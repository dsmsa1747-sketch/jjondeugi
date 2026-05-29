// 공용 Google 서비스 계정 자격증명 (GCS / Firestore / Cloud Tasks 공통)
// base64로 인코딩된 서비스계정 JSON 키를 환경변수에서 디코딩해 사용합니다.
// 반드시 요청 핸들러 안에서만 호출 — 빌드타임에는 실행되지 않아야 합니다.

function loadServiceAccount() {
  const b64 =
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY ||
    process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY ||
    "";
  if (!b64) {
    throw new Error(
      "서비스계정 키가 없습니다. .env.local 에 GOOGLE_SERVICE_ACCOUNT_KEY(base64)를 설정하세요."
    );
  }
  const json = Buffer.from(b64, "base64").toString("utf-8");
  return JSON.parse(json);
}

// 캐시 (콜드스타트마다 재파싱 방지)
let _cached = null;
export function getCredentials() {
  if (!_cached) _cached = loadServiceAccount();
  return _cached;
}

export function getProjectId() {
  return process.env.GCP_PROJECT || getCredentials().project_id;
}
