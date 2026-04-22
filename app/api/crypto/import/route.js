import { sqlCrypto } from "@/app/lib/cryptoDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { transactions } = await request.json();
  let imported = 0;
  let skipped = 0;

  for (const tx of transactions) {
    try {
      if (tx.external_id) {
        const existing = await sqlCrypto`
          SELECT id FROM crypto_transactions
          WHERE user_id = ${session.userId} AND external_id = ${tx.external_id}
        `;
        if (existing.length > 0) { skipped++; continue; }
      }

      await sqlCrypto`
        INSERT INTO crypto_transactions
        (user_id, type, crypto, quantite, prix_unitaire, date_transaction, plateforme, notes, external_id)
        VALUES (
          ${session.userId}, ${tx.type}, ${tx.crypto},
          ${tx.quantite}, ${tx.prix_unitaire}, ${tx.date_transaction},
          ${tx.plateforme || ""}, ${tx.notes || ""}, ${tx.external_id || null}
        )
      `;
      imported++;
    } catch (e) {
      console.error("Erreur:", e.message);
      skipped++;
    }
  }

  return Response.json({ ok: true, imported, skipped });
}
