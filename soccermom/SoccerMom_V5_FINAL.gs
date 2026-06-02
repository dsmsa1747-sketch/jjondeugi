/**
 * ===========================================================
 *  SoccerMom V5 FINAL — Apps Script 단일 파일 통합본
 *  목표: 모든 작업이 구글 내부에서 완결 / setup() 한 번이면 끝
 * ===========================================================
 *
 *  📱 폰에서 사용법 (5분)
 *  1) Apps Script 프로젝트 열기 (기존 SoccerMom 프로젝트)
 *  2) Code.gs 내용 전체 삭제 → 이 파일 통째로 붙여넣기
 *  3) 아래 setup() 함수의 TK/CI/AK 3줄에 본인 키 입력
 *  4) 함수 선택 박스에서 setup ▶️ 실행 → 권한 승인
 *  5) 텔레그램으로 "✅ 셋업 완료" 메시지 받으면 끝
 *  6) setup() 함수의 키 3줄을 다시 빈 값으로 (보안)
 *  7) 배포 > 배포 관리 > ✏️ > 버전: 새 버전 > 배포
 *     → URL 동일하게 유지됨
 * ===========================================================
 */


// ====================  ⬇⬇⬇  최초 1회 setup ⬇⬇⬇  ====================

function setup() {
  // ★ 기존 키 자동 입력 완료 — 그냥 ▶️ 실행만 하면 됨 ★
  const TK = ''; // ← 텔레그램 봇 토큰 입력
  const CI = ''; // ← 관리자 Chat ID 입력
  const AK = ''; // ← Anthropic API 키 입력
  // ===================================================

  if (!TK || !CI || !AK) {
    throw new Error('❌ setup() 함수 상단 TK/CI/AK 3개를 모두 채우고 다시 ▶️ 실행하세요.');
  }

  const log = ['🚀 <b>SoccerMom V5 셋업 진행</b>', ''];
  const P = PropertiesService.getScriptProperties();

  // 1) 키 저장
  P.setProperties({ TK: TK, CI: CI, AK: AK });
  log.push('✅ 1/5 키 저장 (Script Properties)');

  // 2) DB Spreadsheet (Firestore 대체, 더 안정적)
  let sheetId = P.getProperty('SHEET_ID');
  if (!sheetId) {
    const ss = SpreadsheetApp.create('SoccerMom_DB');
    const sh = ss.getActiveSheet();
    sh.setName('users');
    sh.appendRow(['chatId', 'firstSeen', 'lastSeen', 'isAdmin', 'msgCount']);
    ss.insertSheet('inquiries').appendRow(['ts', 'chatId', 'question', 'answer']);
    ss.insertSheet('payments').appendRow(['ts', 'chatId', 'plan', 'amount', 'status']);
    ss.insertSheet('videos').appendRow(['ts', 'chatId', 'url', 'plan', 'status']);
    ss.insertSheet('logs').appendRow(['ts', 'type', 'data']);
    sheetId = ss.getId();
    P.setProperty('SHEET_ID', sheetId);
    log.push('✅ 2/5 DB 생성 (Drive: SoccerMom_DB)');
  } else {
    log.push('✅ 2/5 DB 연결 (기존 사용)');
  }

  // 3) 트리거 등록
  ScriptApp.getProjectTriggers().forEach(t => {
    if (['dailyReport'].includes(t.getHandlerFunction())) ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('dailyReport').timeBased().atHour(8).everyDays(1).inTimezone('Asia/Seoul').create();
  log.push('✅ 3/5 일일리포트 트리거 (매일 08:00 KST)');

  // 4) Telegram Webhook 등록
  const url = ScriptApp.getService().getUrl();
  let webhookOK = false;
  try {
    const wh = UrlFetchApp.fetch(
      'https://api.telegram.org/bot' + TK + '/setWebhook?url=' + encodeURIComponent(url) + '&drop_pending_updates=true',
      { muteHttpExceptions: true }
    );
    const r = JSON.parse(wh.getContentText());
    if (r.ok) { webhookOK = true; log.push('✅ 4/5 Telegram Webhook 등록'); }
    else log.push('⚠️ 4/5 Webhook 실패: ' + (r.description || 'unknown'));
  } catch (e) {
    log.push('⚠️ 4/5 Webhook 오류: ' + e.message);
  }

  // 5) Drive 보안 정리 (노출된 키 파일 휴지통 이동)
  const suspects = [
    'SoccerMom_Bot_V4_2.js', 'SoccerMom_Bot_최종코드.js',
    'SoccerMom_Bot_코드_복사용', 'SoccerMom_Bot_Gemini_최종코드',
    'SoccerMom_AutoUpdate_매일자동업데이트', 'Code_gs_복붙용.txt',
    '.env_ACTUAL_KEYS.txt', 'SOCCERMOM_BOT_TOKEN.txt', 'SoccerMom_Bot.gs'
  ];
  let trashed = 0;
  suspects.forEach(name => {
    try {
      const it = DriveApp.getFilesByName(name);
      while (it.hasNext()) { it.next().setTrashed(true); trashed++; }
    } catch (e) {}
  });
  log.push('✅ 5/5 보안 정리 (' + trashed + '개 파일 휴지통 이동)');

  // 최종 알림
  log.push('');
  log.push('🌐 <b>웹앱 URL</b>');
  log.push(url);
  log.push('');
  log.push('📋 <b>다음 할 일</b>');
  log.push('• setup() 함수 TK/CI/AK 줄 빈 값으로');
  log.push('• 배포 > 새 버전 배포');
  log.push('• 웹앱 URL 접속 확인');
  log.push('• 봇에게 /status 전송');
  log.push('');
  log.push('🔑 관리자: /status /report /users /backup');
  log.push('💬 공통: /start /info /help · 자유질문');

  sendRaw(TK, CI, log.join('\n'));
  Logger.log(log.join('\n').replace(/<[^>]+>/g, ''));
  return { ok: true, webhook: webhookOK, url: url, trashed: trashed };
}


// ====================  코어 유틸  ====================

function P() { return PropertiesService.getScriptProperties(); }
function get(k) { return P().getProperty(k); }

function sendRaw(TK, cid, text) {
  try {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + TK + '/sendMessage', {
      method: 'post', contentType: 'application/json',
      payload: JSON.stringify({ chat_id: cid, text: text, parse_mode: 'HTML' }),
      muteHttpExceptions: true
    });
  } catch (e) { Logger.log('sendRaw fail: ' + e); }
}
function send(cid, text) { sendRaw(get('TK'), cid, text); }
function adminNotify(text) { send(get('CI'), text); }


// ====================  DB (Spreadsheet)  ====================

function ss() { return SpreadsheetApp.openById(get('SHEET_ID')); }
function sheet(name) { return ss().getSheetByName(name); }

function logUser(cid, isAdmin) {
  try {
    const sh = sheet('users');
    const data = sh.getDataRange().getValues();
    const now = new Date().toISOString();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(cid)) {
        sh.getRange(i + 1, 3).setValue(now);
        sh.getRange(i + 1, 5).setValue((Number(data[i][4]) || 0) + 1);
        return false;
      }
    }
    sh.appendRow([String(cid), now, now, !!isAdmin, 1]);
    return true;
  } catch (e) { Logger.log('logUser: ' + e); return false; }
}

