// 접근 제어 — 로그인 사용자 확인 + 관리자(무료 사용) 판별
// 핸들러 안에서만 호출하세요.
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 현재 로그인 사용자 이메일 (없으면 null)
export async function getUserEmail() {
  const session = await getServerSession(authOptions).catch(() => null);
  return session?.user?.email || null;
}

// 관리자(형님 본인 등)는 결제 없이 분석 가능 — ADMIN_EMAILS=콤마구분
export function isAdmin(email) {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}
