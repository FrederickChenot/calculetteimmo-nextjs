import { sqlLmnp } from "@/app/lib/lmnpDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });
  if (String(session.userId) !== process.env.LMNP_OWNER_ID) {
    return Response.json({ error: "Accès réservé" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const annee = searchParams.get("annee") || new Date().getFullYear();

  const rows = await sqlLmnp`
    SELECT f.filename, a.fournisseur, a.date_facture, a.montant_ht, a.tva,
           a.montant_ttc, a.categorie, a.traitement, a.duree_amort, a.description, a.note
    FROM lmnp_factures f
    LEFT JOIN lmnp_analyses a ON a.facture_id = f.id
    WHERE f.user_id = ${session.userId} AND f.annee = ${parseInt(annee)}
    ORDER BY f.id ASC
  `;

  function csvCell(v) {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return s.includes(";") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  }

  const header = "Fichier;Fournisseur;Date;Montant HT;TVA;Montant TTC;Catégorie;Traitement;Durée amort.;Description;Note";
  const lines = rows.map(r =>
    [r.filename, r.fournisseur, r.date_facture, r.montant_ht, r.tva,
     r.montant_ttc, r.categorie, r.traitement, r.duree_amort, r.description, r.note]
      .map(csvCell).join(";")
  );

  const csv = [header, ...lines].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lmnp_${annee}.csv"`,
    },
  });
}
