# SoccerMom — 인프라 구성 정책

> **원칙**
> 1. **Google로 가능한 건 전부 Google** (저장·DB·실행·AI·큐·빌드·호스팅·로그)
> 2. **로그인·결제는 한국 서비스 유지** (카카오·네이버·토스·카드사 — 이미 잡혀있음)
> 3. **회장님 보고는 메신저 자동발송** (텔레그램/카카오 등 — 자동화가 목적)

## 전체 구성표

| 영역 | 역할 | 사용 서비스 | 분류 | 상태 |
|---|---|---|---|---|
| 영상 저장 | 입력/결과 영상·JSON | **Cloud Storage(GCS)** | 🟢 Google | ✅ 워커 연동 |
| 작업 상태 | 분석중→완료 메타 | **Firestore** | 🟢 Google | ✅ 워커 연동 |
| 정밀분석 | YOLO 추적/속도/거리 | **Cloud Run + GPU(L4)** | 🟢 Google | ✅ 이 repo 워커 |
| 빠른 AI 코칭 | 영상 코칭(40초) | **Gemini API** | 🟢 Google | ✅ 적용됨 |
| 작업 큐 | 분석요청 대기열 | **Cloud Tasks** | 🟢 Google | ⏳ 웹 연결 시 |
| 이미지 빌드 | 컨테이너 빌드 | **Cloud Build** | 🟢 Google | ✅ deploy.sh |
| 이미지 저장 | 컨테이너 보관 | **Artifact Registry** | 🟢 Google | ✅ deploy.sh |
| 웹 호스팅 | Next.js 배포 | **Cloud Run / Firebase Hosting** | 🟢 Google | ⏳ 선택 |
| 로그·모니터링 | 운영 관찰 | **Cloud Logging / Monitoring** | 🟢 Google | ✅ 자동 |
| 학부모 완료알림 | 앱/웹 푸시 | **Firebase Cloud Messaging(FCM)** | 🟢 Google | ⏳ 웹 연결 시 |
| **로그인** | 회원 인증 | **Google + 카카오 + 네이버** | 🟡 한국 유지 | ✅ Google 적용, 카카오/네이버 유지 |
| **결제** | 카드결제 | **토스페이먼츠 / 카드사** | 🟡 한국 유지 | ✅ 적용됨 (정산기록은 Firestore 보관) |
| **회장님 보고** | 자동 운영보고 | **텔레그램(기본)·카카오 등 메신저** | 🟠 메신저 | ✅ 워커에 구현 |

→ **인프라(저장·DB·실행·AI·큐·빌드·호스팅·로그·앱푸시)는 100% Google.**
   로그인/결제는 한국 서비스 유지, 회장님 보고는 메신저 자동발송.

## 데이터 흐름
```
[학부모] SoccerMom (Next.js · Cloud Run/Firebase Hosting)
  │  로그인: Google/카카오/네이버    결제: 토스/카드사   ← 한국 서비스
  │  영상 업로드
  ▼
[Cloud Storage] 입력 영상            🟢
  │
  ▼
[Firestore] analysisJobs/{id}=queued 🟢
  │
  ▼
[Cloud Tasks] → POST /analyze        🟢
  ▼
[Cloud Run + GPU] YOLO 정밀분석 워커  🟢
  │  결과영상+JSON → [Cloud Storage]  🟢
  │  상태 done     → [Firestore]      🟢
  ├─▶ [FCM] 학부모 앱푸시 "분석 완료"  🟢
  └─▶ [텔레그램] 회장님 자동보고        🟠 (메신저, 교체가능)
  ▼
[SoccerMom 결과화면] 그래프 + 추적영상
```

## 회장님 자동보고 설정 (텔레그램)
워커가 분석 완료/실패 시 회장님께 자동 메시지를 보냅니다. 봇 토큰·챗ID만 환경변수로 넣으면 끝:
```
NOTIFY_PROVIDER=telegram
TELEGRAM_BOT_TOKEN=<BotFather에서 발급>
TELEGRAM_CHAT_ID=<본인 챗 ID>
```
- 텔레그램을 기본으로 한 이유: **봇 토큰만으로 즉시 자동발송**이 되어 자동화에 가장 적합(추가 승인/심사 불필요).
- 카카오 알림톡으로 바꾸려면 사업자 채널+템플릿 심사가 필요합니다(추후 `notify.py`에 provider 추가 지점 표시해둠).
- 끄려면 `NOTIFY_PROVIDER=none`.

## 적용 체크리스트
- [x] 정밀분석 워커: GCS + Firestore + Cloud Run (Google)
- [x] 회장님 자동보고: 텔레그램(교체 가능) 워커에 구현
- [ ] SoccerMom 웹: 큐(Cloud Tasks) + 학부모알림(FCM) 연결 (SoccerMom 코드 필요)
- [ ] 영상 저장: Drive → GCS로 통일 (서버 처리에 적합, 같은 GCP 프로젝트)
- [ ] 로그인/결제: 한국 서비스 그대로 유지 (변경 없음)
```
