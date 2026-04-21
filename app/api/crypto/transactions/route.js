import { sqlCrypto } from "@/app/lib/cryptoDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const rows = await sqlCrypto`
    SELECT * FROM crypto_transactions WHERE user_id = ${session.userId} ORDER BY date_transaction ASC
  `;
  return Response.json(rows);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { type, crypto, quantite, prix_unitaire, date_transaction, plateforme, notes } = await request.json();
  const rows = await sqlCrypto`
    INSERT INTO crypto_transactions (user_id, type, crypto, quantite, prix_unitaire, date_transaction, plateforme, notes)
    VALUES (${session.userId}, ${type}, ${crypto.toUpperCase()}, ${quantite}, ${prix_unitaire}, ${date_transaction}, ${plateforme}, ${notes})
    RETURNING *
  `;
  return Response.json(rows[0]);
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await request.json();
  await sqlCrypto`DELETE FROM crypto_transactions WHERE id = ${id} AND user_id = ${session.userId}`;
  return Response.json({ ok: true });
}
