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
  themeColor: "#1a1a2e",
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
      <body style={{ margin: 0, fontFamily: "'Noto Sans KR', sans-serif", background: "#f8f9fa", color: "#1a1a2e" }}>
        <SessionProvider>
          <Nav />
          <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px", minHeight: "calc(100vh - 56px)" }}>
            {children}
          </main>
          <footer style={{ textAlign: "center", padding: "20px 16px", fontSize: 13, color: "#6b7280", borderTop: "1px solid #e5e7eb", background: "white" }}>
            <p>
              &copy; 2024 사커맘 | <a href="/privacy" style={{ color: "#6b7280" }}>개인정보처리방침</a> | <a href="/terms" style={{ color: "#6b7280" }}>이용약관</a>
            </p>
            <p style={{ marginTop: 4, fontSize: 12 }}>AI 측정값으로 오차가 있을 수 있으며, 전문 코치의 판단을 대체하지 않습니다.</p>
          </footer>
        </SessionProvider>
        <SwRegister />
      </body>
    </html>
  );
}
