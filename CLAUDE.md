# CLAUDE.md — 디에스컴퍼니 메이크샵 자동등록 프로젝트 메모리

> 이 파일은 세션이 바뀌어도 유지되는 프로젝트 기억입니다. 작업을 이어갈 때 먼저 읽으세요.

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
