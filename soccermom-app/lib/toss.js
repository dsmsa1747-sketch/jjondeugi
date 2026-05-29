// 토스페이먼츠 결제 서버 검증 헬퍼
// 핸들러 안에서만 호출하세요 (lazy init).

/**
 * 토스페이먼츠 결제 승인 API 호출
 * @param {string} paymentKey
 * @param {string} orderId
 * @param {number} amount
 */
export async function confirmTossPayment(paymentKey, orderId, amount) {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    throw new Error("TOSS_SECRET_KEY 환경변수가 없습니다.");
  }

  const credentials = Buffer.from(`${secretKey}:`).toString("base64");

  const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `토스 결제 승인 실패 [${data.code}]: ${data.message}`
    );
  }

  return data;
}
