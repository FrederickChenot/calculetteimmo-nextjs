import { sqlCrypto } from "@/app/lib/cryptoDb";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { token, password } = await request.json();

  const rows = await sqlCrypto`
    SELECT * FROM password_reset_tokens
    WHERE token = ${token} AND used = FALSE AND expires_at > NOW()
  `;
  if (rows.length === 0) return Response.json({ error: "Token invalide ou expiré" }, { status: 400 });

  const hash = await bcrypt.hash(password, 12);
  await sqlCrypto`UPDATE crypto_users SET password = ${hash} WHERE id = ${rows[0].user_id}`;
  await sqlCrypto`UPDATE password_reset_tokens SET used = TRUE WHERE token = ${token}`;

  return Response.json({ ok: true });
}
