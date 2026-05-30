# SoccerMom 보안 점검 보고서

> 작성일: 2026-05-30  
> 대상: soccermom-app (Next.js App Router)  
> 검토 범위: `app/api/*/route.js`, `lib/*.js`  
> 목적: 운영 전 필수 보안 점검 (코드 변경 없이 현황 파악 + 권고)

---

## 1. 기발생 보안 사고 — 즉시 조치 필요

### 1-1. 텔레그램 봇 토큰 + Claude API 키 평문 노출 (고위험)

- **경위**: 과거 Google Drive에 저장된 `SoccerMom_V5_FINAL.gs` (Apps Script) 파일 안에 텔레그램 봇 토큰과 Claude API 키가 소스 코드에 직접 하드코딩된 채로 저장되었음.
- **위험**: Drive 공유 링크가 한 번이라도 외부 노출되었다면 두 키 모두 제3자가 취득했을 수 있음. 텔레그램 봇은 메시지 발송·수신 권한 탈취, Claude 키는 무제한 API 과금 발생 가능.
- **필수 조치**:
  1. 텔레그램 @BotFather → 해당 봇 → `/revoke` → 새 토큰 발급 후 교체.
  2. Anthropic Console (console.anthropic.com) → API Keys → 해당 키 삭제 → 새 키 발급.
  3. Google Drive의 해당 .gs 파일을 삭제하거나 공유를 완전히 차단.
  4. 이후 신규 키는 절대 소스코드에 기록하지 않음 — 아래 Secret Manager 정책 참조.

### 1-2. Gemini API 키 환경변수 관리 (중위험)

- **현황**: `lib/gemini.js`, `app/api/nutrition/route.js`, `app/api/training/route.js` 에서 `process.env.GEMINI_API_KEY` 를 직접 참조. `.env.example` 에도 평문으로 예시가 존재.
- **현재 코드의 처리**: API 키는 환경변수(`process.env`)로만 읽고 응답에 포함되지 않음 — 서버사이드 전용으로 올바르게 처리되고 있음.
- **위험 시나리오**: 배포 환경(Cloud Run 등)에서 환경변수를 콘솔 UI에 직접 입력하면 Cloud Console 로그·IAM 관리자에게 노출될 수 있음. 채팅/슬랙으로 키를 전달한 기록이 있으면 즉시 재발급 권고.
- **권고**: Cloud Run → Secret Manager 참조 방식으로 전환 (아래 체크리스트 참조).

### 1-3. Toss 테스트 시크릿 키 상태 (중위험)

- **현황**: `.env.example` 에 `TOSS_SECRET_KEY=test_sk_xxxx` 로 테스트 키 사용 중. 실제 운영 시 실키(`live_sk_`)로 교체하지 않으면 실결제가 불가능하거나, 더 위험하게는 결제 승인 흐름이 "성공"처럼 보이지만 실제 돈이 수취되지 않을 수 있음.
- **필수 조치**: 토스페이먼츠 가맹점 심사 완료 후 `live_sk_` / `live_ck_` 발급, 환경변수 교체 전까지 실결제 오픈 금지.

---

## 2. API 라우트 보안 점검 — 코드 실측 결과

### 2-1. 로그인 필수 체크 (인증 게이트)

| 라우트 | 로그인 체크 | 방식 | 평가 |
|---|---|---|---|
| `POST /api/analyze-fast` | O | `getUserEmail()` → 401 | 양호 |
| `POST /api/analyze-precise` | O | `getUserEmail()` → 401 | 양호 |
| `POST /api/pay/confirm` | O | `getUserEmail()` → 401 | 양호 |
| `POST /api/ads` (광고 신청) | O | `getUserEmail()` → 401 | 양호 |
| `GET  /api/ads` (광고 조회) | X | 미인증 허용 | 의도적 공개 (배너 노출 목적) — 광고 데이터만 반환하므로 허용 가능 |
| `POST /api/nutrition` | O | `getUserEmail()` → 401 | 양호 |
| `POST /api/training` | O | `getUserEmail()` → 401 | 양호 |
| `GET  /api/growth` | O | `getUserEmail()` → 401 | 양호 |
| `POST /api/growth` | O | `getUserEmail()` → 401 | 양호 |
| `GET  /api/mypage` | O | `getServerSession()` → 401 | 양호 |
| `POST /api/support` | X | 이메일 파라미터만 받음 | 주의 (아래 설명) |
| `POST /api/upload-url` (서명 URL) | △ | 세션 조회하나 없어도 통과 | 주의 (아래 설명) |

