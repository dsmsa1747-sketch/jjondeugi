# CLAUDE.md — 디에스컴퍼니 메이크샵 자동등록 프로젝트 메모리

> 이 파일은 세션이 바뀌어도 유지되는 프로젝트 기억입니다. 작업을 이어갈 때 먼저 읽으세요.

## 🚨 운영 규칙 (회장님 Control Kit — 모든 작업에 강제 적용)
> 출처: 구글 드라이브 Control Kit 폴더(ID `1zpFNclQ2NoJeWEEqkfvhnbz-K7AK59hz`). SoccerMom용으로 만들었지만 **회장님의 보편 작업 규칙**이라 모든 작업에 지킨다.

1. **추측 금지, 한 번만 질문** — 답이 메모(CONTEXT/CLAUDE.md)에 있으면 거기서 읽기. 없으면 딱 한 번만 묻고 그 답을 메모에 영구 저장. **같은 질문 두 번 금지.**
2. **검증 통과 못 하면 "완료" 금지** — 끝났다고 말하기 전 문법·회귀·진실성·보안·한국화 확인. 통과 못 하면 ⚠️ 표시. **수정 3회 실패 시 멈추고 보고.**
3. **STATE 갱신 의무** — 작업 시작/끝마다 진행상태 기록. 메모리 신뢰 금지, 기록으로 이어간다.
4. **사람 개입은 딱 4가지뿐** — 결제/카드입력, 본인인증, 외부 계정생성+로그인, 과금 결정. 그 외 기술적 결정은 알아서 진행.
5. **AI 디자인 박멸** — 떠다니는 입자, 무의미한 그라데이션, 가짜 트래킹 동그라미, 가짜 점수카드(SPD 78 등), 이모지 폭격 금지. **실제 데이터만**, 없으면 "데이터 없음"이라 쓴다.
6. **가짜 데이터 금지** — `Math.random()`, 하드코딩 더미(PLAYERS_DB 등) 금지. 화면 숫자는 전부 실제 API 응답에서.
7. **시크릿 노출 즉시 중단** — 코드/로그/채팅에 키·비번 보이면 그 자리 멈추고 알림.
8. **한국어·구글·KRW·KST** — 모든 출력 한국어, 인프라는 구글 우선(결제만 Toss 예외), 통화 원, 시간 KST.
9. **읽기 먼저 / 한 번에 하나 / 최소 수정** — 새 파일 전 기존 파일 읽기, 곁가지 작업 금지, 큰 파일 통째로 다시쓰기 금지(부분 수정 우선).
10. **빈 약속 금지** — "완벽하게 해드릴게요" 류 금지. **안 되는 건 정확히 "안 됩니다"라고 말한다**(회장님이 가장 중시).

### Control Kit 파일맵 (드라이브)
START_HERE / CLAUDE.md(진입점·읽는 순서) · CONTEXT(회장님·한국·구글 룰) · STATE(진행상태) · MISSION(목표+건들지마라) · RULES(행동규칙) · NEXT_TASK(다음 1개) · VERIFY(완료기준) · DESIGN(AI디자인박멸) · check.sh(검증 자동화) · notify.sh(텔레그램 보고)

### SoccerMom 프로젝트 핵심 (별도 프로젝트, 같은 회장님)
- 목표: 유소년 축구 영상분석 실서비스 오픈. PC: Windows 11 `C:\Users\FOCUS\Desktop\유소년축구플랫폼\soccermom`, PowerShell.
- 인프라: Drive/GCS/Firestore/Gemini/Cloud Run/Secret Manager + 결제 Toss. 가격: 무료 2회→개인 2,000원/팀 5,000원(`lib/pricing.js` 단일출처).
- 건들지마라: `lib/gemini.js`(챗봇), `app/api/payment`(Toss), `app/api/auth`(NextAuth), V5 Apps Script 봇, `.env.local` 키.
- 현재 P0 다음작업: 선수 식별 정확도(입력 등번호 ↔ AI 인식 불일치를 둘 다 정직하게 표시).

> ⚠️ 정직 고지: 이 클라우드 환경은 텔레그램(api.telegram.org) 차단됨 → `notify.sh` 자동알림은 회장님 PC에서만 동작. 또 control_kit/STATE.md 등은 회장님 로컬 PC에 있어 이 환경에서 직접 못 고침(드라이브 경유만 가능).

## 사용자 / 비즈니스
- 오금주 (식스푼 / 디에스컴퍼니 대표). 비개발자.
- 이메일: dsmsa1747@gmail.com
- 쇼핑몰: ostarmarket.com / 플랫폼: Makeshop / Shop ID: `sixpoon6`
- 모든 클라우드 데이터·저장은 **구글(드라이브/시트)**로 통일하길 원함.
- 말투: 한국어, 짧고 쉽게. "다 알아서 해줘" 스타일 → 질문 최소화, 결정해서 진행.

## 핵심 목표 (현재 진행 중)
**메이크샵 자동 상품등록을 끝까지 작동시키기.**
- 메일연결·텔레그램·n8n·메이크샵 연결은 이미 다 됨. **마지막으로 "실제 상품 자동등록"만 미완성.**
- "이거 해결하면 다음거 하자" — 등록 성공 후 다음 작업으로.

