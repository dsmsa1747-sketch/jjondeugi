export const metadata = {
  title: "개인정보처리방침 | 사커맘",
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

export default function PrivacyPage() {
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
        개인정보처리방침
      </h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: 8, fontSize: 14 }}>
        사커맘 서비스의 개인정보 처리에 관한 방침입니다.
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
          <strong style={{ color: "var(--color-text-primary)" }}>사업자등록번호:</strong> [000-00-00000]
        </p>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          <strong style={{ color: "var(--color-text-primary)" }}>주소:</strong> [주소]
          &emsp;|&emsp;
          <strong style={{ color: "var(--color-text-primary)" }}>이메일:</strong> [이메일]
          &emsp;|&emsp;
          <strong style={{ color: "var(--color-text-primary)" }}>연락처:</strong> [연락처]
        </p>
      </div>

      {/* 제1조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제1조 (개인정보의 처리 목적)</h2>
        <p style={pStyle}>
          [사업자명](이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하는 개인정보는 아래 목적
          이외의 용도로는 이용되지 않으며, 목적이 변경될 경우 개인정보 보호법 제18조에 따라 별도의 동의를 받는
          등 필요한 조치를 이행합니다.
        </p>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li style={liStyle}>회원 가입·관리 및 본인 확인 (서비스 이용 자격 부여)</li>
          <li style={liStyle}>유소년 축구 영상 AI 분석 서비스 제공 (빠른 코칭분석 / 정밀 YOLO 분석)</li>
          <li style={liStyle}>결제 처리, 대금 정산 및 환불 처리</li>
          <li style={liStyle}>분석 결과 저장·제공 및 서비스 품질 개선</li>
          <li style={liStyle}>공지사항 전달, 민원 처리 및 고객 지원</li>
          <li style={liStyle}>부정 이용 방지 및 법령 의무 이행</li>
        </ul>
      </section>

      {/* 제2조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제2조 (처리하는 개인정보의 항목)</h2>

        <h3 style={h3Style}>① 필수 수집 항목</h3>
        <ul style={{ paddingLeft: 20, margin: "0 0 14px" }}>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>로그인 정보:</strong> 이름, 이메일 주소, 프로필
            사진 (Google · 카카오 · 네이버 OAuth 소셜 로그인 경유 제공)
          </li>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>영상 파일:</strong> 회원이 직접 업로드한 축구
            경기 영상 (MP4 등). 영상에는 선수(미성년자 포함), 상대팀, 관중 등 제3자의 얼굴·신체·행동 정보가
            포함될 수 있습니다.
          </li>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>결제 기록:</strong> 주문 번호, 결제 금액, 결제
            수단 종류, 결제 시각 (카드번호 등 민감 결제정보는 토스페이먼츠가 직접 처리하며 회사에 저장되지
            않습니다)
          </li>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>서비스 이용 기록:</strong> 분석 요청 내역,
            분석 결과 데이터, 접속 로그 (IP, 브라우저 종류, 접속 일시)
          </li>
        </ul>

        <h3 style={h3Style}>② 자동 수집 항목</h3>
        <ul style={{ paddingLeft: 20, margin: "0 0 14px" }}>
          <li style={liStyle}>쿠키 및 세션 토큰 (서비스 인증·유지 목적)</li>
          <li style={liStyle}>서버 로그 (Google Cloud Logging 통해 보안·장애 대응 목적)</li>
        </ul>

        <div style={warningBoxStyle}>
          <p style={{ ...pStyle, marginBottom: 0, color: "var(--color-warning)", fontWeight: 600 }}>
            ⚠ 미성년자 정보 포함 영상에 관한 안내
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            본 서비스는 유소년(미성년자) 축구 영상을 분석 대상으로 합니다. 업로드되는 영상에는 만 14세 미만
            아동을 포함한 미성년자의 얼굴, 신체, 행동 정보(개인정보보호법상 개인정보)가 포함될 수 있습니다.
            영상을 업로드하는 회원은 영상에 등장하는 모든 미성년자의 <strong>법정대리인(보호자)</strong>으로부터
            영상 분석·저장에 관한 사전 동의를 받은 후 업로드해야 하며, 동의 획득에 관한 법적 책임은 업로드한
            회원에게 있습니다.
          </p>
        </div>

        <h3 style={h3Style}>③ 제3자(상대팀·관중) 정보 처리</h3>
        <p style={pStyle}>
          영상에 찍힌 상대팀 선수, 관중 등 제3자의 정보는 이용자가 업로드한 영상 내에 포함된 정보로서, 회사는
          해당 정보를 영상 분석 서비스 제공 외 목적으로 별도 저장·활용하지 않습니다. 분석 완료 후 보유 기간 경과
          시 원본 영상과 함께 파기합니다.
        </p>
      </section>

      {/* 제3조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제3조 (개인정보의 처리 및 보유 기간)</h2>
        <p style={pStyle}>
          회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시 동의받은 개인정보
          보유·이용 기간 내에서 처리합니다.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>항목</th>
                <th style={thStyle}>보유 기간</th>
                <th style={thStyle}>보유 근거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>회원 정보 (이름, 이메일)</td>
                <td style={tdStyle}>탈퇴 후 30일 (분쟁 대비 유예)</td>
                <td style={tdStyle}>회원 동의</td>
              </tr>
              <tr>
                <td style={tdStyle}>분석용 원본 영상 파일</td>
                <td style={tdStyle}>분석 완료 후 90일</td>
                <td style={tdStyle}>서비스 목적 및 회원 동의</td>
              </tr>
              <tr>
                <td style={tdStyle}>분석 결과 데이터 (텍스트·수치·추적 영상)</td>
                <td style={tdStyle}>1년 또는 회원 삭제 요청 시</td>
                <td style={tdStyle}>회원 동의</td>
              </tr>
              <tr>
                <td style={tdStyle}>결제 기록 (주문번호, 금액, 수단)</td>
                <td style={tdStyle}>5년</td>
                <td style={tdStyle}>전자상거래법 제6조</td>
              </tr>
              <tr>
                <td style={tdStyle}>소비자 불만·분쟁 처리 기록</td>
                <td style={tdStyle}>3년</td>
                <td style={tdStyle}>전자상거래법 제6조</td>
              </tr>
              <tr>
                <td style={tdStyle}>접속 로그 (IP, 접속 일시 등)</td>
                <td style={tdStyle}>3개월</td>
                <td style={tdStyle}>통신비밀보호법 제15조의2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 제4조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제4조 (개인정보의 제3자 제공 및 처리 위탁)</h2>
        <p style={pStyle}>
          회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 서비스 제공에 필요한
          업무의 일부를 외부 업체에 위탁하고 있으며, 위탁 계약 시 개인정보 보호 관련 법령 준수 및 안전성
          확보 조치를 의무화합니다.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>수탁업체</th>
                <th style={thStyle}>위탁 업무 내용</th>
                <th style={thStyle}>개인정보 보유 기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Google LLC (Google Cloud)</td>
                <td style={tdStyle}>
                  영상 저장(Cloud Storage), 데이터베이스(Firestore), AI 분석(Gemini API),
                  서버 운영(Cloud Run), 클라우드 로깅(Cloud Logging)
                </td>
                <td style={tdStyle}>위탁 계약 기간 (서비스 이용 기간 내)</td>
              </tr>
              <tr>
                <td style={tdStyle}>토스페이먼츠 (주)</td>
                <td style={tdStyle}>결제 처리, 카드 승인, 환불 정산</td>
                <td style={tdStyle}>5년 (전자상거래법)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ ...pStyle, fontSize: 13, color: "var(--color-text-tertiary)" }}>
          ※ Google Cloud의 개인정보 처리·보안 정책:{" "}
          <a
            href="https://cloud.google.com/security/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-accent)" }}
          >
            cloud.google.com/security/privacy
          </a>
        </p>
        <p style={{ ...pStyle, fontSize: 13, color: "var(--color-text-tertiary)" }}>
          ※ 토스페이먼츠 개인정보처리방침:{" "}
          <a
            href="https://tosspayments.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-accent)" }}
          >
            tosspayments.com/privacy
          </a>
        </p>
      </section>

      {/* 제5조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제5조 (만 14세 미만 아동(미성년자) 보호)</h2>
        <div style={infoBoxStyle}>
          <p style={{ ...pStyle, color: "var(--color-accent)", fontWeight: 700, marginBottom: 6 }}>
            법정대리인(보호자) 동의 필수
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            만 14세 미만 아동은 개인정보 보호법 제22조에 따라 법정대리인(부모 또는 후견인)의 동의 없이
            본 서비스에 가입하거나 개인정보를 제공할 수 없습니다. 회사는 만 14세 미만 아동의 개인정보를
            수집할 경우 법정대리인의 동의를 별도로 확인합니다.
          </p>
        </div>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li style={liStyle}>
            영상에 만 14세 미만 아동이 등장하는 경우, 업로드하는 회원(보호자 또는 지도자)은 해당 아동의
            법정대리인으로부터 영상 분석 및 클라우드 저장에 대한 서면 또는 전자적 동의를 받아야 합니다.
          </li>
          <li style={liStyle}>
            법정대리인은 아동의 개인정보에 대해 열람·정정·삭제 및 처리 정지를 요청할 수 있으며, 요청 시
            회사는 지체 없이 조치합니다.
          </li>
          <li style={liStyle}>
            아동(미성년자)의 개인정보는 서비스 제공 목적 외에 활용되지 않으며, 보유 기간 경과 후 즉시
            복원 불가능한 방법으로 파기합니다.
          </li>
          <li style={liStyle}>
            법정대리인의 동의 없이 아동 정보가 수집된 사실을 발견한 경우, 즉시 아래 개인정보 보호책임자에게
            연락 주시면 해당 정보를 삭제합니다.
          </li>
        </ul>
      </section>

      {/* 제6조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제6조 (개인정보의 파기 절차 및 방법)</h2>
        <p style={pStyle}>
          회사는 개인정보 보유 기간이 경과하거나 처리 목적이 달성되면 지체 없이 해당 개인정보를 파기합니다.
          단, 관련 법령에 따라 보존이 필요한 정보는 해당 기간 동안 별도 보관 후 파기합니다.
        </p>
        <h3 style={h3Style}>파기 방법</h3>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>영상 파일 (GCS):</strong> Google Cloud
            Storage에서 영구 삭제 API 호출. 삭제 후 복구 불가능.
          </li>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>데이터베이스 기록 (Firestore):</strong>{" "}
            해당 문서 삭제 처리. 백업 보관 기간 경과 후 완전 삭제.
          </li>
          <li style={liStyle}>
            <strong style={{ color: "var(--color-text-primary)" }}>전자적 파일 형태 외 기록물:</strong>{" "}
            분쇄 또는 소각 (해당하는 경우).
          </li>
        </ul>
      </section>

      {/* 제7조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제7조 (정보주체의 권리·의무 및 행사 방법)</h2>
        <p style={pStyle}>
          이용자(정보주체) 및 법정대리인은 언제든지 다음 권리를 행사할 수 있습니다.
        </p>
        <ul style={{ paddingLeft: 20, margin: "0 0 14px" }}>
          <li style={liStyle}>개인정보 열람 요청</li>
          <li style={liStyle}>개인정보 정정·삭제 요청</li>
          <li style={liStyle}>개인정보 처리 정지 요청</li>
          <li style={liStyle}>개인정보 이동 요청 (제공 가능한 범위 내)</li>
        </ul>
        <p style={pStyle}>
          권리 행사는 서비스 내 마이페이지 또는 아래 개인정보 보호책임자 연락처로 서면·이메일·전화를 통해
          할 수 있으며, 회사는 접수 후 <strong style={{ color: "var(--color-text-primary)" }}>10일 이내</strong>에
          조치 결과를 알립니다.
        </p>
        <p style={pStyle}>
          개인정보 침해에 관한 신고·상담은 아래 기관에 문의하실 수 있습니다.
        </p>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li style={liStyle}>개인정보 침해신고센터: privacy.kisa.or.kr / 국번없이 118</li>
          <li style={liStyle}>개인정보 분쟁조정위원회: www.kopico.go.kr / 1833-6972</li>
          <li style={liStyle}>대검찰청 사이버수사과: www.spo.go.kr / 국번없이 1301</li>
          <li style={liStyle}>경찰청 사이버수사국: cyberbureau.police.go.kr / 국번없이 182</li>
        </ul>
      </section>

      {/* 제8조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제8조 (개인정보의 안전성 확보 조치)</h2>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li style={liStyle}>Google Cloud 인프라 기반 암호화 저장·전송 (TLS 1.2 이상, 저장 시 AES-256)</li>
          <li style={liStyle}>접근 권한 최소화: 개인정보 처리 담당자만 접근 가능</li>
          <li style={liStyle}>접근 기록 보관 및 위변조 방지 (Cloud Logging)</li>
          <li style={liStyle}>Google OAuth 기반 안전한 인증, 비밀번호 직접 저장 없음</li>
          <li style={liStyle}>정기적 보안 취약점 점검 및 업데이트</li>
        </ul>
      </section>

      {/* 제9조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제9조 (쿠키 사용)</h2>
        <p style={pStyle}>
          회사는 회원 로그인 상태 유지, 서비스 이용 편의 향상을 위해 쿠키(Cookie)를 사용합니다. 브라우저
          설정에서 쿠키 저장을 거부할 수 있으나, 이 경우 서비스 로그인 등 일부 기능 이용이 제한될 수
          있습니다.
        </p>
      </section>

      {/* 제10조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제10조 (개인정보 보호책임자 및 연락처)</h2>
        <p style={pStyle}>
          회사는 개인정보 처리에 관한 업무를 총괄하고 개인정보 관련 불만 처리 및 피해 구제를 위하여
          아래와 같이 개인정보 보호책임자를 지정합니다.
        </p>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={tdLabelStyle}>사업자명</td>
              <td style={tdStyle}>[사업자명]</td>
            </tr>
            <tr>
              <td style={tdLabelStyle}>개인정보 보호책임자 (성명)</td>
              <td style={tdStyle}>[담당자명]</td>
            </tr>
            <tr>
              <td style={tdLabelStyle}>이메일</td>
              <td style={tdStyle}>[이메일]</td>
            </tr>
            <tr>
              <td style={tdLabelStyle}>연락처</td>
              <td style={tdStyle}>[연락처]</td>
            </tr>
            <tr>
              <td style={tdLabelStyle}>주소</td>
              <td style={tdStyle}>[주소]</td>
            </tr>
          </tbody>
        </table>
        <p style={pStyle}>
          개인정보 관련 문의·불만·피해 구제 요청은 위 연락처로 접수하시면 신속하게 처리하겠습니다.
        </p>
      </section>

      {/* 제11조 */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>제11조 (개인정보처리방침의 변경)</h2>
        <p style={pStyle}>
          이 개인정보처리방침은 법령·정책·서비스 변경에 따라 개정될 수 있습니다. 내용 추가·삭제 또는 수정이
          있을 경우, 개정일로부터 최소 <strong style={{ color: "var(--color-text-primary)" }}>7일 전</strong>에
          서비스 공지사항을 통해 고지합니다. 단, 이용자 권리에 중대한 변경이 있는 경우에는 30일 전에
          고지합니다.
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
