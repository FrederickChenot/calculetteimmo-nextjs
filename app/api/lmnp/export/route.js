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
  const anneeInt = parseInt(annee);

  const [rows, chargesRows] = await Promise.all([
    sqlLmnp`
      SELECT f.filename, a.fournisseur, a.date_facture, a.montant_ht, a.tva,
             a.montant_ttc, a.categorie, a.traitement, a.duree_amort, a.description, a.note
      FROM lmnp_factures f
      LEFT JOIN lmnp_analyses a ON a.facture_id = f.id
      WHERE f.user_id = ${session.userId} AND f.annee = ${anneeInt}
      ORDER BY f.id ASC
    `,
    sqlLmnp`
      SELECT * FROM lmnp_charges_recurrentes
      WHERE user_id = ${session.userId} AND annee = ${anneeInt}
      LIMIT 1
    `,
  ]);

  const charges = chargesRows[0] || null;
  const DA = parseFloat(charges?.loyer_annuel) || 0;
  const totalChargesRec = charges
    ? [
        parseFloat(charges.taxe_fonciere) || 0,
        parseFloat(charges.assurance_pno) || 0,
        parseFloat(charges.cfe) || 0,
        parseFloat(charges.frais_comptabilite) || 0,
        parseFloat(charges.interets_emprunt) || 0,
        parseFloat(charges.autres) || 0,
      ].reduce((a, b) => a + b, 0)
    : 0;

  function csvCell(v) {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return s.includes(";") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  }

  function annuiteTheorique(r) {
    if (r.traitement === "amortissable" && r.duree_amort) {
      return Number(r.montant_ttc || 0) / Number(r.duree_amort);
    }
    return 0;
  }

  function deductibleFiscal(r) {
    if (r.traitement === "deductible") return Number(r.montant_ttc || 0);
    return 0;
  }

  const header =
    `Fichier;Fournisseur;Date;Montant HT;TVA;Montant TTC;Catégorie;Traitement;Durée amort.;Description;Note;Montant retenu TTC;Annuité théorique 39C;Déductible fiscal ${annee}`;

  const lines = rows.map(r => [
    r.filename, r.fournisseur, r.date_facture,
    r.montant_ht, r.tva, r.montant_ttc,
    r.categorie, r.traitement, r.duree_amort,
    r.description, r.note,
    Number(r.montant_ttc || 0).toFixed(2),
    annuiteTheorique(r).toFixed(2),
    deductibleFiscal(r).toFixed(2),
  ].map(csvCell).join(";"));

  const totalTtc = rows.reduce((s, r) => s + Number(r.montant_ttc || 0), 0);
  const totalDeductibleTtc = rows
    .filter(r => r.traitement === "deductible")
    .reduce((s, r) => s + Number(r.montant_ttc || 0), 0);
  const totalAmortissableTtc = rows
    .filter(r => r.traitement === "amortissable")
    .reduce((s, r) => s + Number(r.montant_ttc || 0), 0);
  const totalAnnuites = rows.reduce((s, r) => s + annuiteTheorique(r), 0);
  const totalChargesHorsAmort = totalDeductibleTtc + totalChargesRec;
  const resultatAvantAmort = DA - totalChargesHorsAmort;
  const amortDeductibles = resultatAvantAmort >= 0 ? Math.min(totalAnnuites, resultatAvantAmort) : 0;
  const resultatFiscal = resultatAvantAmort - amortDeductibles;

  const resume = [
    "",
    "=== RÉSUMÉ FISCAL ===",
    `Total factures TTC;${totalTtc.toFixed(2)}`,
    `Charges factures TTC déductibles;${totalDeductibleTtc.toFixed(2)}`,
    `Immobilisations factures TTC;${totalAmortissableTtc.toFixed(2)}`,
    `Annuités théoriques 39C;${totalAnnuites.toFixed(2)}`,
    `Amortissements fiscalement déduits;${amortDeductibles.toFixed(2)}`,
    `Charges récurrentes;${totalChargesRec.toFixed(2)}`,
    `Total charges hors amortissements;${totalChargesHorsAmort.toFixed(2)}`,
    `Résultat fiscal;${resultatFiscal.toFixed(2)}`,
  ];

  const csv = [header, ...lines, ...resume].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lmnp_${annee}.csv"`,
    },
  });
}
