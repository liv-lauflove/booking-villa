import NextAuth from "next-auth"
import { prisma } from "./lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  // @ts-expect-error Type mismatch with beta version
  adapter: PrismaAdapter(prisma),
  callbacks: {
    ...authConfig.callbacks,
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
    }
  }
});