function logInquiry(cid, q, a) {
  try {
    sheet('inquiries').appendRow([new Date().toISOString(), String(cid), String(q).substring(0, 500), String(a).substring(0, 500)]);
  } catch (e) { Logger.log(e); }
}

function countRows(name) {
  try { return Math.max(0, sheet(name).getLastRow() - 1); } catch (e) { return 0; }
}


// ====================  Web 진입점  ====================

function doGet(e) {
  return HtmlService.createHtmlOutput(HTML_PAGE)
    .setTitle('SoccerMom - AI 유소년 축구 분석')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);
    const m = b.message;
    if (!m) return ok();
    const cid = String(m.chat.id);
    const tx = (m.text || '').trim();
    const CI = get('CI');
    const isAdmin = (cid === CI);
    logUser(cid, isAdmin);

    // ----- 관리자 -----
    if (isAdmin) {
      if (tx === '/status') {
        const u = countRows('users'), p = countRows('payments'), v = countRows('videos'), i = countRows('inquiries');
        const t = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
        send(cid, '📊 <b>SoccerMom V5 현황</b>\n\n🕐 ' + t + '\n🟢 정상 운영\n\n👥 회원 ' + u + '명\n💳 결제 ' + p + '건\n🎥 영상 ' + v + '건\n💬 문의 ' + i + '건\n\n/report /users /backup');
        return ok();
      }
      if (tx === '/report') {
        const u = countRows('users'), p = countRows('payments'), v = countRows('videos');
        send(cid, '📈 <b>일간 리포트</b>\n\n👥 회원 ' + u + '명\n💳 결제 ' + p + '건\n🎥 영상 ' + v + '건');
        return ok();
      }
      if (tx === '/users') { send(cid, '👥 전체 회원 ' + countRows('users') + '명'); return ok(); }
      if (tx === '/backup') {
        const url = 'https://docs.google.com/spreadsheets/d/' + get('SHEET_ID') + '/edit';
        send(cid, '📁 <b>DB Spreadsheet</b>\n\n' + url);
        return ok();
      }
    }

    // ----- 공통 -----
    if (tx === '/start' || tx === '') {
      const url = ScriptApp.getService().getUrl();
      send(cid, '⚽ <b>SoccerMom AI</b>에 오신걸 환영합니다!\n\n선수 성장 데이터 분석 플랫폼\n\n🌐 ' + url + '\n\n/help · /info\n💬 무엇이든 질문하세요!');
      if (!isAdmin) adminNotify('🆕 신규 접속\nID: ' + cid);
      return ok();
    }
    if (tx === '/help') {
      send(cid, '📋 <b>도움말</b>\n\n/start · /info · /help\n\n💬 자유질문 가능\n예) "선수 분석은 어떻게?"\n예) "요금제 알려줘"');
      return ok();
    }
    if (tx === '/info') {
      send(cid, '⚽ <b>SoccerMom 서비스</b>\n\n🎥 AI 영상 분석\n📊 선수 성장 데이터\n🏃 스프린트 / 속도\n⚽ 공 터치 / 히트맵\n🏆 MVP · 🎬 AI 쇼츠\n\n💰 <b>요금</b>\n무료 2회 · 개인 1,000원 · 팀 3,000원');
      return ok();
    }

    // ----- AI 자유질문 -----
    const AK = get('AK');
    if (!AK) { send(cid, '⚠️ AI 키 미설정 (관리자 setup 필요)'); return ok(); }
    const r = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post',
      headers: { 'x-api-key': AK, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      payload: JSON.stringify({
        model: 'claude-sonnet-4-20250514', max_tokens: 400,
        messages: [{
          role: 'user',
          content: '너는 SoccerMom 축구 AI 운영봇. 서비스: AI영상분석/선수성장데이터/쇼츠. 요금: 무료2회,개인1000원,팀3000원. 한국어로 친절·간결(200자 이내).\n\n질문: ' + tx
        }]
      }),
      muteHttpExceptions: true
    });
    const d = JSON.parse(r.getContentText());
    const reply = (d.content && d.content[0]) ? d.content[0].text : '잠시 후 다시 시도해주세요';
    send(cid, '🤖 ' + reply);
    logInquiry(cid, tx, reply);
    if (!isAdmin) adminNotify('💬 문의 (' + cid + ')\n' + tx.substring(0, 80));

  } catch (err) {
    Logger.log(err);
    try { adminNotify('❌ 봇 오류: ' + err.message); } catch (e) {}
  }
  return ok();
}

