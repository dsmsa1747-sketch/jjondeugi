export const metadata = {
  title: "개인정보처리방침 | 사커맘",
};

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>개인정보처리방침</h1>
      <p style={{ color: "#6b7280", marginBottom: 32 }}>최종 수정일: 2024년 1월 1일</p>

      <div style={{ lineHeight: 1.8, color: "#374151" }}>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제1조 (개인정보의 처리 목적)
          </h2>
          <p>[사업자명] (이하 "회사")은 다음 목적을 위해 개인정보를 처리합니다.</p>
          <ul>
            <li>서비스 회원 가입·관리 및 본인 확인</li>
            <li>유소년 축구 영상 분석 서비스 제공</li>
            <li>결제 처리 및 환불 처리</li>
            <li>서비스 이용 기록 관리</li>
            <li>민원 처리 및 고객 지원</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제2조 (처리하는 개인정보의 항목)
          </h2>
          <p><b>필수 수집 항목:</b></p>
          <ul>
            <li>이름, 이메일 주소, 프로필 사진 (Google/카카오/네이버 OAuth 로그인 시 제공)</li>
            <li>결제 정보: 주문 번호, 결제 금액, 결제 수단 (토스페이먼츠를 통해 처리)</li>
            <li>분석 요청 기록: 업로드한 영상 파일, 유튜브 링크</li>
          </ul>
          <p><b>미성년자(유소년) 관련 특이사항:</b></p>
          <p style={{ background: "#fffbeb", padding: "12px 16px", borderRadius: 8, borderLeft: "4px solid #fcd34d" }}>
            본 서비스는 유소년 축구 영상을 분석합니다. 영상에는 미성년자의 얼굴, 신체, 행동 정보가 포함될 수 있습니다.
            영상을 업로드하는 회원(보호자 또는 지도자)은 영상에 포함된 미성년자 본인 또는 법정대리인(보호자)의 동의를
            받은 후 업로드해야 하며, 이에 대한 법적 책임은 업로드한 회원에게 있습니다.
            회사는 업로드된 영상을 분석 서비스 제공 목적 외로 사용하지 않습니다.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제3조 (개인정보의 처리 및 보유 기간)
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={{ padding: "10px 12px", border: "1px solid #e5e7eb", textAlign: "left" }}>항목</th>
                <th style={{ padding: "10px 12px", border: "1px solid #e5e7eb", textAlign: "left" }}>보유 기간</th>
                <th style={{ padding: "10px 12px", border: "1px solid #e5e7eb", textAlign: "left" }}>근거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>회원 정보 (이름, 이메일)</td>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>탈퇴 후 30일</td>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>회원 동의</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>분석용 영상 파일</td>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>분석 완료 후 90일</td>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>서비스 목적 및 회원 동의</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>분석 결과 데이터</td>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>1년</td>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>회원 동의</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>결제 기록</td>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>5년</td>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>전자상거래법</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제4조 (개인정보의 제3자 제공 및 위탁)
          </h2>
          <p>회사는 개인정보를 원칙적으로 외부에 제공하지 않습니다. 단, 서비스 제공을 위해 아래와 같이 처리를 위탁합니다.</p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={{ padding: "10px 12px", border: "1px solid #e5e7eb", textAlign: "left" }}>수탁업체</th>
                <th style={{ padding: "10px 12px", border: "1px solid #e5e7eb", textAlign: "left" }}>위탁 업무</th>
                <th style={{ padding: "10px 12px", border: "1px solid #e5e7eb", textAlign: "left" }}>보유 기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>Google Cloud (Google LLC)</td>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>영상 저장(GCS), DB(Firestore), AI 분석(Gemini), 서버 운영(Cloud Run)</td>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>위탁 계약 기간</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>토스페이먼츠 (주)</td>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>결제 처리 및 정산</td>
                <td style={{ padding: "10px 12px", border: "1px solid #e5e7eb" }}>5년 (전자상거래법)</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>
            ※ Google Cloud의 개인정보 처리 및 보안 정책은{" "}
            <a href="https://cloud.google.com/security/privacy" target="_blank" rel="noopener noreferrer">Google Cloud 개인정보 보호</a>를
            참조하세요.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제5조 (미성년자 보호)
          </h2>
          <ul>
            <li>만 14세 미만 아동은 법정대리인(부모 등)의 동의 없이 본 서비스에 가입할 수 없습니다.</li>
            <li>영상에 미성년자가 등장하는 경우, 업로드자(회원)는 해당 미성년자의 법정대리인으로부터 영상 분석 및 저장에 대한 동의를 받아야 합니다.</li>
            <li>미성년자의 개인정보(얼굴, 이름, 소속 팀 등)는 서비스 제공 목적 이외에 사용되지 않으며, 보유 기간 경과 후 즉시 파기됩니다.</li>
            <li>미성년자 관련 개인정보 삭제 요청은 아래 고객센터로 문의해 주세요.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제6조 (개인정보의 파기)
          </h2>
          <p>회사는 보유 기간이 경과하거나 처리 목적이 달성된 개인정보를 다음 방법으로 파기합니다.</p>
          <ul>
            <li><b>전자 파일:</b> 복원 불가능한 방법으로 안전하게 삭제</li>
            <li><b>영상 파일:</b> GCS에서 영구 삭제 (복구 불가)</li>
            <li><b>종이 기록물:</b> 분쇄 또는 소각 (해당 시)</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제7조 (이용자의 권리)
          </h2>
          <p>이용자는 언제든지 다음 권리를 행사할 수 있습니다.</p>
          <ul>
            <li>개인정보 열람·정정 요청</li>
            <li>개인정보 처리 정지 요청</li>
            <li>개인정보 삭제 요청 (서비스 탈퇴 포함)</li>
            <li>개인정보 이동 요청</li>
          </ul>
          <p>요청은 아래 고객센터 이메일 또는 서비스 내 마이페이지에서 할 수 있습니다.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제8조 (개인정보 보호책임자)
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb", background: "#f9fafb", width: "30%" }}>사업자명</td>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>[사업자명]</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb", background: "#f9fafb" }}>개인정보 보호책임자</td>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>[담당자명]</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb", background: "#f9fafb" }}>이메일</td>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>[contact@yourdomain.com]</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb", background: "#f9fafb" }}>주소</td>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>[사업자 주소]</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1a1a2e", borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            제9조 (개인정보 처리방침 변경)
          </h2>
          <p>이 개인정보처리방침은 법령·정책·서비스 변경에 따라 개정될 수 있습니다. 개정 시 공지사항을 통해 7일 전 공지합니다.</p>
        </section>

      </div>
    </div>
  );
}
