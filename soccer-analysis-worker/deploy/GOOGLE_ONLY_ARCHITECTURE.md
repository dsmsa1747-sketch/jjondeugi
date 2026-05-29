# SoccerMom — Google 전용 인프라 구성표

> 원칙: **정보·서비스·클라우드 전부 Google 한 곳에서 관리.** 비구글 의존을 최소화합니다.

## 전체 구성 (모든 칸이 Google)

| 영역 | 역할 | Google 서비스 | 상태 |
|---|---|---|---|
| 로그인 | 회원 인증 | **Google OAuth** (NextAuth) | ✅ 이미 적용 |
| AI 코칭분석 | 빠른 영상 코칭(40초) | **Gemini API** | ✅ 이미 적용 |
| 정밀분석 | YOLO 추적/속도/거리 | **Cloud Run + GPU(L4)** | ✅ 이 repo 워커 |
| 영상 저장 | 입력/결과 영상·JSON | **Cloud Storage(GCS)** | ✅ 워커 연동 |
| 작업 상태 | 분석중→완료 메타 | **Firestore** | ✅ 워커 연동 |
| 작업 큐 | 분석요청 대기열 | **Cloud Tasks** | ⏳ 웹 연결 시 |
| 알림 | 완료 푸시 | **Firebase Cloud Messaging(FCM)** | ⏳ 웹 연결 시 |
| 이미지 빌드 | 컨테이너 빌드 | **Cloud Build** | ✅ deploy.sh |
| 이미지 저장 | 컨테이너 보관 | **Artifact Registry** | ✅ deploy.sh |
| 웹 호스팅(선택) | Next.js 배포 | **Cloud Run** 또는 **Firebase Hosting** | ⏳ 선택 |
| 도메인/인증서 | HTTPS | **Google Cloud(로드밸런서)** | ⏳ 선택 |
| 로그/모니터링 | 운영 관찰 | **Cloud Logging / Monitoring** | ✅ 자동 |

→ **데이터·실행·저장·알림·빌드·호스팅이 전부 한 GCP 프로젝트 안**에 있습니다. 콘솔 한 곳에서 관리.

## 데이터 흐름 (전부 Google)
```
[학부모] SoccerMom (Next.js, Cloud Run/Firebase Hosting)
   │ 영상 업로드
   ▼
[Cloud Storage] 입력 영상 저장
   │ 작업 등록
   ▼
[Firestore] analysisJobs/{id} (status=queued)
   │ 트리거
   ▼
[Cloud Tasks] 큐 → POST /analyze
   ▼
[Cloud Run + GPU] YOLO 정밀분석 워커
   │ 결과 영상+JSON → [Cloud Storage]
   │ 상태 done       → [Firestore]
   ▼
[Firebase Cloud Messaging] 완료 푸시 알림
   ▼
[SoccerMom 결과화면] 그래프 + 추적영상
```

## ⚠️ 정직한 예외 — Google로 못 바꾸는 것
완전한 투명성을 위해 분명히 말씀드립니다. 아래는 **기술적으로 Google 대체가 없거나 부적합**합니다:

1. **결제 (Toss Payments)** — 한국 카드결제 PG입니다. Google에는 한국 카드결제를 처리하는
   동급 서비스가 없습니다(Google Pay는 한국 카드결제 정산 PG가 아님). **Toss 유지 권장.**
   → 단, 결제 *기록/정산 데이터*는 Firestore에 저장해 Google 한 곳에서 조회 가능하게 합니다.
2. **카카오 로그인 (선택)** — 한국 사용자 편의용. 빼고 **Google 로그인만** 써도 됩니다.
   "전부 Google" 원칙대로라면 **카카오 로그인 제거 + Google 로그인 단일화**가 깔끔합니다.

→ 결론: **인프라(저장·DB·실행·큐·알림·빌드·호스팅·AI)는 100% Google.**
   결제만 Toss(대체 불가), 로그인은 Google 단일화 가능.

## 적용 체크리스트
- [x] 정밀분석 워커: GCS + Firestore + Cloud Run (비구글 Telegram 제거 완료)
- [ ] SoccerMom 웹: 알림을 FCM으로, 큐를 Cloud Tasks로 연결 (SoccerMom 코드 필요)
- [ ] 로그인: 카카오 제거 → Google 단일화 여부 결정
- [ ] 영상 저장: Drive 대신 GCS로 통일 (서버 처리에 적합, 같은 GCP 프로젝트)
