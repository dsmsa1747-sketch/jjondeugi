# SoccerMom 프로젝트 — 작업 원칙 (항상 준수)

> 이 파일은 매 세션 자동 로드됩니다. **어떤 작업이든 아래 인프라 정책을 반드시 따릅니다.**

## 🎛️ 컨트롤킷 규칙 (회장님 지정 — 최우선)
회장님(오금주, 디에스컴퍼니) 드라이브 control_kit 폴더의 규칙을 항상 따른다.
- **한 번에 하나만.** NEXT_TASK의 그 작업만. 곁가지·시키지 않은 일 금지.
- **읽기 먼저, 쓰기 나중.** 새 파일 만들기 전 기존 파일 읽기. 같은 거 또 만들지 않기.
- **검증 통과 못 하면 "완료" 금지.** 문법·회귀·가짜데이터0·한국어·보안 확인 후에만 완료.
- **수정 3회 실패하면 멈추고 보고.** 무한 수정 금지.
- **추측 금지, 같은 질문 두 번 금지.** 결제·본인인증·계정생성·과금결정만 회장님께. 그 외 알아서 진행.
- **빈 약속 금지.** "완벽하게 해드릴게요" 금지. 한 만큼만 정직하게 보고. 안 되면 "안 된다"고 정확히.
- **AI 디자인 박멸(DESIGN.md):** 떠다니는 입자·무의미 그라데이션·가짜 트래킹 동그라미·가짜 점수카드·이모지 폭격(6개 초과) 금지. 실제 데이터만, 강조색 1개(라임 #C5FF30), 타이포 위주, "데이터 없음" 명시.
- **가짜 데이터 금지:** Math.random()·하드코딩 더미·PLAYERS_DB 금지. 추정값엔 "AI 추정" 라벨.
- **한국화:** 모든 출력 한국어, 통화 원(KRW), 시간 KST, 날짜 한국식.
- **세션 끊겨도 이어지게:** 중요 진행상황은 메모리(이 파일/STATE)에 기록. 메모리 신뢰 금지.

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
