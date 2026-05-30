// Gemini API — 빠른 코칭분석 (실제 영상 분석 + 축구 영상 판별)
// Lazy init: 핸들러 안에서만 호출하세요. 빌드타임에는 절대 실행하지 마세요.

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY 환경변수가 없습니다.");
  }
  return { apiKey };
}

/**
 * 유튜브 URL의 '실제 영상'을 Gemini가 보고 분석합니다.
 *  - fileData.fileUri 로 유튜브 영상을 직접 전달 (URL 텍스트만 보내면 영상을 안 보고 지어냄 → 금지)
 *  - 먼저 축구 경기 영상인지 판별(is_soccer). 축구가 아니면 분석을 만들지 않습니다.
 * @param {string} youtubeUrl
 * @returns {Promise<object>} { is_soccer, reason, strengths, improvements, drills, highlights, disclaimer }
 */
export async function analyzeFast(youtubeUrl) {
  const { apiKey } = getGeminiClient();

  const prompt = `당신은 유소년 축구 전문 코치입니다. 아래 첨부된 '실제 영상'을 직접 보고 판단하세요.
추측하지 말고, 영상에 실제로 보이는 내용만으로 답하세요.

1단계 — 이 영상이 '축구(풋살 포함) 경기/훈련 영상'이 맞는지 판별하세요.
  - 축구 영상이 아니면(예: 다른 스포츠, 일상 영상, 광고, 음악, 정지화면 등) is_soccer=false 로 하고
    분석 항목은 비워서 반환하세요. 거짓 분석을 만들지 마세요.

2단계 — 축구 영상이 맞을 때만 코칭 분석을 작성하세요.

다음 JSON으로만 응답하세요 (다른 텍스트 없이):
{
  "is_soccer": true 또는 false,
  "reason": "판별 근거 (영상에서 실제로 본 것, 1문장)",
  "strengths": ["강점1", "강점2", "강점3"],
  "improvements": ["개선점1", "개선점2", "개선점3"],
  "drills": ["권장 훈련드릴1", "권장 훈련드릴2"],
  "highlights": "영상에서 실제로 본 장면 요약 (2-3문장)",
  "disclaimer": "AI 측정값으로 오차가 있을 수 있으며, 전문 코치의 판단을 대체하지 않습니다."
}
축구가 아니면 strengths/improvements/drills 는 빈 배열, highlights 는 빈 문자열로 두세요.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              // 실제 영상 전달: 이게 있어야 Gemini가 영상을 '본다'
              { fileData: { fileUri: youtubeUrl } },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
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

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini 응답 파싱 실패: " + text.slice(0, 200));
  }
  // is_soccer 누락 시 보수적으로 false 처리(거짓 분석 방지)
  if (typeof parsed.is_soccer !== "boolean") parsed.is_soccer = false;
  return parsed;
}
