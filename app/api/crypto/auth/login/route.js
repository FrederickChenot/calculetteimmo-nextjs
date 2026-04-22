import { sqlCrypto } from "@/app/lib/cryptoDb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { rateLimit } from "@/app/lib/rateLimit";

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { allowed, remaining, resetAt } = rateLimit(ip, 5, 15 * 60 * 1000);

  if (!allowed) {
    const minutes = Math.ceil((resetAt - Date.now()) / 60000);
    return Response.json(
      { error: `Trop de tentatives. Réessayez dans ${minutes} minutes.` },
      { status: 429 }
    );
  }

  const { email, password } = await request.json();
  const rows = await sqlCrypto`SELECT * FROM crypto_users WHERE email = ${email}`;
  if (rows.length === 0) return Response.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });

  const valid = await bcrypt.compare(password, rows[0].password);
  if (!valid) return Response.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });

  const token = jwt.sign({ userId: rows[0].id, email: rows[0].email }, process.env.CRYPTO_JWT_SECRET, { expiresIn: "30d" });
  return Response.json({ ok: true, token, email: rows[0].email });
}
