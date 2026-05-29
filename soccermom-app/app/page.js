import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* 히어로 섹션 */}
      <section style={{
        textAlign: "center",
        padding: "60px 20px 40px",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        borderRadius: 16,
        color: "white",
        marginBottom: 40,
      }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⚽</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 16px", lineHeight: 1.2 }}>
          사커맘
        </h1>
        <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 480, margin: "0 auto 8px", lineHeight: 1.6 }}>
          유소년 축구 영상을 AI가 분석해 드립니다
        </p>
        <p style={{ fontSize: 14, color: "#64748b", margin: "0 auto 32px" }}>
          ※ AI 측정값으로 오차가 있으며, 전문 코치의 판단을 대체하지 않습니다
        </p>

        {/* 로그인 버튼 */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
          <a href="/api/auth/signin?callbackUrl=/analyze" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", background: "white", color: "#1a1a2e",
            borderRadius: 8, textDecoration: "none", fontWeight: "bold", fontSize: 14,
          }}>
            <span>🔵</span> Google로 시작
          </a>
          <a href="/api/auth/signin?callbackUrl=/analyze" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", background: "#FEE500", color: "#3C1E1E",
            borderRadius: 8, textDecoration: "none", fontWeight: "bold", fontSize: 14,
          }}>
            <span>💛</span> 카카오로 시작
          </a>
          <a href="/api/auth/signin?callbackUrl=/analyze" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", background: "#03C75A", color: "white",
            borderRadius: 8, textDecoration: "none", fontWeight: "bold", fontSize: 14,
          }}>
            <span>🟢</span> 네이버로 시작
          </a>
        </div>

        <Link href="/analyze" style={{
          display: "inline-block",
          padding: "14px 40px",
          background: "#22c55e",
          color: "white",
          borderRadius: 10,
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: 18,
          boxShadow: "0 4px 20px rgba(34,197,94,0.4)",
        }}>
          분석 시작하기 →
        </Link>
      </section>

      {/* 두 가지 분석 모드 */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ textAlign: "center", fontSize: 24, marginBottom: 24 }}>두 가지 분석 모드</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {/* 빠른 코칭분석 */}
          <div style={{
            background: "white",
            border: "2px solid #3b82f6",
            borderRadius: 16,
            padding: 28,
            position: "relative",
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚡</div>
            <h3 style={{ fontSize: 20, margin: "0 0 8px", color: "#1d4ed8" }}>빠른 코칭분석</h3>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#1d4ed8", marginBottom: 12 }}>
              2,000원
            </div>
            <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 4px" }}>엔진: Gemini AI</p>
            <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 16px" }}>소요시간: 40초~1분</p>
            <ul style={{ color: "#374151", fontSize: 14, paddingLeft: 20, lineHeight: 2 }}>
              <li>강점 · 개선점 분석</li>
              <li>훈련 드릴 추천</li>
              <li>경기 하이라이트 요약</li>
            </ul>
            <Link href="/analyze?mode=fast" style={{
              display: "block", textAlign: "center",
              marginTop: 20, padding: "10px 0",
              background: "#3b82f6", color: "white",
              borderRadius: 8, textDecoration: "none", fontWeight: "bold",
            }}>
              빠른 분석 시작
            </Link>
          </div>

          {/* 정밀 YOLO 분석 */}
          <div style={{
            background: "white",
            border: "2px solid #22c55e",
            borderRadius: 16,
            padding: 28,
            position: "relative",
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔬</div>
            <h3 style={{ fontSize: 20, margin: "0 0 8px", color: "#15803d" }}>정밀 YOLO 분석</h3>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#15803d", marginBottom: 12 }}>
              5,000원~
            </div>
            <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 4px" }}>엔진: Cloud Run + GPU (YOLO)</p>
            <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 16px" }}>소요시간: 수 분 (영상 길이에 따라)</p>
            <ul style={{ color: "#374151", fontSize: 14, paddingLeft: 20, lineHeight: 2 }}>
              <li>선수 추적 영상 생성</li>
              <li>속도·거리 측정 <span style={{ color: "#f59e0b", fontSize: 12 }}>(추정값)</span></li>
              <li>볼 점유율 분석</li>
              <li>팀 비교 (공식경기)</li>
            </ul>
            <Link href="/analyze?mode=precise" style={{
              display: "block", textAlign: "center",
              marginTop: 20, padding: "10px 0",
              background: "#22c55e", color: "white",
              borderRadius: 8, textDecoration: "none", fontWeight: "bold",
            }}>
              정밀 분석 시작
            </Link>
          </div>
        </div>
      </section>

      {/* 정직 안내 */}
      <section style={{
        background: "#fffbeb",
        border: "1px solid #fcd34d",
        borderRadius: 12,
        padding: 20,
        marginBottom: 40,
      }}>
        <h3 style={{ margin: "0 0 12px", color: "#92400e" }}>📋 서비스 정직 안내</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: "#78350f", fontSize: 14, lineHeight: 2 }}>
          <li>모든 분석 결과에는 AI 측정 오차가 있습니다.</li>
          <li>정밀분석의 거리·속도는 경기장 보정점이 없으면 <b>상대 추정값(px 기준)</b>으로 표기됩니다 (미터/km/h로 단정하지 않습니다).</li>
          <li>등번호 자동인식은 정확하지 않을 수 있어, 클릭으로 선수를 지정하고 번호를 직접 입력하면 더 정확합니다.</li>
          <li>이 서비스는 전문 코치의 판단을 보조하는 도구이며 대체할 수 없습니다.</li>
        </ul>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>지금 바로 분석해 보세요</h2>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>유튜브 링크만 있으면 시작할 수 있습니다</p>
        <Link href="/analyze" style={{
          display: "inline-block",
          padding: "14px 48px",
          background: "#1a1a2e",
          color: "white",
          borderRadius: 10,
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: 16,
        }}>
          무료로 시작하기 →
        </Link>
      </section>
    </div>
  );
}
