#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# SoccerMom 정밀분석 워커 → Google Cloud Run(GPU) 배포 스크립트
# 형님 PC(또는 Cloud Shell)에서 한 번만 채워서 실행하세요.
# 사전: gcloud CLI 설치 + `gcloud auth login` + 결제 등록된 프로젝트.
# ──────────────────────────────────────────────────────────────
set -euo pipefail

# ── 자동 인식 (편집 불필요) ──────────────────────────────────
# PROJECT_ID 는 현재 gcloud 설정 프로젝트를 자동 사용.
# 바꾸려면:  PROJECT_ID=다른ID bash deploy/deploy.sh
PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${REGION:-us-central1}"          # Cloud Run GPU 지원 리전 (L4)
SERVICE="soccermom-yolo-worker"
BUCKET="${BUCKET:-${PROJECT_ID}-soccermom}"  # 영상/결과 저장 버킷 (없으면 자동 생성)
# 학습된 모델 위치. 기본은 빈 값 → yolov8 폴백으로 '동작 확인'부터 가능.
# best.pt 학습/업로드 후:  MODEL_GS="gs://${BUCKET}/models/best.pt" 로 지정해 재배포.
MODEL_GS="${MODEL_GS:-}"
# 회장님 자동보고(텔레그램). 안 쓰면 NOTIFY_PROVIDER=none.
NOTIFY_PROVIDER="${NOTIFY_PROVIDER:-none}"
TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-}"

if [ -z "$PROJECT_ID" ]; then
  echo "❌ 프로젝트가 설정 안 됨. 먼저:  gcloud config set project soccermom-bcbfd" >&2
  exit 1
fi
echo "▶ 사용 프로젝트: $PROJECT_ID / 리전: $REGION / 버킷: $BUCKET"
# ─────────────────────────────────────────────────────────────

gcloud config set project "$PROJECT_ID"

echo "▶ 필요한 API 활성화..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com \
  cloudbuild.googleapis.com firestore.googleapis.com storage.googleapis.com \
  cloudtasks.googleapis.com

echo "▶ 저장 버킷 생성(이미 있으면 무시)..."
gcloud storage buckets create "gs://${BUCKET}" --location="$REGION" 2>/dev/null || true

echo "▶ 이미지 빌드 + 푸시 (Cloud Build)..."
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/cloud-run-source-deploy/${SERVICE}"
gcloud builds submit --tag "$IMAGE" .

echo "▶ Cloud Run(GPU) 배포..."
# --gpu 1 --gpu-type nvidia-l4 : Cloud Run GPU. --no-cpu-throttling 필수(GPU 사용 시).
# --min-instances 0 : 평소 0대(요청 없을 때 비용 0). --concurrency 1 : 영상 1건씩.
gcloud run deploy "$SERVICE" \
  --image "$IMAGE" \
  --region "$REGION" \
  --gpu 1 --gpu-type nvidia-l4 \
  --cpu 4 --memory 16Gi \
  --no-cpu-throttling \
  --min-instances 0 --max-instances 3 \
  --concurrency 1 \
  --timeout 1800 \
  --set-env-vars "GCP_PROJECT=${PROJECT_ID},GCS_BUCKET=${BUCKET},MODEL_PATH=${MODEL_GS},FIRESTORE_COLLECTION=analysisJobs,NOTIFY_PROVIDER=${NOTIFY_PROVIDER},TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN},TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}" \
  --no-allow-unauthenticated

echo "✅ 배포 완료. 서비스 URL:"
gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)'

cat <<'EOF'

다음 단계:
  1) Firestore를 Native 모드로 활성화 (한 번만):
       gcloud firestore databases create --location=nam5
  2) 학습된 모델 best.pt 를 버킷에 올리기:
       gcloud storage cp best.pt gs://BUCKET/models/best.pt
     (없으면 MODEL_PATH 를 빈 값으로 두면 yolov8 폴백 — 사람만 감지, 테스트용)
  3) SoccerMom 웹에서 분석요청 시:
       - Firestore analysisJobs/{job_id} 문서 생성 (status=queued)
       - Cloud Tasks 로 위 서비스 URL + /analyze 에 POST
         body: {"job_id":"...","video":"gs://.../input.mp4"}
       - 결과는 analysisJobs/{job_id}.status=done + resultVideoUri/resultJsonUri
EOF
