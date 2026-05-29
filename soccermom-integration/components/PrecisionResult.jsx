"use client";
// 정밀분석 결과화면 — 작업 상태를 폴링하고, 완료되면 추적영상 + 지표를 표시.
// analysis_mode === "match" 이면 TeamComparison(팀 비교)도 렌더.
// analysis_mode === "practice" 이면 팀 점유율 대신 개인 분석 안내 표시.
import { useEffect, useState } from "react";
import TeamComparison from "@/components/TeamComparison";

export default function PrecisionResult({ jobId }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!jobId) return;
    let timer;
    const poll = async () => {
      try {
        const r = await fetch(`/api/analyze-precise/status/${jobId}`);
        const j = await r.json();
        if (j.error) throw new Error(j.error);
        setData(j);
        if (j.status === "done" || j.status === "failed") return; // 폴링 종료
      } catch (e) {
        setErr(String(e.message || e));
      }
      timer = setTimeout(poll, 3000); // 3초마다 확인
    };
    poll();
    return () => clearTimeout(timer);
  }, [jobId]);

  if (err) return <p style={{ color: "crimson" }}>오류: {err}</p>;
  if (!data) return <p>불러오는 중…</p>;

  if (data.status === "queued" || data.status === "processing") {
    const pct = data.progress != null ? Math.round(data.progress * 100) : null;
    return (
      <div>
        <p>🎬 AI가 영상을 정밀 분석 중입니다… {pct != null ? `${pct}%` : ""}</p>
        <p style={{ color: "#888" }}>영상 길이에 따라 수 분 걸릴 수 있어요. 이 화면은 자동 갱신됩니다.</p>
      </div>
    );
  }

  if (data.status === "failed") {
    return <p style={{ color: "crimson" }}>분석 실패: {data.error || "알 수 없는 오류"}</p>;
  }

  // done
  const result = data.result || {};
  const players = result.players || [];
  const target = result.target_player;
  const poss = result.possession || {};
  const analysisMode = result.analysis_mode || "match"; // "match" | "practice"
  const isMatchMode = analysisMode === "match";

  return (
    <div>
      <h2>정밀분석 결과</h2>

      {data.videoUrl && (
        <video src={data.videoUrl} controls style={{ width: "100%", maxWidth: 720 }} />
      )}

      {/* 공식경기: 팀 비교 컴포넌트 표시 */}
      {isMatchMode && result.teams && (
        <TeamComparison teams={result.teams} />
      )}

      {/* 연습경기: 팀 구분 불가 안내 */}
      {!isMatchMode && (
        <p style={{ color: "#6b7280", fontSize: 14, margin: "8px 0" }}>
          🏃 연습경기 모드: 팀 구분 없이 개인 분석
        </p>
      )}

      {/* 볼 점유율은 공식경기(팀 비교 없는 경우 포함)에만 표시 */}
      {isMatchMode && !result.teams && (
        <p>⚽ 볼 점유율 — A팀 {poss.team1 ?? "-"}% / B팀 {poss.team2 ?? "-"}%</p>
      )}

      {target && (
        <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, margin: "12px 0" }}>
          <h3>
            ⭐ 지정 선수
            {target.name ? ` — ${target.name}` : ""}
            {target.number ? ` (#${target.number})` : ` (#${target.track_id})`}
          </h3>
          <p>
            이동거리 {target.distance} {target.unit_distance} · 평균속도 {target.avg_speed} {target.unit_speed} · 최고속도 {target.max_speed} {target.unit_speed}
          </p>
        </div>
      )}

      <h3>선수별 활동량 (이동거리 순)</h3>
      <table>
        <thead>
          <tr><th>선수</th><th>팀</th><th>이동거리</th><th>평균속도</th><th>최고속도</th></tr>
        </thead>
        <tbody>
          {players.slice(0, 12).map((p) => (
            <tr key={p.track_id}>
              <td>#{p.track_id}</td>
              <td>{p.team || "-"}</td>
              <td>{p.distance} {p.unit_distance}</td>
              <td>{p.avg_speed} {p.unit_speed}</td>
              <td>{p.max_speed} {p.unit_speed}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 정직 라벨 — 항상 표기 */}
      <p style={{ color: "#888", fontSize: 13, marginTop: 12 }}>
        ※ {result.disclaimer || "AI 측정값으로 오차가 있을 수 있습니다."}
      </p>
    </div>
  );
}
