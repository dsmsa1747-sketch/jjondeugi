# SoccerMom 프로젝트 — 작업 원칙 (항상 준수)

> 이 파일은 매 세션 자동 로드됩니다. **어떤 작업이든 아래 인프라 정책을 반드시 따릅니다.**

## 🔒 인프라 정책 (절대 규칙)
1. **Google로 가능한 건 전부 Google.**
   - 영상 저장 → Google Cloud Storage(GCS)
   - DB/작업 상태 → Firestore
   - 무거운 실행(YOLO 정밀분석) → Cloud Run + GPU(L4)
   - 빠른 AI 코칭 → Gemini API
   - 작업 큐 → Cloud Tasks
   - 컨테이너 빌드/저장 → Cloud Build / Artifact Registry
   - 웹 호스팅 → Cloud Run 또는 Firebase Hosting
   - 로그/모니터링 → Cloud Logging / Monitoring
   - 학부모 완료 알림(앱/웹 푸시) → Firebase Cloud Messaging(FCM)
   - 모든 리소스는 **하나의 GCP 프로젝트** 안에서 관리 (한 곳 관리 원칙)

2. **로그인·결제는 한국 서비스 유지 (Google로 바꾸지 않음).**
   - 로그인: Google + 카카오 + 네이버
   - 결제: 토스페이먼츠 + 카드사
   - 단, 결제/정산 *기록*은 Firestore에 저장해 Google 한 곳에서 조회 가능하게 함.

3. **회장님 보고는 메신저로 자동 발송 (자동화 목적).**
   - 기본: 텔레그램(봇 토큰만으로 즉시 자동발송 — 심사 불필요).
   - 카카오 알림톡 등으로 교체 가능(사업자 채널+템플릿 심사 필요). 교체 지점: `soccer-analysis-worker/app/notify.py`
   - 끄기: `NOTIFY_PROVIDER=none`

## 정직성 원칙 (환불 방지)
- 안 되는 걸 "된다"고 하지 않는다. (가짜 데모/난수 금지)
- 정밀분석 거리/속도는 **경기장 보정점이 없으면 '상대 추정값(px)'으로 표기**, 미터/km/h로 단정하지 않음.
- 결과에 "AI 측정·오차 있음" 라벨 유지. 등번호 자동인식은 약하므로 클릭 선수지정+직접입력으로 보완.

## 두 가지 분석 모드 (둘 다 유지)
| | 빠른 코칭분석(기존) | 정밀분석(신규 YOLO) |
|---|---|---|
| 엔진 | Gemini | Cloud Run + GPU (YOLO) |
| 속도 | 40초~1분 | 수분(영상길이·GPU) |
| 출력 | 강점/개선/드릴/하이라이트 | 추적영상·속도·거리·볼점유 |
| 가격 | 개인 2,000원 | 정밀 5,000원~ |

## 핵심 경로
- 정밀분석 워커: `soccer-analysis-worker/` (Cloud Run + GPU 배포 준비 완료)
- 인프라 구성표: `soccer-analysis-worker/deploy/GOOGLE_ONLY_ARCHITECTURE.md`
- 배포 스크립트: `soccer-analysis-worker/deploy/deploy.sh`
- SoccerMom 웹 연결 드롭인: `soccermom-integration/`

## SoccerMom 코드 구조 (참고)
- Next.js App Router, `jsconfig.json` 의 `@/*` → `./`
- `lib/` : auth.js, drive.js, gemini.js, pricing.js (+ 정밀분석용 신규 추가)
- `app/api/analyze/route.js` : 기존 Gemini 분석
- 인증: NextAuth(Google/Kakao), 결제: Toss, AI: Gemini, 저장: Drive(서비스계정)
