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

  function annuite(r) {
    if (r.traitement === "amortissable" && r.duree_amort) {
      return Number(r.montant_ht || 0) / Number(r.duree_amort);
    }
    return null;
  }

  function deductible(r) {
    if (r.traitement === "deductible") return Number(r.montant_ht || 0);
    if (r.traitement === "amortissable" && r.duree_amort) {
      return Number(r.montant_ht || 0) / Number(r.duree_amort);
    }
    return 0;
  }

  const header =
    `Fichier;Fournisseur;Date;Montant HT;TVA;Montant TTC;Catégorie;Traitement;Durée amort.;Description;Note;Annuité amortissement;Déductible ${annee}`;

  const lines = rows.map(r => {
    const ann = annuite(r);
    const ded = deductible(r);
    return [
      r.filename, r.fournisseur, r.date_facture,
      r.montant_ht, r.tva, r.montant_ttc,
      r.categorie, r.traitement, r.duree_amort,
      r.description, r.note,
      ann !== null ? ann.toFixed(2) : "",
      ded > 0 ? ded.toFixed(2) : "",
    ].map(csvCell).join(";");
  });

  const totalHt = rows.reduce((s, r) => s + Number(r.montant_ht || 0), 0);
  const totalTva = rows.reduce((s, r) => s + Number(r.tva || 0), 0);
  const totalTtc = rows.reduce((s, r) => s + Number(r.montant_ttc || 0), 0);
  const totalAnnuite = rows.reduce((s, r) => s + (annuite(r) || 0), 0);
  const totalDeductible = rows.reduce((s, r) => s + deductible(r), 0);

  const totalRow = [
    "TOTAL", "", "",
    totalHt.toFixed(2), totalTva.toFixed(2), totalTtc.toFixed(2),
    "", "", "", "", "",
    totalAnnuite.toFixed(2), totalDeductible.toFixed(2),
  ].map(csvCell).join(";");

  const csv = [header, ...lines, totalRow].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lmnp_${annee}.csv"`,
    },
  });
}
