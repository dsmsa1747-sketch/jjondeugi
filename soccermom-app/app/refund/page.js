export const metadata = {
  title: "환불·취소 정책 | 사커맘",
};

const sectionStyle = {
  marginBottom: 40,
};

const h2Style = {
  fontSize: 18,
  fontWeight: 700,
  color: "var(--color-accent)",
  borderBottom: "1px solid var(--color-border)",
  paddingBottom: 10,
  marginBottom: 16,
};

const h3Style = {
  fontSize: 15,
  fontWeight: 600,
  color: "var(--color-text-primary)",
  marginBottom: 8,
  marginTop: 16,
};

const pStyle = {
  color: "var(--color-text-secondary)",
  lineHeight: 1.85,
  marginBottom: 10,
  fontSize: 14,
};

const liStyle = {
  color: "var(--color-text-secondary)",
  lineHeight: 1.85,
  marginBottom: 6,
  fontSize: 14,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
  marginBottom: 12,
};

const thStyle = {
  padding: "10px 12px",
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-section)",
  color: "var(--color-text-primary)",
  textAlign: "left",
  fontWeight: 600,
};

const tdStyle = {
  padding: "10px 12px",
  border: "1px solid var(--color-border)",
  color: "var(--color-text-secondary)",
  verticalAlign: "top",
};

const tdLabelStyle = {
  ...tdStyle,
  background: "var(--color-bg-section)",
  color: "var(--color-text-primary)",
  fontWeight: 600,
  width: "35%",
};

const warningBoxStyle = {
  background: "rgba(245, 158, 11, 0.08)",
  border: "1px solid rgba(245, 158, 11, 0.35)",
  borderLeft: "4px solid var(--color-warning)",
  borderRadius: 8,
  padding: "14px 18px",
  marginBottom: 16,
};

const infoBoxStyle = {
  background: "var(--color-accent-bg)",
  border: "1px solid rgba(197, 255, 48, 0.2)",
  borderLeft: "4px solid var(--color-accent)",
  borderRadius: 8,
  padding: "14px 18px",
  marginBottom: 16,
};

const successBoxStyle = {
  background: "rgba(16, 185, 129, 0.07)",
  border: "1px solid rgba(16, 185, 129, 0.3)",
  borderLeft: "4px solid var(--color-success)",
  borderRadius: 8,
  padding: "14px 18px",
  marginBottom: 16,
};

const dangerBoxStyle = {
  background: "rgba(239, 68, 68, 0.07)",
  border: "1px solid rgba(239, 68, 68, 0.3)",
  borderLeft: "4px solid var(--color-danger)",
  borderRadius: 8,
  padding: "14px 18px",
  marginBottom: 16,
};

