// 빠른 코칭분석 API — 로그인 필수 + 축구 영상 판별 + 결제 후 결과 공개
//  - Gemini가 '실제 영상'을 보고 축구 경기인지 먼저 판별 (아니면 거부, 과금 안 함)
//  - 분석 결과는 결제(검증) 후에만 공개 (결제 전 무료 분석 차단)
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { analyzeFast } from "@/lib/gemini";
import { createJob } from "@/lib/firestoreJobs";
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

    const { youtubeUrl, gsUri } = await req.json();
    const source = gsUri || youtubeUrl;
    if (!source) {
      return NextResponse.json({ error: "youtubeUrl 또는 gsUri 가 필요합니다." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "분석 서비스가 아직 설정되지 않았습니다. 관리자에게 문의하세요.", code: "GEMINI_NOT_CONFIGURED" },
        { status: 503 }
      );
    }

    // 2) 실제 영상 분석 + 축구 판별
    let analysis;
    try {
      analysis = await analyzeFast(source);
    } catch (e) {
      if (e.code === "YOUTUBE_UNREADABLE") {
        return NextResponse.json({ error: e.message, code: "YOUTUBE_UNREADABLE" }, { status: 422 });
      }
      throw e;
    }

    // 3) 축구 영상이 아니면 거부 (작업 생성/과금 없음)
    if (!analysis.is_soccer) {
      return NextResponse.json(
        {
          error: "축구 경기/훈련 영상으로 보이지 않습니다. 축구 영상으로 다시 시도해 주세요.",
          code: "NOT_SOCCER",
          reason: analysis.reason || null,
        },
        { status: 422 }
      );
    }

    const amount = getPrice("fast").amount;
    const jobId = randomUUID();
    const admin = isAdmin(email);

    // 4) 관리자(무료): 즉시 공개 / 일반: 결제 전까지 결과 숨김(pendingResult)
    await createJob(jobId, {
      mode: "fast",
      video: source,
      userEmail: email,
      price: amount,
      status: admin ? "done" : "awaiting_payment",
      result: admin ? analysis : null,
      pendingResult: admin ? null : analysis,
    });

    if (admin) {
      return NextResponse.json({ jobId, status: "done", result: analysis, free: true });
    }
    return NextResponse.json({
      jobId,
      status: "awaiting_payment",
      requiresPayment: true,
      amount,
    });
  } catch (e) {
    console.error("[analyze-fast] error:", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
