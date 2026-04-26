export default function sitemap() {
  const base = "https://www.calculetteimmo.com";
  const now = new Date().toISOString();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/a-propos`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/blog/comment-calculer-mensualite-pret-immobilier`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/capacite-emprunt-immobilier`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/frais-de-notaire-achat-immobilier`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/lmnp-regime-reel-simplifie`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/bitcoin-halving-impact-prix`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/crypto-fiscalite-france-2026`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/rendement-locatif-net-net`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/bitcoin-investissement-long-terme`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/apport-personnel-achat-immobilier`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/taux-immobilier-2026`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/dca-bitcoin-investir-chaque-mois`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/sci-vs-lmnp-quelle-structure`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/bitcoin-vs-immobilier-2026`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/declarer-crypto-impots-2026`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/politique-confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
