import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Nav from "@/components/Nav";
import SwRegister from "@/components/SwRegister";

export const metadata = {
  title: "사커맘 — 유소년 축구 AI 분석",
  description: "유소년 축구 영상을 AI로 분석해 드립니다. 빠른 코칭 분석(Gemini)과 정밀 YOLO 분석 두 가지 모드를 제공합니다.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "사커맘",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0E0C",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="사커맘" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1a1a2e" />
      </head>
      <body style={{ margin: 0, background: "var(--color-bg-primary)", color: "var(--color-text-primary)" }}>
        <SessionProvider>
          <Nav />
          <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px", minHeight: "calc(100vh - 56px)" }}>
            {children}
          </main>
          <footer style={{ textAlign: "center", padding: "24px 16px", fontSize: 13, color: "var(--color-text-tertiary)", borderTop: "1px solid var(--color-border)", background: "var(--color-bg-card)" }}>
            <p style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <span>&copy; 2026 사커맘</span>
              <a href="/privacy" style={{ color: "var(--color-text-secondary)" }}>개인정보처리방침</a>
              <a href="/terms" style={{ color: "var(--color-text-secondary)" }}>이용약관</a>
              <a href="/refund" style={{ color: "var(--color-text-secondary)" }}>환불정책</a>
              <a href="/support" style={{ color: "var(--color-text-secondary)" }}>고객지원</a>
              <a href="/ads" style={{ color: "var(--color-text-secondary)" }}>광고문의</a>
            </p>
            <p style={{ marginTop: 4, fontSize: 12 }}>AI 측정값으로 오차가 있을 수 있으며, 전문 코치의 판단을 대체하지 않습니다.</p>
          </footer>
        </SessionProvider>
        <SwRegister />
      </body>
    </html>
  );
}
