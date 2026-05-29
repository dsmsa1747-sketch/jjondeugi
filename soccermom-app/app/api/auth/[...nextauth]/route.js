import NextAuth from "next-auth";
import { buildAuthOptions } from "@/lib/auth";

// NextAuth는 런타임에만 동작 — 빌드타임에 환경변수 없어도 안전
const handler = NextAuth(buildAuthOptions());

export { handler as GET, handler as POST };
