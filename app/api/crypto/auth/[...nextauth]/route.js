import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sqlCrypto } from "@/app/lib/cryptoDb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const rows = await sqlCrypto`SELECT * FROM crypto_users WHERE email = ${credentials.email}`;
        if (rows.length === 0) return null;
        const valid = await bcrypt.compare(credentials.password, rows[0].password);
        if (!valid) return null;
        return { id: rows[0].id, email: rows[0].email };
      },
    }),
  ],
  secret: process.env.CRYPTO_JWT_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/crypto/login" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existing = await sqlCrypto`SELECT id FROM crypto_users WHERE email = ${user.email}`;
        if (existing.length === 0) {
          await sqlCrypto`INSERT INTO crypto_users (email, password) VALUES (${user.email}, 'google-oauth')`;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const rows = await sqlCrypto`SELECT id FROM crypto_users WHERE email = ${token.email}`;
        if (rows.length > 0) token.userId = rows[0].id;
      }
      return token;
    },
    async session({ session, token }) {
      session.userId = token.userId;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
