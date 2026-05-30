"use client";
// 선수 케어 — AI 식단·영양 / AI 개인훈련 / 성장 기록장 (탭)
import { useState, useEffect } from "react";

const ACCENT = "var(--color-accent)";

export default function CarePage() {
  const [tab, setTab] = useState("nutrition");
  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: 28, color: "#fff", marginBottom: 4 }}>선수 케어</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: 20 }}>
        식단·영양, 개인훈련 루틴, 성장 기록을 한곳에서 관리하세요.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <TabBtn id="nutrition" tab={tab} setTab={setTab}>🥗 AI 식단·영양</TabBtn>
        <TabBtn id="training" tab={tab} setTab={setTab}>🏃 AI 개인훈련</TabBtn>
        <TabBtn id="growth" tab={tab} setTab={setTab}>📈 성장 기록장</TabBtn>
      </div>

      {tab === "nutrition" && <NutritionTool />}
      {tab === "training" && <TrainingTool />}
      {tab === "growth" && <GrowthTool />}
    </div>
  );
}

function TabBtn({ id, tab, setTab, children }) {
  const active = tab === id;
  return (
    <button onClick={() => setTab(id)} style={{
      padding: "10px 18px", borderRadius: 999, fontWeight: 800, fontSize: 14, cursor: "pointer",
      border: active ? "none" : "1px solid var(--color-border)",
      background: active ? ACCENT : "transparent",
      color: active ? "#0B0E0C" : "var(--color-text-secondary)",
    }}>{children}</button>
  );
}

const input = { width: "100%", padding: "10px 12px", boxSizing: "border-box", background: "var(--color-bg-card)", border: "2px solid var(--color-border)", borderRadius: 10, color: "#fff", marginBottom: 10 };
const label = { fontSize: 13, fontWeight: 700, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 };

// ───────── 식단 ─────────
function NutritionTool() {
  const [f, setF] = useState({ age: "", position: "", height: "", weight: "", goal: "", allergies: "" });
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const run = async () => {
    setBusy(true); setErr(null); setRes(null);
    try {
      const r = await fetch("/api/nutrition", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "오류");
      setRes(j.result);
    } catch (e) { setErr(String(e.message)); } finally { setBusy(false); }
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
        <div><label style={label}>나이 *</label><input style={input} value={f.age} onChange={(e) => setF({ ...f, age: e.target.value })} placeholder="예: 11" /></div>
        <div><label style={label}>포지션</label><input style={input} value={f.position} onChange={(e) => setF({ ...f, position: e.target.value })} placeholder="예: 미드필더" /></div>
        <div><label style={label}>키(cm)</label><input style={input} value={f.height} onChange={(e) => setF({ ...f, height: e.target.value })} /></div>
        <div><label style={label}>체중(kg)</label><input style={input} value={f.weight} onChange={(e) => setF({ ...f, weight: e.target.value })} /></div>
        <div><label style={label}>목표</label><input style={input} value={f.goal} onChange={(e) => setF({ ...f, goal: e.target.value })} placeholder="예: 근력 향상" /></div>
        <div><label style={label}>알레르기</label><input style={input} value={f.allergies} onChange={(e) => setF({ ...f, allergies: e.target.value })} placeholder="예: 우유" /></div>
      </div>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <button className="btn btn-primary" onClick={run} disabled={busy} style={{ width: "100%" }}>{busy ? "생성 중…" : "AI 식단 생성"}</button>

      {res && (
        <div style={{ marginTop: 16, color: "var(--color-text-secondary)" }}>
          <p style={{ color: "#fff", fontWeight: 700 }}>{res.summary}</p>
          {res.daily_meals && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginTop: 12 }}>
              {[["아침", res.daily_meals.breakfast], ["점심", res.daily_meals.lunch], ["저녁", res.daily_meals.dinner], ["간식", res.daily_meals.snack]].map(([t, arr]) => (
                <div key={t} className="card" style={{ padding: 12 }}>
                  <div style={{ color: ACCENT, fontWeight: 800, marginBottom: 6 }}>{t}</div>
                  <ul style={{ paddingLeft: 16, lineHeight: 1.8, fontSize: 13 }}>{(arr || []).map((m, i) => <li key={i}>{m}</li>)}</ul>
                </div>
              ))}
            </div>
          )}
          {res.match_day && <p style={{ marginTop: 12 }}>⚽ <b style={{ color: "#fff" }}>경기 당일:</b> {res.match_day}</p>}
          {res.hydration && <p>💧 <b style={{ color: "#fff" }}>수분:</b> {res.hydration}</p>}
          {res.avoid?.length > 0 && <p>🚫 <b style={{ color: "#fff" }}>피하기:</b> {res.avoid.join(", ")}</p>}
          <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 12, borderTop: "1px solid var(--color-border)", paddingTop: 8 }}>※ {res.disclaimer}</p>
        </div>
      )}
    </div>
  );
}

