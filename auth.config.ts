import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin"
  },
  callbacks: {
    session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;
