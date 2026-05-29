// Cloud Tasks — 정밀분석 워커(Cloud Run)로 작업 전달(큐)
// 큐가 재시도/타임아웃을 관리하므로 무거운 분석을 안전하게 비동기 처리합니다.
import { CloudTasksClient } from "@google-cloud/tasks";
import { getCredentials, getProjectId } from "@/lib/googleAuth";

let _client = null;
function client() {
  if (!_client) _client = new CloudTasksClient({ credentials: getCredentials() });
  return _client;
}

const LOCATION = process.env.CLOUD_TASKS_LOCATION || "us-central1";
const QUEUE = process.env.CLOUD_TASKS_QUEUE || "soccermom-analyze";
const WORKER_URL = process.env.WORKER_URL;            // Cloud Run 워커 URL
const INVOKER_SA = process.env.WORKER_INVOKER_SA;     // 워커 호출 권한 가진 서비스계정 이메일

// payload 예: { job_id, video, source_points?, target_point?, target_meta? }
export async function enqueueAnalyze(payload) {
  const project = getProjectId();
  const parent = client().queuePath(project, LOCATION, QUEUE);
  const task = {
    httpRequest: {
      httpMethod: "POST",
      url: `${WORKER_URL}/analyze`,
      headers: { "Content-Type": "application/json" },
      body: Buffer.from(JSON.stringify(payload)).toString("base64"),
      // 워커가 --no-allow-unauthenticated 이므로 OIDC 토큰으로 인증
      oidcToken: INVOKER_SA ? { serviceAccountEmail: INVOKER_SA, audience: WORKER_URL } : undefined,
    },
    dispatchDeadline: { seconds: 1800 }, // 최대 30분
  };
  const [resp] = await client().createTask({ parent, task });
  return resp.name;
}
