import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as never),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Expose isSupporter and city in the session so client knows immediately
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).isSupporter = (user as any).isSupporter ?? false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).city = (user as any).city ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
