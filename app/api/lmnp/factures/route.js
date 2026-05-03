import { sqlLmnp } from "@/app/lib/lmnpDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const annee = searchParams.get("annee");

  const rows = annee
    ? await sqlLmnp`
        SELECT f.id, f.filename, f.annee, f.created_at, f.url_pdf,
               a.id as analyse_id, a.fournisseur, a.date_facture,
               a.montant_ht, a.tva, a.montant_ttc,
               a.categorie, a.traitement, a.duree_amort, a.description, a.note
        FROM lmnp_factures f
        LEFT JOIN lmnp_analyses a ON a.facture_id = f.id
        WHERE f.user_id = ${session.userId} AND f.annee = ${parseInt(annee)}
        ORDER BY f.created_at DESC
      `
    : await sqlLmnp`
        SELECT f.id, f.filename, f.annee, f.created_at, f.url_pdf,
               a.id as analyse_id, a.fournisseur, a.date_facture,
               a.montant_ht, a.tva, a.montant_ttc,
               a.categorie, a.traitement, a.duree_amort, a.description, a.note
        FROM lmnp_factures f
        LEFT JOIN lmnp_analyses a ON a.facture_id = f.id
        WHERE f.user_id = ${session.userId}
        ORDER BY f.created_at DESC
      `;

  const isOwner = String(session.userId) === process.env.LMNP_OWNER_ID;
  return Response.json({ factures: rows, isOwner });
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { analyse_id, analyse_ids, categorie, traitement, duree_amort } = await request.json();
  const dur = duree_amort ?? null;

  if (Array.isArray(analyse_ids) && analyse_ids.length > 0) {
    await sqlLmnp`
      UPDATE lmnp_analyses
      SET categorie = ${categorie}, traitement = ${traitement}, duree_amort = ${dur}
      WHERE id = ANY(${analyse_ids})
        AND facture_id IN (
          SELECT id FROM lmnp_factures WHERE user_id = ${session.userId}
        )
    `;
  } else {
    await sqlLmnp`
      UPDATE lmnp_analyses
      SET categorie = ${categorie}, traitement = ${traitement}, duree_amort = ${dur}
      WHERE id = ${analyse_id}
        AND facture_id IN (
          SELECT id FROM lmnp_factures WHERE user_id = ${session.userId}
        )
    `;
  }
  return Response.json({ ok: true });
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await request.json();
  await sqlLmnp`
    DELETE FROM lmnp_factures WHERE id = ${id} AND user_id = ${session.userId}
  `;
  return Response.json({ ok: true });
}
