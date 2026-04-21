import { sqlCrypto } from "@/app/lib/cryptoDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const rows = await sqlCrypto`
    SELECT pv.*, ct.date_transaction, ct.plateforme
    FROM crypto_plusvalues pv
    JOIN crypto_transactions ct ON ct.id = pv.transaction_id
    WHERE pv.user_id = ${session.userId}
    ORDER BY ct.date_transaction DESC
  `;
  return Response.json(rows);
}
