# 🌱 콩나물 — 설치 & 실서비스 연결 가이드

신선 커머스 앱 **콩나물**의 전체 구조와, 데모 → 실서비스 전환 방법입니다.
**핵심:** 지금 상태로도 jjondeugi.com 에서 바로 동작하고(데모 모드), Apps Script URL만 넣으면 진짜 회원·결제·정산이 작동합니다.

---

## 📁 파일 구조 (이 레포)

```
jjondeugi/
├─ index.html              ← 콩나물 프론트엔드 앱 (GitHub Pages 홈페이지)
├─ CNAME                   ← jjondeugi.com 도메인 연결
├─ SETUP.md                ← (이 문서)
├─ backend/
│  ├─ Code.gs              ← Google Apps Script 백엔드 (구글 시트=DB, 토스 결제, 정산, 텔레그램)
│  └─ appsscript.json      ← Apps Script 매니페스트(웹앱 배포 설정)
└─ SELLZY_complete.html    ← (구버전 데모, 참고용 보관)
```

## 🌐 주요 경로(URL)

| 항목 | 위치 |
|------|------|
| 서비스 주소 | **https://jjondeugi.com** (GitHub Pages + CNAME) |
| 소스 저장소 | github.com/dsmsa1747-sketch/jjondeugi |
| 프론트 설정 | `index.html` 상단 `const CONFIG = { ... }` |
| 백엔드 코드 | `backend/Code.gs` → Apps Script 편집기에 붙여넣기 |

---

## 🚦 1단계 — 지금 바로 (데모 모드, 0분)

아무 설정 없이 푸시하면 GitHub Pages가 `index.html`을 jjondeugi.com에 배포합니다.
이 상태에서도 회원가입·로그인·장바구니·주문·결제(시뮬레이션)가 **브라우저(localStorage)** 기준으로 모두 동작합니다.
> 데이터가 브라우저에만 저장되고 결제는 가짜라는 점만 다릅니다.

---

## 🔌 2단계 — 실서비스 연결 (Google 도구만 사용)

### ① Google Sheets 생성 (DB)
1. [sheets.new](https://sheets.new) 로 새 스프레드시트 생성 (이름: `콩나물 DB`)
2. 주소창 URL에서 ID 복사
   `https://docs.google.com/spreadsheets/d/`**`여기가_ID`**`/edit`

### ② Apps Script 백엔드 붙여넣기
1. 스프레드시트 상단 메뉴 **확장 프로그램 ▸ Apps Script**
2. 기본 `Code.gs` 내용 지우고 → 이 레포 `backend/Code.gs` 전체 붙여넣기
3. 좌측 **프로젝트 설정(⚙️) ▸ 스크립트 속성**에서 아래 등록

   | 속성 이름 | 값 | 필수 |
   |-----------|-----|------|
   | `SPREADSHEET_ID` | ①에서 복사한 ID | ✅ |
   | `TOKEN_SECRET` | 아무 긴 랜덤 문자열(로그인 토큰 서명용) | ✅ |
   | `TOSS_SECRET_KEY` | `test_sk_...` 또는 `live_sk_...` | 결제 시 |
   | `TELEGRAM_BOT_TOKEN` | @BotFather 발급 토큰 | 선택 |
   | `TELEGRAM_OWNER_ID` | 본인 텔레그램 chat id | 선택 |

4. 함수 선택창에서 **`initSetup`** 실행 → 권한 허용 → 시트/헤더/샘플상품 자동 생성
5. **`setupTriggers`** 실행 → 매일 새벽 3시 **D+7 자동 정산** 트리거 등록

### ③ 웹앱 배포
1. 우상단 **배포 ▸ 새 배포 ▸ 유형: 웹 앱**
2. **실행 사용자: 나** / **액세스 권한: 모든 사용자**
3. 배포 → 생성된 **웹 앱 URL**(`https://script.google.com/macros/s/AKfycb.../exec`) 복사

### ④ 프론트엔드에 연결
`index.html` 상단 CONFIG 수정:
```js
const CONFIG = {
  API_BASE: 'https://script.google.com/macros/s/AKfycb.../exec', // ← ③에서 복사
  TOSS_CLIENT_KEY: 'test_ck_...',  // 토스 클라이언트 키 (선택, 실결제 시)
  ...
};
```
커밋·푸시하면 끝. 이제 회원·주문이 **구글 시트에 저장**되고, 결제는 토스로 승인됩니다.

---

## 💳 토스페이먼츠 연결

1. [tosspayments.com](https://www.tosspayments.com) 가입 → 개발자센터에서 키 발급
2. **클라이언트 키**(`ck`) → `index.html`의 `CONFIG.TOSS_CLIENT_KEY`
3. **시크릿 키**(`sk`) → Apps Script 스크립트 속성 `TOSS_SECRET_KEY`
4. 테스트는 `test_ck_` / `test_sk_`, 실결제는 `live_` 키 사용
> 키 미설정 시 결제는 자동으로 **시뮬레이션**되어 주문 흐름만 검증됩니다.

## 🤖 텔레그램 알림(선택)

1. 텔레그램 **@BotFather** → `/newbot` → 토큰 발급 → `TELEGRAM_BOT_TOKEN`
2. 본인 chat id 확인 후 `TELEGRAM_OWNER_ID` 등록
3. 봇 명령어: `/status`(현황) · `/settle`(즉시 정산)
4. 신규 가입·결제·정산 시 자동 알림 수신

---

## 🗂️ 구글 시트 DB 스키마 (initSetup가 자동 생성)

| 시트 | 컬럼 |
|------|------|
| **Users** | id, email, name, phone, pwHash, salt, role, createdAt |
| **Products** | id, name, price, cat, emoji, seller, stock, sales, desc |
| **Orders** | id, uid, itemsJson, amount, shipJson, status, paymentKey, createdAt, paidAt |
| **Settlements** | id, sellerId, amount, fee, net, status, date |
| **Logs** | ts, action, detail |

상품 추가/수정은 **Products 시트에 직접 입력**하면 앱에 즉시 반영됩니다.

---

## ✅ 동작 확인 체크리스트

- [ ] jjondeugi.com 접속 → 홈 화면·상품 노출
- [ ] 회원가입 → 로그인 → 마이페이지 표시
- [ ] 상품 담기 → 장바구니 → 주문/결제 → 결제완료 화면
- [ ] (백엔드 연결 시) 구글 시트 Users/Orders에 데이터 적재
- [ ] (텔레그램 연결 시) `/status` 응답 수신

---

## 🔒 보안 메모
- 비밀번호는 백엔드에서 **SHA-256 + salt** 해시로 저장(평문 저장 안 함)
- 로그인 토큰은 `TOKEN_SECRET` 기반 서명 검증
- API 키/시크릿은 **코드에 하드코딩하지 말고** Apps Script 스크립트 속성에만 보관
