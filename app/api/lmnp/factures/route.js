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

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await request.json();
  await sqlLmnp`
    DELETE FROM lmnp_factures WHERE id = ${id} AND user_id = ${session.userId}
  `;
  return Response.json({ ok: true });
}
