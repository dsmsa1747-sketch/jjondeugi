"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Nav() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      background: "var(--color-bg-card)",
      color: "white",
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 56,
      position: "sticky",
      top: 0,
      zIndex: 100,
      borderBottom: "1px solid var(--color-border)",
    }}>
      <Link href="/" style={{ color: "var(--color-accent)", textDecoration: "none", fontWeight: 900, fontSize: 20, fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>
        ⚽ 사커맘
      </Link>

      {/* 데스크탑 메뉴 */}
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <Link href="/analyze" style={{ color: "var(--color-text-secondary)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>분석 시작</Link>
        <Link href="/community" style={{ color: "var(--color-text-secondary)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>커뮤니티</Link>
        <Link href="/care" style={{ color: "var(--color-text-secondary)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>선수케어</Link>
        <Link href="/ads" style={{ color: "var(--color-text-secondary)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>광고</Link>
        <Link href="/pricing" style={{ color: "var(--color-text-secondary)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>가격 안내</Link>
        {session && (
          <Link href="/mypage" style={{ color: "var(--color-text-secondary)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>내 분석</Link>
        )}
        {status === "loading" ? null : session ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>{session.user?.name || session.user?.email}</span>
            <button
              onClick={() => signOut()}
              style={{
                background: "transparent",
                border: "1px solid #475569",
                color: "#e2e8f0",
                padding: "4px 12px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn(undefined, { callbackUrl: "/analyze" })}
            className="btn btn-primary btn-sm"
          >
            로그인
          </button>
        )}
      </div>
    </nav>
  );
}
