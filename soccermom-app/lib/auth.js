// NextAuth 설정 — Google + 카카오 + 네이버
// 이 파일은 런타임에만 사용됩니다 (빌드타임 실행 금지).

export function buildAuthOptions() {
  return {
    providers: [
      // Google
      {
        id: "google",
        name: "Google",
        type: "oauth",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
        authorization: { params: { scope: "openid email profile" } },
        idToken: true,
        checks: ["pkce", "state"],
        profile(profile) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          };
        },
      },
      // 카카오
      {
        id: "kakao",
        name: "카카오",
        type: "oauth",
        clientId: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        authorization: {
          url: "https://kauth.kakao.com/oauth/authorize",
          params: { scope: "profile_nickname account_email" },
        },
        token: "https://kauth.kakao.com/oauth/token",
        userinfo: "https://kapi.kakao.com/v2/user/me",
        profile(profile) {
          return {
            id: String(profile.id),
            name: profile.kakao_account?.profile?.nickname,
            email: profile.kakao_account?.email,
            image: profile.kakao_account?.profile?.profile_image_url,
          };
        },
      },
      // 네이버
      {
        id: "naver",
        name: "네이버",
        type: "oauth",
        clientId: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        authorization: {
          url: "https://nid.naver.com/oauth2.0/authorize",
          params: { scope: "name email" },
        },
        token: "https://nid.naver.com/oauth2.0/token",
        userinfo: "https://openapi.naver.com/v1/nid/me",
        profile(profile) {
          return {
            id: profile.response?.id,
            name: profile.response?.name,
            email: profile.response?.email,
            image: profile.response?.profile_image,
          };
        },
      },
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    pages: {
      signIn: "/",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.email = user.email;
          token.name = user.name;
          token.picture = user.image;
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user.email = token.email;
          session.user.name = token.name;
          session.user.image = token.picture;
        }
        return session;
      },
    },
  };
}

// authOptions는 API route 핸들러 안에서 buildAuthOptions()로 생성하세요.
// 여기서 직접 export하면 빌드타임에 환경변수가 없어도 안전합니다.
export const authOptions = {
  get providers() {
    return buildAuthOptions().providers;
  },
  get secret() {
    return process.env.NEXTAUTH_SECRET;
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  },
};
