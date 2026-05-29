// 정밀분석 상태 조회 API — 결과화면이 폴링해서 진행률/완료를 확인
import { NextResponse } from "next/server";
import { getJob } from "@/lib/firestoreJobs";
import { createReadSignedUrl, readJson } from "@/lib/gcs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  try {
    const { jobId } = params;
    const job = await getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: "작업을 찾을 수 없습니다." }, { status: 404 });
    }

    const out = {
      jobId,
      status: job.status, // queued | processing | done | failed
      progress: job.progress ?? null,
      summary: job.summary ?? null,
      error: job.error ?? null,
    };

    // 완료면 결과 영상(서명URL) + 상세 JSON 동봉
    if (job.status === "done") {
      if (job.resultVideoUri) {
        out.videoUrl = await createReadSignedUrl(job.resultVideoUri).catch(() => null);
      }
      if (job.resultJsonUri) {
        out.result = await readJson(job.resultJsonUri).catch(() => null);
      }
    }

    return NextResponse.json(out);
  } catch (e) {
    console.error("[analyze-precise/status] error:", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
