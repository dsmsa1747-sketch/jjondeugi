// 고객지원 문의 접수 — Firestore 'supportTickets' 컬렉션 저장
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getDb() {
  const { Firestore } = require("@google-cloud/firestore");
  const { getCredentials, getProjectId } = require("@/lib/googleAuth");
  return new Firestore({ projectId: getProjectId(), credentials: getCredentials() });
}

const COLLECTION = "supportTickets";

export async function POST(req) {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY && !process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json(
        { error: "저장소가 아직 설정되지 않았습니다. 잠시 후 다시 시도해 주세요." },
        { status: 503 }
      );
    }

    const { email, subject, message } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "이메일, 제목, 내용을 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    const doc = await getDb().collection(COLLECTION).add({
      email,
      subject,
      message,
      status: "접수",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: doc.id, ok: true });
  } catch (e) {
    console.error("[support POST]", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
