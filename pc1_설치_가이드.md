# pc1에서 메이크샵 자동등록 돌리기

n8n이 이미 깔려 있는 **pc1**에서 자동등록을 실행합니다.
pc1은 메이크샵에 접속이 되는 컴퓨터라서 여기서 돌려야 실제 등록이 됩니다.

---

## 1단계 — 파일 가져오기 (pc1에서 한 번)

pc1에서 이 저장소를 받습니다. 이미 받아둔 폴더가 있으면 최신화만 하면 됩니다.

```bash
# 처음이면
git clone https://github.com/dsmsa1747-sketch/jjondeugi.git
cd jjondeugi

# 이미 폴더가 있으면
cd jjondeugi
git pull origin main
```

필요한 파일: `makeshop_sheets_pipeline.py`, `sheets_service.py`

---

## 2단계 — 준비물 설치 (pc1에서 한 번)

```bash
pip install playwright python-dotenv google-auth google-auth-oauthlib google-api-python-client requests
playwright install chromium
```

그리고 지금 쓰던 시스템의 `.env` 파일과 구글 인증 파일
(`drive_token.json` 또는 `credentials.json`)을 **이 폴더 안에** 같이 둡니다.
(기존 시스템에서 쓰던 그 파일 그대로 복사하면 됩니다.)

`.env` 안에 아래 값이 들어있어야 합니다:
```
MAKESHOP_ADMIN_ID=...
MAKESHOP_ADMIN_PASSWORD=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

---

## 3단계 — 한번 직접 돌려보기 (테스트)

```bash
python makeshop_sheets_pipeline.py
```

- 텔레그램으로 단계별 스크린샷이 오면 정상 작동 중입니다.
- 시트의 "대기" 상품이 "완료"/"실패"로 바뀝니다.
- 화면(콘솔)에 나오는 글을 그대로 복사해서 저(클로드)에게 주시면, 막히는 부분을 바로 고쳐드립니다.

---

## 4단계 — n8n에 연결 (자동화)

1. n8n 화면 우측 상단 **⋮ → Import from File**
2. 이 폴더의 **`n8n_makeshop_register.json`** 선택
3. **"메이크샵 자동등록 실행"** 노드를 열어서, `cd` 뒤의 경로를
   pc1에서 `makeshop_sheets_pipeline.py` 가 들어있는 **실제 폴더 경로**로 바꿉니다.
   - 예) 리눅스: `cd /home/사용자/jjondeugi && python3 makeshop_sheets_pipeline.py`
   - 예) 윈도우: `cd C:\jjondeugi && python makeshop_sheets_pipeline.py`
4. 저장 후 **Active(활성화)** 켜기 → 매일 오전 10시 자동 실행
   - 즉시 실행하려면 **수동 실행** 노드에서 ▶ 클릭

---

## 작동 방식

```
구글 시트(상태=대기 상품)
   ↓  sheets_service.py
makeshop_sheets_pipeline.py (Playwright로 메이크샵 자동 로그인·입력·등록)
   ↓
텔레그램 알림 + 시트에 결과("완료"/"실패") 기록
```

이미 "완료"가 된 상품은 다시 등록하지 않으니 중복 걱정은 없습니다.
새 상품은 시트에 줄을 추가하고 **상태를 "대기"**로 두기만 하면 됩니다.
