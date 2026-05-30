"use client";
// 인라인 광고 — Firestore clubAds(승인됨)에서 랜덤 노출. (원본 InlineAd 자동화 구조)
// 광고가 없으면 광고신청 유도 카드를 보여줌(빈 공간 방지).
import { useEffect, useState } from "react";
import Link from "next/link";

const ACCENT = "var(--color-accent)";

export default function InlineAd() {
  const [ad, setAd] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/ads")
      .then((r) => r.json())
      .then((j) => setAd(j.ad || null))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  // 승인된 광고 노출
  if (ad) {
    return (
      <div style={{ background: "linear-gradient(135deg,#121614,#0B0E0C)", border: `1.8px dashed ${ACCENT}`, borderRadius: 12, padding: 16, position: "relative", margin: "12px 0" }}>
        <span style={{ position: "absolute", top: 8, right: 12, fontSize: 9, color: ACCENT, fontWeight: 900 }}>AD · 스폰서</span>
        <div style={{ fontSize: 11, color: ACCENT, fontWeight: 800 }}>{ad.region} {ad.ageGroup}</div>
        <h4 style={{ margin: "4px 0", color: "#fff", fontSize: 15 }}>{ad.clubName}</h4>
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
          {ad.position ? `${ad.position} 모집 · ` : ""}{ad.clubIntro}
        </p>
        <button
          onClick={() => alert(`${ad.contact} 로 문의하세요!`)}
          className="btn btn-primary btn-sm" style={{ marginTop: 10 }}
        >
          알아보기
        </button>
      </div>
    );
  }

  // 광고 없을 때 → 광고신청 유도
  return (
    <div style={{ background: "var(--color-bg-card)", border: "1.5px dashed var(--color-border)", borderRadius: 12, padding: 16, textAlign: "center", margin: "12px 0" }}>
      <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-tertiary)" }}>
        📢 이 자리에 우리 클럽·교실 광고를 올릴 수 있어요
      </p>
      <Link href="/ads" style={{ color: ACCENT, fontSize: 13, fontWeight: 800, textDecoration: "underline" }}>
        광고 신청하기 →
      </Link>
    </div>
  );
}
