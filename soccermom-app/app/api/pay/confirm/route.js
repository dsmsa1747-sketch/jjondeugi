// 토스페이먼츠 결제 승인 서버 검증 + 검증 통과 후에만 분석 실행
//  - 로그인 사용자 == 작업 소유자 확인
//  - 결제 금액 == 서버에 저장된 정가 확인 (금액 위변조 차단)
//  - 중복 처리 방지 (awaiting_payment 상태일 때만)
//  - fast: 보관해둔 결과 공개 / precise: 이제서야 워커에 작업 전달
import { NextResponse } from "next/server";
import { confirmTossPayment } from "@/lib/toss";
import { getJob, updateJob, recordPayment } from "@/lib/firestoreJobs";
import { enqueueAnalyze } from "@/lib/cloudTasks";
import { getUserEmail } from "@/lib/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const email = await getUserEmail();
    if (!email) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { paymentKey, orderId, amount } = await req.json();
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: "paymentKey, orderId, amount 가 모두 필요합니다." },
        { status: 400 }
      );
    }
    if (!process.env.TOSS_SECRET_KEY) {
      return NextResponse.json(
        { error: "결제 서비스가 아직 설정되지 않았습니다." },
        { status: 503 }
      );
    }

    // orderId 형식: soccermom-{jobId}-{timestamp}
    const m = orderId.match(/^soccermom-([0-9a-f-]+)-\d+$/);
    const jobId = m ? m[1] : null;
    if (!jobId) {
      return NextResponse.json({ error: "주문번호 형식이 올바르지 않습니다." }, { status: 400 });
    }

    // 작업 검증
    const job = await getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: "작업을 찾을 수 없습니다." }, { status: 404 });
    }
    if (job.userEmail && job.userEmail !== email) {
      return NextResponse.json({ error: "본인 작업만 결제할 수 있습니다." }, { status: 403 });
    }
    if (job.status !== "awaiting_payment") {
      // 이미 처리됨(중복/재전송) — 안전하게 현재 상태만 반환
      return NextResponse.json({ success: true, jobId, mode: job.mode, already: true });
    }

    // 토스 승인 (실제 결제 검증)
    const tossData = await confirmTossPayment(paymentKey, orderId, Number(amount));

    // 금액 위변조 차단: 실제 결제금액 == 서버 정가
    const expected = Number(job.price);
    if (Number(tossData.totalAmount) !== expected) {
      await updateJob(jobId, { status: "payment_mismatch" });
      return NextResponse.json(
        { error: `결제 금액이 정가와 다릅니다. (결제 ${tossData.totalAmount} / 정가 ${expected})` },
        { status: 400 }
      );
    }

    await recordPayment(jobId, {
      paymentKey: tossData.paymentKey,
      orderId: tossData.orderId,
      amount: tossData.totalAmount,
      method: tossData.method,
      status: tossData.status,
    });

    // 결제 검증 통과 → 이제서야 분석 실행/공개
    if (job.mode === "fast") {
      await updateJob(jobId, {
        status: "done",
        result: job.pendingResult || null,
        pendingResult: null,
      });
    } else {
      // precise: 보관해둔 파라미터로 워커에 작업 전달
      if (job.workerPayload) {
        await enqueueAnalyze(job.workerPayload);
      }
      await updateJob(jobId, { status: "queued" });
    }

    return NextResponse.json({
      success: true,
      jobId,
      mode: job.mode,
      payment: {
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
