import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { exchangeGoogleToken, loginWithEmailPassword } from "@/lib/api/auth";
import { BackendAuthResponse, UserRole } from "@/types/travel";

function isTokenExpired(token: string) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
    const payload = JSON.parse(payloadJson);
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

interface SessionUserPayload {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  avatarUrl: string;
  backendAccessToken: string;
  passwordConfigured: boolean;
}

function mapBackendSession(backendSession: BackendAuthResponse): SessionUserPayload {
  return {
    id: String(backendSession.user.id),
    role: backendSession.user.role,
    fullName: backendSession.user.fullName,
    email: backendSession.user.email,
    avatarUrl: backendSession.user.avatarUrl,
    backendAccessToken: backendSession.accessToken,
    passwordConfigured: backendSession.user.passwordConfigured,
  };
}

const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV !== "production" ? "travelto-dev-secret-change-for-production" : undefined);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "Email + Mật khẩu",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        try {
          const backendSession = await loginWithEmailPassword(email, password);
          const payload = mapBackendSession(backendSession);
          return {
            id: payload.id,
            role: payload.role,
            name: payload.fullName,
            email: payload.email,
            image: payload.avatarUrl,
            backendAccessToken: payload.backendAccessToken,
            passwordConfigured: payload.passwordConfigured,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "google" && !account.id_token) {
        return false;
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account?.provider === "google" && account.id_token) {
        const backendSession = await exchangeGoogleToken(account.id_token);
        const payload = mapBackendSession(backendSession);
        token.backendAccessToken = payload.backendAccessToken;
        token.userId = payload.id;
        token.role = payload.role;
        token.name = payload.fullName;
        token.email = payload.email;
        token.picture = payload.avatarUrl;
        token.passwordConfigured = payload.passwordConfigured;
      }

      if (account?.provider === "credentials") {
        token.backendAccessToken =
          typeof user?.backendAccessToken === "string" ? user.backendAccessToken : token.backendAccessToken;
        token.userId = typeof user?.id === "string" ? user.id : token.userId;
        token.role = user?.role === "ADMIN" || user?.role === "USER" ? user.role : token.role;
        token.name = typeof user?.name === "string" ? user.name : token.name;
        token.email = typeof user?.email === "string" ? user.email : token.email;
        token.picture = typeof user?.image === "string" ? user.image : token.picture;
        token.passwordConfigured =
          typeof user?.passwordConfigured === "boolean"
            ? user.passwordConfigured
            : token.passwordConfigured === true;
      }

      return token;
    },
    async session({ session, token }) {
      const backendToken = typeof token.backendAccessToken === "string" ? token.backendAccessToken : undefined;

      if (backendToken && isTokenExpired(backendToken)) {
        session.user = undefined as any;
        session.backendAccessToken = undefined;
        return session;
      }

      if (session.user) {
        session.user.id = typeof token.userId === "string" ? token.userId : "";
        session.user.role = token.role === "ADMIN" || token.role === "USER" ? token.role : undefined;
        session.user.name = typeof token.name === "string" ? token.name : "";
        session.user.email = typeof token.email === "string" ? token.email : "";
        if (typeof token.picture === "string") {
          session.user.image = token.picture;
        }
        session.user.passwordConfigured = token.passwordConfigured === true;
      }
      session.backendAccessToken = backendToken;
      return session;
    },
  },
  trustHost: true,
  secret: authSecret,
});
