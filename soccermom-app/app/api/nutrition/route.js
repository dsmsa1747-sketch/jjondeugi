// AI 식단·영양 가이드 — Gemini 기반 (성장기 유소년 맞춤)
// ⚠️ 의학적 처방이 아니라 일반 영양 가이드입니다. 알레르기·질환은 전문가 상담.
import { NextResponse } from "next/server";
import { getUserEmail } from "@/lib/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const email = await getUserEmail();
    if (!email) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "서비스가 아직 설정되지 않았습니다." }, { status: 503 });
    }

    const { age, position, weight, height, goal, allergies } = await req.json();
    if (!age) {
      return NextResponse.json({ error: "나이를 입력해 주세요." }, { status: 400 });
    }

    const prompt = `당신은 유소년 축구 선수 전담 스포츠 영양 코치입니다.
아래 선수 정보로 '성장기 축구 선수'에 맞는 하루 식단·영양 가이드를 작성하세요.
의학적 처방이 아니라 일반적인 영양 가이드입니다.

선수 정보:
- 나이: ${age}세
- 포지션: ${position || "미입력"}
- 키: ${height || "미입력"}cm / 체중: ${weight || "미입력"}kg
- 목표: ${goal || "균형 성장"}
- 알레르기/주의: ${allergies || "없음"}

다음 JSON으로만 응답하세요:
{
  "summary": "이 선수에게 가장 중요한 영양 포인트 (2-3문장)",
  "daily_meals": {
    "breakfast": ["아침 메뉴1", "메뉴2"],
    "lunch": ["점심 메뉴1", "메뉴2"],
    "dinner": ["저녁 메뉴1", "메뉴2"],
    "snack": ["간식1", "간식2"]
  },
  "match_day": "경기 당일 식사 타이밍 팁 (2문장)",
  "hydration": "수분 섭취 가이드 (1-2문장)",
  "avoid": ["피해야 할 것1", "피해야 할 것2"],
  "disclaimer": "본 가이드는 일반 영양 정보이며 의학적 처방이 아닙니다. 알레르기·질환이 있으면 전문가와 상담하세요."
}`;

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 2048, responseMimeType: "application/json" },
        }),
      }
    );
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`Gemini API 오류 (${r.status}): ${t}`);
    }
    const j = await r.json();
    const text = j.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("응답이 비어있습니다.");
    return NextResponse.json({ result: JSON.parse(text) });
  } catch (e) {
    console.error("[nutrition] error:", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
