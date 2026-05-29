// 정밀분석 요청 API — 작업 생성 + Cloud Tasks 큐 등록
// (무거운 YOLO 분석은 Cloud Run 워커가 비동기로 처리)
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createJob } from "@/lib/firestoreJobs";
import { enqueueAnalyze } from "@/lib/cloudTasks";

export const runtime = "nodejs"; // Google 클라이언트 라이브러리는 Node 런타임 필요

export async function POST(req) {
  try {
    // 로그인 사용자 확인(결제/소유자 매핑용). 비로그인 허용하려면 이 블록 제거.
    const session = await getServerSession(authOptions).catch(() => null);

    const body = await req.json();
    const {
      youtubeUrl, // 유튜브 링크 또는
      gsUri, // 이미 업로드된 gs:// 경로
      sourcePoints, // (선택) 원근변환 보정 4점 [[x,y]*4]
      targetPoint, // (선택) 클릭 선수지정 화면좌표 [x,y]
      targetMeta, // (선택) { name, number, jersey }
    } = body;

    const video = gsUri || youtubeUrl;
    if (!video) {
      return NextResponse.json(
        { error: "youtubeUrl 또는 gsUri 가 필요합니다." },
        { status: 400 }
      );
    }

    const jobId = randomUUID();

    // 1) Firestore에 작업 등록 (status=queued)
    await createJob(jobId, {
      mode: "precise",
      video,
      userEmail: session?.user?.email || null,
      targetMeta: targetMeta || null,
    });

    // 2) Cloud Tasks로 워커에 분석 작업 전달
    await enqueueAnalyze({
      job_id: jobId,
      video,
      source_points: sourcePoints || null,
      target_point: targetPoint || null,
      target_meta: targetMeta || null,
    });

    return NextResponse.json({ jobId, status: "queued" });
  } catch (e) {
    console.error("[analyze-precise] error:", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
