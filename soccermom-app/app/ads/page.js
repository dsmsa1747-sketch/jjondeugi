"use client";
// 광고 신청 페이지 — AD_PRICING 가격표 + 신청 폼 (원본 광고 자동화 복원)
import { useState } from "react";
import { AD_PRICING } from "@/lib/constants";

const ACCENT = "var(--color-accent)";
const won = (n) => n.toLocaleString() + "원";

export default function AdsPage() {
  const [f, setF] = useState({ clubName: "", region: "", ageGroup: "", position: "", clubIntro: "", contact: "", adType: "D", period: 7 });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const price = AD_PRICING[f.adType]?.periods?.[f.period];

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null); setMsg(null);
    try {
      const r = await fetch("/api/ads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "신청 실패");
      setMsg(j.message || "광고 신청이 접수되었습니다.");
    } catch (e) { setErr(String(e.message)); } finally { setBusy(false); }
  };

  const input = { width: "100%", padding: "10px 12px", boxSizing: "border-box", background: "var(--color-bg-primary)", border: "2px solid var(--color-border)", borderRadius: 10, color: "#fff", marginBottom: 10 };
  const label = { fontSize: 13, fontWeight: 700, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 };

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: 28, color: "#fff", marginBottom: 4 }}>광고 신청</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: 20 }}>
        유소년 축구 클럽·교실·용품점 광고를 사커맘 학부모에게 노출하세요. 신청 후 운영자 승인 시 게재됩니다.
      </p>

      {/* 가격표 */}
      <div className="card" style={{ padding: 20, marginBottom: 20, overflowX: "auto" }}>
        <h3 style={{ color: "#fff", marginTop: 0 }}>📋 광고 요금표</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, color: "var(--color-text-secondary)" }}>
          <thead>
            <tr style={{ color: ACCENT, textAlign: "left" }}>
              <th style={{ padding: 8 }}>유형</th><th style={{ padding: 8 }}>위치</th>
              <th style={{ padding: 8 }}>7일</th><th style={{ padding: 8 }}>15일</th><th style={{ padding: 8 }}>30일</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(AD_PRICING).map(([key, v]) => (
              <tr key={key} style={{ borderTop: "1px solid var(--color-border)" }}>
                <td style={{ padding: 8, color: "#fff", fontWeight: 800 }}>{key}</td>
                <td style={{ padding: 8 }}>{v.label}</td>
                <td style={{ padding: 8 }}>{won(v.periods[7])}</td>
                <td style={{ padding: 8 }}>{won(v.periods[15])}</td>
                <td style={{ padding: 8 }}>{won(v.periods[30])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 신청 폼 */}
      <form onSubmit={submit} className="card" style={{ padding: 20 }}>
        <h3 style={{ color: "#fff", marginTop: 0 }}>광고 신청서</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
          <div><label style={label}>클럽/업체명 *</label><input style={input} value={f.clubName} onChange={(e) => setF({ ...f, clubName: e.target.value })} required /></div>
          <div><label style={label}>지역</label><input style={input} value={f.region} onChange={(e) => setF({ ...f, region: e.target.value })} placeholder="예: 서울 강남" /></div>
          <div><label style={label}>대상 연령</label><input style={input} value={f.ageGroup} onChange={(e) => setF({ ...f, ageGroup: e.target.value })} placeholder="예: U-10" /></div>
          <div><label style={label}>모집 포지션</label><input style={input} value={f.position} onChange={(e) => setF({ ...f, position: e.target.value })} placeholder="예: 골키퍼" /></div>
          <div><label style={label}>연락처 *</label><input style={input} value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} required placeholder="전화/카톡/이메일" /></div>
        </div>
        <label style={label}>소개 문구</label>
        <input style={input} value={f.clubIntro} onChange={(e) => setF({ ...f, clubIntro: e.target.value })} placeholder="한 줄 소개" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={label}>광고 유형</label>
            <select style={input} value={f.adType} onChange={(e) => setF({ ...f, adType: e.target.value })}>
              {Object.entries(AD_PRICING).map(([k, v]) => <option key={k} value={k}>{k} · {v.label}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>기간</label>
            <select style={input} value={f.period} onChange={(e) => setF({ ...f, period: Number(e.target.value) })}>
              <option value={7}>7일</option><option value={15}>15일</option><option value={30}>30일</option>
            </select>
          </div>
        </div>

        {price != null && (
          <p style={{ color: ACCENT, fontWeight: 800, fontSize: 18 }}>예상 금액: {won(price)}</p>
        )}
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        {msg && <p style={{ color: "#10B981", fontWeight: 700 }}>✅ {msg}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy} style={{ width: "100%" }}>
          {busy ? "신청 중…" : "광고 신청하기"}
        </button>
        <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 10 }}>
          ※ 신청 후 운영자 승인 시 게재되며, 결제 안내는 입력하신 연락처로 드립니다.
        </p>
      </form>
    </div>
  );
}
