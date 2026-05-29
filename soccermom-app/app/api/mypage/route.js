// 마이페이지 — 사용자 분석 기록 조회
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserJobs } from "@/lib/firestoreJobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions).catch(() => null);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY && !process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json({ error: "서비스가 설정되지 않았습니다." }, { status: 503 });
    }

    const jobs = await getUserJobs(session.user.email);
    return NextResponse.json({ jobs });
  } catch (e) {
    console.error("[mypage] error:", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
