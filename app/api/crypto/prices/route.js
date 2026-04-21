import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPrices } from "@/app/lib/cryptoPrices";
import { sqlCrypto } from "@/app/lib/cryptoDb";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const transactions = await sqlCrypto`
    SELECT DISTINCT crypto FROM crypto_transactions WHERE user_id = ${session.userId}
  `;
  const cryptos = transactions.map(t => t.crypto);
  const prices = await getPrices(cryptos);
  return Response.json(prices);
}
