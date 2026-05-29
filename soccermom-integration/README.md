# SoccerMom 웹 ↔ 정밀분석 연결 (드롭인)

기존 SoccerMom(Next.js)에 **정밀분석(YOLO)** 을 붙이는 파일들입니다.
정책대로 전부 Google(GCS·Firestore·Cloud Tasks·FCM)로 연결합니다.
로그인·결제는 한국 서비스(카카오/네이버/토스) 그대로 둡니다.

> ⚠️ 이 파일들은 형님 SoccerMom 구조(App Router, `@/*`, `lib/`)에 맞춘 **템플릿**입니다.
> 실제 코드에 넣은 뒤 한 번 동작 확인이 필요합니다(특히 `@/lib/auth` 의 `authOptions` 이름).

## 1) 파일을 SoccerMom 프로젝트에 복사
```
soccermom-integration/lib/googleAuth.js        →  soccermom/lib/googleAuth.js
soccermom-integration/lib/gcs.js               →  soccermom/lib/gcs.js
soccermom-integration/lib/firestoreJobs.js     →  soccermom/lib/firestoreJobs.js
soccermom-integration/lib/cloudTasks.js        →  soccermom/lib/cloudTasks.js
soccermom-integration/app/api/analyze-precise/route.js
                                               →  soccermom/app/api/analyze-precise/route.js
soccermom-integration/app/api/analyze-precise/status/[jobId]/route.js
                                               →  soccermom/app/api/analyze-precise/status/[jobId]/route.js
soccermom-integration/components/PrecisionResult.jsx
                                               →  soccermom/components/PrecisionResult.jsx
```

## 2) npm 패키지 설치
```bash
npm install @google-cloud/storage @google-cloud/firestore @google-cloud/tasks
```

## 3) .env.local 에 추가
```bash
# 공용 서비스계정(base64). 기존 Drive 키 재사용 가능(폴백 처리됨).
GOOGLE_SERVICE_ACCOUNT_KEY=base64-encoded-service-account-json
GCP_PROJECT=your-gcp-project-id

# 저장/DB
GCS_BUCKET=your-project-soccermom
FIRESTORE_COLLECTION=analysisJobs

# Cloud Tasks → Cloud Run 워커
WORKER_URL=https://soccermom-yolo-worker-xxxx.run.app   # 워커 배포 후 URL
CLOUD_TASKS_LOCATION=us-central1
CLOUD_TASKS_QUEUE=soccermom-analyze
WORKER_INVOKER_SA=tasks-invoker@your-project.iam.gserviceaccount.com
```

## 4) GCP 1회 설정
```bash
# Cloud Tasks 큐 생성
gcloud tasks queues create soccermom-analyze --location=us-central1

# 워커 호출용 서비스계정 + 권한 (워커가 비공개라 OIDC 인증 호출)
gcloud iam service-accounts create tasks-invoker
gcloud run services add-iam-policy-binding soccermom-yolo-worker \
  --member="serviceAccount:tasks-invoker@your-project.iam.gserviceaccount.com" \
  --role="roles/run.invoker" --region=us-central1

# 서비스계정에 GCS/Firestore 권한
gcloud projects add-iam-policy-binding your-project \
  --member="serviceAccount:tasks-invoker@your-project.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"
gcloud projects add-iam-policy-binding your-project \
  --member="serviceAccount:tasks-invoker@your-project.iam.gserviceaccount.com" \
  --role="roles/datastore.user"
```

## 5) 사용 흐름
1. 사용자가 영상(유튜브 링크 또는 업로드)으로 정밀분석 요청
2. `POST /api/analyze-precise` → `{ jobId }` 반환
3. 결과 페이지에서 `<PrecisionResult jobId={jobId} />` 렌더 → 자동 폴링
4. 완료되면 추적영상 + 선수별 거리/속도 + 볼점유율 표시
5. (워커가) 회장님께 텔레그램 자동보고

### 호출 예시 (요청)
```js
const res = await fetch("/api/analyze-precise", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    youtubeUrl: "https://www.youtube.com/watch?v=...",
    // 클릭 선수지정(선택):
    targetPoint: [640, 380],
    targetMeta: { name: "홍길동", number: "28", jersey: "파랑" },
  }),
});
const { jobId } = await res.json();
```

## 참고
- 대용량 파일 업로드는 `lib/gcs.js` 의 `createUploadSignedUrl` 로 브라우저→GCS 직접 업로드 권장.
- 학부모 완료 푸시(FCM)는 결과 페이지 폴링으로 대체 가능. FCM은 별도 연결(추후).
- 결제(토스)·로그인(카카오/네이버)은 기존 그대로 — 이 연결과 무관.
