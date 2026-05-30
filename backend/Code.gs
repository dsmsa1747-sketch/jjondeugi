/**************************************************************
 * 콩나물 — Google Apps Script 백엔드 (멀티 역할 플랫폼)
 * 화면(Index.html) + 데이터(Google Sheets) + 결제(토스) + 알림(텔레그램)을 한 프로젝트에서.
 *
 * 배포(약 5분):
 *  1) sheets.new → 빈 시트 생성 → URL의 /d/ 와 /edit 사이 ID 복사
 *  2) 확장 프로그램 ▸ Apps Script → Code.gs 에 이 코드 붙여넣기
 *  3) ＋ ▸ HTML 파일 추가, 이름 'Index' → index.html 내용 전체 붙여넣기
 *  4) ⚙️ 프로젝트 설정 ▸ 스크립트 속성:
 *       SPREADSHEET_ID = 1번 ID            (필수)
 *       ADMIN_PW       = 관리자 비밀번호      (선택, 기본 admin)
 *       TOSS_SECRET_KEY / TELEGRAM_BOT_TOKEN / TELEGRAM_OWNER_ID (선택)
 *  5) 함수 initSetup 1회 실행(권한 허용) → DB 시트 + 시드 데이터 생성
 *  6) 배포 ▸ 새 배포 ▸ 웹 앱 / 실행:나 / 액세스:모든 사용자 → /exec URL = 앱 주소
 **************************************************************/

const STORES = ['products','vendors','owners','orders','withdrawals'];
const FEE_RATE=0.07, OWNER_RATE=0.03, WITHHOLD=0.033;

