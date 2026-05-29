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
        <p style={{ fontSize: 18 }}>⚡ 빠른 분석 중…</p>
        <p style={{ color: "#6b7280" }}>40초~1분 내에 완료됩니다.</p>
      </div>
    );
  }

  const result = data.result || {};
  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>빠른 코칭분석 결과</h2>

      {result.highlights && (
        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 8px", color: "#0369a1" }}>📝 경기 요약</h3>
          <p style={{ margin: 0 }}>{result.highlights}</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        {result.strengths?.length > 0 && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 16 }}>
            <h3 style={{ margin: "0 0 10px", color: "#15803d" }}>💪 강점</h3>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
              {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        {result.improvements?.length > 0 && (
          <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: 16 }}>
            <h3 style={{ margin: "0 0 10px", color: "#c2410c" }}>📈 개선점</h3>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
              {result.improvements.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
      </div>

      {result.drills?.length > 0 && (
        <div style={{ background: "#faf5ff", border: "1px solid #d8b4fe", borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 10px", color: "#7c3aed" }}>🏃 권장 훈련 드릴</h3>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
            {result.drills.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      <p style={{ fontSize: 13, color: "#9ca3af", padding: "10px 14px", background: "#f9fafb", borderRadius: 6, borderLeft: "3px solid #d1d5db" }}>
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
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: 12, marginBottom: 20 }}>
          ✅ 결제가 완료되었습니다. 분석이 시작됩니다.
        </div>
      )}
      {payErr && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: 12, marginBottom: 20, color: "#dc2626" }}>
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
          padding: "10px 20px", background: "#3b82f6", color: "white",
          borderRadius: 8, textDecoration: "none", fontWeight: "bold",
        }}>
          새 분석 시작
        </Link>
        <Link href="/mypage" style={{
          padding: "10px 20px", background: "white", color: "#374151",
          border: "1px solid #d1d5db", borderRadius: 8, textDecoration: "none",
        }}>
          내 분석 목록
        </Link>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>결과 불러오는 중...</div>}>
      <ResultContent />
    </Suspense>
  );
}
