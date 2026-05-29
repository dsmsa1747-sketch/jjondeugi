// Google Cloud Storage — 영상 업로드 + 결과 읽기
// 모든 함수는 요청 핸들러 안에서만 호출 (빌드타임 실행 금지)

import { getCredentials, getProjectId } from "@/lib/googleAuth";

function getStorage() {
  // 동적 require로 빌드타임 임포트 방지
  const { Storage } = require("@google-cloud/storage");
  return new Storage({
    projectId: getProjectId(),
    credentials: getCredentials(),
  });
}

function getBucket() {
  const bucket = process.env.GCS_BUCKET;
  if (!bucket) throw new Error("GCS_BUCKET 환경변수가 필요합니다.");
  return getStorage().bucket(bucket);
}

// 업로드: 입력 영상 파일(Buffer) → GCS, gs:// URI 반환
export async function uploadVideoBuffer(buffer, destPath, contentType = "video/mp4") {
  const bucket = getBucket();
  const file = bucket.file(destPath);
  await file.save(buffer, { contentType, resumable: false });
  return `gs://${process.env.GCS_BUCKET}/${destPath}`;
}

// 브라우저 직접 업로드용 서명 URL (대용량 영상은 이 방식 권장 — 서버 메모리 안 씀)
export async function createUploadSignedUrl(destPath, contentType = "video/mp4") {
  const bucket = getBucket();
  const [url] = await bucket
    .file(destPath)
    .getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    });
  return { uploadUrl: url, gsUri: `gs://${process.env.GCS_BUCKET}/${destPath}` };
}

// 결과(영상/JSON) 다운로드용 읽기 서명 URL (브라우저에서 바로 재생/표시)
export async function createReadSignedUrl(gsUri) {
  const BUCKET = process.env.GCS_BUCKET;
  const path = gsUri.replace(`gs://${BUCKET}/`, "");
  const [url] = await getBucket()
    .file(path)
    .getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });
  return url;
}

// 결과 JSON 내용 읽기
export async function readJson(gsUri) {
  const BUCKET = process.env.GCS_BUCKET;
  const path = gsUri.replace(`gs://${BUCKET}/`, "");
  const [buf] = await getBucket().file(path).download();
  return JSON.parse(buf.toString("utf-8"));
}
