// AI 개인훈련 루틴 — Gemini 기반 (포지션·약점 맞춤 드릴)
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

    const { age, position, weakness, days, place } = await req.json();
    if (!age) {
      return NextResponse.json({ error: "나이를 입력해 주세요." }, { status: 400 });
    }

    const prompt = `당신은 유소년 축구 전문 트레이너입니다.
아래 선수에게 맞는 '개인 훈련 루틴'을 안전하고 단계적으로 설계하세요.
성장기 부상 예방을 최우선으로 하고, 무리한 고강도는 피하세요.

선수 정보:
- 나이: ${age}세
- 포지션: ${position || "미입력"}
- 개선하고 싶은 약점: ${weakness || "기본기 전반"}
- 주당 훈련 가능 일수: ${days || 3}일
- 훈련 장소: ${place || "집/공터"}

다음 JSON으로만 응답하세요:
{
  "focus": "이 선수가 집중해야 할 핵심 (2문장)",
  "warmup": ["워밍업1", "워밍업2"],
  "drills": [
    { "name": "드릴 이름", "how": "방법 설명(2문장)", "reps": "횟수/시간", "target": "효과" }
  ],
  "weekly_plan": ["1일차: ...", "2일차: ...", "3일차: ..."],
  "cooldown": ["쿨다운1", "쿨다운2"],
  "safety": "부상 예방 주의사항 (2문장)",
  "disclaimer": "AI가 생성한 일반 훈련 가이드입니다. 통증이 있으면 즉시 중단하고 전문가와 상담하세요."
}
drills 는 4~6개 작성하세요.`;

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 2500, responseMimeType: "application/json" },
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
    console.error("[training] error:", e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
