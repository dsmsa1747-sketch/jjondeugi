// 정밀분석 요청 API — 로그인 필수 + 결제 후에만 워커 실행
//  - 결제 전에는 작업만 'awaiting_payment'로 등록 (Cloud Tasks 큐에 넣지 않음)
//  - 결제 검증(pay/confirm) 통과 후 실제로 워커에 작업을 전달
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createJob } from "@/lib/firestoreJobs";
import { enqueueAnalyze } from "@/lib/cloudTasks";
import { getUserEmail, isAdmin } from "@/lib/access";
import { getPrice } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    // 1) 로그인 필수
    const email = await getUserEmail();
    if (!email) {
      return NextResponse.json(
        { error: "로그인이 필요합니다.", code: "LOGIN_REQUIRED" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      youtubeUrl,
      gsUri,
      sourcePoints,
      targetPoint,
      targetTime,
      targetMeta,
      analysisMode,
    } = body;

    const resolvedMode = analysisMode === "practice" ? "practice" : "match";
    const video = gsUri || youtubeUrl;
    if (!video) {
      return NextResponse.json(
        { error: "youtubeUrl 또는 gsUri 가 필요합니다." },
        { status: 400 }
      );
    }

    const amount = getPrice("precise").amount;
    const jobId = randomUUID();
    const admin = isAdmin(email);

    // 워커에 넘길 작업 파라미터 (결제 후 사용)
    const workerPayload = {
      job_id: jobId,
      video,
      source_points: sourcePoints || null,
      target_point: targetPoint || null,
      target_time: targetTime ?? null,
      target_meta: targetMeta || null,
      analysis_mode: resolvedMode,
    };

    // 2) 작업 등록 (결제 전: awaiting_payment, 파라미터 저장)
    await createJob(jobId, {
      mode: "precise",
      video,
      userEmail: email,
      targetMeta: targetMeta || null,
      analysisMode: resolvedMode,
      price: amount,
      status: admin ? "queued" : "awaiting_payment",
      workerPayload,
    });

    // 3) 관리자(무료)는 즉시 큐 등록, 일반은 결제 후 등록
    if (admin) {
      await enqueueAnalyze(workerPayload);
      return NextResponse.json({ jobId, status: "queued", free: true });
    }
    return NextResponse.json({
      jobId,
      status: "awaiting_payment",
      requiresPayment: true,
      amount,
    });
  } catch (e) {
    console.error("[analyze-precise] error:", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
