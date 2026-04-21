import { sqlCrypto } from "@/app/lib/cryptoDb";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { email, password } = await request.json();
  if (!email || !password) return Response.json({ error: "Champs manquants" }, { status: 400 });
  if (password.length < 8) return Response.json({ error: "Mot de passe trop court (8 car. min)" }, { status: 400 });

  const existing = await sqlCrypto`SELECT id FROM crypto_users WHERE email = ${email}`;
  if (existing.length > 0) return Response.json({ error: "Email déjà utilisé" }, { status: 409 });

  const hash = await bcrypt.hash(password, 12);
  const rows = await sqlCrypto`
    INSERT INTO crypto_users (email, password) VALUES (${email}, ${hash}) RETURNING id, email
  `;
  return Response.json({ ok: true, user: rows[0] });
}
