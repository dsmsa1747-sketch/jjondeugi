/**************************************************************
 * 콩나물 — Google Apps Script 백엔드
 * Google Sheets = 데이터베이스 / 토스페이먼츠 결제 확정 / D+7 정산 / 텔레그램 알림
 *
 * 사용 방법(요약):
 *  1) Google Sheets 새 스프레드시트 생성 → URL의 /d/ 와 /edit 사이 ID 복사
 *  2) Apps Script 편집기 → 이 코드 전체 붙여넣기
 *  3) [프로젝트 설정 ▸ 스크립트 속성]에 아래 키 등록
 *       SPREADSHEET_ID   = (1번에서 복사한 ID) [필수]
 *       TOKEN_SECRET     = (아무 긴 랜덤 문자열)   [필수]
 *       TOSS_SECRET_KEY  = test_sk_... / live_sk_... [결제 시 필수]
 *       TELEGRAM_BOT_TOKEN = (선택)
 *       TELEGRAM_OWNER_ID  = (선택, 본인 chat id)
 *  4) initSetup 함수 1회 실행(권한 허용) → 시트/헤더/샘플상품 생성
 *  5) setupTriggers 1회 실행 → 매일 새벽 3시 자동 정산 트리거 등록
 *  6) [배포 ▸ 새 배포 ▸ 웹 앱] 실행:나 / 액세스:모든 사용자 → /exec URL 복사
 *  7) index.html 의 CONFIG.API_BASE 에 그 URL 붙여넣기
 **************************************************************/

const SHEETS = {
  USERS:'Users', PRODUCTS:'Products', ORDERS:'Orders', SETTLE:'Settlements', LOGS:'Logs'
};
const HEADERS = {
  Users:       ['id','email','name','phone','pwHash','salt','role','createdAt'],
  Products:    ['id','name','price','cat','emoji','seller','stock','sales','desc'],
  Orders:      ['id','uid','itemsJson','amount','shipJson','status','paymentKey','createdAt','paidAt'],
  Settlements: ['id','sellerId','amount','fee','net','status','date'],
  Logs:        ['ts','action','detail'],
};
const FEE_RATE = 0.03;