**support 라우트 주의**: 로그인 없이도 이메일·제목·내용을 POST하면 Firestore에 저장됨. 스팸/어뷰징 문의가 대량 저장될 수 있음. 운영 중 문제가 되면 `getUserEmail()` 체크 추가 또는 CAPTCHA 도입 권고.

**upload-url 라우트 주의**: 세션이 없으면 `anonymous` 경로로 서명 URL을 발급함. 비로그인 사용자도 GCS에 파일을 업로드할 수 있어 스토리지 남용 가능. `analyze-fast/precise` 에서 업로드된 영상은 어차피 로그인이 필요하므로 `upload-url` 도 로그인 필수로 변경 권고.

### 2-2. 결제 금액 위변조 방지 (pay/confirm)

`app/api/pay/confirm/route.js` 에서 다음 로직 확인:

```js
// 금액 위변조 차단: 실제 결제금액 == 서버 정가
const expected = Number(job.price);
if (Number(tossData.totalAmount) !== expected) {
  await updateJob(jobId, { status: "payment_mismatch" });
  return NextResponse.json({ error: "결제 금액이 정가와 다릅니다." }, { status: 400 });
}
```

- 클라이언트가 `amount`를 변조해 보내도 토스 승인 후 **서버에 저장된 정가(`job.price`)와 비교**하여 불일치 시 `payment_mismatch` 처리 후 거부. **금액 위변조 차단 구현 양호.**
- 토스 응답의 `totalAmount`(토스 서버 측정값)를 사용하므로 클라이언트 변조 불가.

### 2-3. 결제 후에만 분석 실행 (결제 우선 원칙)

- **빠른 분석(fast)**: Gemini 분석을 먼저 실행하되 결과를 `pendingResult`에 보관 → 결제 검증 후 `result`로 이동하고 `pendingResult`는 삭제. `analyze-precise/status` 라우트에서 `pendingResult`를 의도적으로 읽지 않음 (주석으로 명시). **구현 양호.**
- **정밀 분석(precise)**: 결제 전까지 Cloud Tasks 큐에 넣지 않음. 결제 검증 후 `workerPayload`로 큐에 등록. **구현 양호.**
- **관리자 우회**: `ADMIN_EMAILS` 환경변수에 등록된 이메일은 결제 없이 즉시 실행. 관리자 이메일 목록이 노출되지 않도록 환경변수 관리 철저히 필요.

### 2-4. 작업 소유자 확인 (수평 권한 상승 방지)

`pay/confirm`에서:

```js
if (job.userEmail && job.userEmail !== email) {
  return NextResponse.json({ error: "본인 작업만 결제할 수 있습니다." }, { status: 403 });
}
```

**구현 양호.** 타인의 jobId로 결제를 가로채는 공격 차단.

### 2-5. 중복 결제 방지

```js
if (job.status !== "awaiting_payment") {
  return NextResponse.json({ success: true, jobId, mode: job.mode, already: true });
}
```

**구현 양호.** 동일 orderId 중복 전송(네트워크 재전송 등) 시 안전하게 현재 상태만 반환.

### 2-6. 서비스 계정 키 관리

- `lib/googleAuth.js`: `GOOGLE_SERVICE_ACCOUNT_KEY` 환경변수에서 base64 디코딩하여 사용. 파일 시스템에 키 파일을 두지 않음 — **Cloud Run 배포에 적합한 패턴.**
- 단, base64 값을 환경변수에 직접 입력하면 Cloud Console UI에서 보이거나 CI 로그에 노출될 수 있음 → **Secret Manager** 참조 방식 권고.

---

## 3. 권고사항 체크리스트

### 운영 전 필수 (MUST)