/* ---------- 진입점 ---------- */
function doGet(e){
  try{
    return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('콩나물')
      .addMetaTag('viewport','width=device-width, initial-scale=1.0, viewport-fit=cover');
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({ok:true,service:'콩나물 API',time:new Date()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
// 화면에서 google.script.run 으로 호출 (동일 출처)
function apiCall(bodyJson){
  let b={}; try{ b=JSON.parse(bodyJson||'{}'); }catch(_){}
  try{ return JSON.stringify({ok:true, result: route_(b.action, b.payload||{})}); }
  catch(err){ log_('error', (b.action||'')+': '+err.message); return JSON.stringify({ok:false, error:String(err.message||err)}); }
}
// 별도 배포 백엔드를 fetch로 호출할 때
function doPost(e){
  let b={}; try{ b=JSON.parse(e.postData.contents||'{}'); }catch(_){}
  if(b.message||b.update_id){ try{ handleTelegram_(b); }catch(_){}; return json_({ok:true}); }
  try{ return json_({ok:true, result: route_(b.action, b.payload||{})}); }
  catch(err){ log_('error',(b.action||'')+': '+err.message); return json_({ok:false, error:String(err.message||err)}); }
}

function route_(action,p){
  switch(action){
    case 'loadAll':  return loadAll_();
    case 'saveAll':  return saveAll_(p);
    case 'adminLogin': return { ok: String(p.pw||'')===(props_().getProperty('ADMIN_PW')||'admin') };
    case 'confirmPayment': return confirmPayment_(p);
    default: throw new Error('알 수 없는 요청: '+action);
  }
}

/* ---------- Google Sheets 저장 (key/json) ---------- */
function props_(){ return PropertiesService.getScriptProperties(); }
function ss_(){ const id=props_().getProperty('SPREADSHEET_ID'); if(!id) throw new Error('SPREADSHEET_ID 미설정'); return SpreadsheetApp.openById(id); }
function dbSheet_(){ const ss=ss_(); let sh=ss.getSheetByName('DB'); if(!sh){ sh=ss.insertSheet('DB'); sh.appendRow(['key','json']); } return sh; }
function readKey_(key){ const sh=dbSheet_(); const last=sh.getLastRow(); if(last<2) return null;
  const v=sh.getRange(2,1,last-1,2).getValues(); const row=v.find(r=>r[0]===key); return row?JSON.parse(row[1]||'null'):null; }
function writeKey_(key,obj){ const sh=dbSheet_(); const last=sh.getLastRow(); const json=JSON.stringify(obj);
  if(last>=2){ const ks=sh.getRange(2,1,last-1,1).getValues(); for(let i=0;i<ks.length;i++){ if(ks[i][0]===key){ sh.getRange(i+2,2).setValue(json); return; } } }
  sh.appendRow([key,json]); }
function loadAll_(){ const o={}; STORES.forEach(k=>o[k]=readKey_(k)||[]); return o; }
function saveAll_(d){ STORES.forEach(k=>{ if(d[k]!==undefined) writeKey_(k,d[k]); });
  // 사람이 보기 쉬운 미러 시트도 갱신(상품/주문)
  try{ mirror_('상품_보기', d.products, ['id','name','brand','price','stock','cat','status']);
       mirror_('주문_보기', d.orders, ['id','buyer','ownerCode','amount','status','createdAt']); }catch(_){}
  return true; }
function mirror_(name,rows,cols){ if(!rows) return; const ss=ss_(); let sh=ss.getSheetByName(name); if(!sh) sh=ss.insertSheet(name);
  sh.clear(); sh.appendRow(cols); if(rows.length) sh.getRange(2,1,rows.length,cols.length).setValues(rows.map(r=>cols.map(c=>c==='createdAt'?new Date(r[c]):r[c]??''))); }
function json_(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function log_(a,d){ try{ const ss=ss_(); let sh=ss.getSheetByName('Logs'); if(!sh){sh=ss.insertSheet('Logs');sh.appendRow(['ts','action','detail']);} sh.appendRow([new Date(),a,String(d).slice(0,500)]); }catch(_){} }

/* ---------- 결제(토스) ---------- */
function confirmPayment_(p){
  const secret=props_().getProperty('TOSS_SECRET_KEY');
  if(secret && p.paymentKey && String(p.paymentKey).indexOf('sim_')!==0){
    const res=UrlFetchApp.fetch('https://api.tosspayments.com/v1/payments/confirm',{method:'post',contentType:'application/json',
      headers:{Authorization:'Basic '+Utilities.base64Encode(secret+':')},
      payload:JSON.stringify({paymentKey:p.paymentKey,orderId:p.orderId,amount:p.amount}),muteHttpExceptions:true});
    const d=JSON.parse(res.getContentText()); if(d.status!=='DONE') throw new Error(d.message||'결제 승인 실패');
  }
  notify_('💳 결제완료 '+p.orderId+' / ₩'+Number(p.amount).toLocaleString('ko-KR'));
  return {ok:true};
}

/* ---------- 텔레그램 ---------- */
function notify_(text){ const t=props_().getProperty('TELEGRAM_BOT_TOKEN'), c=props_().getProperty('TELEGRAM_OWNER_ID');
  if(!t||!c) return; try{ UrlFetchApp.fetch('https://api.telegram.org/bot'+t+'/sendMessage',{method:'post',payload:{chat_id:c,text},muteHttpExceptions:true}); }catch(_){} }
function handleTelegram_(b){ const m=b.message; if(!m||!m.text) return; const owner=props_().getProperty('TELEGRAM_OWNER_ID');
  if(owner && String(m.chat.id)!==String(owner)){ notify_('권한 없음'); return; }
  if(m.text.trim()==='/status'){ const d=loadAll_(); const gmv=(d.orders||[]).reduce((s,o)=>s+(Number(o.amount)||0),0);
    notify_('📊 콩나물\n상품 '+(d.products||[]).length+'\n입점 '+(d.vendors||[]).length+'\n오너 '+(d.owners||[]).length+'\n주문 '+(d.orders||[]).length+'\n매출 ₩'+gmv.toLocaleString('ko-KR')); }
  else notify_('명령어: /status'); }

/* ---------- 초기 설정 (1회 실행) ---------- */
function initSetup(){
  dbSheet_();
  if(!readKey_('products')){
    const N=Date.now();
    writeKey_('products',[
      {id:'p1',name:'국산 무농약 콩나물 300g',price:2200,cat:'채소',emoji:'🌱',brand:'새벽농장',stock:120,sales:842,desc:'아삭한 식감의 국산 무농약 콩나물.',status:'판매중'},
      {id:'p2',name:'유기농 시금치 한 단',price:3500,cat:'채소',emoji:'🥬',brand:'들녘농원',stock:64,sales:311,desc:'유기농 인증 시금치.',status:'판매중'},
      {id:'p3',name:'알이 꽉 찬 방울토마토 1kg',price:8900,cat:'과일',emoji:'🍅',brand:'햇살팜',stock:38,sales:520,desc:'당도 9brix 이상.',status:'판매중'},
      {id:'p4',name:'갓 볶은 스페셜티 원두 200g',price:12000,cat:'가공식품',emoji:'☕',brand:'로스터리K',stock:90,sales:177,desc:'주문 즉시 로스팅.',status:'판매중'},
      {id:'p5',name:'제주 노지 감귤 3kg',price:15900,cat:'과일',emoji:'🍊',brand:'제주직송',stock:25,sales:998,desc:'산지 직송 감귤.',status:'판매중'},
      {id:'p6',name:'동물복지 유정란 15구',price:7200,cat:'축산',emoji:'🥚',brand:'행복한닭',stock:140,sales:430,desc:'동물복지 유정란.',status:'판매중'},
    ]);
    writeKey_('vendors',[
      {id:'v1',company:'새벽농장',bizNo:'123-45-67890',email:'dawn@farm.kr',phone:'010-1111-2222',status:'승인',createdAt:N-8.6e8},
      {id:'v2',company:'들녘농원',bizNo:'222-33-44444',email:'field@farm.kr',phone:'010-3333-4444',status:'승인',createdAt:N-7e8},
      {id:'v3',company:'산미베이커리',bizNo:'555-66-77777',email:'sanmi@bake.kr',phone:'010-5555-6666',status:'대기',createdAt:N-1.2e8},
    ]);
    writeKey_('owners',[
      {id:'o1',name:'이수연',sns:'@suyeon_shop',channel:'instagram',email:'suyeon@mail.com',code:'SY4F2A',status:'승인',gmv:182500,createdAt:N-6e8},
      {id:'o2',name:'박지호',sns:'@jiho_living',channel:'youtube',email:'jiho@mail.com',code:'JH9K1B',status:'승인',gmv:94000,createdAt:N-5e8},
      {id:'o3',name:'최하은',sns:'@haeun.daily',channel:'instagram',email:'haeun@mail.com',code:'',status:'대기',gmv:0,createdAt:N-2e7},
    ]);
    writeKey_('orders',[
      {id:'ORD-1001',buyer:'김구매',ownerCode:'SY4F2A',items:[{id:'p5',name:'제주 노지 감귤 3kg',price:15900,qty:1,emoji:'🍊',brand:'제주직송'}],amount:15900,status:'배송완료',createdAt:N-5.5e8},
    ]);
    writeKey_('withdrawals',[]);
  }
  return '초기화 완료';
}
