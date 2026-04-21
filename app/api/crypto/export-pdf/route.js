import { sqlCrypto } from "@/app/lib/cryptoDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { annee } = await request.json();

  const transactions = await sqlCrypto`
    SELECT * FROM crypto_transactions
    WHERE user_id = ${session.userId}
    AND EXTRACT(YEAR FROM date_transaction) = ${annee}
    ORDER BY date_transaction ASC
  `;

  const plusvalues = await sqlCrypto`
    SELECT * FROM crypto_plusvalues
    WHERE user_id = ${session.userId} AND annee = ${annee}
    ORDER BY created_at ASC
  `;

  const totalCessions = plusvalues.reduce((s, p) => s + Number(p.prix_cession_total), 0);
  const totalPlusValue = plusvalues.reduce((s, p) => s + Number(p.plus_value), 0);
  const totalImpot = plusvalues.reduce((s, p) => s + Number(p.impot_estime), 0);

  return Response.json({
    annee,
    email: session.user.email,
    transactions,
    plusvalues,
    totaux: {
      totalCessions: Math.round(totalCessions * 100) / 100,
      totalPlusValue: Math.round(totalPlusValue * 100) / 100,
      totalImpot: Math.round(totalImpot * 100) / 100,
    }
  });
}