export default function RefundPage() {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "48px 24px 80px",
        color: "var(--color-text-primary)",
      }}
    >
      {/* 페이지 헤더 */}
      <h1
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: "var(--color-text-primary)",
          marginBottom: 6,
        }}
      >
        환불·취소 정책
      </h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: 8, fontSize: 14 }}>
        사커맘 유료 서비스(빠른 코칭분석·정밀 YOLO 분석)의 환불 및 취소에 관한 정책입니다.
      </p>
      <p style={{ color: "var(--color-text-tertiary)", marginBottom: 40, fontSize: 13 }}>
        시행일: 2026년 5월 30일 &nbsp;|&nbsp; 최종 개정일: 2026년 5월 30일
      </p>

      {/* 사업자 정보 */}
      <div className="card" style={{ marginBottom: 40, padding: "20px 24px" }}>
        <p style={{ ...pStyle, marginBottom: 4 }}>
          <strong style={{ color: "var(--color-text-primary)" }}>사업자명:</strong> [사업자명]
          &emsp;|&emsp;
          <strong style={{ color: "var(--color-text-primary)" }}>대표자:</strong> [대표자]
          &emsp;|&emsp;
          <strong style={{ color: "var(--color-text-primary)" }}>사업자등록번호:</strong> [사업자등록번호]
        </p>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          <strong style={{ color: "var(--color-text-primary)" }}>주소:</strong> [주소]
          &emsp;|&emsp;
          <strong style={{ color: "var(--color-text-primary)" }}>이메일:</strong> [이메일]
        </p>
      </div>

      {/* 제1조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제1조 (적용 범위)</h2>
        <p style={pStyle}>
          이 환불·취소 정책은 사커맘(이하 "서비스")의 유료 서비스인 빠른 코칭분석(2,000원/건) 및 정밀 YOLO
          분석(5,000원~/건)에 적용됩니다. 서비스 이용에 관한 일반적인 사항은
          <a href="/terms" style={{ color: "var(--color-accent)", textDecoration: "none", margin: "0 4px" }}>
            이용약관
          </a>을 함께 참고하시기 바랍니다.
        </p>
        <p style={pStyle}>
          결제는 토스페이먼츠를 통해 처리되며, 환불 금액은 결제 수단으로 반환됩니다. 카드 결제의 경우 카드사
          정책에 따라 실제 환급까지 영업일 기준 3~7일이 소요될 수 있습니다.
        </p>
      </section>

      {/* 제2조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제2조 (청약철회 — 전자상거래법 안내)</h2>
        <div style={infoBoxStyle}>
          <p style={{ ...pStyle, color: "var(--color-accent)", fontWeight: 700, marginBottom: 6 }}>
            전자상거래 등에서의 소비자보호에 관한 법률 제17조 안내
          </p>
          <p style={{ ...pStyle, marginBottom: 4 }}>
            소비자는 원칙적으로 결제일로부터 <strong>7일 이내</strong>에 청약철회를 할 수 있습니다.
            다만, 다음 각 호의 경우에는 동법 제17조 제2항에 따라 청약철회가 제한될 수 있습니다.
          </p>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ ...liStyle, color: "var(--color-text-secondary)" }}>
              소비자의 요청에 따라 제공이 개시된 디지털 콘텐츠(분석 서비스)로서, 콘텐츠 제공이 시작된 경우
              (단, 소비자가 청약철회권을 행사하지 않겠다는 사전 동의가 있어야 함)
            </li>
            <li style={{ ...liStyle, color: "var(--color-text-secondary)" }}>
              분석이 완료되어 결과물(텍스트·수치·추적 영상 등)이 이용자에게 제공된 경우
            </li>
          </ul>
        </div>
        <p style={pStyle}>
          회사는 결제 시 또는 분석 시작 전에 위 청약철회 제한 내용을 이용자에게 고지하며, 이용자의 명시적
          동의를 받습니다. 해당 고지 및 동의 절차를 거치지 않은 경우에는 청약철회 제한이 적용되지 않습니다.
        </p>
      </section>

      {/* 제3조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제3조 (분석 상태별 환불 기준)</h2>
        <p style={pStyle}>
          디지털 분석 서비스의 특성을 고려하여 아래 기준에 따라 환불을 처리합니다.
        </p>

        <div style={{ overflowX: "auto", marginBottom: 16 }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>분석 상태</th>
                <th style={thStyle}>환불 가능 여부</th>
                <th style={thStyle}>비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>결제 완료, 분석 미시작 (대기 중)</td>
                <td style={{ ...tdStyle, color: "var(--color-success)", fontWeight: 600 }}>전액 환불 가능</td>
                <td style={tdStyle}>결제 취소 요청 즉시 처리</td>
              </tr>
              <tr>
                <td style={tdStyle}>분석 진행 중 (영상 업로드·AI 처리 시작)</td>
                <td style={{ ...tdStyle, color: "var(--color-warning)", fontWeight: 600 }}>원칙적 환불 제한</td>
                <td style={tdStyle}>디지털 콘텐츠 제공 시작으로 환불 제한 (소비자 사전 동의 조건)</td>
              </tr>
              <tr>
                <td style={tdStyle}>분석 완료, 결과 제공됨</td>
                <td style={{ ...tdStyle, color: "var(--color-danger)", fontWeight: 600 }}>환불 불가</td>
                <td style={tdStyle}>콘텐츠 제공 완료 후 이용자 변심에 의한 환불 불가</td>
              </tr>
              <tr>
                <td style={tdStyle}>분석 실패 (서버 오류 등 회사 귀책)</td>
                <td style={{ ...tdStyle, color: "var(--color-success)", fontWeight: 600 }}>전액 환불 또는 재분석</td>
                <td style={tdStyle}>고객센터 확인 후 영업일 기준 3일 이내 처리</td>
              </tr>
              <tr>
                <td style={tdStyle}>분석 결과 오류 (AI 품질 불량 — 회사 귀책)</td>
                <td style={{ ...tdStyle, color: "var(--color-success)", fontWeight: 600 }}>전액 환불 또는 재분석</td>
                <td style={tdStyle}>결과 제공일로부터 7일 이내 신청 시 처리</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={warningBoxStyle}>
          <p style={{ ...pStyle, color: "var(--color-warning)", fontWeight: 600, marginBottom: 6 }}>
            ⚠ AI 분석 결과의 정확도 관련 안내
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            AI 분석 결과는 참고용 추정값이며, 분석 자체가 정상 완료된 경우 결과의 정확도(측정 오차, 선수
            인식 정밀도 등)를 이유로 한 환불은 원칙적으로 처리되지 않습니다. 정밀분석의 거리·속도는
            경기장 보정점이 없으면 픽셀 기준 상대 추정값으로 제공된다는 점이 사전에 고지되어 있습니다.
            다만, 분석 결과가 전혀 생성되지 않거나 명백히 무의미한 경우(예: 완전히 빈 결과 출력)는
            회사 귀책 환불 사유에 해당합니다.
          </p>
        </div>
      </section>

      {/* 제4조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제4조 (결제 후 미사용 환불 기준)</h2>

        <h3 style={h3Style}>분석 미시작(미사용) 상태에서의 환불</h3>
        <ul style={{ paddingLeft: 20, margin: "0 0 16px" }}>
          <li style={liStyle}>
            결제 완료 후 영상을 업로드하지 않았거나 분석 요청을 시작하지 않은 경우,
            <strong style={{ color: "var(--color-text-primary)" }}> 결제일로부터 7일 이내</strong>에 고객센터로
            환불을 요청하면 전액 환불됩니다.
          </li>
          <li style={liStyle}>
            결제일로부터 7일을 초과하고 분석을 시작하지 않은 경우, 서비스 이용 의사가 없음을 확인 후 환불
            여부를 개별 검토합니다 (고객센터 문의 필수).
          </li>
          <li style={liStyle}>
            크레딧·포인트 형태로 선불 결제한 경우의 미사용 잔액 환불 기준은 별도 공지에 따릅니다.
          </li>
        </ul>

        <div style={successBoxStyle}>
          <p style={{ ...pStyle, color: "var(--color-success)", fontWeight: 600, marginBottom: 6 }}>
            환불 신청 방법
          </p>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ ...liStyle, color: "var(--color-text-secondary)" }}>
              서비스 내 마이페이지 &gt; 결제 내역 &gt; 환불 요청
            </li>
            <li style={{ ...liStyle, color: "var(--color-text-secondary)" }}>
              고객센터 이메일: [이메일] (주문번호·결제일·환불 사유 필수 기재)
            </li>
            <li style={{ ...liStyle, color: "var(--color-text-secondary)" }}>
              처리 기간: 접수 후 영업일 기준 3~5일 이내 (카드사 환불은 추가 소요 가능)
            </li>
          </ul>
        </div>
      </section>

      {/* 제5조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제5조 (분석 실패·오류 시 환불 및 재분석)</h2>

        <h3 style={h3Style}>① 회사 귀책 사유에 해당하는 경우</h3>
        <ul style={{ paddingLeft: 20, margin: "0 0 16px" }}>
          <li style={liStyle}>서버 장애, Cloud Run 작업자 오류, GPU 처리 실패 등 회사 측 기술 문제로 분석이 완료되지 않은 경우</li>
          <li style={liStyle}>분석 결과가 생성되지 않았거나 결과 파일이 손상된 경우</li>
          <li style={liStyle}>정상 영상 파일을 업로드하였음에도 분석이 반복적으로 실패한 경우</li>
        </ul>
        <p style={pStyle}>
          위 경우 회사는 이용자의 선택에 따라 <strong style={{ color: "var(--color-text-primary)" }}>전액 환불</strong> 또는
          <strong style={{ color: "var(--color-text-primary)" }}> 재분석(동등 서비스 무상 제공)</strong>을 처리합니다.
          환불 요청은 실패 확인 후 7일 이내에 접수해 주세요.
        </p>

        <h3 style={h3Style}>② 이용자 귀책 사유에 해당하는 경우 (환불 불가)</h3>
        <div style={dangerBoxStyle}>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ ...liStyle, color: "var(--color-text-secondary)" }}>
              영상 파일이 손상되었거나 지원하지 않는 형식(코덱)으로 업로드한 경우
            </li>
            <li style={{ ...liStyle, color: "var(--color-text-secondary)" }}>
              영상 해상도·화질이 너무 낮아 AI 분석이 불가능한 경우 (업로드 전 최소 요구사항 안내 제공)
            </li>
            <li style={{ ...liStyle, color: "var(--color-text-secondary)" }}>
              축구 영상이 아닌 다른 콘텐츠를 업로드한 경우
            </li>
            <li style={{ ...liStyle, color: "var(--color-text-secondary)" }}>
              이용자가 분석 도중 임의로 작업을 취소한 경우
            </li>
          </ul>
        </div>
        <p style={pStyle}>
          업로드 전에 지원 형식 및 최소 품질 기준을 서비스 화면에서 반드시 확인해 주시기 바랍니다.
        </p>
      </section>

      {/* 제6조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제6조 (환불 처리 절차 및 기간)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>단계</th>
                <th style={thStyle}>내용</th>
                <th style={thStyle}>소요 기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>1. 환불 신청</td>
                <td style={tdStyle}>마이페이지 또는 고객센터 이메일로 신청 (주문번호·환불 사유 포함)</td>
                <td style={tdStyle}>즉시</td>
              </tr>
              <tr>
                <td style={tdStyle}>2. 사실 확인</td>
                <td style={tdStyle}>회사 담당자가 분석 상태·사유를 확인</td>
                <td style={tdStyle}>영업일 1~2일</td>
              </tr>
              <tr>
                <td style={tdStyle}>3. 환불 결정 통보</td>
                <td style={tdStyle}>이메일로 환불 가부 및 금액 안내</td>
                <td style={tdStyle}>영업일 1~3일</td>
              </tr>
              <tr>
                <td style={tdStyle}>4. 토스페이먼츠 환불 처리</td>
                <td style={tdStyle}>결제 취소 또는 환불 요청 처리</td>
                <td style={tdStyle}>영업일 1~2일</td>
              </tr>
              <tr>
                <td style={tdStyle}>5. 카드사 환급</td>
                <td style={tdStyle}>카드사 정책에 따른 실제 환급 (체크카드·계좌이체 등 수단별 상이)</td>
                <td style={tdStyle}>영업일 3~7일</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ ...pStyle, fontSize: 13, color: "var(--color-text-tertiary)" }}>
          ※ 환불 처리 총 소요 기간은 접수 후 최대 영업일 기준 14일 이내를 원칙으로 합니다.
          불가피한 사정으로 지연될 경우 개별 안내드립니다.
        </p>
      </section>

      {/* 제7조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제7조 (소비자 분쟁 해결 및 관할)</h2>
        <p style={pStyle}>
          환불·분쟁과 관련하여 회사와 이용자 간에 합의가 이루어지지 않을 경우, 다음 기관에 도움을 요청할 수
          있습니다.
        </p>
        <ul style={{ paddingLeft: 20, margin: "0 0 16px" }}>
          <li style={liStyle}>
            한국소비자원 소비자상담센터: 1372 (www.kca.go.kr)
          </li>
          <li style={liStyle}>
            전자거래분쟁조정위원회: 1661-5714 (www.ecmc.or.kr)
          </li>
          <li style={liStyle}>
            공정거래위원회 소비자상담센터: 1372 (www.ftc.go.kr)
          </li>
        </ul>
        <p style={pStyle}>
          본 정책에 관한 분쟁은 대한민국 법률을 준거법으로 하며, 소송 제기 시 회사 소재지 관할 법원을
          제1심 관할 법원으로 합니다.
        </p>
      </section>

      {/* 제8조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제8조 (고객센터 및 환불 문의)</h2>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={tdLabelStyle}>고객센터 이메일</td>
              <td style={tdStyle}>[이메일]</td>
            </tr>
            <tr>
              <td style={tdLabelStyle}>운영 시간</td>
              <td style={tdStyle}>평일 09:00 ~ 18:00 (주말·공휴일 제외)</td>
            </tr>
            <tr>
              <td style={tdLabelStyle}>환불 신청 경로</td>
              <td style={tdStyle}>마이페이지 &gt; 결제 내역 &gt; 환불 요청 또는 고객센터 이메일</td>
            </tr>
            <tr>
              <td style={tdLabelStyle}>필수 기재 사항</td>
              <td style={tdStyle}>주문번호, 결제일, 환불 사유, 연락처</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 정책 변경 안내 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제9조 (환불 정책의 변경)</h2>
        <p style={pStyle}>
          이 환불·취소 정책은 관련 법령 또는 서비스 운영 방침의 변경에 따라 개정될 수 있습니다. 개정 시
          시행일 7일 전(이용자에게 불리한 변경은 30일 전)에 서비스 공지사항을 통해 고지합니다.
        </p>
      </section>

      {/* 하단 */}
      <div
        style={{
          borderTop: "1px solid var(--color-border)",
          paddingTop: 28,
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <p style={{ color: "var(--color-text-tertiary)", fontSize: 13, margin: 0 }}>
          최종 개정일: 2026년 5월 30일
        </p>
        <a
          href="/"
          style={{
            color: "var(--color-accent)",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          ← 홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}
