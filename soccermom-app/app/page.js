import Link from "next/link";
import InlineAd from "@/components/InlineAd";

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* 히어로 섹션 */}
      <section style={{
        textAlign: "center",
        padding: "64px 20px 48px",
        background: "linear-gradient(135deg, #121614 0%, #0B0E0C 100%)",
        borderRadius: 20,
        border: "1px solid var(--color-border)",
        marginBottom: 40,
      }}>
        <span className="badge badge-accent" style={{ marginBottom: 16 }}>SOCCERMOM AI PLATFORM</span>
        <h1 style={{ fontSize: 44, fontWeight: 900, margin: "8px 0 16px", lineHeight: 1.1, letterSpacing: "-0.03em", color: "#fff" }}>
          사커맘
        </h1>
        <p style={{ fontSize: 18, color: "var(--color-text-secondary)", maxWidth: 480, margin: "0 auto 8px", lineHeight: 1.6, fontWeight: 500 }}>
          유소년 축구 영상을 AI가 분석하고, 학부모·코치가 소통하는 커뮤니티
        </p>
        <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", margin: "0 auto 32px" }}>
          ※ AI 측정값으로 오차가 있으며, 전문 코치의 판단을 대체하지 않습니다
        </p>

        {/* 로그인 버튼 */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
          <a href="/api/auth/signin?callbackUrl=/analyze" style={loginBtn("#fff", "#1a1a2e")}>🔵 Google로 시작</a>
          <a href="/api/auth/signin?callbackUrl=/analyze" style={loginBtn("#FEE500", "#3C1E1E")}>💛 카카오로 시작</a>
          <a href="/api/auth/signin?callbackUrl=/analyze" style={loginBtn("#03C75A", "#fff")}>🟢 네이버로 시작</a>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/analyze" className="btn btn-primary btn-lg">분석 시작하기 →</Link>
          <Link href="/community" className="btn btn-outline btn-lg">커뮤니티 둘러보기</Link>
        </div>
      </section>

      {/* 두 가지 분석 모드 */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ textAlign: "center", fontSize: 26, marginBottom: 24, color: "#fff" }}>두 가지 분석 모드</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚡</div>
            <h3 style={{ fontSize: 20, margin: "0 0 8px", color: "#fff" }}>빠른 코칭분석</h3>
            <div style={{ fontSize: 28, fontWeight: 900, color: "var(--color-accent)", marginBottom: 12, fontFamily: "var(--font-data)" }}>2,000원</div>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: "0 0 4px" }}>엔진: Gemini AI</p>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: "0 0 16px" }}>소요시간: 40초~1분</p>
            <ul style={{ color: "var(--color-text-secondary)", fontSize: 14, paddingLeft: 18, lineHeight: 2 }}>
              <li>강점 · 개선점 분석</li>
              <li>훈련 드릴 추천</li>
              <li>경기 하이라이트 요약</li>
            </ul>
            <Link href="/analyze?mode=fast" className="btn btn-primary" style={{ width: "100%", marginTop: 20 }}>빠른 분석 시작</Link>
          </div>

          <div className="card" style={{ padding: 28, borderColor: "var(--color-accent)" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔬</div>
            <h3 style={{ fontSize: 20, margin: "0 0 8px", color: "#fff" }}>정밀 YOLO 분석</h3>
            <div style={{ fontSize: 28, fontWeight: 900, color: "var(--color-accent)", marginBottom: 12, fontFamily: "var(--font-data)" }}>5,000원~</div>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: "0 0 4px" }}>엔진: Cloud Run + GPU (YOLO)</p>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: "0 0 16px" }}>소요시간: 수 분</p>
            <ul style={{ color: "var(--color-text-secondary)", fontSize: 14, paddingLeft: 18, lineHeight: 2 }}>
              <li>선수 추적 영상 생성</li>
              <li>속도·거리 측정 <span style={{ color: "var(--color-warning)", fontSize: 12 }}>(추정값)</span></li>
              <li>볼 점유율 분석</li>
              <li>팀 비교 (공식경기)</li>
            </ul>
            <Link href="/analyze?mode=precise" className="btn btn-primary" style={{ width: "100%", marginTop: 20 }}>정밀 분석 시작</Link>
          </div>
        </div>
      </section>

      {/* 광고 영역 */}
      <InlineAd />

      {/* 커뮤니티 안내 */}
      <section className="card" style={{ padding: 28, marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h3 style={{ fontSize: 20, margin: "0 0 6px", color: "#fff" }}>💬 학부모 · 코치 커뮤니티</h3>
          <p style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: 0 }}>훈련 정보 · 진학 상담 · 장비 리뷰 · 팀원 모집을 카테고리별로 공유하세요.</p>
        </div>
        <Link href="/community" className="btn btn-outline">커뮤니티 가기 →</Link>
      </section>

      {/* 정직 안내 */}
      <section style={{ background: "var(--color-warning-bg)", borderLeft: "3px solid var(--color-warning)", borderRadius: "0 10px 10px 0", padding: 20, marginBottom: 40 }}>
        <h3 style={{ margin: "0 0 12px", color: "var(--color-warning)" }}>📋 서비스 정직 안내</h3>
        <ul style={{ margin: 0, paddingLeft: 18, color: "var(--color-text-secondary)", fontSize: 14, lineHeight: 2 }}>
          <li>모든 분석 결과에는 AI 측정 오차가 있습니다.</li>
          <li>정밀분석의 거리·속도는 경기장 보정점이 없으면 <b style={{ color: "#fff" }}>상대 추정값(px 기준)</b>으로 표기됩니다.</li>
          <li>등번호 자동인식은 약하니 클릭 선수지정 + 번호 직접입력을 권장합니다.</li>
          <li>이 서비스는 전문 코치의 판단을 보조하는 도구이며 대체할 수 없습니다.</li>
        </ul>
      </section>
    </div>
  );
}

function loginBtn(bg, color) {
  return {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "10px 20px", background: bg, color,
    borderRadius: 8, textDecoration: "none", fontWeight: "bold", fontSize: 14,
  };
}
