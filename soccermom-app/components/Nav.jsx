"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Nav() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      background: "#1a1a2e",
      color: "white",
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 56,
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    }}>
      <Link href="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: 20 }}>
        ⚽ 사커맘
      </Link>

      {/* 데스크탑 메뉴 */}
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <Link href="/analyze" style={{ color: "#e2e8f0", textDecoration: "none", fontSize: 14 }}>분석 시작</Link>
        <Link href="/community" style={{ color: "#e2e8f0", textDecoration: "none", fontSize: 14 }}>커뮤니티</Link>
        <Link href="/pricing" style={{ color: "#e2e8f0", textDecoration: "none", fontSize: 14 }}>가격 안내</Link>
        {session && (
          <Link href="/mypage" style={{ color: "#e2e8f0", textDecoration: "none", fontSize: 14 }}>내 분석</Link>
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
            style={{
              background: "#22c55e",
              border: "none",
              color: "white",
              padding: "6px 16px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            로그인
          </button>
        )}
      </div>
    </nav>
  );
}
