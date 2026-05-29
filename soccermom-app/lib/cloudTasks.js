// Cloud Tasks — 정밀분석 워커(Cloud Run)로 작업 전달(큐)
// 큐가 재시도/타임아웃을 관리하므로 무거운 분석을 안전하게 비동기 처리합니다.
// 모든 함수는 요청 핸들러 안에서만 호출 (빌드타임 실행 금지)

import { getCredentials, getProjectId } from "@/lib/googleAuth";

function getClient() {
  const { CloudTasksClient } = require("@google-cloud/tasks");
  return new CloudTasksClient({ credentials: getCredentials() });
}

const LOCATION = process.env.CLOUD_TASKS_LOCATION || "asia-northeast3";
const QUEUE = process.env.CLOUD_TASKS_QUEUE || "soccermom-analyze";
const WORKER_URL = process.env.WORKER_URL; // Cloud Run 워커 URL
const INVOKER_SA = process.env.WORKER_INVOKER_SA; // 워커 호출 권한 가진 서비스계정 이메일

// payload 예: { job_id, video, source_points?, target_point?, target_meta? }
export async function enqueueAnalyze(payload) {
  const client = getClient();
  const project = getProjectId();
  const parent = client.queuePath(project, LOCATION, QUEUE);
  const task = {
    httpRequest: {
      httpMethod: "POST",
      url: `${WORKER_URL}/analyze`,
      headers: { "Content-Type": "application/json" },
      body: Buffer.from(JSON.stringify(payload)).toString("base64"),
      // 워커가 --no-allow-unauthenticated 이므로 OIDC 토큰으로 인증
      oidcToken: INVOKER_SA
        ? { serviceAccountEmail: INVOKER_SA, audience: WORKER_URL }
        : undefined,
    },
    dispatchDeadline: { seconds: 1800 }, // 최대 30분
  };
  const [resp] = await client.createTask({ parent, task });
  return resp.name;
}
