import { sqlCrypto } from "@/app/lib/cryptoDb";
import jwt from "jsonwebtoken";

function getUser(request) {
  const auth = request.headers.get("authorization");
  if (!auth) return null;
  try {
    return jwt.verify(auth.replace("Bearer ", ""), process.env.CRYPTO_JWT_SECRET);
  } catch { return null; }
}

export async function GET(request) {
  const user = getUser(request);
  if (!user) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const rows = await sqlCrypto`
    SELECT * FROM crypto_transactions WHERE user_id = ${user.userId} ORDER BY date_transaction ASC
  `;
  return Response.json(rows);
}

export async function POST(request) {
  const user = getUser(request);
  if (!user) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { type, crypto, quantite, prix_unitaire, date_transaction, plateforme, notes } = await request.json();
  const rows = await sqlCrypto`
    INSERT INTO crypto_transactions (user_id, type, crypto, quantite, prix_unitaire, date_transaction, plateforme, notes)
    VALUES (${user.userId}, ${type}, ${crypto.toUpperCase()}, ${quantite}, ${prix_unitaire}, ${date_transaction}, ${plateforme}, ${notes})
    RETURNING *
  `;
  return Response.json(rows[0]);
}

export async function DELETE(request) {
  const user = getUser(request);
  if (!user) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await request.json();
  await sqlCrypto`DELETE FROM crypto_transactions WHERE id = ${id} AND user_id = ${user.userId}`;
  return Response.json({ ok: true });
}