- [ ] **텔레그램 봇 토큰 즉시 재발급** — @BotFather `/revoke` → 신규 토큰 → `soccer-analysis-worker/app/notify.py` 교체
- [ ] **Claude API 키 즉시 폐기 및 재발급** — Anthropic Console에서 해당 키 삭제 후 새 키 발급
- [ ] **Drive의 SoccerMom_V5_FINAL.gs 공유 차단/삭제**
- [ ] **Toss 실키(`live_sk_`, `live_ck_`) 발급 후 환경변수 교체** — 테스트키 상태로 실결제 오픈 금지
- [ ] **NEXTAUTH_SECRET** 을 충분히 긴 랜덤값으로 생성 (`openssl rand -base64 32`)
- [ ] **.env / .env.local 파일이 `.gitignore`에 포함 확인** (현재 확인: 포함되어 있음 — 유지)
- [ ] **GCS 버킷 퍼블릭 접근 차단** — Uniform bucket-level access 활성화 + allUsers 권한 제거
- [ ] **Firestore 보안 규칙 설정** — 서버사이드 서비스계정만 접근하므로 클라이언트 SDK 전체 차단: `allow read, write: if false;`
- [ ] **upload-url 라우트 로그인 필수 처리** — 익명 업로드로 인한 GCS 남용 차단

### 권장 (SHOULD)

- [ ] **Secret Manager 전환**: `GEMINI_API_KEY`, `TOSS_SECRET_KEY`, `GOOGLE_SERVICE_ACCOUNT_KEY` 를 Cloud Run 환경변수 직접 입력 대신 Secret Manager → Cloud Run 마운트로 관리
- [ ] **support 라우트 인증 추가** 또는 CAPTCHA 적용 — 스팸 문의 방지
- [ ] **ADMIN_EMAILS 값 최소화** — 실 운영 이메일만 유지, 불필요한 이메일 제거
- [ ] **Cloud Logging 알림 설정** — `payment_mismatch` 로그 발생 시 이메일/텔레그램 즉시 알림
- [ ] **GCS 업로드 파일 크기 및 MIME 타입 제한** — 서명 URL 발급 시 contentType 화이트리스트 + 최대 파일 크기 명시 (현재: 제한 없음)
- [ ] **Rate Limiting** — Gemini·Toss API를 호출하는 라우트에 IP당 분당 요청 수 제한 (Upstash Redis 또는 Cloud Armor 검토)
- [ ] **토스페이먼츠 웹훅(Webhook) 엔드포인트 추가** — 환불·취소 등 비동기 상태 변경을 서버사이드에서 반영하기 위해 권장

### 참고 (NICE TO HAVE)

- [ ] `pendingResult` 필드에 분석 결과가 임시 저장됨 — DB 접근 권한이 있는 내부자는 볼 수 있음. 민감도가 높다면 암호화 검토.
- [ ] `resultVideoUri` 서명 URL 만료 시간 — 현재 1시간. 필요에 따라 조정.
- [ ] 정밀분석 결과 조회(`analyze-precise/status`) 라우트에 jobId 소유자 검증 추가 — 현재는 jobId를 알면 누구나 상태를 조회할 수 있음.

---

## 4. 현재 잘 되어 있는 것 (긍정 평가)

1. **모든 민감 API(분석·결제·개인기록)에 로그인 필수 체크** — 일관성 있게 구현.
2. **금액 위변조 차단** — 클라이언트 금액이 아닌 Toss 서버 응답값 vs 서버 저장 정가 비교.
3. **결제 전 분석 결과 노출 없음** — `pendingResult` 패턴으로 분리, 상태 조회 API에서도 차단 (주석으로 의도 명시).
4. **작업 소유자 확인** — 타인 jobId 결제 시도 403 차단.
5. **중복 결제 방지** — `awaiting_payment` 상태 아닐 때 멱등성 있게 처리.
6. **서비스 계정 키를 파일 시스템 대신 환경변수(base64)로 관리** — Cloud Run 친화적.
7. **빌드타임 환경변수 없이 안전** — Lazy init 패턴 (핸들러 안에서만 초기화).
8. **Gemini 응답에 면책 라벨 강제 포함** — `disclaimer` 필드를 프롬프트에 명시.
9. **`.env` / `.env.local` 이 `.gitignore` 에 포함** — 실수 커밋 방지.
10. **Cloud Tasks OIDC 인증** — 워커 URL을 `--no-allow-unauthenticated`로 보호하고 서비스계정 OIDC 토큰으로만 호출.
