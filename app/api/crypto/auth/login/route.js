import { sqlCrypto } from "@/app/lib/cryptoDb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const { email, password } = await request.json();
  const rows = await sqlCrypto`SELECT * FROM crypto_users WHERE email = ${email}`;
  if (rows.length === 0) return Response.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });

  const valid = await bcrypt.compare(password, rows[0].password);
  if (!valid) return Response.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });

  const token = jwt.sign({ userId: rows[0].id, email: rows[0].email }, process.env.CRYPTO_JWT_SECRET, { expiresIn: "30d" });
  return Response.json({ ok: true, token, email: rows[0].email });
}
