"use client";
// 클릭 선수지정 UI
//  - 영상을 재생/일시정지하고, 분석할 선수를 클릭해 지정
//  - 클릭 좌표(영상 원본 픽셀) + 클릭 시점(초) + 이름/등번호/유니폼색을 함께 전송
//  - 등번호 자동인식은 약하므로, 클릭+직접입력으로 정확도를 보완
//  - 연습경기 모드: 같은 조끼라 팀 구분 불가 → 클릭+이름/번호로 대상 선수 지정 후 개인 추적
//
// ⚠️ 클릭 지정은 '업로드한 mp4'(GCS 재생 URL)에서 동작합니다.
//    유튜브 임베드는 iframe이라 픽셀 단위 클릭이 불가 → 이 경우 클릭 없이 분석하세요.
import { useRef, useState } from "react";

export default function PlayerSelector({ videoUrl, gsUri, onSubmitted }) {
  const videoRef = useRef(null);
  const [pick, setPick] = useState(null); // { xNative, yNative, time, displayX, displayY }
  const [meta, setMeta] = useState({ name: "", number: "", jersey: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  // 연습경기 모드: true이면 analysisMode="practice", false이면 "match"
  const [practiceMode, setPracticeMode] = useState(false);

  // 영상 클릭 → 표시좌표를 영상 '원본 픽셀'로 환산 + 현재 재생시점 기록
  const handleClick = (e) => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const rect = v.getBoundingClientRect();
    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;
    // width:100%, height:auto 로 원본 비율이 유지되므로 단순 스케일이 정확
    const scaleX = v.videoWidth / rect.width;
    const scaleY = v.videoHeight / rect.height;
    v.pause();
    setPick({
      xNative: Math.round(displayX * scaleX),
      yNative: Math.round(displayY * scaleY),
      time: Number(v.currentTime.toFixed(2)),
      displayX,
      displayY,
    });
  };

  const submit = async () => {
    if (!pick) {
      setErr("먼저 영상에서 분석할 선수를 클릭하세요.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/analyze-precise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gsUri,
          targetPoint: [pick.xNative, pick.yNative],
          targetTime: pick.time,
          targetMeta: {
            name: meta.name || null,
            number: meta.number || null,
            jersey: meta.jersey || null,
          },
          analysisMode: practiceMode ? "practice" : "match",
        }),
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error);
      onSubmitted?.(j.jobId);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {/* 연습경기 모드 토글 */}
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={practiceMode}
          onChange={(e) => setPracticeMode(e.target.checked)}
          style={{ width: 16, height: 16 }}
        />
        <span style={{ fontWeight: "bold" }}>연습경기 모드 (번호 없음 · 같은 조끼)</span>
      </label>
      {practiceMode && (
        <p style={{ color: "#666", fontSize: 13, marginTop: -4, marginBottom: 8, lineHeight: 1.5 }}>
          💡 연습경기는 같은 조끼라 팀 구분이 안 되니, 클릭으로 선수를 지정하고 이름/번호를 직접 입력하면 그 선수를 따라가며 분석합니다.
        </p>
      )}

      <p style={{ color: "#555" }}>
        ▶ 영상을 재생하다가 <b>분석할 선수가 잘 보이는 순간 일시정지 → 그 선수를 클릭</b>하세요.
      </p>
      <p style={{ color: "#888", fontSize: 13 }}>
        ※ 등번호 자동 인식은 정확하지 않을 수 있습니다. 이름과 번호를 직접 입력하면 더 정확합니다.
      </p>

      <div style={{ position: "relative", display: "inline-block", maxWidth: 720, width: "100%" }}>
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          onClick={handleClick}
          style={{ width: "100%", height: "auto", cursor: "crosshair", display: "block", borderRadius: 8 }}
        />
        {pick && (
          <div
            style={{
              position: "absolute",
              left: pick.displayX - 12,
              top: pick.displayY - 12,
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: "3px solid #ffd400",
              boxShadow: "0 0 0 2px rgba(0,0,0,.4)",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {pick && (
        <p style={{ color: "#0a7" }}>
          ✓ 선택됨 — {pick.time}초 지점, 좌표 ({pick.xNative}, {pick.yNative})
        </p>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>
        <input
          placeholder="이름 (예: 홍길동)"
          value={meta.name}
          onChange={(e) => setMeta({ ...meta, name: e.target.value })}
          style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 6 }}
        />
        <input
          placeholder="등번호 (예: 28)"
          value={meta.number}
          onChange={(e) => setMeta({ ...meta, number: e.target.value })}
          style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 6 }}
        />
        <input
          placeholder="유니폼색 (예: 파랑)"
          value={meta.jersey}
          onChange={(e) => setMeta({ ...meta, jersey: e.target.value })}
          style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 6 }}
        />
      </div>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <button
        onClick={submit}
        disabled={busy}
        style={{
          padding: "10px 24px",
          background: busy ? "#9ca3af" : "#16a34a",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: 15,
          cursor: busy ? "not-allowed" : "pointer",
          marginTop: 8,
        }}
      >
        {busy ? "분석 요청 중…" : "이 선수로 정밀분석"}
      </button>
    </div>
  );
}
