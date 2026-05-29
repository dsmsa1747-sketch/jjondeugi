// 빠른 코칭분석 API — Gemini로 유튜브 영상 분석
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { analyzeFast } from "@/lib/gemini";
import { createJob } from "@/lib/firestoreJobs";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);

    const body = await req.json();
    const { youtubeUrl } = body;

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: "youtubeUrl 이 필요합니다." },
        { status: 400 }
      );
    }

    // GEMINI_API_KEY 없으면 503 반환 (가짜 데이터 금지)
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY가 설정되지 않았습니다. 서비스를 이용하려면 관리자에게 문의하세요.",
          code: "GEMINI_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    const jobId = randomUUID();

    // Firestore에 작업 기록 (userEmail 매핑)
    await createJob(jobId, {
      mode: "fast",
      video: youtubeUrl,
      userEmail: session?.user?.email || null,
      status: "processing",
    }).catch((e) => {
      // Firestore 없어도 분석은 진행 (로깅만)
      console.warn("[analyze-fast] Firestore 기록 실패 (무시):", e.message);
    });

    // Gemini 분석 실행
    const result = await analyzeFast(youtubeUrl);

    // 완료 상태로 업데이트
    await createJob(jobId, {
      mode: "fast",
      video: youtubeUrl,
      userEmail: session?.user?.email || null,
      status: "done",
      result,
    }).catch(() => {});

    return NextResponse.json({ jobId, status: "done", result });
  } catch (e) {
    console.error("[analyze-fast] error:", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
