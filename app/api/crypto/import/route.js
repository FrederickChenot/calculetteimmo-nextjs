import { sqlCrypto } from "@/app/lib/cryptoDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { transactions } = await request.json();
  let imported = 0;

  for (const tx of transactions) {
    try {
      await sqlCrypto`
        INSERT INTO crypto_transactions
        (user_id, type, crypto, quantite, prix_unitaire, date_transaction, plateforme, notes, external_id)
        VALUES (
          ${session.userId}, ${tx.type}, ${tx.crypto}, ${tx.quantite},
          ${tx.prix_unitaire}, ${tx.date_transaction}, ${tx.plateforme || ""},
          ${tx.notes || ""}, ${tx.external_id || null}
        )
        ON CONFLICT (external_id) DO NOTHING
      `;
      imported++;
    } catch (e) { console.error(e); }
  }

  return Response.json({ ok: true, imported });
}
