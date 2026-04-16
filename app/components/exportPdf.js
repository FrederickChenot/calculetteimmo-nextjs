// Génération PDF avec jsPDF pur — sans plugin externe

// toLocaleString("fr-FR") produit des espaces insécables (\u202F) que jsPDF
// affiche comme "/". On formate avec des espaces normales à la place.
export function fmtNum(value) {
  const n = parseFloat(value);
  if (isNaN(n)) return String(value);
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u0020");
}

const PRIMARY    = "#18625E";
const PRIMARY_R  = 24;  const PRIMARY_G  = 98;  const PRIMARY_B  = 94;
const MARGIN     = 20;
const PAGE_W     = 210;
const ROW_H      = 8;
const COL1_W     = 90;
const COL2_W     = 80;

function loadLogoBase64(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const W = 100;
      const H = Math.round(W / (img.width / img.height));
      const canvas = document.createElement("canvas");
      canvas.width  = W;
      canvas.height = H;
      canvas.getContext("2d").drawImage(img, 0, 0, W, H);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => resolve(null);
  });
}

function drawTable(doc, rows, startY, heading) {
  let y = startY;

  // Titre de section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  doc.text(heading, MARGIN, y);
  y += 6;

  // En-tête de table
  doc.setFillColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  doc.setDrawColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  doc.rect(MARGIN, y, COL1_W + COL2_W, ROW_H, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(rows[0][0], MARGIN + 3, y + ROW_H - 2);
  doc.text(rows[0][1], MARGIN + COL1_W + 3, y + ROW_H - 2);
  y += ROW_H;

  // Lignes de données
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  rows.slice(1).forEach((row, i) => {
    // fond alterné
    if (i % 2 === 0) {
      doc.setFillColor(243, 243, 243);
      doc.rect(MARGIN, y, COL1_W + COL2_W, ROW_H, "F");
    }
    doc.setDrawColor(200, 200, 200);
    doc.rect(MARGIN, y, COL1_W + COL2_W, ROW_H, "S");

    doc.setTextColor(0, 0, 0);
    doc.text(String(row[0]), MARGIN + 3, y + ROW_H - 2);
    doc.text(String(row[1]), MARGIN + COL1_W + 3, y + ROW_H - 2);
    y += ROW_H;
  });

  return y + 8; // y après la table
}

export async function exportPdf({ titre, donnees, resultats, filename }) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  const logoBase64 = await loadLogoBase64("/img/logoP.webp");

  // ── Logo ──────────────────────────────────────────────────────────────
  if (logoBase64) {
    doc.setDrawColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 10, 20, 20, 5, 5, "FD");
    doc.addImage(logoBase64, "JPEG", 10, 10, 20, 20);
  }

  // ── Titre ─────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  doc.text(titre, PAGE_W / 2, 20, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.text(
    `Généré le ${new Date().toLocaleDateString("fr-FR")}`,
    PAGE_W / 2, 27, { align: "center" }
  );

  doc.setDrawColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  doc.line(MARGIN, 32, PAGE_W - MARGIN, 32);

  // ── Tables ────────────────────────────────────────────────────────────
  const y1 = drawTable(
    doc,
    [["Paramètre", "Valeur"], ...donnees],
    38,
    "Données saisies"
  );

  drawTable(
    doc,
    [["Indicateur", "Valeur"], ...resultats],
    y1,
    "Résultats"
  );

  // ── Pied de page ──────────────────────────────────────────────────────
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text(
      "Simulation réalisée sur CalculetteImmo.com - Estimations à titre indicatif",
      PAGE_W / 2, 290, { align: "center" }
    );
    doc.text(`Page ${i} / ${pages}`, PAGE_W - MARGIN, 290, { align: "right" });
  }

  doc.save(filename);
}
