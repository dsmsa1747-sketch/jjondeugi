// Gemini API — 빠른 코칭분석
// Lazy init: 핸들러 안에서만 호출하세요. 빌드타임에는 절대 실행하지 마세요.

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY 환경변수가 없습니다.");
  }
  // Google AI SDK (@google/generative-ai) 대신 fetch 직접 사용 (추가 패키지 불필요)
  return { apiKey };
}

/**
 * 유튜브 URL을 받아 Gemini로 빠른 코칭분석 결과를 반환합니다.
 * @param {string} youtubeUrl
 * @returns {Promise<object>} { strengths, improvements, drills, highlights, disclaimer }
 */
export async function analyzeFast(youtubeUrl) {
  const { apiKey } = getGeminiClient();

  const prompt = `당신은 유소년 축구 전문 코치입니다.
아래 유튜브 영상 URL의 축구 경기를 분석해 주세요.
URL: ${youtubeUrl}

다음 형식의 JSON으로만 응답하세요 (다른 텍스트 없이):
{
  "strengths": ["강점1", "강점2", "강점3"],
  "improvements": ["개선점1", "개선점2", "개선점3"],
  "drills": ["권장 훈련드릴1", "권장 훈련드릴2"],
  "highlights": "영상 전체 하이라이트 요약 (2-3문장)",
  "disclaimer": "AI 측정값으로 오차가 있을 수 있으며, 전문 코치의 판단을 대체하지 않습니다."
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API 오류 (${response.status}): ${errText}`);
  }

  const json = await response.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini 응답이 비어있습니다.");

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Gemini 응답 파싱 실패: " + text.slice(0, 200));
  }
}
