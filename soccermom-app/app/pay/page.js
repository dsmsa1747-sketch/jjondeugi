"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PRICES } from "@/lib/pricing";

function PayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const mode = searchParams.get("mode") || "fast";
  const jobId = searchParams.get("jobId") || "";
  const priceInfo = PRICES[mode] || PRICES.fast;

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";
  const orderId = `soccermom-${jobId}-${Date.now()}`;
  const customerName = session?.user?.name || "고객";

  // 토스페이먼츠 결제위젯 동적 로드 (SSR 오류 방지)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!clientKey) {
      setErr("결제 서비스가 아직 설정되지 않았습니다 (NEXT_PUBLIC_TOSS_CLIENT_KEY 미설정).");
      return;
    }

    let widget;
    const loadWidget = async () => {
      try {
        // Dynamic import로 클라이언트에서만 로드
        // Dynamic import - package must be installed at runtime
        // eslint-disable-next-line import/no-unresolved
        const tossModule = await import(/* webpackIgnore: true */ "@tosspayments/payment-sdk").catch(() => null);
        if (!tossModule) throw new Error("토스페이먼츠 SDK를 불러올 수 없습니다.");
        const { loadTossPayments } = tossModule;
        const tossPayments = await loadTossPayments(clientKey);
        widget = tossPayments.widgets({ customerKey: session?.user?.email || "GUEST" });

        await widget.setAmount({ currency: "KRW", value: priceInfo.amount });
        await Promise.all([
          widget.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
          widget.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
        ]);

        setWidgetLoaded(true);

        // 결제 버튼 클릭 핸들러
        document.getElementById("toss-pay-btn")?.addEventListener("click", async () => {
          try {
            setLoading(true);
            await widget.requestPayment({
              orderId,
              orderName: priceInfo.label,
              successUrl: `${window.location.origin}/result/${jobId}?paySuccess=1`,
              failUrl: `${window.location.origin}/pay?mode=${mode}&jobId=${jobId}&fail=1`,
              customerEmail: session?.user?.email,
              customerName,
            });
          } catch (e) {
            setErr(String(e.message || e));
            setLoading(false);
          }
        });
      } catch (e) {
        setErr("결제위젯 로드 실패: " + String(e.message));
      }
    };

    loadWidget();
  }, [clientKey, session, orderId, mode, jobId, priceInfo, customerName]);

  // 결제 실패 파라미터 처리
  const failMsg = searchParams.get("fail");
  const failCode = searchParams.get("code");
  const failMessage = searchParams.get("message");

  return (
    <div style={{ maxWidth: 540, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>결제</h1>

      {/* 주문 요약 */}
      <div style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "#6b7280" }}>상품</span>
          <span style={{ fontWeight: "bold" }}>{priceInfo.label}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "#6b7280" }}>설명</span>
          <span style={{ fontSize: 13, color: "#374151" }}>{priceInfo.description}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #f3f4f6" }}>
          <span style={{ fontWeight: "bold" }}>결제금액</span>
          <span style={{ fontWeight: "bold", fontSize: 20, color: "#1d4ed8" }}>
            {priceInfo.amount.toLocaleString()}원
          </span>
        </div>
      </div>

      {failMsg && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: 12, marginBottom: 16, color: "#dc2626" }}>
          결제가 취소되었거나 실패했습니다. {failMessage && `(${failMessage})`}
        </div>
      )}

      {err && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: 12, marginBottom: 16, color: "#dc2626" }}>
          {err}
        </div>
      )}

      {/* 토스페이먼츠 위젯 마운트 포인트 */}
      {clientKey && (
        <>
          <div id="payment-method" style={{ marginBottom: 16 }} />
          <div id="agreement" style={{ marginBottom: 16 }} />
          <button
            id="toss-pay-btn"
            disabled={loading || !widgetLoaded}
            style={{
              width: "100%",
              padding: "14px 0",
              background: loading || !widgetLoaded ? "#9ca3af" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontSize: 17,
              fontWeight: "bold",
              cursor: loading || !widgetLoaded ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "처리 중…" : widgetLoaded ? `${priceInfo.amount.toLocaleString()}원 결제하기` : "결제 준비 중…"}
          </button>
        </>
      )}

      {!clientKey && !err && (
        <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, textAlign: "center", color: "#6b7280" }}>
          결제 서비스를 설정하는 중입니다.<br />
          <small>관리자: NEXT_PUBLIC_TOSS_CLIENT_KEY 환경변수를 설정하세요.</small>
        </div>
      )}

      <p style={{ marginTop: 16, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
        결제 후 분석이 자동으로 시작됩니다. 결제는 토스페이먼츠를 통해 안전하게 처리됩니다.
      </p>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<div>결제 준비 중...</div>}>
      <PayContent />
    </Suspense>
  );
}
