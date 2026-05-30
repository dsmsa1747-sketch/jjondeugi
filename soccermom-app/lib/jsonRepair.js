// 잘린/불완전 JSON 복구 파서 (Gemini 응답이 MAX_TOKENS로 잘릴 때 대비)
export function safeJsonParse(text) {
  if (!text) return null;
  try { return JSON.parse(text); } catch {}
  let s = String(text).trim().replace(/,\s*$/, "");
  // 열린 따옴표/괄호를 추정해서 닫아본다
  const candidates = [
    s, s + '"', s + '"]', s + '"]}', s + '"}', s + "]}", s + "}",
    s + '"]}}', s + '"}}', s + "}}",
  ];
  for (const c of candidates) {
    try { return JSON.parse(c); } catch {}
  }
  return null;
}
