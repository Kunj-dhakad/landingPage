import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db, databaseReady } from "@/lib/db";
import {
  hashToken,
  token,
  verifyPassword,
  rateLimit,
  sameOrigin,
} from "@/lib/security";
import { emailSchema } from "@/lib/validation";
export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  providers: [
    Credentials({
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials, request) {
        const authRequest = new Request(
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          { headers: request.headers as Record<string, string> },
        );
        if (
          !databaseReady() ||
          !process.env.AUTH_SECRET ||
          !sameOrigin(authRequest) ||
          !(await rateLimit(authRequest, "login", 5))
        )
          return null;
        const parsed = z
          .object({ email: emailSchema, password: z.string().min(12).max(128) })
          .safeParse(credentials);
        if (!parsed.success) return null;
        const user = await db.adminUser.findUnique({
          where: { email: parsed.data.email },
        });
        const valid = verifyPassword(
          parsed.data.password,
          user?.passwordHash ||
            "00000000000000000000000000000000:" + "00".repeat(64),
        );
        if (!user || !user.enabled || !valid) return null;
        const raw = token();
        await db.adminSession.create({
          data: {
            adminId: user.id,
            tokenHash: hashToken(raw),
            expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
          },
        });
        return { id: user.id, email: user.email, name: raw };
      },
    }),
  ],
  callbacks: {
    async jwt({ token: jwt, user }) {
      if (user) jwt.sessionKey = user.name;
      return jwt;
    },
    async session({ session, token: jwt }) {
      if (session.user)
        session.user.name =
          typeof jwt.sessionKey === "string" ? jwt.sessionKey : null;
      return session;
    },
  },
  events: {
    async signOut(message) {
      if ("token" in message && typeof message.token?.sessionKey === "string")
        await db.adminSession.deleteMany({
          where: { tokenHash: hashToken(message.token.sessionKey) },
        });
    },
  },
};
export const auth = () => getServerSession(authOptions);
const handler = NextAuth(authOptions);
export const handlers = { GET: handler, POST: handler };