/* ---------- 진입점 ---------- */
function doGet(e){
  return ContentService.createTextOutput(JSON.stringify({ok:true, service:'콩나물 API', time:new Date()}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e){
  let body={};
  try{ body = JSON.parse(e.postData.contents||'{}'); }catch(_){}
  // 텔레그램 웹훅(메시지 객체가 있으면 봇 처리)
  if(body.message || body.update_id) { try{ handleTelegram_(body); }catch(_){}; return json_({ok:true}); }

  const {action, token, payload={}} = body;
  try{
    const result = route_(action, token, payload);
    return json_({ok:true, result});
  }catch(err){
    log_('error', action+': '+err.message);
    return json_({ok:false, error:String(err.message||err)});
  }
}

function route_(action, token, p){
  switch(action){
    case 'listProducts': return listProducts_();
    case 'getProduct':   return getProduct_(p.id);
    case 'listLive':     return listLive_();
    case 'signup':       return signup_(p);
    case 'login':        return login_(p);
    case 'social':       return social_(p);
    case 'me':           return meFromToken_(token);
    case 'logout':       return true;
    case 'listOrders':   return listOrders_(requireUid_(token));
    case 'createOrder':  return createOrder_(requireUid_(token), p);
    case 'confirmPayment': return confirmPayment_(p);
    default: throw new Error('알 수 없는 요청: '+action);
  }
}

/* ---------- 시트 헬퍼 ---------- */
function props_(){ return PropertiesService.getScriptProperties(); }
function ss_(){
  const id = props_().getProperty('SPREADSHEET_ID');
  if(!id) throw new Error('SPREADSHEET_ID 스크립트 속성이 없습니다. README 참고.');
  return SpreadsheetApp.openById(id);
}
function sheet_(name){
  const ss=ss_(); let sh=ss.getSheetByName(name);
  if(!sh){ sh=ss.insertSheet(name); sh.appendRow(HEADERS[name]); }
  return sh;
}
function rows_(name){
  const sh=sheet_(name); const last=sh.getLastRow(); if(last<2) return [];
  const head=HEADERS[name]; const vals=sh.getRange(2,1,last-1,head.length).getValues();
  return vals.map(r=>{ const o={}; head.forEach((h,i)=>o[h]=r[i]); return o; });
}
function append_(name,obj){ const sh=sheet_(name); sh.appendRow(HEADERS[name].map(h=>obj[h]??'')); }
function updateRow_(name, matchKey, matchVal, patch){
  const sh=sheet_(name); const head=HEADERS[name]; const last=sh.getLastRow(); if(last<2) return false;
  const col=head.indexOf(matchKey)+1; const colVals=sh.getRange(2,col,last-1,1).getValues();
  for(let i=0;i<colVals.length;i++){
    if(String(colVals[i][0])===String(matchVal)){
      const rowNum=i+2; const cur=sh.getRange(rowNum,1,1,head.length).getValues()[0];
      head.forEach((h,j)=>{ if(h in patch) cur[j]=patch[h]; });
      sh.getRange(rowNum,1,1,head.length).setValues([cur]); return true;
    }
  }
  return false;
}
function json_(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function log_(action,detail){ try{ append_(SHEETS.LOGS,{ts:new Date(),action,detail:String(detail).slice(0,500)}); }catch(_){} }
function uid_(){ return Utilities.getUuid().slice(0,12); }

/* ---------- 인증 ---------- */
function secret_(){ const s=props_().getProperty('TOKEN_SECRET'); if(!s) throw new Error('TOKEN_SECRET 미설정'); return s; }
function sha256_(str){
  const bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, str, Utilities.Charset.UTF_8);
  return bytes.map(b=>('0'+(b&0xFF).toString(16)).slice(-2)).join('');
}
function hashPw_(pw,salt){ return sha256_(pw+'::'+salt); }
function makeToken_(uid){ const sig=sha256_(uid+'|'+secret_()).slice(0,24); return uid+'.'+sig; }
function verifyToken_(token){
  if(!token||token.indexOf('.')<0) return null;
  const [uid,sig]=token.split('.');
  return sha256_(uid+'|'+secret_()).slice(0,24)===sig ? uid : null;
}
function requireUid_(token){ const u=verifyToken_(token); if(!u) throw new Error('로그인이 필요합니다.'); return u; }
function safeUser_(u){ return {id:u.id,email:u.email,name:u.name,phone:u.phone,role:u.role}; }

/* ---------- 상품 ---------- */
function listProducts_(){ return rows_(SHEETS.PRODUCTS).map(normProduct_); }
function getProduct_(id){ const p=rows_(SHEETS.PRODUCTS).find(x=>x.id===id); return p?normProduct_(p):null; }
function normProduct_(p){ return {...p, price:Number(p.price)||0, stock:Number(p.stock)||0, sales:Number(p.sales)||0}; }
function listLive_(){
  return [
    {id:'l1',title:'제주 감귤 산지 라이브 특가',host:'제주직송',status:'live',viewers:1284,emoji:'🍊'},
    {id:'l2',title:'새벽농장 콩나물 키우기 비하인드',host:'새벽농장',status:'soon',startAt:'오늘 20:00',emoji:'🌱'},
    {id:'l3',title:'로스터리K 원두 블라인드 테스트',host:'로스터리K',status:'soon',startAt:'내일 19:30',emoji:'☕'},
  ];
}

/* ---------- 회원 ---------- */
function signup_(p){
  if(!p.email||!p.pw||!p.name) throw new Error('필수 항목 누락');
  const users=rows_(SHEETS.USERS);
  if(users.some(u=>u.email===p.email)) throw new Error('이미 가입된 이메일입니다.');
  const salt=uid_(); const u={id:uid_(),email:p.email,name:p.name,phone:p.phone||'',
    pwHash:hashPw_(p.pw,salt),salt,role:'buyer',createdAt:new Date()};
  append_(SHEETS.USERS,u);
  notify_(`🆕 신규 회원: ${u.name} (${u.email})`);
  return {token:makeToken_(u.id), user:safeUser_(u)};
}
function login_(p){
  const u=rows_(SHEETS.USERS).find(x=>x.email===p.email);
  if(!u || u.pwHash!==hashPw_(p.pw,u.salt)) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  return {token:makeToken_(u.id), user:safeUser_(u)};
}
function social_(p){
  // 간이 소셜 로그인(데모용). 실제 OAuth 연동 시 검증된 email/sub 를 받아 처리하도록 확장하세요.
  const email=(p.provider||'social')+'_user@'+(p.provider||'social')+'.login';
  let u=rows_(SHEETS.USERS).find(x=>x.email===email);
  if(!u){ const salt=uid_(); u={id:uid_(),email,name:p.provider==='kakao'?'카카오회원':'네이버회원',
    phone:'',pwHash:'',salt,role:'buyer',createdAt:new Date()}; append_(SHEETS.USERS,u); }
  return {token:makeToken_(u.id), user:safeUser_(u)};
}
function meFromToken_(token){
  const uid=verifyToken_(token); if(!uid) return null;
  const u=rows_(SHEETS.USERS).find(x=>x.id===uid); return u?safeUser_(u):null;
}

/* ---------- 주문 ---------- */
function listOrders_(uid){
  return rows_(SHEETS.ORDERS).filter(o=>o.uid===uid)
    .map(o=>({...o, amount:Number(o.amount)||0, items:JSON.parse(o.itemsJson||'[]'),
      createdAt:new Date(o.createdAt).getTime()}))
    .sort((a,b)=>b.createdAt-a.createdAt);
}
function createOrder_(uid,p){
  const id='ORD-'+uid_().toUpperCase();
  const o={id,uid,itemsJson:JSON.stringify(p.items||[]),amount:p.amount,
    shipJson:JSON.stringify(p.ship||{}),status:'결제대기',paymentKey:'',createdAt:new Date(),paidAt:''};
  append_(SHEETS.ORDERS,o);
  return {id,uid,items:p.items,amount:p.amount,ship:p.ship,status:'결제대기',createdAt:Date.now()};
}
function confirmPayment_(p){
  const secret=props_().getProperty('TOSS_SECRET_KEY');
  // 토스 시크릿 키가 있으면 실제 승인, 없으면 시뮬레이션 승인
  if(secret && p.paymentKey && String(p.paymentKey).indexOf('sim_')!==0){
    const res=UrlFetchApp.fetch('https://api.tosspayments.com/v1/payments/confirm',{
      method:'post', contentType:'application/json',
      headers:{Authorization:'Basic '+Utilities.base64Encode(secret+':')},
      payload:JSON.stringify({paymentKey:p.paymentKey,orderId:p.orderId,amount:p.amount}),
      muteHttpExceptions:true });
    const data=JSON.parse(res.getContentText());
    if(data.status!=='DONE') throw new Error(data.message||'결제 승인 실패');
  }
  updateRow_(SHEETS.ORDERS,'id',p.orderId,{status:'결제완료',paymentKey:p.paymentKey||('sim_'+uid_()),paidAt:new Date()});
  notify_(`💳 결제완료\n주문 ${p.orderId}\n금액 ₩${Number(p.amount).toLocaleString('ko-KR')}`);
  const o=rows_(SHEETS.ORDERS).find(x=>x.id===p.orderId);
  return o?{...o, items:JSON.parse(o.itemsJson||'[]'), amount:Number(o.amount)}:null;
}

/* ---------- D+7 자동 정산 ---------- */
function autoSettlement(){
  const orders=rows_(SHEETS.ORDERS);
  const cutoff=Date.now()-7*24*60*60*1000;
  const bySeller={};
  orders.forEach(o=>{
    const paid=o.paidAt&&new Date(o.paidAt).getTime();
    if(o.status==='결제완료' && paid && paid<cutoff){
      JSON.parse(o.itemsJson||'[]').forEach(it=>{
        const s=it.seller||'미지정'; bySeller[s]=(bySeller[s]||0)+(Number(it.price)*Number(it.qty||1));
      });
      updateRow_(SHEETS.ORDERS,'id',o.id,{status:'정산완료'});
    }
  });
  const today=Utilities.formatDate(new Date(),'Asia/Seoul','yyyy-MM-dd');
  let total=0;
  Object.keys(bySeller).forEach(seller=>{
    const amount=bySeller[seller]; const fee=Math.round(amount*FEE_RATE); const net=amount-fee; total+=net;
    append_(SHEETS.SETTLE,{id:uid_(),sellerId:seller,amount,fee,net,status:'정산대기',date:today});
  });
  if(Object.keys(bySeller).length) notify_(`📊 정산 완료\n대상 ${Object.keys(bySeller).length}건\n지급액 ₩${total.toLocaleString('ko-KR')}`);
}

/* ---------- 텔레그램 ---------- */
function notify_(text){
  const token=props_().getProperty('TELEGRAM_BOT_TOKEN'), chat=props_().getProperty('TELEGRAM_OWNER_ID');
  if(!token||!chat) return;
  try{ UrlFetchApp.fetch('https://api.telegram.org/bot'+token+'/sendMessage',{
    method:'post', payload:{chat_id:chat, text}, muteHttpExceptions:true }); }catch(_){}
}
function handleTelegram_(body){
  const msg=body.message; if(!msg||!msg.text) return;
  const owner=props_().getProperty('TELEGRAM_OWNER_ID');
  if(owner && String(msg.chat.id)!==String(owner)){ notify_('권한이 없습니다.'); return; }
  const t=msg.text.trim();
  if(t==='/status'){
    const users=rows_(SHEETS.USERS).length, products=rows_(SHEETS.PRODUCTS).length;
    const orders=rows_(SHEETS.ORDERS); const rev=orders.reduce((s,o)=>s+(o.status!=='결제대기'?Number(o.amount):0),0);
    notify_(`📊 콩나물 상태\n👥 회원 ${users}\n📦 상품 ${products}\n🛒 주문 ${orders.length}\n💰 매출 ₩${rev.toLocaleString('ko-KR')}`);
  } else if(t==='/settle'){ autoSettlement(); notify_('정산 실행 완료'); }
  else { notify_('명령어: /status, /settle'); }
}

/* ---------- 초기 설정 / 트리거 ---------- */
function initSetup(){
  Object.values(SHEETS).forEach(name=>{ const sh=sheet_(name);
    if(sh.getLastRow()===0) sh.appendRow(HEADERS[name]); });
  // 헤더 보정
  Object.keys(HEADERS).forEach(name=>{ const sh=ss_().getSheetByName(name);
    if(sh && sh.getLastRow()===0) sh.appendRow(HEADERS[name]); });
  // 샘플 상품 시드(상품 시트가 비어 있을 때만)
  if(rows_(SHEETS.PRODUCTS).length===0){
    [
      ['p1','국산 무농약 콩나물 300g',2200,'채소','🌱','새벽농장',120,842,'아삭한 식감의 국산 무농약 콩나물.'],
      ['p2','유기농 시금치 한 단',3500,'채소','🥬','들녘농원',64,311,'유기농 인증 시금치.'],
      ['p3','알이 꽉 찬 방울토마토 1kg',8900,'과일','🍅','햇살팜',38,520,'당도 9brix 이상 프리미엄.'],
      ['p4','갓 볶은 원두 200g',12000,'가공식품','☕','로스터리K',90,177,'주문 즉시 로스팅.'],
      ['p5','제주 감귤 3kg',15900,'과일','🍊','제주직송',25,998,'산지 직송 노지 감귤.'],
      ['p6','유정란 특란 15구',7200,'축산','🥚','행복한닭',140,430,'동물복지 인증 유정란.'],
      ['p7','국산 햇감자 2kg',6900,'채소','🥔','강원감자',77,265,'포슬포슬 강원 햇감자.'],
      ['p8','손질 새송이버섯 500g',4500,'채소','🍄','버섯마을',52,188,'바로 요리하는 손질 버섯.'],
    ].forEach(r=>sheet_(SHEETS.PRODUCTS).appendRow(r));
  }
  return '초기화 완료';
}
function setupTriggers(){
  ScriptApp.getProjectTriggers().forEach(t=>{ if(t.getHandlerFunction()==='autoSettlement') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('autoSettlement').timeBased().atHour(3).everyDays(1).create();
  return 'D+7 정산 트리거 등록 완료(매일 03:00)';
}
