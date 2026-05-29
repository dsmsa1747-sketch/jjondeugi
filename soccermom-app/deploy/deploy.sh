#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# SoccerMom 앱 → Google Cloud Run 배포 (명령 한 줄)
# 사전: gcloud CLI + `gcloud auth login` + 결제 등록된 프로젝트.
# 실행: Cloud Shell 또는 PC 터미널에서  bash deploy/deploy.sh
# ──────────────────────────────────────────────────────────────
set -euo pipefail

# ── 자동 인식 (편집 불필요) ──────────────────────────────────
PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${REGION:-asia-northeast3}"          # 서울 리전 (앱은 한국 가까운 곳)
SERVICE="soccermom-app"
# 워커 URL 자동 조회(이미 배포돼 있으면). 없으면 빈 값으로 두고 나중에 콘솔에서 추가.
WORKER_URL="${WORKER_URL:-$(gcloud run services describe soccermom-yolo-worker --region us-central1 --format='value(status.url)' 2>/dev/null)}"
# ─────────────────────────────────────────────────────────────

if [ -z "$PROJECT_ID" ]; then
  echo "❌ 프로젝트가 설정 안 됨. 먼저:  gcloud config set project soccermom-bcbfd" >&2
  exit 1
fi
echo "▶ 사용 프로젝트: $PROJECT_ID / 리전: $REGION / 워커URL: ${WORKER_URL:-(없음)}"

gcloud config set project "$PROJECT_ID"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/cloud-run-source-deploy/${SERVICE}"
echo "▶ 빌드 + 푸시 (Cloud Build)..."
gcloud builds submit --tag "$IMAGE" .

echo "▶ Cloud Run 배포..."
# 환경변수는 보안상 Secret Manager 사용 권장. 여기서는 간단히 --set-env-vars 예시.
# 실제 키들은 아래 자리표시자를 본인 값으로 교체하거나 Secret Manager 연동하세요.
gcloud run deploy "$SERVICE" \
  --image "$IMAGE" \
  --region "$REGION" \
  --allow-unauthenticated \
  --memory 512Mi --cpu 1 \
  --min-instances 0 --max-instances 5 \
  --set-env-vars "WORKER_URL=${WORKER_URL},GCP_PROJECT=${PROJECT_ID}"

echo "✅ 배포 완료. 앱 URL:"
gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)'

cat <<'EOF'

⚠️ 실제 동작에 필요한 나머지 환경변수(로그인/결제/저장 등)는
   Cloud Run 콘솔의 '변수 및 보안 비밀' 또는 Secret Manager로 추가하세요.
   목록은 .env.example 참고. (NEXTAUTH_SECRET, GOOGLE/카카오/네이버 OAuth,
   GOOGLE_SERVICE_ACCOUNT_KEY, GCS_BUCKET, GEMINI_API_KEY, TOSS 키 등)
EOF
