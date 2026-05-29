// 토스페이먼츠 결제 승인 서버 검증
import { NextResponse } from "next/server";
import { confirmTossPayment } from "@/lib/toss";
import { recordPayment } from "@/lib/firestoreJobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { paymentKey, orderId, amount } = await req.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: "paymentKey, orderId, amount 가 모두 필요합니다." },
        { status: 400 }
      );
    }

    if (!process.env.TOSS_SECRET_KEY) {
      return NextResponse.json(
        { error: "결제 서비스가 아직 설정되지 않았습니다. 관리자에게 문의하세요." },
        { status: 503 }
      );
    }

    // 토스 결제 승인
    const tossData = await confirmTossPayment(paymentKey, orderId, amount);

    // orderId 에서 jobId 추출 (orderId 형식: "soccermom-{jobId}-{timestamp}")
    const jobIdMatch = orderId.match(/^soccermom-([a-f0-9-]+)-\d+$/);
    const jobId = jobIdMatch ? jobIdMatch[1] : null;

    // Firestore에 결제 기록
    if (jobId) {
      await recordPayment(jobId, {
        paymentKey: tossData.paymentKey,
        orderId: tossData.orderId,
        amount: tossData.totalAmount,
        method: tossData.method,
        status: tossData.status,
      }).catch((e) => {
        console.warn("[pay/confirm] Firestore 기록 실패 (무시):", e.message);
      });
    }

    return NextResponse.json({
      success: true,
      jobId,
      payment: {
        paymentKey: tossData.paymentKey,
        orderId: tossData.orderId,
        amount: tossData.totalAmount,
        method: tossData.method,
        approvedAt: tossData.approvedAt,
      },
    });
  } catch (e) {
    console.error("[pay/confirm] error:", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
