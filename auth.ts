import NextAuth from "next-auth"
import { prisma } from "./lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-expect-error Type mismatch with beta version
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin"
  },
  callbacks: {
    async jwt({ token, user }) {
      // Saat pertama login, ambil dari object user
      if (user) {
        token.role = user.role;
      } else if (token.email) {
        // Pada request selanjutnya, ambil selalu dari database agar role terupdate real-time
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Memasukkan role dari token ke object session agar bisa dibaca di frontend/komponen
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  }
});