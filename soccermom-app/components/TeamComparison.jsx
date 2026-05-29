"use client";
// 팀 비교 컴포넌트 — 공식경기(match) 결과에서 A팀 vs B팀 지표를 시각적으로 비교.
// 외부 차트 라이브러리 없이 인라인 스타일 div 막대로 구현.
// Props:
//   teams — result.teams 객체 { team1: {...}, team2: {...} }
//     각 팀: { players, total_distance, avg_speed, max_speed, possession,
//              unit_distance, unit_speed }

// 단위에 "상대" 또는 "px" 가 포함되면 절대수치가 아닌 추정값임을 표기
function isEstimated(unit) {
  if (!unit) return false;
  return unit.includes("상대") || unit.includes("px");
}

// 막대 하나: 값 / 최대값 비율로 너비를 결정
function Bar({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{ background: "#f0f0f0", borderRadius: 4, overflow: "hidden", height: 14, flex: 1 }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 4,
          transition: "width 0.4s",
        }}
      />
    </div>
  );
}

// A팀·B팀 가로 이중 막대 행 하나
function CompareRow({ label, v1, v2, unit, estimated }) {
  const max = Math.max(Number(v1) || 0, Number(v2) || 0);
  return (
    <tr>
      <td style={{ padding: "6px 8px", color: "#555", whiteSpace: "nowrap" }}>{label}</td>
      {/* A팀 막대 — 오른쪽 정렬 */}
      <td style={{ width: "35%", padding: "6px 6px 6px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ minWidth: 60, textAlign: "right", fontWeight: "bold" }}>
            {v1 ?? "-"}
          </span>
          <Bar value={Number(v1) || 0} max={max} color="#3b82f6" />
        </div>
      </td>
      {/* B팀 막대 — 왼쪽 정렬 */}
      <td style={{ width: "35%", padding: "6px 0 6px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Bar value={Number(v2) || 0} max={max} color="#ef4444" />
          <span style={{ minWidth: 60, fontWeight: "bold" }}>
            {v2 ?? "-"}
          </span>
        </div>
      </td>
      <td style={{ padding: "6px 8px", color: "#888", fontSize: 12, whiteSpace: "nowrap" }}>
        {unit}{estimated ? <span style={{ color: "#f59e0b", marginLeft: 4 }}>추정값</span> : null}
      </td>
    </tr>
  );
}

export default function TeamComparison({ teams }) {
  if (!teams) return null;
  const t1 = teams.team1 || {};
  const t2 = teams.team2 || {};

  const uDist = t1.unit_distance || t2.unit_distance || "";
  const uSpeed = t1.unit_speed || t2.unit_speed || "";
  const distEstimated = isEstimated(uDist);
  const speedEstimated = isEstimated(uSpeed);

  // 점유율 막대 — 합산이 100%가 되도록 좌/우 표시
  const poss1 = Number(t1.possession) || 0;
  const poss2 = Number(t2.possession) || 0;

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, margin: "16px 0" }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>⚔️ 팀 비교</h3>

      {/* 헤더: A팀 vs B팀 */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: "#3b82f6", fontWeight: "bold", fontSize: 15 }}>A팀</span>
        <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: 15 }}>B팀</span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <CompareRow
            label="선수 수"
            v1={t1.players}
            v2={t2.players}
            unit="명"
            estimated={false}
          />
          <CompareRow
            label="총 이동거리"
            v1={t1.total_distance}
            v2={t2.total_distance}
            unit={uDist}
            estimated={distEstimated}
          />
          <CompareRow
            label="평균속도"
            v1={t1.avg_speed}
            v2={t2.avg_speed}
            unit={uSpeed}
            estimated={speedEstimated}
          />
          <CompareRow
            label="최고속도"
            v1={t1.max_speed}
            v2={t2.max_speed}
            unit={uSpeed}
            estimated={speedEstimated}
          />
        </tbody>
      </table>

      {/* 점유율 — 전체 너비 분할 막대 */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
          <span style={{ color: "#3b82f6", fontWeight: "bold" }}>A팀 점유율 {poss1}%</span>
          <span style={{ color: "#ef4444", fontWeight: "bold" }}>B팀 점유율 {poss2}%</span>
        </div>
        <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", background: "#f0f0f0" }}>
          <div style={{ width: `${poss1}%`, background: "#3b82f6", transition: "width 0.4s" }} />
          <div style={{ width: `${poss2}%`, background: "#ef4444", transition: "width 0.4s" }} />
        </div>
      </div>
    </div>
  );
}
