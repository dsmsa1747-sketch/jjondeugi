import Link from "next/link";

export const metadata = {
  title: "가격 안내 | 사커맘",
  description: "사커맘 서비스 가격 안내 — 빠른 코칭분석 2,000원, 정밀 YOLO 분석 5,000원",
};

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="8" cy="8" r="8" fill="rgba(197,255,48,0.18)" />
    <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DotIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
    <circle cx="7" cy="7" r="3" fill="rgba(160,165,162,0.5)" />
  </svg>
);

const CompareRow = ({ label, fast, precise }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    alignItems: "center",
    padding: "13px 0",
    borderBottom: "1px solid var(--color-border)",
    gap: 8,
  }}>
    <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", paddingRight: 8 }}>{label}</span>
    <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-primary)", textAlign: "center", fontFamily: "var(--font-data)" }}>{fast}</span>
    <span style={{ fontSize: "var(--text-sm)", color: "var(--color-accent)", textAlign: "center", fontFamily: "var(--font-data)", fontWeight: 600 }}>{precise}</span>
  </div>
);

export default function PricingPage() {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "52px 24px 88px" }}>

      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <span className="badge badge-accent" style={{ marginBottom: 18, display: "inline-flex" }}>
          건당 결제 · 구독 없음
        </span>
        <h1 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          color: "var(--color-text-primary)",
          marginBottom: 18,
          letterSpacing: "0.04em",
          lineHeight: 1.2,
        }}>
          가격 안내
        </h1>
        <p style={{
          color: "var(--color-text-secondary)",
          fontSize: "var(--text-lg)",
          maxWidth: 500,
          margin: "0 auto",
          lineHeight: "var(--leading-relaxed)",
        }}>
          필요할 때만, 원하는 만큼만.<br />
          구독 없이 분석 건당 결제합니다.
        </p>
      </div>

      {/* ── Pricing Cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 24,
        marginBottom: 40,
        alignItems: "stretch",
      }}>

        {/* 빠른 코칭분석 */}
        <div className="card" style={{
          padding: 0,
          border: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* top accent bar — subtle gray */}
          <div style={{
            height: 4,
            background: "linear-gradient(90deg, var(--color-border), rgba(160,165,162,0.4))",
            borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
          }} />

          <div style={{ padding: "32px 28px 28px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
            {/* Label */}
            <span style={{
              fontFamily: "var(--font-data)",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-text-secondary)",
              marginBottom: 10,
              display: "block",
            }}>⚡ 빠른 코칭분석</span>

            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
              color: "var(--color-text-primary)",
              marginBottom: 4,
              letterSpacing: "0.03em",
            }}>
              Gemini AI 코칭
            </h2>
            <p style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
              marginBottom: 28,
              lineHeight: 1.5,
            }}>
              40초 안에 강점·개선점·드릴 추천까지
            </p>

            {/* Price */}
            <div style={{
              display: "flex",
              alignItems: "baseline",
              gap: 6,
              marginBottom: 6,
            }}>
              <span style={{
                fontFamily: "var(--font-data)",
                fontSize: "clamp(2.2rem, 5vw, 3rem)",
                fontWeight: 900,
                color: "var(--color-text-primary)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}>2,000원</span>
              <span style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>/ 건</span>
            </div>
            <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)", marginBottom: 28 }}>
              결제 후 40초~1분 내 결과 제공
            </p>

            {/* Spec rows */}
            <div style={{
              borderTop: "1px solid var(--color-border)",
              paddingTop: 16,
              marginBottom: 24,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}>
              {[
                ["엔진", "Gemini AI"],
                ["처리 시간", "40초 ~ 1분"],
                ["입력 형식", "유튜브 링크"],
                ["GPU 추적", "미포함"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>{label}</span>
                  <span style={{
                    color: value === "미포함" ? "var(--color-text-tertiary)" : "var(--color-text-primary)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    fontFamily: "var(--font-data)",
                    textAlign: "right",
                  }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Features */}
            <div style={{ flexGrow: 1, marginBottom: 28 }}>
              <p style={{
                color: "var(--color-text-tertiary)",
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 14,
              }}>포함 내용</p>
              <ul style={{ display: "flex", flexDirection: "column", gap: 11, padding: 0, listStyle: "none" }}>
                {[
                  "강점 분석 (3가지)",
                  "개선점 제안 (3가지)",
                  "훈련 드릴 추천 (2가지)",
                  "경기 하이라이트 요약",
                  "선수케어 — 식단·훈련 플랜",
                  "커뮤니티 공유 가능",
                ].map((item) => (
                  <li key={item} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-primary)",
                    lineHeight: 1.5,
                  }}>
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/analyze?mode=fast" className="btn btn-outline" style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
            }}>
              빠른 분석 시작
            </Link>
          </div>
        </div>

        {/* 정밀 YOLO 분석 — featured */}
        <div className="card" style={{
          padding: 0,
          border: "1px solid rgba(197,255,48,0.3)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 48px rgba(197,255,48,0.1)",
          position: "relative",
        }}>
          {/* Accent top bar */}
          <div style={{
            height: 4,
            background: "linear-gradient(90deg, var(--color-accent), var(--color-accent-light))",
            borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
          }} />

          {/* 추천 badge */}
          <div style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "var(--color-accent)",
            color: "var(--color-primary-dark)",
            fontFamily: "var(--font-data)",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "4px 12px",
            borderRadius: "var(--radius-pill)",
          }}>추천</div>

          <div style={{ padding: "32px 28px 28px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
            {/* Label */}
            <span style={{
              fontFamily: "var(--font-data)",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-accent)",
              marginBottom: 10,
              display: "block",
            }}>정밀 YOLO 분석</span>

            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
              color: "var(--color-text-primary)",
              marginBottom: 4,
              letterSpacing: "0.03em",
            }}>
              GPU 딥러닝 추적
            </h2>
            <p style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
              marginBottom: 28,
              lineHeight: 1.5,
            }}>
              선수 추적 영상·속도·거리·볼 점유율까지
            </p>

            {/* Price */}
            <div style={{
              display: "flex",
              alignItems: "baseline",
              gap: 6,
              marginBottom: 6,
            }}>
              <span style={{
                fontFamily: "var(--font-data)",
                fontSize: "clamp(2.2rem, 5vw, 3rem)",
                fontWeight: 900,
                color: "var(--color-accent)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}>5,000원~</span>
              <span style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>/ 건</span>
            </div>
            <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)", marginBottom: 28 }}>
              영상 길이에 따라 수 분 소요
            </p>

            {/* Spec rows */}
            <div style={{
              borderTop: "1px solid rgba(197,255,48,0.15)",
              paddingTop: 16,
              marginBottom: 24,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}>
              {[
                ["엔진", "Cloud Run + GPU (YOLO)"],
                ["처리 시간", "수 분 (영상 길이)"],
                ["입력 형식", "유튜브 / MP4"],
                ["GPU 추적", "포함"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>{label}</span>
                  <span style={{
                    color: value === "포함" ? "var(--color-accent)" : "var(--color-text-primary)",
                    fontSize: "var(--text-sm)",
                    fontWeight: value === "포함" ? 700 : 500,
                    fontFamily: "var(--font-data)",
                    textAlign: "right",
                  }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Features */}
            <div style={{ flexGrow: 1, marginBottom: 28 }}>
              <p style={{
                color: "var(--color-text-tertiary)",
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 14,
              }}>포함 내용</p>
              <ul style={{ display: "flex", flexDirection: "column", gap: 11, padding: 0, listStyle: "none" }}>
                {[
                  { text: "선수 추적 영상 생성" },
                  { text: "속도·거리 측정", note: "상대 추정값*" },
                  { text: "볼 점유율 분석" },
                  { text: "팀 비교 (공식경기)" },
                  { text: "선수 클릭 지정 추적" },
                  { text: "연습경기 모드 지원" },
                  { text: "선수케어 — 식단·훈련 플랜" },
                  { text: "커뮤니티 공유 가능" },
                ].map((item) => (
                  <li key={item.text} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-primary)",
                    lineHeight: 1.5,
                  }}>
                    <CheckIcon />
                    <span>
                      {item.text}
                      {item.note && (
                        <span style={{
                          color: "var(--color-warning)",
                          fontSize: 11,
                          marginLeft: 5,
                          fontFamily: "var(--font-data)",
                        }}>{item.note}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/analyze?mode=precise" className="btn btn-primary" style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
            }}>
              정밀 분석 시작 →
            </Link>
          </div>
        </div>
      </div>

      {/* ── 비교표 ── */}
      <div className="card" style={{ padding: "28px 32px", marginBottom: 28 }}>
        <p style={{
          fontFamily: "var(--font-data)",
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--color-text-tertiary)",
          marginBottom: 20,
        }}>두 모드 비교</p>

        {/* Header row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          paddingBottom: 12,
          borderBottom: "1px solid rgba(197,255,48,0.2)",
          marginBottom: 0,
        }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}></span>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center", fontFamily: "var(--font-data)", fontWeight: 700 }}>⚡ 빠른</span>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center", fontFamily: "var(--font-data)", fontWeight: 700 }}>정밀</span>
        </div>

        <CompareRow label="가격" fast="2,000원" precise="5,000원~" />
        <CompareRow label="처리 속도" fast="40초~1분" precise="수 분" />
        <CompareRow label="AI 엔진" fast="Gemini" precise="YOLO + GPU" />
        <CompareRow label="강점·개선점 분석" fast="✓" precise="✓" />
        <CompareRow label="훈련 드릴 추천" fast="✓" precise="✓" />
        <CompareRow label="선수케어 식단·훈련" fast="✓" precise="✓" />
        <CompareRow label="커뮤니티 공유" fast="✓" precise="✓" />
        <CompareRow label="선수 추적 영상" fast="—" precise="✓" />
        <CompareRow label="속도·거리 측정" fast="—" precise="추정값*" />
        <CompareRow label="볼 점유율" fast="—" precise="✓" />

        <div style={{ marginTop: 4, paddingTop: 4 }}>
          <Link href="/analyze" className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>
            지금 분석 시작하기 →
          </Link>
        </div>
      </div>

      {/* ── 공통 포함 ── */}
      <div className="card" style={{
        padding: "28px 32px",
        marginBottom: 28,
      }}>
        <p style={{
          fontFamily: "var(--font-data)",
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--color-text-tertiary)",
          marginBottom: 20,
        }}>모든 플랜 공통 포함</p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "14px 28px",
        }}>
          {[
            "선수케어 — 식단 분석",
            "선수케어 — 훈련 플랜",
            "커뮤니티 피드 공유",
            "분석 기록 영구 보관",
            "모바일 최적화 결과지",
            "AI 측정 오차 안내 포함",
          ].map((item) => (
            <div key={item} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
            }}>
              <DotIcon />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── 유의사항 ── */}
      <div className="card" style={{
        padding: "24px 28px",
        marginBottom: 52,
        borderColor: "rgba(245,158,11,0.2)",
        background: "rgba(245,158,11,0.04)",
      }}>
        <p style={{
          fontFamily: "var(--font-data)",
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--color-warning)",
          marginBottom: 16,
        }}>유의사항</p>
        <ul style={{ display: "flex", flexDirection: "column", gap: 12, padding: 0, listStyle: "none" }}>
          {[
            "*추정값: 경기장 보정점이 없으면 속도·거리는 상대 추정값(px 기준)으로 표기되며 실제 미터·km/h와 다를 수 있습니다.",
            "분석 결과에는 AI 측정 오차가 포함되며, 전문 코치의 판단을 보조하는 참고 자료입니다.",
            "등번호 자동인식 정확도가 낮을 수 있으므로 선수를 직접 클릭하고 번호를 입력하는 방식을 권장합니다.",
            "결제 완료 후 분석이 시작되며, 분석 실패 시 고객센터로 문의하세요.",
          ].map((note) => (
            <li key={note} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.65,
            }}>
              <span style={{ color: "var(--color-warning)", flexShrink: 0, marginTop: 1, fontWeight: 700 }}>—</span>
              {note}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Bottom CTA ── */}
      <div style={{ textAlign: "center" }}>
        <p style={{
          color: "var(--color-text-secondary)",
          marginBottom: 22,
          fontSize: "var(--text-base)",
          lineHeight: "var(--leading-relaxed)",
        }}>
          어떤 분석이 맞는지 모르겠다면?<br />
          <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>빠른분석(2,000원)으로 먼저 체험해보세요.</span>
        </p>
        <Link href="/analyze" className="btn btn-primary btn-lg">
          지금 분석 시작하기 →
        </Link>
      </div>
    </div>
  );
}
