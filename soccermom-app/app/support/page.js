"use client";

import { useState } from "react";
import Link from "next/link";

const FAQ_ITEMS = [
  {
    q: "분석에 얼마나 걸리나요?",
    a: "빠른 코칭분석(Gemini)은 40초~1분, 정밀 YOLO 분석은 영상 길이와 GPU 상태에 따라 수 분이 소요됩니다. 분석이 완료되면 앱·웹 푸시로 알림을 보내드립니다.",
  },
  {
    q: "유튜브 영상이 분석 안 돼요.",
    a: "현재 유튜브 URL 직접 분석은 지원하지 않습니다. 영상을 MP4 파일로 다운로드한 뒤 업로드해 주세요. 최대 업로드 용량은 500 MB입니다.",
  },
  {
    q: "환불이 되나요?",
    a: "분석이 시작(AI 처리 진입)되기 전이라면 전액 환불이 가능합니다. 분석이 이미 시작된 경우에는 처리 비용이 발생하여 환불이 어렵습니다. 문제가 있을 경우 아래 1:1 문의로 접수해 주시면 검토 후 안내드립니다.",
  },
  {
    q: "정밀분석과 빠른분석의 차이는 무엇인가요?",
    a: "빠른 코칭분석(2,000원)은 Gemini AI가 영상을 보고 강점·개선점·드릴·하이라이트를 텍스트로 요약합니다. 정밀 YOLO 분석(5,000원~)은 GPU 서버에서 선수를 프레임별로 추적하여 속도·거리(상대 추정값)·볼 점유율·추적 영상을 생성합니다.",
  },
  {
    q: "미성년 자녀 영상을 올려도 되나요?",
    a: "보호자(학부모·코치)가 직접 업로드하는 경우에 한해 허용됩니다. 회원가입 시 이용약관에서 미성년자 개인정보 처리에 대한 보호자 동의가 포함되어 있으니 반드시 확인해 주세요. 타인의 자녀 영상은 해당 보호자의 동의 없이 업로드할 수 없습니다.",
  },
  {
    q: "결제 수단은 무엇이 있나요?",
    a: "토스페이먼츠를 통해 신용카드·체크카드·간편결제(토스·카카오페이·네이버페이 등)를 지원합니다. 결제 내역은 마이페이지에서 확인하실 수 있습니다.",
  },
  {
    q: "등번호 인식이 틀려요.",
    a: "AI 자동 등번호 인식은 영상 화질·카메라 각도에 따라 오류가 발생할 수 있습니다. 분석 결과 화면에서 선수를 직접 클릭한 후 번호를 직접 입력해 수정할 수 있습니다. 이 방식이 가장 정확합니다.",
  },
  {
    q: "분석 결과가 너무 일반적이에요.",
    a: "빠른 코칭분석은 영상 전체 맥락을 AI가 해석하므로 포지션·상황에 따라 일반적인 피드백이 나올 수 있습니다. 정밀 YOLO 분석을 사용하면 수치 기반 개인별 데이터를 제공합니다. 또한 분석 요청 시 '포지션 / 집중 분석 항목'을 메모란에 입력하시면 더 맞춤화된 결과를 받을 수 있습니다.",
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [form, setForm] = useState({ email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function toggleFaq(i) {
    setOpenIndex(openIndex === i ? null : i);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.subject || !form.message) {
      setError("이메일, 제목, 내용을 모두 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "오류가 발생했습니다. 다시 시도해 주세요.");
      } else {
        setSubmitted(true);
        setForm({ email: "", subject: "", message: "" });
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 60px" }}>
      {/* 페이지 헤더 */}
      <div style={{ marginBottom: 40 }}>
        <span
          style={{
            display: "inline-block",
            background: "var(--color-accent-bg)",
            color: "var(--color-accent)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            padding: "4px 12px",
            borderRadius: 999,
            marginBottom: 12,
            border: "1px solid rgba(197,255,48,0.2)",
          }}
        >
          SUPPORT
        </span>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--color-text-primary)", margin: "0 0 8px" }}>
          고객지원
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 15, margin: 0 }}>
          자주 묻는 질문을 먼저 확인해 보세요. 해결되지 않으면 1:1 문의를 남겨 주세요.
        </p>
      </div>

      {/* FAQ 아코디언 */}
      <section style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "var(--color-accent)" }}>?</span> 자주 묻는 질문 (FAQ)
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: 0,
                overflow: "hidden",
                border: openIndex === i
                  ? "1px solid rgba(197,255,48,0.3)"
                  : "1px solid var(--color-border)",
                transition: "border-color 0.2s",
              }}
            >
              <button
                onClick={() => toggleFaq(i)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: openIndex === i ? "var(--color-accent)" : "var(--color-text-primary)",
                    flex: 1,
                    transition: "color 0.2s",
                  }}
                >
                  {item.q}
                </span>
                <span
                  style={{
                    color: "var(--color-accent)",
                    fontSize: 18,
                    fontWeight: 300,
                    flexShrink: 0,
                    transition: "transform 0.25s",
                    transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                    display: "inline-block",
                  }}
                >
                  +
                </span>
              </button>

              {openIndex === i && (
                <div
                  style={{
                    padding: "0 20px 18px",
                    color: "var(--color-text-secondary)",
                    fontSize: 14,
                    lineHeight: 1.75,
                    borderTop: "1px solid var(--color-border)",
                    paddingTop: 14,
                  }}
                >
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 1:1 문의 폼 */}
      <section>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "var(--color-accent)" }}>✉</span> 1:1 문의
        </h2>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 13, marginBottom: 20 }}>
          영업일 기준 1~2일 내에 이메일로 답변드립니다.
        </p>

        <div className="card" style={{ padding: 28 }}>
          {submitted ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "var(--color-accent-bg)",
                  border: "2px solid var(--color-accent)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  margin: "0 auto 16px",
                }}
              >
                ✓
              </div>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-accent)",
                  margin: "0 0 8px",
                }}
              >
                접수되었습니다
              </p>
              <p style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: "0 0 24px" }}>
                영업일 1~2일 내에 입력하신 이메일로 답변드리겠습니다.
              </p>
              <button
                className="btn"
                onClick={() => setSubmitted(false)}
                style={{ fontSize: 14 }}
              >
                추가 문의하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                    marginBottom: 6,
                  }}
                >
                  이메일 *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="답변받을 이메일 주소"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                    marginBottom: 6,
                  }}
                >
                  제목 *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="문의 제목을 입력해 주세요"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                    marginBottom: 6,
                  }}
                >
                  내용 *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="문의 내용을 자세히 입력해 주세요. (오류 발생 시 화면 캡처나 오류 메시지를 함께 알려주시면 빠른 처리에 도움이 됩니다)"
                  required
                  rows={6}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                />
              </div>

              {error && (
                <div
                  style={{
                    background: "var(--color-danger-bg)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    color: "var(--color-danger)",
                    fontSize: 14,
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ marginTop: 4, opacity: submitting ? 0.6 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
              >
                {submitting ? "접수 중..." : "문의 접수하기"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 하단 홈 링크 */}
      <div style={{ marginTop: 40, textAlign: "center" }}>
        <Link
          href="/"
          style={{
            color: "var(--color-text-secondary)",
            textDecoration: "none",
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← 홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "var(--color-bg-dark)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  padding: "10px 14px",
  color: "var(--color-text-primary)",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};
