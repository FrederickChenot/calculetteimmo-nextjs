import { sqlCrypto } from "@/app/lib/cryptoDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { oldPassword, newPassword } = await request.json();

  const user = await sqlCrypto`SELECT * FROM crypto_users WHERE id = ${session.userId}`;
  if (user.length === 0) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });

  if (user[0].password === "google-oauth") {
    return Response.json({ error: "Compte Google — utilisez la gestion Google pour changer votre mot de passe" }, { status: 400 });
  }

  const valid = await bcrypt.compare(oldPassword, user[0].password);
  if (!valid) return Response.json({ error: "Mot de passe actuel incorrect" }, { status: 401 });

  const hash = await bcrypt.hash(newPassword, 12);
  await sqlCrypto`UPDATE crypto_users SET password = ${hash} WHERE id = ${session.userId}`;

  return Response.json({ ok: true });
}
