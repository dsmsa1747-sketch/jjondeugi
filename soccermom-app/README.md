# 사커맘 (SoccerMom)

유소년 축구 영상 AI 분석 서비스 — Next.js 14 App Router

## 로컬 실행

```bash
cp .env.example .env.local
# .env.local 에 실제 값 입력 후:
npm install
npm run dev
```

## 환경변수 설정 (.env.local)

`.env.example` 파일을 참조하세요. 주요 환경변수:

| 변수명 | 설명 |
|--------|------|
| `NEXTAUTH_SECRET` | NextAuth 서명 비밀키 (openssl rand -base64 32) |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth 클라이언트 |
| `KAKAO_CLIENT_ID/SECRET` | 카카오 OAuth |
| `NAVER_CLIENT_ID/SECRET` | 네이버 OAuth |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | GCP 서비스계정 JSON (base64 인코딩) |
| `GCP_PROJECT` | GCP 프로젝트 ID |
| `GCS_BUCKET` | GCS 버킷명 |
| `GEMINI_API_KEY` | Gemini AI API 키 |
| `TOSS_SECRET_KEY` | 토스페이먼츠 시크릿 키 |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | 토스페이먼츠 클라이언트 키 |
| `WORKER_URL` | Cloud Run 워커 URL |
| `WORKER_INVOKER_SA` | Cloud Tasks 워커 호출 서비스계정 |

## Cloud Run 배포

```bash
# Dockerfile 없이 Cloud Run에 배포 (소스 빌드)
gcloud run deploy soccermom-app \
  --source . \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --set-env-vars="NEXTAUTH_URL=https://YOUR_DOMAIN,..."
```

또는 `Dockerfile`을 추가 후:

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT/soccermom-app
gcloud run deploy soccermom-app --image gcr.io/YOUR_PROJECT/soccermom-app ...
```

## Firebase Hosting (정적 출력 모드)

`next.config.mjs` 에 `output: 'export'` 추가 후:

```bash
npm run build
firebase deploy --only hosting
```

단, API Routes는 Cloud Run에 별도 배포 필요.

## PWA 설치형 앱

사커맘은 PWA(Progressive Web App)로 앱스토어 없이 설치 가능합니다.

**iOS (Safari):**
1. Safari에서 사이트 접속
2. 공유 버튼 → "홈 화면에 추가"
3. 앱 아이콘으로 실행 가능

**Android (Chrome):**
1. Chrome에서 사이트 접속
2. 주소창 오른쪽 "앱 설치" 버튼 또는 메뉴 → "앱 설치"

**아이콘 교체:** `public/icons/icon-192.png`, `public/icons/icon-512.png` 교체

## 분석 모드

| | 빠른 코칭분석 | 정밀 YOLO 분석 |
|---|---|---|
| 엔진 | Gemini AI | Cloud Run + GPU (YOLO) |
| 가격 | 2,000원/건 | 5,000원~/건 |
| 소요시간 | 40초~1분 | 수 분 |
| 입력 | 유튜브 링크 | 유튜브 링크 / mp4 업로드 |

> **정직 안내:** 정밀분석 거리·속도는 경기장 보정점 없이는 상대 추정값(px 기준)으로만 제공됩니다.

## 프로젝트 구조

```
soccermom-app/
├── app/
│   ├── layout.js              # 루트 레이아웃 (PWA 메타, Nav, Footer)
│   ├── page.js                # 랜딩 페이지
│   ├── analyze/page.js        # 분석 시작 (모드 선택, 영상 입력)
│   ├── pay/page.js            # 결제 (토스페이먼츠 위젯)
│   ├── result/[jobId]/page.js # 분석 결과 (폴링)
│   ├── pricing/page.js        # 가격 안내
│   ├── mypage/page.js         # 내 분석 기록
│   ├── privacy/page.js        # 개인정보처리방침
│   ├── terms/page.js          # 이용약관
│   └── api/
│       ├── auth/[...nextauth]/ # NextAuth (Google/카카오/네이버)
│       ├── analyze-fast/       # Gemini 빠른 분석
│       ├── analyze-precise/    # YOLO 정밀 분석 (Cloud Tasks)
│       │   └── status/[jobId]/ # 분석 상태 폴링
│       ├── pay/confirm/        # 토스 결제 서버 검증
│       ├── upload-url/         # GCS 서명 URL 발급
│       └── mypage/             # 분석 기록 조회
├── components/
│   ├── Nav.jsx                # 네비게이션
│   ├── SessionProvider.jsx    # NextAuth 세션
│   ├── SwRegister.jsx         # 서비스 워커 등록
│   ├── PrecisionResult.jsx    # 정밀분석 결과 (폴링)
│   ├── PlayerSelector.jsx     # 클릭 선수 지정
│   └── TeamComparison.jsx     # 팀 비교
├── lib/
│   ├── auth.js                # NextAuth 옵션
│   ├── gemini.js              # Gemini API (lazy)
│   ├── gcs.js                 # Google Cloud Storage (lazy)
│   ├── firestoreJobs.js       # Firestore 작업 관리 (lazy)
│   ├── cloudTasks.js          # Cloud Tasks 큐 (lazy)
│   ├── toss.js                # 토스 결제 검증 (lazy)
│   └── pricing.js             # 가격 상수
└── public/
    ├── manifest.json          # PWA 매니페스트
    ├── sw.js                  # 서비스 워커
    └── icons/                 # PWA 아이콘
```
