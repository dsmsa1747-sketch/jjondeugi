// 광고 노출/신청 API — Firestore clubAds 컬렉션
//  GET  : 승인된 광고 중 랜덤 1개 반환 (피드/배너 노출용)
//  POST : 광고 신청 등록 (status=pending) — 운영자 승인 후 노출
import { NextResponse } from "next/server";
import { getUserEmail } from "@/lib/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getDb() {
  const { Firestore } = require("@google-cloud/firestore");
  const { getCredentials, getProjectId } = require("@/lib/googleAuth");
  return new Firestore({ projectId: getProjectId(), credentials: getCredentials() });
}
const COLLECTION = "clubAds";

function hasKey() {
  return !!(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY);
}

// 승인된 광고 랜덤 1개
export async function GET() {
  try {
    if (!hasKey()) return NextResponse.json({ ad: null });
    const snap = await getDb().collection(COLLECTION).where("status", "==", "approved").get();
    const ads = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (ads.length === 0) return NextResponse.json({ ad: null });
    const ad = ads[Math.floor(Math.random() * ads.length)];
    return NextResponse.json({ ad });
  } catch (e) {
    console.error("[ads GET]", e);
    return NextResponse.json({ ad: null });
  }
}

// 광고 신청 (status=pending)
export async function POST(req) {
  try {
    const email = await getUserEmail();
    if (!email) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    if (!hasKey()) return NextResponse.json({ error: "저장소가 설정되지 않았습니다." }, { status: 503 });

    const { clubName, region, ageGroup, position, clubIntro, contact, adType, period } = await req.json();
    if (!clubName || !contact) {
      return NextResponse.json({ error: "클럽명과 연락처는 필수입니다." }, { status: 400 });
    }
    const doc = await getDb().collection(COLLECTION).add({
      clubName, region: region || "", ageGroup: ageGroup || "", position: position || "",
      clubIntro: clubIntro || "", contact,
      adType: adType || "D", period: period || 7,
      status: "pending", // 운영자 승인 후 approved
      userEmail: email,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: doc.id, ok: true, message: "광고 신청이 접수되었습니다. 운영자 승인 후 노출됩니다." });
  } catch (e) {
    console.error("[ads POST]", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
