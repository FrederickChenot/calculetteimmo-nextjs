import { sqlLmnp } from "@/app/lib/lmnpDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const annee = parseInt(searchParams.get("annee")) || new Date().getFullYear();

  const [facturesRows, bienRows, chargesRows] = await Promise.all([
    sqlLmnp`
      SELECT a.fournisseur, a.montant_ht, a.tva, a.montant_ttc,
             a.categorie, a.traitement, a.duree_amort, a.description, f.filename
      FROM lmnp_factures f
      LEFT JOIN lmnp_analyses a ON a.facture_id = f.id
      WHERE f.user_id = ${session.userId} AND f.annee = ${annee}
      ORDER BY a.fournisseur ASC
    `,
    sqlLmnp`SELECT * FROM lmnp_bien WHERE user_id = ${session.userId} LIMIT 1`,
    sqlLmnp`
      SELECT * FROM lmnp_charges_recurrentes
      WHERE user_id = ${session.userId} AND annee = ${annee}
      LIMIT 1
    `,
  ]);

  const bien = bienRows[0] || null;
  const charges = chargesRows[0] || null;

  // Amortissement bien — ne démarre qu'à la date de mise en location
  const valeurVenale = parseFloat(bien?.valeur_venale) || 0;
  const quotePart = parseFloat(bien?.quote_part_terrain) || 15;
  const dureeAmortBien = parseInt(bien?.duree_amort) || 30;
  const baseAmortissable = valeurVenale * (1 - quotePart / 100);
  const amortBienBrut = dureeAmortBien > 0 ? baseAmortissable / dureeAmortBien : 0;

  const miseDateStr = bien?.date_mise_en_location;
  const miseEnLocationAnnee = miseDateStr ? parseInt(String(miseDateStr).slice(0, 4)) : null;
  const amortBienAnnuel = (miseEnLocationAnnee && miseEnLocationAnnee > annee) ? 0 : amortBienBrut;

  // Charges récurrentes totales
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

  // Factures déductibles
  const deductibleHt = facturesRows
    .filter(f => f.traitement === "deductible")
    .reduce((s, f) => s + (parseFloat(f.montant_ht) || 0), 0);

  // Amortissements factures
  const amortissables = facturesRows.filter(f => f.traitement === "amortissable" && f.duree_amort);
  const amortAnnuel = amortissables.reduce((s, f) => {
    return s + (parseFloat(f.montant_ht) || 0) / parseFloat(f.duree_amort);
  }, 0);

  const chargesExternes = deductibleHt + totalChargesRec;
  const amortTotal = amortAnnuel + amortBienAnnuel;

  // Règle art. 39C CGI
  const DA = parseFloat(charges?.loyer_annuel) || 0;
  const resultatAvantAmort = DA - chargesExternes;
  const amortDeductibles = resultatAvantAmort >= 0
    ? Math.min(amortTotal, resultatAvantAmort)
    : 0;
  const amortDifferes = amortTotal - amortDeductibles;
  const resultatFiscal = resultatAvantAmort - amortDeductibles;

  // Tableau 2033-C (toutes dotations, y compris différées)
  const tableau2033C = [];

  if (valeurVenale > 0) {
    tableau2033C.push({
      designation: "Bien immobilier (dépendance Jeuxey)",
      valeur: valeurVenale,
      duree: dureeAmortBien,
      amortAn: amortBienAnnuel,
      cumul: amortBienAnnuel,
      vnc: valeurVenale - amortBienAnnuel,
      isBien: true,
      differe: miseEnLocationAnnee && miseEnLocationAnnee > annee,
    });
  }

  for (const f of amortissables) {
    const ht = parseFloat(f.montant_ht) || 0;
    const duree = parseFloat(f.duree_amort);
    const annuite = ht / duree;
    tableau2033C.push({
      designation: f.fournisseur || f.description || f.filename || "Inconnu",
      valeur: ht,
      duree,
      amortAn: annuite,
      cumul: annuite,
      vnc: ht - annuite,
    });
  }

  const totalAmort = tableau2033C.reduce((s, r) => s + r.amortAn, 0);

  return Response.json({
    annee,
    cases2031: {
      DA,
      case10: chargesExternes,
      case14: amortDeductibles,
      caseGG: Math.abs(resultatFiscal),
      isDeficit: resultatFiscal < 0,
      amortDifferes,
    },
    cases2033B: {
      produits: DA,
      chargesDeductibles: chargesExternes,
      dotationsAmort: amortTotal,
      resultatNet: resultatFiscal,
    },
    regle39C: {
      resultatAvantAmort,
      amortDeductibles,
      amortDifferes,
      resultatFiscal,
    },
    tableau2033C,
    totalAmort,
    detail: {
      deductibleHt,
      totalChargesRec,
      amortAnnuel,
      amortBienAnnuel,
      amortBienBrut,
      miseEnLocationAnnee,
    },
  });
}