// ───────── 훈련 ─────────
function TrainingTool() {
  const [f, setF] = useState({ age: "", position: "", weakness: "", days: "3", place: "" });
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const run = async () => {
    setBusy(true); setErr(null); setRes(null);
    try {
      const r = await fetch("/api/training", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "오류");
      setRes(j.result);
    } catch (e) { setErr(String(e.message)); } finally { setBusy(false); }
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
        <div><label style={label}>나이 *</label><input style={input} value={f.age} onChange={(e) => setF({ ...f, age: e.target.value })} placeholder="예: 11" /></div>
        <div><label style={label}>포지션</label><input style={input} value={f.position} onChange={(e) => setF({ ...f, position: e.target.value })} /></div>
        <div><label style={label}>약점</label><input style={input} value={f.weakness} onChange={(e) => setF({ ...f, weakness: e.target.value })} placeholder="예: 왼발 슈팅" /></div>
        <div><label style={label}>주당 일수</label><input style={input} value={f.days} onChange={(e) => setF({ ...f, days: e.target.value })} /></div>
        <div><label style={label}>장소</label><input style={input} value={f.place} onChange={(e) => setF({ ...f, place: e.target.value })} placeholder="예: 집 거실" /></div>
      </div>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <button className="btn btn-primary" onClick={run} disabled={busy} style={{ width: "100%" }}>{busy ? "생성 중…" : "AI 훈련 루틴 생성"}</button>

      {res && (
        <div style={{ marginTop: 16, color: "var(--color-text-secondary)" }}>
          <p style={{ color: "#fff", fontWeight: 700 }}>{res.focus}</p>
          {res.warmup?.length > 0 && <p style={{ marginTop: 8 }}>🔥 <b style={{ color: "#fff" }}>워밍업:</b> {res.warmup.join(", ")}</p>}
          {res.drills?.map((d, i) => (
            <div key={i} className="card" style={{ padding: 12, marginTop: 8 }}>
              <div style={{ color: ACCENT, fontWeight: 800 }}>{i + 1}. {d.name} <span style={{ color: "var(--color-text-tertiary)", fontWeight: 500, fontSize: 12 }}>· {d.reps}</span></div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{d.how}</div>
              {d.target && <div style={{ fontSize: 12, color: ACCENT, marginTop: 4 }}>효과: {d.target}</div>}
            </div>
          ))}
          {res.weekly_plan?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <b style={{ color: "#fff" }}>주간 플랜</b>
              <ul style={{ paddingLeft: 16, lineHeight: 1.8, fontSize: 13 }}>{res.weekly_plan.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
          )}
          {res.safety && <p style={{ marginTop: 8 }}>⚠️ <b style={{ color: "#fff" }}>안전:</b> {res.safety}</p>}
          <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 12, borderTop: "1px solid var(--color-border)", paddingTop: 8 }}>※ {res.disclaimer}</p>
        </div>
      )}
    </div>
  );
}

// ───────── 성장 기록 ─────────
function GrowthTool() {
  const [records, setRecords] = useState([]);
  const [f, setF] = useState({ date: new Date().toISOString().slice(0, 10), height: "", weight: "", memo: "", player: "우리 아이" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const load = async () => {
    try {
      const r = await fetch("/api/growth");
      const j = await r.json();
      if (r.ok) setRecords(j.records || []);
    } catch {}
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/growth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "오류");
      setF({ ...f, height: "", weight: "", memo: "" });
      load();
    } catch (e) { setErr(String(e.message)); } finally { setBusy(false); }
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10 }}>
        <div><label style={label}>선수</label><input style={input} value={f.player} onChange={(e) => setF({ ...f, player: e.target.value })} /></div>
        <div><label style={label}>날짜</label><input type="date" style={input} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></div>
        <div><label style={label}>키(cm)</label><input style={input} value={f.height} onChange={(e) => setF({ ...f, height: e.target.value })} /></div>
        <div><label style={label}>체중(kg)</label><input style={input} value={f.weight} onChange={(e) => setF({ ...f, weight: e.target.value })} /></div>
      </div>
      <label style={label}>메모</label>
      <input style={input} value={f.memo} onChange={(e) => setF({ ...f, memo: e.target.value })} placeholder="예: 이번 달 첫 골! 컨디션 좋음" />
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <button className="btn btn-primary" onClick={add} disabled={busy} style={{ width: "100%" }}>{busy ? "저장 중…" : "기록 추가"}</button>

      <div style={{ marginTop: 16 }}>
        {records.length === 0 ? (
          <p style={{ color: "var(--color-text-tertiary)", textAlign: "center" }}>아직 기록이 없습니다. 첫 기록을 남겨보세요!</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ color: ACCENT, textAlign: "left" }}><th style={{ padding: 8 }}>날짜</th><th>키</th><th>체중</th><th>메모</th></tr></thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}>
                  <td style={{ padding: 8 }}>{r.date}</td>
                  <td>{r.height ? `${r.height}cm` : "-"}</td>
                  <td>{r.weight ? `${r.weight}kg` : "-"}</td>
                  <td>{r.memo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
