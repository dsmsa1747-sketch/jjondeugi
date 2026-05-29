// Firestore — 정밀분석 작업(job) 상태 관리
import { Firestore } from "@google-cloud/firestore";
import { getCredentials, getProjectId } from "@/lib/googleAuth";

let _db = null;
function db() {
  if (!_db) {
    _db = new Firestore({
      projectId: getProjectId(),
      credentials: getCredentials(),
    });
  }
  return _db;
}

const COLLECTION = process.env.FIRESTORE_COLLECTION || "analysisJobs";

// 작업 생성 (status=queued)
export async function createJob(jobId, data) {
  await db()
    .collection(COLLECTION)
    .doc(jobId)
    .set({
      status: "queued",
      createdAt: new Date().toISOString(),
      ...data,
    });
  return jobId;
}

// 작업 조회 (웹 결과화면 폴링용)
export async function getJob(jobId) {
  const snap = await db().collection(COLLECTION).doc(jobId).get();
  return snap.exists ? snap.data() : null;
}
