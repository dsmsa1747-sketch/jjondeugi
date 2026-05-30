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

function statusStyle(status) {
  const map = {
    queued: {
      background: "rgba(245,158,11,0.15)",
      color: "var(--color-warning)",
      borderColor: "rgba(245,158,11,0.3)",
    },
    processing: {
      background: "rgba(59,130,246,0.15)",
      color: "var(--color-info)",
      borderColor: "rgba(59,130,246,0.3)",
    },
    done: {
      background: "rgba(197,255,48,0.12)",
      color: "var(--color-accent)",
      borderColor: "rgba(197,255,48,0.25)",
    },
    failed: {
      background: "rgba(239,68,68,0.12)",
      color: "var(--color-danger)",
      borderColor: "rgba(239,68,68,0.25)",
    },
  };
  return map[status] || { background: "var(--color-bg-section)", color: "var(--color-text-secondary)", borderColor: "var(--color-border)" };
}

/* Left accent bar color per status */
function statusAccentColor(status) {
  const map = {
    queued: "var(--color-warning)",
    processing: "var(--color-info)",
    done: "var(--color-accent)",
    failed: "var(--color-danger)",
  };
  return map[status] || "var(--color-border)";
}

function ModeChip({ mode }) {
  const isfast = mode === "fast";
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: 11,
      fontWeight: 700,
      fontFamily: "var(--font-data)",
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      color: isfast ? "var(--color-text-secondary)" : "var(--color-accent)",
      background: isfast ? "rgba(160,165,162,0.1)" : "rgba(197,255,48,0.08)",
      border: `1px solid ${isfast ? "var(--color-border)" : "rgba(197,255,48,0.2)"}`,
      borderRadius: "var(--radius-pill)",
      padding: "3px 10px",
    }}>
      {isfast ? "⚡ 빠른" : "🎯 정밀"}
    </span>
  );
}

/* Minimal stat chip shown in the header area */
function StatBadge({ count }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 28,
      height: 22,
      padding: "0 8px",
      borderRadius: "var(--radius-pill)",
      background: "var(--color-accent-bg)",
      border: "1px solid rgba(197,255,48,0.2)",
      color: "var(--color-accent)",
      fontSize: 11,
      fontWeight: 700,
      fontFamily: "var(--font-data)",
      letterSpacing: "0.04em",
    }}>{count}</span>
  );
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

  /* ── Loading ── */
  if (status === "loading" || loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 360,
        gap: 20,
      }}>
        <div className="spinner" />
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>불러오는 중…</p>
      </div>
    );
  }

  /* ── Not signed in ── */
  if (!session) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 420,
        gap: 0,
        textAlign: "center",
        padding: "64px 24px",
      }}>
        <div style={{
          width: 76,
          height: 76,
          borderRadius: "50%",
          background: "var(--color-accent-bg)",
          border: "1px solid rgba(197,255,48,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          fontSize: 34,
        }}>
          ⚽
        </div>
        <h2 style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text-primary)",
          fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
          marginBottom: 12,
          letterSpacing: "0.03em",
        }}>로그인이 필요합니다</h2>
        <p style={{
          color: "var(--color-text-secondary)",
          marginBottom: 32,
          fontSize: "var(--text-sm)",
          lineHeight: "var(--leading-relaxed)",
          maxWidth: 320,
        }}>
          분석 기록을 보려면 먼저 로그인해주세요.
        </p>
        <a href="/api/auth/signin" className="btn btn-primary">
          로그인하기
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "44px 24px 88px" }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 40 }}>
        <span className="badge badge-accent" style={{ marginBottom: 16, display: "inline-flex" }}>내 분석 기록</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 10 }}>
          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
            color: "var(--color-text-primary)",
            letterSpacing: "0.04em",
            lineHeight: 1.2,
          }}>
            분석 히스토리
          </h1>
          {jobs && jobs.length > 0 && <StatBadge count={jobs.length} />}
        </div>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
          {session.user.email}
        </p>
      </div>

      {/* ── Error ── */}
      {err && (
        <div style={{
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "var(--radius-md)",
          padding: "14px 18px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: "var(--color-danger)",
          fontSize: "var(--text-sm)",
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>⚠</span>
          <span>불러오기 실패: {err}</span>
        </div>
      )}

      {/* ── Empty state ── */}
      {!err && jobs?.length === 0 && (
        <div className="card" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "72px 32px",
          gap: 0,
        }}>
          {/* Decorative ring */}
          <div style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: "var(--color-accent-bg)",
            border: "1px solid rgba(197,255,48,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
            fontSize: 38,
          }}>
            📋
          </div>
          <h3 style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-text-primary)",
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            marginBottom: 12,
            letterSpacing: "0.03em",
          }}>아직 분석 기록이 없어요</h3>
          <p style={{
            color: "var(--color-text-secondary)",
            fontSize: "var(--text-sm)",
            marginBottom: 32,
            lineHeight: "var(--leading-relaxed)",
            maxWidth: 320,
          }}>
            영상을 업로드하고 첫 분석을 시작해보세요.<br />
            빠른 분석은 40초 만에 결과가 나와요.
          </p>
          <Link href="/analyze" className="btn btn-primary">
            첫 분석 시작하기 →
          </Link>
        </div>
      )}

      {/* ── Job list ── */}
      {jobs && jobs.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {jobs.map((job) => {
            const ss = statusStyle(job.status);
            const accentColor = statusAccentColor(job.status);
            return (
              <div
                key={job.id}
                className="card"
                style={{
                  padding: 0,
                  display: "flex",
                  overflow: "hidden",
                  border: "1px solid var(--color-border)",
                }}
              >
                {/* Left accent stripe */}
                <div style={{
                  width: 4,
                  flexShrink: 0,
                  background: accentColor,
                  opacity: 0.7,
                }} />

                {/* Content */}
                <div style={{
                  flex: 1,
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                  minWidth: 0,
                }}>
                  {/* Left: info */}
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    {/* Chips row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                      {/* Status pill */}
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "3px 10px",
                        borderRadius: "var(--radius-pill)",
                        border: `1px solid ${ss.borderColor}`,
                        background: ss.background,
                        color: ss.color,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "var(--font-data)",
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}>
                        {statusLabel(job.status)}
                      </span>
                      <ModeChip mode={job.mode} />
                    </div>

                    {/* Video URL */}
                    <p style={{
                      margin: 0,
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-secondary)",
                      wordBreak: "break-all",
                      lineHeight: 1.5,
                    }}>
                      {job.video?.slice(0, 72)}{job.video?.length > 72 ? "…" : ""}
                    </p>

                    {/* Timestamp */}
                    {job.createdAt && (
                      <p style={{
                        margin: "6px 0 0",
                        fontSize: 11,
                        color: "var(--color-text-tertiary)",
                        fontFamily: "var(--font-data)",
                        letterSpacing: "0.02em",
                      }}>
                        {new Date(job.createdAt).toLocaleString("ko-KR")}
                      </p>
                    )}
                  </div>

                  {/* Right: CTA */}
                  <Link
                    href={`/result/${job.id}?mode=${job.mode || "precise"}`}
                    className="btn btn-outline btn-sm"
                    style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                  >
                    결과 보기
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Bottom CTA */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/analyze" className="btn btn-primary">
              새 분석 시작하기 →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
