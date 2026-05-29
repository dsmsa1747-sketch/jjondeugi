"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

function statusLabel(status) {
  const map = {
    queued: "대기 중",
    processing: "분석 중",
    done: "완료",
    failed: "실패",
  };
  return map[status] || status;
}

function statusColor(status) {
  const map = {
    queued: "#f59e0b",
    processing: "#3b82f6",
    done: "#22c55e",
    failed: "#ef4444",
  };
  return map[status] || "#6b7280";
}

export default function MyPage() {
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setLoading(false);
      return;
    }
    fetch("/api/mypage")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErr(d.error);
        else setJobs(d.jobs);
        setLoading(false);
      })
      .catch((e) => {
        setErr(String(e.message));
        setLoading(false);
      });
  }, [session, status]);

  if (status === "loading" || loading) {
    return <p>불러오는 중…</p>;
  }

  if (!session) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <p style={{ fontSize: 18, marginBottom: 20 }}>로그인이 필요합니다.</p>
        <a href="/api/auth/signin" style={{
          display: "inline-block",
          padding: "12px 32px",
          background: "#3b82f6",
          color: "white",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: "bold",
        }}>
          로그인하기
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>내 분석 기록</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>{session.user.email}</p>

      {err && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: 12, marginBottom: 16, color: "#dc2626" }}>
          불러오기 실패: {err}
        </div>
      )}

      {!err && jobs?.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
          <p>분석 기록이 없습니다.</p>
          <Link href="/analyze" style={{
            display: "inline-block", marginTop: 16,
            padding: "10px 24px", background: "#3b82f6",
            color: "white", borderRadius: 8, textDecoration: "none",
          }}>
            첫 분석 시작하기
          </Link>
        </div>
      )}

      {jobs && jobs.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {jobs.map((job) => (
            <div key={job.id} style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    background: statusColor(job.status),
                    color: "white",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: "bold",
                  }}>
                    {statusLabel(job.status)}
                  </span>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>
                    {job.mode === "fast" ? "⚡ 빠른 분석" : "🔬 정밀 분석"}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#374151", wordBreak: "break-all" }}>
                  {job.video?.slice(0, 60)}{job.video?.length > 60 ? "…" : ""}
                </p>
                {job.createdAt && (
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af" }}>
                    {new Date(job.createdAt).toLocaleString("ko-KR")}
                  </p>
                )}
              </div>
              <Link href={`/result/${job.id}?mode=${job.mode || "precise"}`} style={{
                padding: "8px 16px",
                background: "#3b82f6",
                color: "white",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 14,
                whiteSpace: "nowrap",
              }}>
                결과 보기
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
