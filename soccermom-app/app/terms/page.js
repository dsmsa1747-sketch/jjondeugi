export const metadata = {
  title: "이용약관 | 사커맘",
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
  width: "30%",
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

const dangerBoxStyle = {
  background: "rgba(239, 68, 68, 0.07)",
  border: "1px solid rgba(239, 68, 68, 0.3)",
  borderLeft: "4px solid var(--color-danger)",
  borderRadius: 8,
  padding: "14px 18px",
  marginBottom: 16,
};

export default function TermsPage() {
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
        이용약관
      </h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: 8, fontSize: 14 }}>
        사커맘 서비스 이용에 관한 약관입니다. 서비스 이용 전 반드시 읽어 주시기 바랍니다.
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
        <h2 style={h2Style}>제1조 (목적)</h2>
        <p style={pStyle}>
          이 약관은 [사업자명](이하 "회사")이 제공하는 사커맘(SoccerMom) 서비스(이하 "서비스")를 이용함에
          있어 회사와 이용자 간의 권리·의무 및 책임 사항, 서비스 이용 조건·절차 등 기본적인 사항을
          규정함을 목적으로 합니다.
        </p>
      </section>

      {/* 제2조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제2조 (정의)</h2>
        <p style={pStyle}>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>"서비스"</strong>란 회사가 운영하는 사커맘
            웹사이트 및 모바일 웹을 통해 제공하는 유소년 축구 영상 AI 분석 서비스(빠른 코칭분석·정밀 YOLO 분석),
            커뮤니티, 광고, 기타 부가 서비스 전체를 말합니다.
          </li>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>"회원"</strong>이란 이 약관에 동의하고 회사와
            이용 계약을 체결하여 서비스를 이용하는 자를 말합니다.
          </li>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>"미성년자"</strong>란 만 19세 미만의 자를
            말합니다.
          </li>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>"보호자(법정대리인)"</strong>란 미성년자의
            부모, 후견인 등 법령에 따른 법정대리인을 말합니다.
          </li>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>"빠른 코칭분석"</strong>이란 Google Gemini AI를
            활용하여 약 40초~1분 내에 영상으로부터 강점·개선점·훈련 드릴·하이라이트 코멘트를 생성하는 서비스를
            말합니다.
          </li>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>"정밀 YOLO 분석"</strong>이란 Cloud Run + GPU
            서버에서 YOLO 객체 추적 모델을 이용해 선수 이동 추적, 속도·거리 추정, 볼 점유율 등을 제공하는
            서비스를 말합니다.
          </li>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>"분석 결과"</strong>란 AI가 영상을 분석하여
            생성한 텍스트, 수치(추정값), 추적 영상, 코칭 코멘트 등 일체의 산출물을 말합니다.
          </li>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>"유료 서비스"</strong>란 토스페이먼츠를 통한
            결제 후 이용 가능한 서비스를 말합니다.
          </li>
        </ul>
      </section>

      {/* 제3조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제3조 (약관의 효력 및 변경)</h2>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li style={liStyle}>
            이 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생하며, 이를 동의한
            모든 회원에게 적용됩니다.
          </li>
          <li style={liStyle}>
            회사는 「약관의 규제에 관한 법률」, 「전자상거래 등에서의 소비자 보호에 관한 법률」 등 관련
            법령을 위반하지 않는 범위에서 약관을 변경할 수 있습니다.
          </li>
          <li style={liStyle}>
            약관 변경 시 시행일 7일 전(이용자에게 불리한 변경의 경우 30일 전)에 서비스 공지사항을 통해
            고지합니다.
          </li>
          <li style={liStyle}>
            회원이 변경된 약관 시행일 이후 서비스를 계속 이용하면 변경 약관에 동의한 것으로 봅니다.
          </li>
          <li style={liStyle}>
            회원이 변경 약관에 동의하지 않는 경우, 서비스 이용을 중단하고 탈퇴할 수 있습니다.
          </li>
        </ul>
      </section>

      {/* 제4조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제4조 (회원 가입 및 미성년자 이용)</h2>
        <ul style={{ paddingLeft: 20, margin: "0 0 16px" }}>
          <li style={liStyle}>
            회원 가입은 Google, 카카오, 네이버 소셜 로그인(OAuth)을 통해 가능합니다. 별도의 아이디·비밀번호를
            직접 저장하지 않습니다.
          </li>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>만 14세 미만 아동</strong>은 개인정보 보호법
            제22조에 따라 법정대리인(보호자)의 동의 없이 회원 가입 및 서비스 이용이 불가합니다.
          </li>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>만 14세 이상 만 19세 미만 미성년자</strong>가
            유료 서비스를 이용하려면 법정대리인의 동의가 필요하며, 법정대리인이 동의한 경우 미성년자의 모든
            행위에 대해 법정대리인도 연대하여 책임을 집니다.
          </li>
        </ul>
        <div style={warningBoxStyle}>
          <p style={{ ...pStyle, color: "var(--color-warning)", fontWeight: 600, marginBottom: 6 }}>
            ⚠ 영상 속 미성년자 동의 의무
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            미성년자가 등장하는 영상을 업로드하는 회원은, 영상에 등장하는 <strong>모든 미성년자의 법정대리인
            (보호자)</strong>으로부터 해당 영상의 분석·클라우드 저장에 관한 사전 동의를 반드시 받아야 합니다.
            이에 대한 법적 책임은 전적으로 업로드한 회원에게 있으며, 회사는 이로 인한 법적 분쟁에 대해
            책임을 지지 않습니다.
          </p>
        </div>
      </section>

      {/* 제5조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제5조 (서비스 내용, 한계 및 AI 분석 면책)</h2>

        <h3 style={h3Style}>① 두 가지 분석 모드</h3>
        <div style={{ overflowX: "auto", marginBottom: 16 }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>항목</th>
                <th style={thStyle}>빠른 코칭분석</th>
                <th style={thStyle}>정밀 YOLO 분석</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>엔진</td>
                <td style={tdStyle}>Google Gemini AI</td>
                <td style={tdStyle}>Cloud Run + GPU (YOLO)</td>
              </tr>
              <tr>
                <td style={tdStyle}>가격</td>
                <td style={tdStyle}>2,000원/건</td>
                <td style={tdStyle}>5,000원~/건</td>
              </tr>
              <tr>
                <td style={tdStyle}>소요시간</td>
                <td style={tdStyle}>40초 ~ 1분</td>
                <td style={tdStyle}>수 분 이상 (영상 길이·GPU 상황에 따라 상이)</td>
              </tr>
              <tr>
                <td style={tdStyle}>주요 출력</td>
                <td style={tdStyle}>강점·개선점·훈련 드릴·하이라이트 코멘트</td>
                <td style={tdStyle}>선수 추적 영상, 속도·거리 추정값, 볼 점유율</td>
              </tr>
              <tr>
                <td style={tdStyle}>거리·속도 단위</td>
                <td style={tdStyle}>미제공</td>
                <td style={tdStyle}>상대 추정값 (픽셀 기준)*</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={warningBoxStyle}>
          <p style={{ ...pStyle, color: "var(--color-warning)", fontWeight: 600, marginBottom: 6 }}>
            ⚠ AI 분석 측정값 한계 고지 (정직성 원칙)
          </p>
          <p style={{ ...pStyle, marginBottom: 4 }}>
            정밀분석의 거리·속도는 경기장 보정점(실제 좌표)이 제공되지 않으면 영상 픽셀(px) 기준
            <strong> 상대 추정값</strong>으로만 제공됩니다. 실제 미터(m) 또는 km/h 단위로 단정하지 않으며,
            모든 분석 결과에는 "AI 측정·오차 있음" 표기를 유지합니다.
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            이는 서비스의 기술적 한계이며 허위 표시가 아닙니다. 이용자는 이를 충분히 인지하고 서비스를
            이용합니다.
          </p>
        </div>

        <h3 style={h3Style}>② 커뮤니티 및 광고 서비스</h3>
        <p style={pStyle}>
          회사는 분석 서비스 외에 학부모·지도자 커뮤니티 기능 및 관련 광고 서비스를 제공할 수 있습니다.
          커뮤니티에 게시된 내용의 책임은 게시한 회원에게 있으며, 불법·부적절한 게시물은 사전 고지 없이
          삭제될 수 있습니다.
        </p>

        <h3 style={h3Style}>③ AI 결과의 전문 코치 대체 불가 명시</h3>
        <div style={infoBoxStyle}>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            본 서비스의 AI 분석 결과는 <strong>참고 자료</strong>로 제공되며, 자격을 갖춘 전문 코치의
            판단·지도를 대체하지 않습니다. 분석 결과를 바탕으로 한 훈련 계획·의학적 판단은 반드시 전문가의
            검토를 거쳐야 합니다. 회사는 AI 분석 결과의 완전성·정확성을 보증하지 않습니다.
          </p>
        </div>
      </section>

      {/* 제6조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제6조 (유료 결제 및 토스페이먼츠)</h2>
        <ul style={{ paddingLeft: 20, margin: "0 0 16px" }}>
          <li style={liStyle}>
            유료 서비스는 건당 결제 방식으로 운영됩니다. 결제는 <strong style={{ color: "var(--color-text-primary)" }}>토스페이먼츠</strong>를
            통해 처리되며, 신용카드·체크카드·간편결제 등을 이용할 수 있습니다.
          </li>
          <li style={liStyle}>
            결제 금액은 결제 시점에 표시된 금액으로 확정되며, 부가세(VAT) 포함 여부는 서비스 화면에 명시합니다.
          </li>
          <li style={liStyle}>
            카드번호 등 민감한 결제 정보는 회사 서버에 저장되지 않으며, 토스페이먼츠가 직접 처리합니다.
          </li>
          <li style={liStyle}>
            미성년자의 유료 결제는 법정대리인의 동의 또는 법정대리인 명의 결제 수단 사용을 원칙으로 합니다.
          </li>
          <li style={liStyle}>
            결제 후 분석이 시작되면 디지털 콘텐츠의 특성상 환불이 제한될 수 있습니다. 자세한 사항은
            <a href="/refund" style={{ color: "var(--color-accent)", textDecoration: "none", marginLeft: 4 }}>
              환불·취소 정책
            </a>을 참고하세요.
          </li>
        </ul>
      </section>

      {/* 제7조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제7조 (회원의 의무 및 금지 행위)</h2>
        <p style={pStyle}>회원은 다음 각 호의 행위를 해서는 안 됩니다.</p>
        <ul style={{ paddingLeft: 20, margin: "0 0 16px" }}>
          <li style={liStyle}>타인(상대팀·관중 포함)의 동의 없이 제3자가 등장하는 영상을 업로드하는 행위</li>
          <li style={liStyle}>
            만 14세 미만 아동이 등장하는 영상을 해당 아동 법정대리인의 동의 없이 업로드하는 행위
          </li>
          <li style={liStyle}>저작권이 있는 방송·스트리밍 영상을 저작권자 허락 없이 업로드하는 행위</li>
          <li style={liStyle}>서비스를 통해 취득한 분석 결과를 무단으로 제3자에게 판매하거나 배포하는 행위</li>
          <li style={liStyle}>회사의 서버·시스템에 과부하를 주거나 정상 운영을 방해하는 행위</li>
          <li style={liStyle}>타인의 계정을 도용하거나 허위 정보로 회원 가입하는 행위</li>
          <li style={liStyle}>불법적인 목적·수단으로 서비스를 이용하는 행위</li>
          <li style={liStyle}>음란·혐오·명예 훼손 등 불법·부적절한 콘텐츠를 게시하는 행위</li>
        </ul>

        <h3 style={h3Style}>저작권 및 업로드 영상 책임</h3>
        <p style={pStyle}>
          회원이 업로드하는 영상의 저작권 및 초상권 침해에 관한 모든 법적 책임은 업로드한 회원에게 있습니다.
          회사는 회원이 제공한 영상이 제3자의 권리를 침해하지 않음을 보증하지 않으며, 침해로 인한 분쟁·손해배상
          청구 등에 대한 책임을 지지 않습니다. 회사는 저작권법 위반으로 신고된 콘텐츠를 지체 없이 삭제할 수
          있습니다.
        </p>
      </section>

      {/* 제8조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제8조 (서비스 이용 제한 및 계약 해지)</h2>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li style={liStyle}>
            회사는 회원이 제7조의 금지 행위를 한 경우, 사전 통보 없이 서비스 이용을 제한하거나 회원 자격을
            박탈할 수 있습니다.
          </li>
          <li style={liStyle}>
            회원은 언제든지 서비스 내 마이페이지 또는 고객센터를 통해 탈퇴(계약 해지)를 요청할 수 있습니다.
          </li>
          <li style={liStyle}>
            탈퇴 시 개인정보는 개인정보처리방침에 따라 처리되며, 결제 기록은 전자상거래법에 따라 5년간
            보관됩니다.
          </li>
        </ul>
      </section>

      {/* 제9조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제9조 (회사의 의무 및 면책)</h2>

        <h3 style={h3Style}>① 회사의 의무</h3>
        <ul style={{ paddingLeft: 20, margin: "0 0 16px" }}>
          <li style={liStyle}>회사는 서비스를 안정적으로 제공하기 위해 최선을 다합니다.</li>
          <li style={liStyle}>
            개인정보 보호법 등 관련 법령을 준수하며 회원의 개인정보를 안전하게 관리합니다.
          </li>
          <li style={liStyle}>
            서비스 장애 발생 시 즉시 복구하거나 회원에게 고지합니다.
          </li>
        </ul>

        <h3 style={h3Style}>② 면책 사항</h3>
        <div style={dangerBoxStyle}>
          <p style={{ ...pStyle, marginBottom: 4 }}>
            회사는 다음 각 호의 경우에는 책임을 지지 않습니다.
          </p>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ ...liStyle, color: "var(--color-text-secondary)" }}>
              AI 분석 결과의 정확도·완전성으로 인해 이용자가 입은 손해 (분석 결과는 AI 추정값이며 오차 있음)
            </li>
            <li style={{ ...liStyle, color: "var(--color-text-secondary)" }}>
              천재지변, 전쟁, 정전, 인터넷 통신 장애 등 불가항력적 사유로 인한 서비스 중단
            </li>
            <li style={{ ...liStyle, color: "var(--color-text-secondary)" }}>
              회원이 타인의 개인정보(미성년자 포함)를 무단으로 업로드하여 발생한 법적 분쟁·손해
            </li>
            <li style={{ ...liStyle, color: "var(--color-text-secondary)" }}>
              회원의 귀책 사유(잘못된 영상 업로드, 서비스 오용 등)로 인한 손해
            </li>
            <li style={{ ...liStyle, color: "var(--color-text-secondary)" }}>
              제3자(소셜 로그인 제공자, 결제사 등) 서비스의 장애로 인한 손해
            </li>
          </ul>
        </div>
      </section>

      {/* 제10조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제10조 (광고 게재 및 제3자 링크)</h2>
        <p style={pStyle}>
          회사는 서비스 운영을 위해 서비스 내 광고를 게재할 수 있습니다. 회원은 서비스 이용 시 노출되는 광고에
          동의한 것으로 봅니다.
        </p>
        <p style={pStyle}>
          서비스 내 제3자 웹사이트 링크는 참고 목적으로 제공되며, 해당 외부 사이트의 내용·정책에 대해 회사는
          책임을 지지 않습니다.
        </p>
      </section>

      {/* 제11조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제11조 (준거법 및 관할 법원)</h2>
        <p style={pStyle}>
          이 약관은 <strong style={{ color: "var(--color-text-primary)" }}>대한민국 법률</strong>에 따라
          해석되고 적용됩니다.
        </p>
        <p style={pStyle}>
          서비스 이용과 관련하여 회사와 회원 간에 분쟁이 발생하면, 양 당사자가 성실히 협의하여 해결합니다.
          협의가 이루어지지 않을 경우, 민사소송법에 따른 관할 법원(회사 소재지 관할 법원)을 제1심 전속
          관할 법원으로 합니다.
        </p>
      </section>

      {/* 제12조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제12조 (문의처)</h2>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={tdLabelStyle}>사업자명</td>
              <td style={tdStyle}>[사업자명]</td>
            </tr>
            <tr>
              <td style={tdLabelStyle}>대표자</td>
              <td style={tdStyle}>[대표자]</td>
            </tr>
            <tr>
              <td style={tdLabelStyle}>사업자등록번호</td>
              <td style={tdStyle}>[사업자등록번호]</td>
            </tr>
            <tr>
              <td style={tdLabelStyle}>주소</td>
              <td style={tdStyle}>[주소]</td>
            </tr>
            <tr>
              <td style={tdLabelStyle}>이메일</td>
              <td style={tdStyle}>[이메일]</td>
            </tr>
          </tbody>
        </table>
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
