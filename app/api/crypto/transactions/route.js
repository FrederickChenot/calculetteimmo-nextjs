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

  if (type === "vente") {
    const allTx = await sqlCrypto`
      SELECT * FROM crypto_transactions WHERE user_id = ${session.userId} ORDER BY date_transaction ASC
    `;

    let prixRevientGlobal = 0;
    const quantites = {};
    for (const tx of allTx) {
      const c = tx.crypto;
      if (!quantites[c]) quantites[c] = 0;
      if (tx.type === "achat") {
        prixRevientGlobal += Number(tx.quantite) * Number(tx.prix_unitaire);
        quantites[c] += Number(tx.quantite);
      } else if (tx.type === "vente") {
        const fraction = Number(tx.quantite) / quantites[c];
        prixRevientGlobal *= (1 - fraction);
        quantites[c] -= Number(tx.quantite);
      }
    }

    let valeurGlobale = 0;
    for (const [c, qte] of Object.entries(quantites)) {
      if (qte > 0) {
        const prix = c === crypto.toUpperCase() ? Number(prix_unitaire) : 0;
        valeurGlobale += qte * prix;
      }
    }

    const prixCessionTotal = Number(quantite) * Number(prix_unitaire);
    const fractionCedee = valeurGlobale > 0 ? prixCessionTotal / valeurGlobale : 0;
    const prixRevientCession = prixRevientGlobal * fractionCedee;
    const plusValue = prixCessionTotal - prixRevientCession;
    const impot = plusValue > 0 ? plusValue * 0.30 : 0;
    const annee = new Date(date_transaction).getFullYear();

    await sqlCrypto`
      INSERT INTO crypto_plusvalues (user_id, transaction_id, annee, crypto, quantite_cedee, prix_cession_total, prix_revient_cession, plus_value, impot_estime)
      VALUES (${session.userId}, ${rows[0].id}, ${annee}, ${crypto.toUpperCase()}, ${quantite}, ${prixCessionTotal}, ${prixRevientCession}, ${plusValue}, ${impot})
    `;
  }

  return Response.json(rows[0]);
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await request.json();
  await sqlCrypto`DELETE FROM crypto_transactions WHERE id = ${id} AND user_id = ${session.userId}`;
  return Response.json({ ok: true });
}
