// 가격 상수 — 결제/UI 양쪽에서 공통으로 사용
export const PRICES = {
  fast: {
    label: "빠른 코칭분석",
    amount: 2000, // 원
    currency: "KRW",
    description: "Gemini AI 코칭분석 (40초~1분)",
  },
  precise: {
    label: "정밀 YOLO 분석",
    amount: 5000, // 원
    currency: "KRW",
    description: "Cloud Run GPU YOLO 분석 (수 분, 추적영상+속도+거리+점유율)",
  },
};

export function getPrice(mode) {
  return PRICES[mode] ?? PRICES.fast;
}
