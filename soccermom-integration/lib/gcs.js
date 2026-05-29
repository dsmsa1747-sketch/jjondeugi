// Google Cloud Storage — 영상 업로드 + 결과 읽기
import { Storage } from "@google-cloud/storage";
import { getCredentials, getProjectId } from "@/lib/googleAuth";

let _storage = null;
function storage() {
  if (!_storage) {
    _storage = new Storage({
      projectId: getProjectId(),
      credentials: getCredentials(),
    });
  }
  return _storage;
}

const BUCKET = process.env.GCS_BUCKET; // 예: my-project-soccermom

// 업로드: 입력 영상 파일(Buffer) → GCS, gs:// URI 반환
export async function uploadVideoBuffer(buffer, destPath, contentType = "video/mp4") {
  const file = storage().bucket(BUCKET).file(destPath);
  await file.save(buffer, { contentType, resumable: false });
  return `gs://${BUCKET}/${destPath}`;
}

// 브라우저 직접 업로드용 서명 URL (대용량 영상은 이 방식 권장 — 서버 메모리 안 씀)
export async function createUploadSignedUrl(destPath, contentType = "video/mp4") {
  const [url] = await storage()
    .bucket(BUCKET)
    .file(destPath)
    .getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    });
  return { uploadUrl: url, gsUri: `gs://${BUCKET}/${destPath}` };
}

// 결과(영상/JSON) 다운로드용 읽기 서명 URL (브라우저에서 바로 재생/표시)
export async function createReadSignedUrl(gsUri) {
  const path = gsUri.replace(`gs://${BUCKET}/`, "");
  const [url] = await storage()
    .bucket(BUCKET)
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
  const path = gsUri.replace(`gs://${BUCKET}/`, "");
  const [buf] = await storage().bucket(BUCKET).file(path).download();
  return JSON.parse(buf.toString("utf-8"));
}
