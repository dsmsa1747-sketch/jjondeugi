"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import PlayerSelector from "@/components/PlayerSelector";
import { Suspense } from "react";

function AnalyzeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [mode, setMode] = useState(searchParams.get("mode") === "precise" ? "precise" : "fast");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStep, setUploadStep] = useState("idle"); // idle | uploading | done | error
  const [gsUri, setGsUri] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [fastResult, setFastResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const fileRef = useRef();

  const isPrecise = mode === "precise";

  // 파일 업로드
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
    setGsUri(null);
    setErr(null);
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploadStep("uploading");
    setErr(null);
    try {
      // 서명 URL 요청
      const urlRes = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: uploadFile.name, contentType: uploadFile.type }),
      });
      const urlData = await urlRes.json();
      if (urlData.error) throw new Error(urlData.error);

      // GCS에 직접 업로드
      const uploadRes = await fetch(urlData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": uploadFile.type },
        body: uploadFile,
      });
      if (!uploadRes.ok) throw new Error("파일 업로드 실패");

      setGsUri(urlData.gsUri);
      setUploadStep("done");
    } catch (e) {
      setErr(String(e.message));
      setUploadStep("error");
    }
  };

  // 빠른 분석 제출
  const handleFastAnalyze = async () => {
    if (!youtubeUrl) {
      setErr("유튜브 링크를 입력해 주세요.");
      return;
    }
    if (!session) {
      setErr("분석은 로그인 후 이용할 수 있습니다. 먼저 로그인해 주세요.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/analyze-fast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "NOT_SOCCER") {
          setErr("⚠️ 축구 경기/훈련 영상으로 보이지 않습니다. 축구 영상으로 다시 시도해 주세요.");
        } else if (data.code === "YOUTUBE_UNREADABLE") {
          setErr("⚠️ " + (data.error || "이 유튜브 영상은 자동 분석이 어렵습니다. mp4 파일을 직접 업로드해 보세요."));
        } else if (data.code === "LOGIN_REQUIRED") {
          setErr("로그인이 필요합니다.");
        } else {
          setErr(data.error || "분석 요청에 실패했습니다.");
        }
        return;
      }
      // 관리자(무료)면 결과로, 일반은 결제 페이지로
      if (data.free) {
        router.push(`/result/${data.jobId}?mode=fast`);
      } else {
        router.push(`/pay?mode=fast&jobId=${data.jobId}`);
      }
    } catch (e) {
      setErr(String(e.message));
    } finally {
      setBusy(false);
    }
  };

  const handlePreciseSubmitted = (newJobId) => {
    router.push(`/pay?mode=precise&jobId=${newJobId}`);
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>영상 분석 시작</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>분석 모드를 선택하고 영상을 제출하세요.</p>

      {/* 모드 선택 */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <button
          onClick={() => setMode("fast")}
          style={{
            flex: 1, padding: "14px 0",
            background: !isPrecise ? "#3b82f6" : "white",
            color: !isPrecise ? "white" : "#374151",
            border: "2px solid #3b82f6",
            borderRadius: 10, cursor: "pointer",
            fontWeight: "bold", fontSize: 15,
          }}
        >
          ⚡ 빠른 코칭분석 — 2,000원
        </button>
        <button
          onClick={() => setMode("precise")}
          style={{
            flex: 1, padding: "14px 0",
            background: isPrecise ? "#22c55e" : "white",
            color: isPrecise ? "white" : "#374151",
            border: "2px solid #22c55e",
            borderRadius: 10, cursor: "pointer",
            fontWeight: "bold", fontSize: 15,
          }}
        >
          🔬 정밀 YOLO 분석 — 5,000원~
        </button>
      </div>

      {/* 빠른 분석: 유튜브 URL만 */}
      {!isPrecise && (
        <div style={{ background: "white", borderRadius: 12, padding: 24, border: "1px solid #e5e7eb" }}>
          <h2 style={{ margin: "0 0 16px" }}>유튜브 링크 입력</h2>
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px",
              border: "1px solid #d1d5db", borderRadius: 8,
              fontSize: 15, boxSizing: "border-box", marginBottom: 12,
            }}
          />
          {err && <p style={{ color: "crimson", marginBottom: 8 }}>{err}</p>}
          <button
            onClick={handleFastAnalyze}
            disabled={busy || !youtubeUrl}
            style={{
              width: "100%", padding: "12px 0",
              background: busy || !youtubeUrl ? "#9ca3af" : "#3b82f6",
              color: "white", border: "none", borderRadius: 8,
              fontSize: 16, fontWeight: "bold",
              cursor: busy || !youtubeUrl ? "not-allowed" : "pointer",
            }}
          >
            {busy ? "처리 중…" : "분석 결제하기 (2,000원)"}
          </button>
        </div>
      )}

      {/* 정밀 분석: 파일 업로드 + PlayerSelector */}
      {isPrecise && (
        <div style={{ background: "white", borderRadius: 12, padding: 24, border: "1px solid #e5e7eb" }}>
          <h2 style={{ margin: "0 0 8px" }}>영상 업로드</h2>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 16px" }}>
            mp4 파일을 업로드하거나 유튜브 링크를 입력하세요.<br />
            파일 업로드 시 클릭으로 선수를 지정할 수 있습니다.
          </p>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>유튜브 링크 (파일 없을 때)</label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, boxSizing: "border-box", fontSize: 14 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>또는 파일 직접 업로드 (mp4, 권장)</label>
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              style={{ marginBottom: 8, display: "block" }}
            />
            {uploadFile && uploadStep === "idle" && (
              <button
                onClick={handleUpload}
                style={{
                  padding: "8px 20px", background: "#6366f1", color: "white",
                  border: "none", borderRadius: 6, cursor: "pointer",
                }}
              >
                GCS에 업로드 시작
              </button>
            )}
            {uploadStep === "uploading" && <p style={{ color: "#6b7280" }}>업로드 중…</p>}
            {uploadStep === "done" && <p style={{ color: "#16a34a" }}>✓ 업로드 완료</p>}
            {uploadStep === "error" && <p style={{ color: "crimson" }}>업로드 실패: {err}</p>}
          </div>

          {/* 파일 업로드 완료: PlayerSelector 표시 */}
          {gsUri && videoPreviewUrl && (
            <div style={{ marginTop: 24, borderTop: "1px solid #e5e7eb", paddingTop: 24 }}>
              <h3 style={{ margin: "0 0 12px" }}>선수 지정 (선택)</h3>
              <PlayerSelector
                videoUrl={videoPreviewUrl}
                gsUri={gsUri}
                onSubmitted={handlePreciseSubmitted}
              />
            </div>
          )}

          {/* 파일 없이 유튜브 링크로 정밀분석 */}
          {!gsUri && youtubeUrl && (
            <div style={{ marginTop: 16 }}>
              <button
                onClick={async () => {
                  if (!session) {
                    setErr("분석은 로그인 후 이용할 수 있습니다. 먼저 로그인해 주세요.");
                    return;
                  }
                  setBusy(true);
                  setErr(null);
                  try {
                    const res = await fetch("/api/analyze-precise", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ youtubeUrl }),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      setErr(data.error || "분석 요청에 실패했습니다.");
                      return;
                    }
                    if (data.free) router.push(`/result/${data.jobId}?mode=precise`);
                    else router.push(`/pay?mode=precise&jobId=${data.jobId}`);
                  } catch (e) {
                    setErr(String(e.message));
                  } finally {
                    setBusy(false);
                  }
                }}
                disabled={busy}
                style={{
                  padding: "12px 24px", background: busy ? "#9ca3af" : "#22c55e",
                  color: "white", border: "none", borderRadius: 8,
                  fontSize: 15, fontWeight: "bold",
                  cursor: busy ? "not-allowed" : "pointer",
                }}
              >
                {busy ? "처리 중…" : "유튜브 링크로 정밀분석 (5,000원)"}
              </button>
              {err && <p style={{ color: "crimson", marginTop: 8 }}>{err}</p>}
            </div>
          )}
        </div>
      )}

      {/* 정직 안내 */}
      <div style={{
        marginTop: 24, padding: 16,
        background: "#f9fafb", borderRadius: 8,
        borderLeft: "4px solid #d1d5db",
        fontSize: 13, color: "#6b7280",
      }}>
        <b>분석 유의사항:</b> 정밀분석의 거리·속도는 경기장 보정점이 없을 경우 상대 추정값(px 기준)으로 표기됩니다.
        등번호 자동인식은 약하니 직접 입력을 권장합니다. AI 측정·오차 있음.
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AnalyzeContent />
    </Suspense>
  );
}
