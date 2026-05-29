// GCS 서명 URL 발급 — 브라우저가 영상을 GCS에 직접 업로드
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createUploadSignedUrl } from "@/lib/gcs";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);

    const { filename, contentType } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: "filename 이 필요합니다." }, { status: 400 });
    }

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY && !process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json(
        { error: "GCS 서비스가 설정되지 않았습니다." },
        { status: 503 }
      );
    }

    // 경로: uploads/{userEmail or anonymous}/{uuid}/{filename}
    const userPrefix = session?.user?.email
      ? session.user.email.replace(/[@.]/g, "_")
      : "anonymous";
    const destPath = `uploads/${userPrefix}/${randomUUID()}/${filename}`;

    const { uploadUrl, gsUri } = await createUploadSignedUrl(
      destPath,
      contentType || "video/mp4"
    );

    return NextResponse.json({ uploadUrl, gsUri, destPath });
  } catch (e) {
    console.error("[upload-url] error:", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