## ⚠️ 가장 중요한 제약 (실측으로 확인됨)
- **이 클라우드/웹 작업환경은 메이크샵에 접속 불가.** 실제 Chromium으로 접속 시도 결과:
  `premium.makeshop.co.kr` → HTTP 403 **"Host not in allowlist"** (환경 방화벽 화이트리스트).
  텔레그램(api.telegram.org)도 차단(403). **구글 API·pypi만 허용됨.**
- 따라서 자동등록 실행은 **반드시 pc1**(메일·텔레그램·n8n이 이미 도는 컴퓨터, 메이크샵 접속 가능)에서 해야 함.
- 클라우드에서 할 수 있는 것: 코드 작성/수정, 구글 시트 읽기·쓰기(MCP), 구글 드라이브 업로드(MCP).

## 데이터 소스
- 구글 시트 "디에스컴퍼니 자동화 시트"
  - ID: `1UcrfwRtiy9Qgs4aVbAHhYE1_gW2r6bCCae5Jh1190g4`
  - 컬럼: 번호, 상태, 등록일, 상품명, 카테고리, 공급처, 원산지, 제조사, 옵션1_이름/원가/판매가, 옵션2_이름/원가/판매가, 수수료율, 무료배송, 판매처, 이미지폴더URL, 상세페이지URL, 메모, 처리결과, 완료시간, 텔레그램알림
  - 상태=="대기"인 행만 처리. 등록되면 "완료"/"실패"로 갱신 (중복방지).
  - 현재 대기 상품 2개: ①퀵맘 냉감 UV 자켓(싱글 8000/39800, 더블 16000/59800) ②디비노 포렌즈 편광선글라스 힙색 SET(단일 16500/59800)
- 구글 드라이브 "메이크샵" 폴더 (ID: `1kst5UR5QQ6E6nIHzYDH8Z2jYDKpAosyn`)
  - `메이크샵_자동등록_전체.zip` (작업 코드 전체, 무결성 확인 23491 byte)
  - `[가이드] pc1에서 메이크샵 자동등록 돌리기` (Google 문서)

## 코드 구조 (이 repo)
- `makeshop_sheets_pipeline.py` — **메인.** 시트 대기상품 읽기 → Playwright로 메이크샵 로그인·폼입력·등록 → 스크린샷(텔레그램/드라이브) → 시트 갱신. SHEET_ID 하드코딩. 다중 셀렉터 폴백.
- `sheets_service.py` — 구글 시트 read/write 헬퍼. drive_token.json(OAuth) 우선, credentials.json(서비스계정) 폴백.
- `diagnose_makeshop.py` — 메이크샵 실제 입력필드/셀렉터 수집 진단용.
- `n8n_makeshop_register.json` — n8n import용 워크플로우 (수동 + 매일 10시). Execute Command로 파이프라인 실행. 경로 수정 필요.
- `.github/workflows/makeshop-register.yml` — 서버리스 대안(GitHub Actions). Secrets 등록 + main 머지 필요.
- `pc1_설치_가이드.md`, `MAKESHOP_자동등록_사용법.md` — 사용 가이드.

## 실행 방법 (pc1에서)
```
pip install playwright python-dotenv google-auth google-auth-oauthlib google-api-python-client requests
playwright install chromium
# .env + (drive_token.json 또는 credentials.json) 같은 폴더에 두기
python makeshop_sheets_pipeline.py
```
.env 필수값: MAKESHOP_ADMIN_ID, MAKESHOP_ADMIN_PASSWORD, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

## 수정 이력 / 해결한 것
- Playwright 버그 2건 수정: `frame.keyboard`→`page.keyboard`, `frame.wait_for_timeout`→`asyncio.sleep` (frame엔 해당 메서드 없음).
- `.gitignore` 추가(.env, __pycache__, diag_out, *.db, 인증 json 제외).
- 클라우드에서 직접 실행 시도 → "Host not in allowlist" 확인(차단 증거).

## 미해결 / 다음 단계
1. **pc1에서 `python makeshop_sheets_pipeline.py` 실행 → 콘솔/텔레그램 결과 받기.**
2. 그 결과로 메이크샵 실제 화면의 진짜 셀렉터(로그인 필드, 상품등록 폼 필드명, 등록버튼)를 확정해 코드 수정.
3. 등록 성공까지 반복 → 성공하면 "다음거" 진행.

## Git / PR
- 작업 브랜치: `claude/nice-edison-kYOc4` (절대 main에 직접 push 금지, 권한 없이).
- PR #2 (claude/nice-edison-kYOc4 → main) = draft. GitHub Actions 쓰려면 main 머지 필요(사용자 허락 후).
- repo: dsmsa1747-sketch/jjondeugi

## 보안 주의 (사용자에게 고지함)
- 업로드된 .env에 실제 키 노출됨(Anthropic/OpenAI/Gemini/Telegram bot/메이크샵 비번). **재발급 권장.**
- 어떤 키·비번도 repo에 커밋 금지.
