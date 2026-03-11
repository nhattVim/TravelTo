import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { exchangeGoogleToken } from "@/lib/api/auth";

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
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "google" && !account.id_token) {
        return false;
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account?.provider === "google" && account.id_token) {
        const backendSession = await exchangeGoogleToken(account.id_token);
        token.backendAccessToken = backendSession.accessToken;
        token.userId = String(backendSession.user.id);
        token.role = backendSession.user.role;
        token.name = backendSession.user.fullName;
        token.email = backendSession.user.email;
        token.picture = backendSession.user.avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.userId === "string" ? token.userId : "";
        session.user.role = token.role === "ADMIN" || token.role === "USER" ? token.role : undefined;
        session.user.name = typeof token.name === "string" ? token.name : "";
        session.user.email = typeof token.email === "string" ? token.email : "";
        if (typeof token.picture === "string") {
          session.user.image = token.picture;
        }
      }
      session.backendAccessToken =
        typeof token.backendAccessToken === "string" ? token.backendAccessToken : undefined;
      return session;
    },
  },
  trustHost: true,
  secret: authSecret,
});
