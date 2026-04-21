import { sqlCrypto } from "@/app/lib/cryptoDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPrices } from "@/app/lib/cryptoPrices";

function calculerPortefeuille(transactions) {
  let prixRevientGlobal = 0;
  const quantites = {};

  for (const tx of transactions) {
    const crypto = tx.crypto;
    const qte = Number(tx.quantite);
    const prix = Number(tx.prix_unitaire);

    if (!quantites[crypto]) quantites[crypto] = 0;

    if (tx.type === "achat") {
      prixRevientGlobal += qte * prix;
      quantites[crypto] += qte;
    } else if (tx.type === "vente") {
      const fractionVendue = qte / quantites[crypto];
      prixRevientGlobal *= (1 - fractionVendue);
      quantites[crypto] -= qte;
    }
  }

  return { prixRevientGlobal, quantites };
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { prixCessionUnitaire, quantiteCedee, crypto } = await request.json();

  const transactions = await sqlCrypto`
    SELECT * FROM crypto_transactions
    WHERE user_id = ${session.userId}
    ORDER BY date_transaction ASC
  `;

  const { prixRevientGlobal, quantites } = calculerPortefeuille(transactions);

  const cryptos = Object.keys(quantites).filter(c => quantites[c] > 0);
  const prices = await getPrices(cryptos);

  let valeurGlobalePortefeuille = 0;
  for (const [c, qte] of Object.entries(quantites)) {
    if (qte > 0) {
      const prixActuel = c === crypto?.toUpperCase() ? prixCessionUnitaire : (prices[c] || 0);
      valeurGlobalePortefeuille += qte * prixActuel;
    }
  }

  const prixCessionTotal = quantiteCedee * prixCessionUnitaire;
  const fractionCedee = valeurGlobalePortefeuille > 0 ? prixCessionTotal / valeurGlobalePortefeuille : 0;
  const prixRevientCession = prixRevientGlobal * fractionCedee;
  const plusValue = prixCessionTotal - prixRevientCession;
  const impot = plusValue > 0 ? plusValue * 0.30 : 0;

  return Response.json({
    prixCessionTotal: Math.round(prixCessionTotal * 100) / 100,
    prixRevientCession: Math.round(prixRevientCession * 100) / 100,
    plusValue: Math.round(plusValue * 100) / 100,
    impot: Math.round(impot * 100) / 100,
    valeurGlobalePortefeuille: Math.round(valeurGlobalePortefeuille * 100) / 100,
    prixRevientGlobal: Math.round(prixRevientGlobal * 100) / 100,
    quantites,
    prices,
  });
}
