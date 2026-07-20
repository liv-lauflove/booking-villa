import NextAuth from "next-auth"
import { prisma } from "./lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/SignIn"
  },
  callbacks: {
    async jwt({ token, user }) {
      // Menyimpan role dari database ke token saat pertama kali login
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Memasukkan role dari token ke object session agar bisa dibaca di frontend/komponen
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  }
});