function ok() { return ContentService.createTextOutput('ok'); }


// ====================  일일 자동 보고  ====================

function dailyReport() {
  try {
    const u = countRows('users'), p = countRows('payments'), v = countRows('videos'), i = countRows('inquiries');
    const t = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    adminNotify('📊 <b>SoccerMom 일간 리포트</b>\n🕐 ' + t + '\n\n👥 회원 ' + u + '명\n💳 결제 ' + p + '건\n🎥 영상 ' + v + '건\n💬 문의 ' + i + '건\n\n🟢 정상 운영중');
  } catch (e) { try { adminNotify('❌ 일일리포트 오류: ' + e.message); } catch (er) {} }
}


// ====================  Health Check  ====================

function healthCheck() {
  return {
    status: 'ok', version: 'V5-FINAL',
    timestamp: new Date().toISOString(),
    hasTK: !!get('TK'), hasCI: !!get('CI'), hasAK: !!get('AK'), hasDB: !!get('SHEET_ID')
  };
}


// ====================  HTML 메인 페이지 (인라인)  ====================

const HTML_PAGE = `<!DOCTYPE html>
<html lang="ko">
<head>
<base target="_top">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#000000">
<title>SoccerMom - AI 유소년 축구 분석</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
*{-webkit-tap-highlight-color:transparent}
body{font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Segoe UI',Roboto,sans-serif;background:#000;color:#fff;overscroll-behavior:none}
.grad{background:linear-gradient(135deg,#10b981 0%,#059669 50%,#047857 100%)}
.gt{background:linear-gradient(135deg,#34d399 0%,#10b981 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.glow{box-shadow:0 0 40px rgba(16,185,129,.35)}
.fu{animation:fu .6s ease-out}@keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.pl{animation:pl 2s infinite}@keyframes pl{0%,100%{opacity:1}50%{opacity:.5}}
</style>
</head>
<body class="bg-black">

<header class="fixed top-0 inset-x-0 z-50 bg-black/70 backdrop-blur-lg border-b border-emerald-900/30">
<div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
<div class="flex items-center gap-2"><span class="text-2xl">⚽</span><span class="font-bold text-lg tracking-tight">SoccerMom</span><span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">V5</span></div>
<a id="bot1" href="#" class="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-1.5 rounded-full text-sm font-bold transition">봇 시작</a>
</div>
</header>

<section class="pt-24 pb-12 px-4 fu">
<div class="max-w-3xl mx-auto text-center">
<div class="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs mb-5">
<span class="w-1.5 h-1.5 bg-emerald-400 rounded-full pl"></span>AI 유소년 축구 분석 · 베타 운영중</div>
<h1 class="text-4xl md:text-6xl font-bold leading-[1.15] mb-5 tracking-tight">영상 한 편으로<br><span class="gt">우리 아이의 실력</span>이<br>숫자로 보입니다</h1>
<p class="text-gray-400 mb-8 text-base md:text-lg leading-relaxed">스프린트 · 활동량 · 볼터치 · 히트맵까지<br>AI가 3분 안에 자동 분석합니다</p>
<div class="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
<button onclick="openUp()" class="grad px-7 py-4 rounded-full font-bold glow text-base active:scale-95 transition">🎥 영상 분석 시작</button>
<a href="#price" class="border border-emerald-500/30 px-7 py-4 rounded-full active:scale-95 transition">💰 요금 보기</a>
</div>
<div class="mt-6 text-sm text-gray-500">무료 체험 2회 · 결제 없이 시작</div>
</div>
</section>

<section class="px-4 py-10 bg-gradient-to-b from-emerald-950/20 to-transparent">
<div class="max-w-3xl mx-auto grid grid-cols-3 gap-3 text-center">
<div class="p-4"><div class="text-3xl md:text-4xl font-bold gt" id="uc">Beta</div><div class="text-xs text-gray-500 mt-1">누적 회원</div></div>
<div class="p-4 border-x border-gray-900"><div class="text-3xl md:text-4xl font-bold gt" id="vc">Beta</div><div class="text-xs text-gray-500 mt-1">분석 영상</div></div>
<div class="p-4"><div class="text-3xl md:text-4xl font-bold gt">24/7</div><div class="text-xs text-gray-500 mt-1">AI 운영</div></div>
</div>
</section>

<section class="px-4 py-16">
<div class="max-w-5xl mx-auto">
<div class="text-center mb-10"><h2 class="text-3xl md:text-4xl font-bold mb-3 tracking-tight">AI가 분석하는 8가지</h2><p class="text-gray-500">경기 영상만 올리면 자동 처리됩니다</p></div>
<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
<div class="bg-gray-900/60 border border-gray-800 hover:border-emerald-500/50 p-5 rounded-2xl transition"><div class="text-3xl mb-2">🏃</div><div class="font-bold text-sm">선수 추적</div><div class="text-xs text-gray-500 mt-1">개별 동선·이동</div></div>
<div class="bg-gray-900/60 border border-gray-800 hover:border-emerald-500/50 p-5 rounded-2xl transition"><div class="text-3xl mb-2">⚽</div><div class="font-bold text-sm">공 추적</div><div class="text-xs text-gray-500 mt-1">볼 이동 경로</div></div>
<div class="bg-gray-900/60 border border-gray-800 hover:border-emerald-500/50 p-5 rounded-2xl transition"><div class="text-3xl mb-2">⚡</div><div class="font-bold text-sm">스프린트</div><div class="text-xs text-gray-500 mt-1">최고·평균 속도</div></div>
<div class="bg-gray-900/60 border border-gray-800 hover:border-emerald-500/50 p-5 rounded-2xl transition"><div class="text-3xl mb-2">📊</div><div class="font-bold text-sm">활동량</div><div class="text-xs text-gray-500 mt-1">총 이동거리</div></div>
<div class="bg-gray-900/60 border border-gray-800 hover:border-emerald-500/50 p-5 rounded-2xl transition"><div class="text-3xl mb-2">🔥</div><div class="font-bold text-sm">히트맵</div><div class="text-xs text-gray-500 mt-1">활동 영역 시각화</div></div>
<div class="bg-gray-900/60 border border-gray-800 hover:border-emerald-500/50 p-5 rounded-2xl transition"><div class="text-3xl mb-2">👟</div><div class="font-bold text-sm">볼 터치</div><div class="text-xs text-gray-500 mt-1">터치 횟수·지점</div></div>
<div class="bg-gray-900/60 border border-gray-800 hover:border-emerald-500/50 p-5 rounded-2xl transition"><div class="text-3xl mb-2">🏆</div><div class="font-bold text-sm">MVP 산정</div><div class="text-xs text-gray-500 mt-1">AI 종합 평가</div></div>
<div class="bg-gray-900/60 border border-gray-800 hover:border-emerald-500/50 p-5 rounded-2xl transition"><div class="text-3xl mb-2">🎬</div><div class="font-bold text-sm">AI 쇼츠</div><div class="text-xs text-gray-500 mt-1">하이라이트 자동</div></div>
</div>
</div>
</section>

<section class="px-4 py-16 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent">
<div class="max-w-2xl mx-auto">
<div class="text-center mb-10"><h2 class="text-3xl md:text-4xl font-bold mb-3 tracking-tight">3단계로 끝</h2><p class="text-gray-500">평균 3~5분 소요</p></div>
<div class="space-y-3">
<div class="flex gap-4 items-start bg-gray-900/50 border border-gray-800 p-5 rounded-2xl"><div class="grad w-11 h-11 rounded-full flex items-center justify-center font-bold flex-shrink-0 glow">1</div><div class="pt-1"><div class="font-bold mb-1">영상 업로드</div><div class="text-sm text-gray-400">유튜브 링크 또는 핸드폰 영상 (5~30분)</div></div></div>
<div class="flex gap-4 items-start bg-gray-900/50 border border-gray-800 p-5 rounded-2xl"><div class="grad w-11 h-11 rounded-full flex items-center justify-center font-bold flex-shrink-0 glow">2</div><div class="pt-1"><div class="font-bold mb-1">AI 자동 분석</div><div class="text-sm text-gray-400">선수 추적 → 데이터 산출 → 시각화 (3~5분)</div></div></div>
<div class="flex gap-4 items-start bg-gray-900/50 border border-gray-800 p-5 rounded-2xl"><div class="grad w-11 h-11 rounded-full flex items-center justify-center font-bold flex-shrink-0 glow">3</div><div class="pt-1"><div class="font-bold mb-1">리포트 + 쇼츠 수령</div><div class="text-sm text-gray-400">텔레그램으로 PDF + AI 하이라이트 전송</div></div></div>
</div>
</div>
</section>

<section id="price" class="px-4 py-16">
<div class="max-w-4xl mx-auto">
<div class="text-center mb-10"><h2 class="text-3xl md:text-4xl font-bold mb-3 tracking-tight">요금</h2><p class="text-gray-500">결제 없이 무료 2회 먼저</p></div>
<div class="grid md:grid-cols-3 gap-3">
<div class="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl"><div class="text-sm text-gray-400 mb-1">체험</div><div class="text-3xl font-bold mb-1">무료</div><div class="text-xs text-gray-500 mb-5">최초 2회</div><ul class="text-sm text-gray-300 space-y-2"><li>✓ 기본 분석</li><li>✓ 스프린트/활동량</li><li>✓ 히트맵</li></ul></div>
<div class="bg-emerald-900/30 border-2 border-emerald-500 p-6 rounded-2xl relative glow"><div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full">추천</div><div class="text-sm text-emerald-400 mb-1">개인</div><div class="flex items-baseline gap-1 mb-1"><div class="text-3xl font-bold">1,000원</div><div class="text-xs text-gray-400">/회</div></div><div class="text-xs text-gray-400 mb-5">개인 선수 분석</div><ul class="text-sm text-gray-200 space-y-2"><li>✓ 8가지 전체 분석</li><li>✓ AI 쇼츠 자동</li><li>✓ MVP 평가</li><li>✓ PDF 리포트</li></ul></div>
<div class="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl"><div class="text-sm text-gray-400 mb-1">팀</div><div class="flex items-baseline gap-1 mb-1"><div class="text-3xl font-bold">3,000원</div><div class="text-xs text-gray-400">/회</div></div><div class="text-xs text-gray-500 mb-5">팀 전체 분석</div><ul class="text-sm text-gray-300 space-y-2"><li>✓ 전 선수 분석</li><li>✓ 팀 히트맵·전술</li><li>✓ 클럽 대시보드</li><li>✓ 스카우팅 데이터</li></ul></div>
</div>
<div class="text-center text-xs text-gray-500 mt-6">Toss 간편결제 지원 예정</div>
</div>
</section>

<section class="px-4 py-20 bg-gradient-to-b from-emerald-950/30 to-black">
<div class="max-w-2xl mx-auto text-center">
<h2 class="text-3xl md:text-4xl font-bold mb-4 tracking-tight">지금 시작하세요</h2>
<p class="text-gray-400 mb-8">텔레그램 봇이 24시간 운영합니다</p>
<div class="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
<a id="bot2" href="#" class="grad px-7 py-4 rounded-full font-bold glow active:scale-95 transition">💬 텔레그램 봇 열기</a>
<button onclick="openUp()" class="border border-emerald-500/40 px-7 py-4 rounded-full active:scale-95 transition">🎥 웹에서 업로드</button>
</div>
</div>
</section>

<footer class="px-4 py-10 border-t border-gray-900">
<div class="max-w-6xl mx-auto text-center text-xs text-gray-500 space-y-2">
<div class="flex items-center justify-center gap-2"><span class="text-base">⚽</span><span class="font-bold text-gray-400">SoccerMom V5</span></div>
<div>DSCompany · 유소년 축구 AI 분석 플랫폼</div>
<div>문의: dsmsa1747@gmail.com</div>
</div>
</footer>

<div id="upMod" class="fixed inset-0 bg-black/85 backdrop-blur-sm hidden items-end sm:items-center justify-center z-50 p-0 sm:p-4">
<div class="bg-gray-900 border-t sm:border border-emerald-500/30 rounded-t-3xl sm:rounded-2xl max-w-md w-full p-6 sm:p-7">
<div class="flex justify-between items-center mb-5"><h3 class="font-bold text-lg">🎥 영상 분석 요청</h3><button onclick="closeUp()" class="text-gray-400 text-2xl leading-none active:scale-90 transition">&times;</button></div>
<div class="space-y-3">
<input type="url" id="ytUrl" placeholder="유튜브 URL (예: youtu.be/...)" class="w-full bg-black border border-gray-700 focus:border-emerald-500 rounded-xl p-3.5 text-sm outline-none transition">
<input type="text" id="pName" placeholder="선수 이름 (선택)" class="w-full bg-black border border-gray-700 focus:border-emerald-500 rounded-xl p-3.5 text-sm outline-none transition">
<select id="plan" class="w-full bg-black border border-gray-700 rounded-xl p-3.5 text-sm outline-none">
<option value="free">무료 체험 (2회 한정)</option>
<option value="personal">개인 분석 (1,000원)</option>
<option value="team">팀 분석 (3,000원)</option>
</select>
<button onclick="sub()" class="w-full grad py-3.5 rounded-xl font-bold active:scale-[.98] transition">텔레그램으로 요청</button>
<div id="upMsg" class="text-xs text-center text-gray-500 min-h-[16px]"></div>
</div>
<div class="mt-4 pt-4 border-t border-gray-800 text-[11px] text-gray-500 text-center">결과는 텔레그램으로 전송됩니다.</div>
</div>
</div>

<script>
var BOT='SoccerMom_bot';
var burl='https://t.me/'+BOT;
document.getElementById('bot1').href=burl;
document.getElementById('bot2').href=burl;
function openUp(){var m=document.getElementById('upMod');m.classList.remove('hidden');m.classList.add('flex');document.body.style.overflow='hidden';}
function closeUp(){var m=document.getElementById('upMod');m.classList.add('hidden');m.classList.remove('flex');document.body.style.overflow='';}
function sub(){var u=document.getElementById('ytUrl').value.trim();var n=document.getElementById('pName').value.trim();var p=document.getElementById('plan').value;var m=document.getElementById('upMsg');if(!u){m.textContent='⚠️ 영상 URL을 입력해주세요';m.className='text-xs text-center text-red-400 min-h-[16px]';return;}m.textContent='⏳ 텔레그램 봇으로 연결합니다...';m.className='text-xs text-center text-emerald-400 min-h-[16px]';setTimeout(function(){location.href=burl+'?start=v_'+p;},1000);}
document.getElementById('upMod').addEventListener('click',function(e){if(e.target.id==='upMod')closeUp();});
</script>
</body>
</html>`;
