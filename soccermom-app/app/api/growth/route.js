// 성장 기록장 — 키·체중·메모를 Firestore에 저장/조회 (사용자별)
import { NextResponse } from "next/server";
import { getUserEmail } from "@/lib/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getDb() {
  const { Firestore } = require("@google-cloud/firestore");
  const { getCredentials, getProjectId } = require("@/lib/googleAuth");
  return new Firestore({ projectId: getProjectId(), credentials: getCredentials() });
}
const COLLECTION = "growthRecords";

// 기록 목록 조회
export async function GET() {
  try {
    const email = await getUserEmail();
    if (!email) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY && !process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json({ records: [], note: "저장소 미설정" });
    }
    const snap = await getDb()
      .collection(COLLECTION)
      .where("userEmail", "==", email)
      .get();
    const records = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    return NextResponse.json({ records });
  } catch (e) {
    console.error("[growth GET]", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

// 기록 추가
export async function POST(req) {
  try {
    const email = await getUserEmail();
    if (!email) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY && !process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json({ error: "저장소가 아직 설정되지 않았습니다." }, { status: 503 });
    }
    const { date, height, weight, memo, player } = await req.json();
    if (!date) return NextResponse.json({ error: "날짜를 입력해 주세요." }, { status: 400 });

    const doc = await getDb().collection(COLLECTION).add({
      userEmail: email,
      player: player || "우리 아이",
      date,
      height: height ? Number(height) : null,
      weight: weight ? Number(weight) : null,
      memo: memo || "",
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: doc.id, ok: true });
  } catch (e) {
    console.error("[growth POST]", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
