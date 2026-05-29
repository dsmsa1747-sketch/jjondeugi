// Firestore — 정밀분석 작업(job) 상태 관리
// 모든 함수는 요청 핸들러 안에서만 호출 (빌드타임 실행 금지)

import { getCredentials, getProjectId } from "@/lib/googleAuth";

function getDb() {
  const { Firestore } = require("@google-cloud/firestore");
  return new Firestore({
    projectId: getProjectId(),
    credentials: getCredentials(),
  });
}

const COLLECTION = process.env.FIRESTORE_COLLECTION || "analysisJobs";

// 작업 생성 (status=queued)
export async function createJob(jobId, data) {
  await getDb()
    .collection(COLLECTION)
    .doc(jobId)
    .set({
      status: "queued",
      createdAt: new Date().toISOString(),
      ...data,
    });
  return jobId;
}

// 작업 부분 갱신 (병합) — 상태/결과 업데이트용
export async function updateJob(jobId, data) {
  await getDb()
    .collection(COLLECTION)
    .doc(jobId)
    .set({ ...data, updatedAt: new Date().toISOString() }, { merge: true });
  return jobId;
}

// 작업 조회 (웹 결과화면 폴링용)
export async function getJob(jobId) {
  const snap = await getDb().collection(COLLECTION).doc(jobId).get();
  return snap.exists ? snap.data() : null;
}

// 사용자 이메일로 최근 작업 목록 조회 (마이페이지용)
export async function getUserJobs(userEmail, limit = 20) {
  const snap = await getDb()
    .collection(COLLECTION)
    .where("userEmail", "==", userEmail)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// 결제 기록 저장
export async function recordPayment(jobId, paymentData) {
  await getDb()
    .collection(COLLECTION)
    .doc(jobId)
    .set(
      {
        payment: {
          ...paymentData,
          paidAt: new Date().toISOString(),
        },
      },
      { merge: true }
    );
}
