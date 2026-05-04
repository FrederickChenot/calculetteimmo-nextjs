import { sqlLmnp } from "@/app/lib/lmnpDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const annee = parseInt(searchParams.get("annee"));

  const rows = await sqlLmnp`
    SELECT * FROM lmnp_charges_recurrentes
    WHERE user_id = ${session.userId} AND annee = ${annee}
    LIMIT 1
  `;
  return Response.json({ charges: rows[0] || null });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { annee, loyer_annuel, taxe_fonciere, assurance_pno, cfe, frais_comptabilite, interets_emprunt, autres, autres_libelle } = await request.json();

  const existing = await sqlLmnp`
    SELECT id FROM lmnp_charges_recurrentes
    WHERE user_id = ${session.userId} AND annee = ${annee}
    LIMIT 1
  `;

  if (existing.length > 0) {
    await sqlLmnp`
      UPDATE lmnp_charges_recurrentes
      SET loyer_annuel = ${loyer_annuel}, taxe_fonciere = ${taxe_fonciere},
          assurance_pno = ${assurance_pno}, cfe = ${cfe},
          frais_comptabilite = ${frais_comptabilite},
          interets_emprunt = ${interets_emprunt}, autres = ${autres},
          autres_libelle = ${autres_libelle || null}, updated_at = NOW()
      WHERE user_id = ${session.userId} AND annee = ${annee}
    `;
  } else {
    await sqlLmnp`
      INSERT INTO lmnp_charges_recurrentes
        (user_id, annee, loyer_annuel, taxe_fonciere, assurance_pno, cfe, frais_comptabilite, interets_emprunt, autres, autres_libelle)
      VALUES
        (${session.userId}, ${annee}, ${loyer_annuel}, ${taxe_fonciere}, ${assurance_pno}, ${cfe},
         ${frais_comptabilite}, ${interets_emprunt}, ${autres}, ${autres_libelle || null})
    `;
  }
  return Response.json({ ok: true });
}
