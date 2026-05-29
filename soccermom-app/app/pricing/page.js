import Link from "next/link";

export const metadata = {
  title: "가격 안내 | 사커맘",
  description: "사커맘 서비스 가격 안내 — 빠른 코칭분석 2,000원, 정밀 YOLO 분석 5,000원",
};

export default function PricingPage() {
  return (
    <div>
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>가격 안내</h1>
      <p style={{ color: "#6b7280", marginBottom: 32 }}>사커맘의 모든 분석 서비스는 건당 결제 방식입니다.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 40 }}>

        {/* 빠른 코칭분석 */}
        <div style={{
          background: "white",
          border: "2px solid #3b82f6",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 4px 16px rgba(59,130,246,0.1)",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
          <h2 style={{ margin: "0 0 8px", color: "#1d4ed8", fontSize: 22 }}>빠른 코칭분석</h2>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#1d4ed8", margin: "16px 0" }}>
            2,000원 <span style={{ fontSize: 16, fontWeight: "normal", color: "#6b7280" }}>/ 건</span>
          </div>

          <table style={{ width: "100%", fontSize: 14, marginBottom: 20 }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "8px 0", color: "#6b7280" }}>엔진</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>Gemini AI</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "8px 0", color: "#6b7280" }}>소요시간</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>40초~1분</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "8px 0", color: "#6b7280" }}>입력</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>유튜브 링크</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ margin: "0 0 8px", fontSize: 15 }}>포함 내용</h3>
          <ul style={{ margin: "0 0 24px", paddingLeft: 20, lineHeight: 2, fontSize: 14 }}>
            <li>강점 분석 (3가지)</li>
            <li>개선점 제안 (3가지)</li>
            <li>훈련 드릴 추천 (2가지)</li>
            <li>경기 하이라이트 요약</li>
          </ul>

          <Link href="/analyze?mode=fast" style={{
            display: "block", textAlign: "center",
            padding: "12px 0", background: "#3b82f6",
            color: "white", borderRadius: 8,
            textDecoration: "none", fontWeight: "bold",
          }}>
            빠른 분석 시작
          </Link>
        </div>

        {/* 정밀 YOLO 분석 */}
        <div style={{
          background: "white",
          border: "2px solid #22c55e",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 4px 16px rgba(34,197,94,0.1)",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔬</div>
          <h2 style={{ margin: "0 0 8px", color: "#15803d", fontSize: 22 }}>정밀 YOLO 분석</h2>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#15803d", margin: "16px 0" }}>
            5,000원~ <span style={{ fontSize: 16, fontWeight: "normal", color: "#6b7280" }}>/ 건</span>
          </div>

          <table style={{ width: "100%", fontSize: 14, marginBottom: 20 }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "8px 0", color: "#6b7280" }}>엔진</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>Cloud Run + GPU (YOLO)</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "8px 0", color: "#6b7280" }}>소요시간</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>수 분 (영상 길이에 따라)</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "8px 0", color: "#6b7280" }}>입력</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>유튜브 링크 / mp4 업로드</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ margin: "0 0 8px", fontSize: 15 }}>포함 내용</h3>
          <ul style={{ margin: "0 0 24px", paddingLeft: 20, lineHeight: 2, fontSize: 14 }}>
            <li>선수 추적 영상 생성</li>
            <li>속도·거리 측정 <span style={{ color: "#f59e0b" }}>(추정값*)</span></li>
            <li>볼 점유율 분석</li>
            <li>팀 비교 (공식경기)</li>
            <li>개인 선수 클릭 지정 추적</li>
            <li>연습경기 모드 지원</li>
          </ul>

          <Link href="/analyze?mode=precise" style={{
            display: "block", textAlign: "center",
            padding: "12px 0", background: "#22c55e",
            color: "white", borderRadius: 8,
            textDecoration: "none", fontWeight: "bold",
          }}>
            정밀 분석 시작
          </Link>
        </div>
      </div>

      {/* 유의사항 */}
      <div style={{
        background: "#fffbeb",
        border: "1px solid #fcd34d",
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
      }}>
        <h3 style={{ margin: "0 0 12px", color: "#92400e" }}>📋 유의사항</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: "#78350f", fontSize: 14, lineHeight: 2 }}>
          <li><b>*추정값:</b> 정밀분석의 거리·속도는 경기장 보정점이 없으면 상대 추정값(px 기준)으로 표기되며, 실제 미터·km/h 수치와 다를 수 있습니다.</li>
          <li>분석 결과에는 AI 측정 오차가 포함되며, 전문 코치의 판단을 보조하는 참고 자료입니다.</li>
          <li>등번호 자동인식 정확도가 낮을 수 있으므로, 선수를 직접 클릭하고 번호를 입력하는 방식을 권장합니다.</li>
          <li>결제 완료 후 분석이 시작되며, 분석 실패 시 고객센터로 문의하세요.</li>
        </ul>
      </div>

      <div style={{ textAlign: "center" }}>
        <Link href="/analyze" style={{
          display: "inline-block",
          padding: "14px 40px",
          background: "#1a1a2e",
          color: "white",
          borderRadius: 10,
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: 16,
        }}>
          지금 분석 시작하기 →
        </Link>
      </div>
    </div>
  );
}
