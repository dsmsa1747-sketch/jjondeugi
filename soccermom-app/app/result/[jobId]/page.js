"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import PrecisionResult from "@/components/PrecisionResult";
import Link from "next/link";

function FastResultView({ jobId }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    // 빠른 분석: Firestore에서 결과 조회
    let timer;
    const poll = async () => {
      try {
        const r = await fetch(`/api/analyze-precise/status/${jobId}`);
        const j = await r.json();
        if (j.error && j.error !== "작업을 찾을 수 없습니다.") {
          setErr(j.error);
          return;
        }
        if (j.status === "done" && j.result) {
          setData(j);
          return;
        }
        if (j.status === "failed") {
          setErr(j.error || "분석 실패");
          return;
        }
      } catch (e) {
        setErr(String(e.message));
        return;
      }
      timer = setTimeout(poll, 3000);
    };
    poll();
    return () => clearTimeout(timer);
  }, [jobId]);

  if (err) return <p style={{ color: "crimson" }}>오류: {err}</p>;
  if (!data) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <p style={{ fontSize: 18, color: "#fff" }}>⚡ 빠른 분석 중…</p>
        <p style={{ color: "var(--color-text-secondary)" }}>40초~1분 내에 완료됩니다.</p>
      </div>
    );
  }

  const result = data.result || {};
  return (
    <div>
      <h2 style={{ marginBottom: 20, color: "#fff" }}>빠른 코칭분석 결과</h2>

      {/* 하이라이트 — prominent quote card */}
      {result.highlights && (
        <div style={{
          background: "linear-gradient(135deg, rgba(197,255,48,0.08) 0%, rgba(197,255,48,0.03) 100%)",
          border: "1px solid var(--color-accent)",
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 24,
          position: "relative",
        }}>
          <div style={{
            fontSize: 36,
            lineHeight: 1,
            color: "var(--color-accent)",
            opacity: 0.4,
            position: "absolute",
            top: 12,
            left: 16,
            fontFamily: "Georgia, serif",
          }}>&ldquo;</div>
          <h3 style={{ margin: "0 0 10px", color: "var(--color-accent)", fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>📝 경기 요약</h3>
          <p style={{ margin: 0, color: "#fff", fontSize: 16, lineHeight: 1.7, paddingLeft: 8 }}>{result.highlights}</p>
        </div>
      )}

      {/* 역량 요약 섹션 — styled cards with colored left-borders */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 20 }}>
        {result.strengths?.length > 0 && (
          <div style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            borderLeft: "4px solid #22c55e",
            borderRadius: 10,
            padding: 20,
          }}>
            <h3 style={{ margin: "0 0 14px", color: "#22c55e", fontSize: 14, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>💪 강점</h3>
            <ul style={{ margin: 0, paddingLeft: 0, lineHeight: 1.85, listStyle: "none" }}>
              {result.strengths.map((s, i) => (
                <li key={i} style={{ color: "var(--color-text-secondary)", fontSize: 14, paddingLeft: 16, position: "relative", marginBottom: 4 }}>
                  <span style={{ position: "absolute", left: 0, color: "#22c55e", fontWeight: 800 }}>›</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.improvements?.length > 0 && (
          <div style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            borderLeft: "4px solid #f97316",
            borderRadius: 10,
            padding: 20,
          }}>
            <h3 style={{ margin: "0 0 14px", color: "#f97316", fontSize: 14, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>📈 개선점</h3>
            <ul style={{ margin: 0, paddingLeft: 0, lineHeight: 1.85, listStyle: "none" }}>
              {result.improvements.map((s, i) => (
                <li key={i} style={{ color: "var(--color-text-secondary)", fontSize: 14, paddingLeft: 16, position: "relative", marginBottom: 4 }}>
                  <span style={{ position: "absolute", left: 0, color: "#f97316", fontWeight: 800 }}>›</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {result.drills?.length > 0 && (
        <div style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
          borderLeft: "4px solid var(--color-accent)",
          borderRadius: 10,
          padding: 20,
          marginBottom: 20,
        }}>
          <h3 style={{ margin: "0 0 14px", color: "var(--color-accent)", fontSize: 14, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>🏃 권장 훈련 드릴</h3>
          <ul style={{ margin: 0, paddingLeft: 0, lineHeight: 1.85, listStyle: "none" }}>
            {result.drills.map((s, i) => (
              <li key={i} style={{ color: "var(--color-text-secondary)", fontSize: 14, paddingLeft: 16, position: "relative", marginBottom: 4 }}>
                <span style={{ position: "absolute", left: 0, color: "var(--color-accent)", fontWeight: 800 }}>›</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", padding: "10px 14px", background: "var(--color-bg-card)", borderRadius: 6, borderLeft: "3px solid var(--color-border)" }}>
        ※ {result.disclaimer || "AI 측정값으로 오차가 있을 수 있으며, 전문 코치의 판단을 대체하지 않습니다."}
      </p>
    </div>
  );
}

function ResultContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const jobId = params?.jobId;
  const paySuccess = searchParams.get("paySuccess") === "1";
  const mode = searchParams.get("mode") || "precise";

  // 결제 성공 후 서버에서 결제 확인 (paymentKey, orderId, amount가 URL에 있을 때)
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const [payConfirmed, setPayConfirmed] = useState(!paymentKey);
  const [payErr, setPayErr] = useState(null);

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) return;
    // 결제 승인
    fetch("/api/pay/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setPayErr(d.error);
        else setPayConfirmed(true);
      })
      .catch((e) => setPayErr(String(e.message)));
  }, [paymentKey, orderId, amount]);

  if (!jobId) {
    return (
      <div>
        <p style={{ color: "crimson" }}>jobId 가 없습니다.</p>
        <Link href="/">홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div>
      {paySuccess && (
        <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid #22c55e", borderRadius: 8, padding: 12, marginBottom: 20, color: "#22c55e", fontWeight: 600 }}>
          ✅ 결제가 완료되었습니다. 분석이 시작됩니다.
        </div>
      )}
      {payErr && (
        <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid #dc2626", borderRadius: 8, padding: 12, marginBottom: 20, color: "#dc2626" }}>
          결제 확인 오류: {payErr}
        </div>
      )}

      {mode === "fast" ? (
        <FastResultView jobId={jobId} />
      ) : (
        <PrecisionResult jobId={jobId} />
      )}

      <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
        <Link href="/analyze" style={{
          padding: "10px 20px", background: "var(--color-accent)", color: "#0B0E0C",
          borderRadius: 8, textDecoration: "none", fontWeight: "bold",
        }}>
          새 분석 시작
        </Link>
        <Link href="/mypage" style={{
          padding: "10px 20px", background: "transparent", color: "var(--color-text-secondary)",
          border: "1px solid var(--color-border)", borderRadius: 8, textDecoration: "none",
        }}>
          내 분석 목록
        </Link>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div style={{ color: "var(--color-text-secondary)" }}>결과 불러오는 중...</div>}>
      <ResultContent />
    </Suspense>
  );
}
