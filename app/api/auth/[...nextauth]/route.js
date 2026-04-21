import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

const sqlAdmin = neon(process.env.DATABASE_URL);
const sqlCrypto = neon(process.env.CRYPTO_DATABASE_URL);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "admin", email: credentials.email, role: "admin" };
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: "crypto-credentials",
      name: "Crypto",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const rows = await sqlCrypto`SELECT * FROM crypto_users WHERE email = ${credentials.email}`;
        if (rows.length === 0) return null;
        const valid = await bcrypt.compare(credentials.password, rows[0].password);
        if (!valid) return null;
        return { id: rows[0].id.toString(), email: rows[0].email, role: "crypto" };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/crypto/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existing = await sqlCrypto`SELECT id FROM crypto_users WHERE email = ${user.email}`;
        if (existing.length === 0) {
          await sqlCrypto`INSERT INTO crypto_users (email, password) VALUES (${user.email}, 'google-oauth')`;
        }
        user.role = "crypto";
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        if (user.role === "crypto" || account?.provider === "google") {
          const rows = await sqlCrypto`SELECT id FROM crypto_users WHERE email = ${token.email}`;
          if (rows.length > 0) token.userId = rows[0].id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.role = token.role;
      session.userId = token.userId;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
