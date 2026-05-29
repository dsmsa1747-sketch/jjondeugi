export const metadata = {
  title: "이용약관 | 사커맘",
};

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>이용약관</h1>
      <p style={{ color: "#6b7280", marginBottom: 32 }}>최종 수정일: 2024년 1월 1일</p>

      <div style={{ lineHeight: 1.8, color: "#374151" }}>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제1조 (목적)
          </h2>
          <p>
            이 약관은 [사업자명](이하 "회사")이 제공하는 사커맘 서비스(이하 "서비스")의 이용 조건 및 절차,
            회사와 이용자 간의 권리·의무·책임 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제2조 (정의)
          </h2>
          <ul>
            <li><b>"서비스"</b>란 회사가 제공하는 유소년 축구 영상 AI 분석 서비스(빠른 코칭분석, 정밀 YOLO 분석)를 말합니다.</li>
            <li><b>"회원"</b>이란 이 약관에 동의하고 서비스를 이용하는 자를 말합니다.</li>
            <li><b>"미성년자"</b>란 만 19세 미만의 자를 말합니다.</li>
            <li><b>"보호자"</b>란 미성년자의 법정대리인(부모 등)을 말합니다.</li>
            <li><b>"분석 결과"</b>란 AI가 영상을 분석하여 생성한 텍스트, 수치, 추적 영상 등을 말합니다.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제3조 (약관의 효력 및 변경)
          </h2>
          <ul>
            <li>이 약관은 서비스를 이용하는 모든 회원에게 효력이 있습니다.</li>
            <li>회사는 관련 법령의 범위 내에서 약관을 변경할 수 있으며, 변경 시 7일 전 공지합니다.</li>
            <li>회원이 변경 약관 시행 후 계속 서비스를 이용하면 변경 약관에 동의한 것으로 봅니다.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제4조 (회원 가입 및 미성년자 이용)
          </h2>
          <ul>
            <li>회원 가입은 Google, 카카오, 네이버 소셜 로그인을 통해 가능합니다.</li>
            <li>만 14세 미만 아동은 법정대리인(보호자)의 동의 없이 가입·이용할 수 없습니다.</li>
            <li>
              만 14세 이상 만 19세 미만의 미성년자가 서비스를 이용하려면 보호자의 동의가 필요합니다.
              보호자가 미성년자 회원의 서비스 이용을 허락한 경우, 미성년자의 모든 행위에 대해 보호자도 책임을 집니다.
            </li>
            <li>
              <b>영상 속 미성년자 동의:</b> 미성년자가 등장하는 영상을 업로드하는 회원은, 영상에 등장하는 모든 미성년자의
              법정대리인(보호자)으로부터 영상 분석·저장에 대한 동의를 사전에 받아야 합니다. 이에 대한 법적 책임은
              업로드하는 회원에게 있으며, 회사는 이에 대해 책임을 지지 않습니다.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제5조 (서비스 내용 및 한계)
          </h2>
          <p>회사는 다음 두 가지 분석 모드를 제공합니다.</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, marginBottom: 12 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  <th style={{ padding: "10px 12px", border: "1px solid #e5e7eb", textAlign: "left" }}>항목</th>
                  <th style={{ padding: "10px 12px", border: "1px solid #e5e7eb", textAlign: "left" }}>빠른 코칭분석</th>
                  <th style={{ padding: "10px 12px", border: "1px solid #e5e7eb", textAlign: "left" }}>정밀 YOLO 분석</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>가격</td>
                  <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>2,000원/건</td>
                  <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>5,000원~/건</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>소요시간</td>
                  <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>40초~1분</td>
                  <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>수 분 이상</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>거리/속도</td>
                  <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>미제공</td>
                  <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>상대 추정값(px 기준)*</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ background: "#fffbeb", padding: "12px 16px", borderRadius: 8, borderLeft: "4px solid #fcd34d", fontSize: 14 }}>
            * 정밀분석의 거리·속도는 경기장 보정점(실제 좌표)이 없으면 영상 픽셀 기준 상대 추정값으로만 제공됩니다.
            실제 미터(m) 또는 km/h 단위로 단정하지 않으며, 이는 서비스의 한계이지 허위 표시가 아닙니다.
          </p>
          <p>회사는 AI 분석 결과가 전문 코치의 판단을 대체한다고 보증하지 않습니다.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제6조 (요금 및 결제)
          </h2>
          <ul>
            <li>서비스 요금은 건당 결제 방식입니다. 결제는 토스페이먼츠를 통해 처리됩니다.</li>
            <li>분석이 시작된 후에는 환불이 어렵습니다. 단, 분석 실패(서버 오류 등 회사 귀책)의 경우 전액 환불합니다.</li>
            <li>환불 요청은 분석 완료 후 7일 이내에 고객센터로 문의해 주세요.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제7조 (회원의 의무)
          </h2>
          <ul>
            <li>타인의 동의 없이 제3자가 등장하는 영상을 업로드하지 않아야 합니다.</li>
            <li>저작권이 있는 방송·스트리밍 영상을 무단으로 업로드하지 않아야 합니다.</li>
            <li>미성년자 영상 업로드 시 보호자 동의를 반드시 받아야 합니다.</li>
            <li>불법적인 목적으로 서비스를 이용하지 않아야 합니다.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제8조 (책임 제한)
          </h2>
          <ul>
            <li>AI 분석 결과의 정확도는 보증하지 않으며, 결과 활용에 따른 손해에 대해 회사는 책임을 지지 않습니다.</li>
            <li>천재지변, 서버 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 회사는 책임을 지지 않습니다.</li>
            <li>회원이 타인의 개인정보(미성년자 포함)를 무단으로 업로드하여 발생한 법적 책임은 해당 회원에게 있습니다.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제9조 (분쟁 해결)
          </h2>
          <p>
            이 약관에 관한 분쟁은 대한민국 법률에 따르며, 관할 법원은 회사 소재지 관할 법원으로 합니다.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제10조 (문의처)
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb", background: "#f9fafb", width: "30%" }}>사업자명</td>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>[사업자명]</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb", background: "#f9fafb" }}>대표자</td>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>[대표자명]</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb", background: "#f9fafb" }}>사업자등록번호</td>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>[000-00-00000]</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb", background: "#f9fafb" }}>주소</td>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>[사업자 주소]</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb", background: "#f9fafb" }}>이메일</td>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>[contact@yourdomain.com]</td>
              </tr>
            </tbody>
          </table>
        </section>

      </div>
    </div>
  );
}
