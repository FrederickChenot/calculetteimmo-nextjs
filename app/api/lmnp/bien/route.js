import { sqlLmnp } from "@/app/lib/lmnpDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const rows = await sqlLmnp`
    SELECT * FROM lmnp_bien WHERE user_id = ${session.userId} LIMIT 1
  `;
  return Response.json({ bien: rows[0] || null });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { valeur_venale, quote_part_terrain, duree_amort, date_debut } = await request.json();

  const existing = await sqlLmnp`
    SELECT id FROM lmnp_bien WHERE user_id = ${session.userId} LIMIT 1
  `;

  if (existing.length > 0) {
    await sqlLmnp`
      UPDATE lmnp_bien
      SET valeur_venale = ${valeur_venale}, quote_part_terrain = ${quote_part_terrain},
          duree_amort = ${duree_amort}, date_debut = ${date_debut || null},
          updated_at = NOW()
      WHERE user_id = ${session.userId}
    `;
  } else {
    await sqlLmnp`
      INSERT INTO lmnp_bien (user_id, valeur_venale, quote_part_terrain, duree_amort, date_debut)
      VALUES (${session.userId}, ${valeur_venale}, ${quote_part_terrain}, ${duree_amort}, ${date_debut || null})
    `;
  }
  return Response.json({ ok: true });
}
