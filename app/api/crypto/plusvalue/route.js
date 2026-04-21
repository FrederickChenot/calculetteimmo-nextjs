import { sqlCrypto } from "@/app/lib/cryptoDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Méthode PMP globale — Article 150 VH bis CGI — Formulaire 2086
function calculerPlusValue(transactions, prixCessionUnitaire, quantiteCedee) {
  let prixRevientGlobal = 0;
  let quantiteTotale = 0;

  for (const tx of transactions) {
    if (tx.type === "achat") {
      prixRevientGlobal += Number(tx.quantite) * Number(tx.prix_unitaire);
      quantiteTotale += Number(tx.quantite);
    } else if (tx.type === "vente") {
      const fractionVendue = Number(tx.quantite) / quantiteTotale;
      prixRevientGlobal *= (1 - fractionVendue);
      quantiteTotale -= Number(tx.quantite);
    }
  }

  const valeurGlobalePortefeuille = quantiteTotale * prixCessionUnitaire;
  const prixCessionTotal = quantiteCedee * prixCessionUnitaire;
  const fractionCedee = prixCessionTotal / valeurGlobalePortefeuille;
  const prixRevientCession = prixRevientGlobal * fractionCedee;
  const plusValue = prixCessionTotal - prixRevientCession;
  const impot = plusValue > 0 ? plusValue * 0.30 : 0;

  return {
    prixCessionTotal: Math.round(prixCessionTotal * 100) / 100,
    prixRevientCession: Math.round(prixRevientCession * 100) / 100,
    plusValue: Math.round(plusValue * 100) / 100,
    impot: Math.round(impot * 100) / 100,
    valeurGlobalePortefeuille: Math.round(valeurGlobalePortefeuille * 100) / 100,
    prixRevientGlobal: Math.round(prixRevientGlobal * 100) / 100,
    quantiteTotale: Math.round(quantiteTotale * 10000) / 10000,
  };
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { prixCessionUnitaire, quantiteCedee } = await request.json();

  const transactions = await sqlCrypto`
    SELECT * FROM crypto_transactions WHERE user_id = ${session.userId} ORDER BY date_transaction ASC
  `;

  const result = calculerPlusValue(transactions, prixCessionUnitaire, quantiteCedee);
  return Response.json(result);
}
