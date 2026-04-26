import Link from "next/link";
import ViewCounter from "@/app/components/ViewCounter";

export const metadata = {
  title: "Blog — Guides immobilier, fiscalité et crypto",
  description:
    "Guides pratiques sur l'immobilier, la fiscalité LMNP, le Bitcoin et les cryptomonnaies. Des explications claires pour prendre les meilleures décisions.",
};

const ARTICLES = [
  {
    slug: "comment-calculer-mensualite-pret-immobilier",
    titre: "Comment calculer la mensualité d'un prêt immobilier ?",
    description:
      "Formule, exemples concrets et tableau comparatif : comprenez exactement comment votre mensualité est calculée en fonction du taux, de la durée et du capital emprunté.",
    tag: "Prêt immobilier",
  },
  {
    slug: "frais-de-notaire-achat-immobilier",
    titre: "Frais de notaire lors d'un achat immobilier : tout comprendre",
    description:
      "Ancien ou neuf, les frais varient du simple au triple. Découvrez leur composition, les barèmes officiels et comment les réduire légalement.",
    tag: "Frais d'acquisition",
  },
  {
    slug: "capacite-emprunt-immobilier",
    titre: "Capacité d'emprunt immobilier : comment la calculer ?",
    description:
      "Revenus retenus, règle des 35 %, rôle de l'apport personnel : maîtrisez tous les leviers pour maximiser votre budget d'achat avant de rencontrer votre banque.",
    tag: "Budget",
  },
  {
    slug: "lmnp-regime-reel-simplifie",
    titre: "LMNP réel simplifié : amortissements, charges et liasse 2031",
    description:
      "Comment calculer vos amortissements par composants, quelles charges déduire, et comment remplir la liasse fiscale 2031 pour payer zéro impôt sur vos loyers.",
    tag: "Fiscalité immobilière",
  },
  {
    slug: "bitcoin-halving-impact-prix",
    titre: "Bitcoin halving : historique, mécanisme et impact sur le prix",
    description:
      "Tous les 4 ans, la récompense des mineurs est divisée par deux. Comprendre ce mécanisme est essentiel pour saisir les cycles de prix du Bitcoin.",
    tag: "Bitcoin",
  },
  {
    slug: "crypto-fiscalite-france-2026",
    titre: "Fiscalité crypto en France 2026 : ce qu'il faut déclarer",
    description:
      "Flat tax 30 %, seuil de 305 €, formulaire 2086, échanges crypto-to-crypto : tout ce que vous devez savoir pour déclarer vos cryptos sans erreur.",
    tag: "Crypto & Fiscalité",
  },
  { slug: "rendement-locatif-net-net", titre: "Rendement locatif net net : ce que les agences ne calculent pas", description: "Rendement brut, net et net net : apprenez à calculer la vraie rentabilité de votre investissement locatif.", tag: "Investissement" },
  { slug: "bitcoin-investissement-long-terme", titre: "Investir dans Bitcoin sur 10 ans : stratégie et risques", description: "DCA, gestion du risque, conservation des clés : comment aborder Bitcoin sur le long terme de façon rationnelle.", tag: "Bitcoin" },
  { slug: "apport-personnel-achat-immobilier", titre: "Apport personnel : quel montant minimum en 2026 ?", description: "Combien faut-il d'apport pour acheter en 2026 ? Règles des banques, minimum exigé et comment emprunter sans apport.", tag: "Financement" },
  { slug: "taux-immobilier-2026", titre: "Taux immobilier 2026 — Où en est-on et que prévoir ?", description: "Analyse des taux immobiliers en 2026, évolution depuis 2024, prévisions et conseils pour emprunter au meilleur taux.", tag: "Immobilier" },
  { slug: "dca-bitcoin-investir-chaque-mois", titre: "DCA Bitcoin — Comment investir 50€/mois et construire un patrimoine", description: "Le DCA (Dollar Cost Averaging) appliqué au Bitcoin : stratégie, avantages, calculs et plateformes recommandées pour investir régulièrement.", tag: "Bitcoin" },
  { slug: "sci-vs-lmnp-quelle-structure", titre: "SCI ou LMNP — Quelle structure choisir pour investir dans l'immobilier locatif ?", description: "Comparatif SCI vs LMNP : fiscalité, avantages, inconvénients et cas pratiques pour choisir la meilleure structure d'investissement locatif.", tag: "Immobilier" },
  { slug: "bitcoin-vs-immobilier-2026", titre: "Bitcoin vs Immobilier — Quel investissement choisir en 2026 ?", description: "Comparatif Bitcoin vs immobilier en 2026 : rendements, risques, fiscalité, liquidité. Faut-il choisir ou combiner les deux ?", tag: "Investissement" },
  { slug: "declarer-crypto-impots-2026", titre: "Déclarer ses crypto aux impôts en 2026 — Guide complet formulaire 2086", description: "Comment déclarer ses cryptomonnaies aux impôts en 2026 ? Guide complet sur le formulaire 2086, la méthode PMP et la flat tax 30%.", tag: "Fiscalité crypto" },
];

export default function BlogIndex() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <ViewCounter slug="blog" />
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center bg-[#0d1f21] py-8 rounded-xl">
          <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Ressources
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Blog <span className="text-[#C9A84C]">immobilier</span>
          </h1>
          <p className="text-zinc-400 text-base max-w-xl mx-auto">
            Des guides pratiques pour comprendre les mécanismes du financement immobilier
            et prendre les meilleures décisions.
          </p>
        </div>

        {/* Articles */}
        <div className="space-y-6">
          {ARTICLES.map(({ slug, titre, description, tag }) => (
            <Link
              key={slug}
              href={`/blog/${slug}`}
              className="group block bg-[#12282A] ring-1 ring-[#C9A84C]/20 hover:ring-[#C9A84C]/60 rounded-2xl p-6 transition-all"
            >
              <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-3">
                {tag}
              </span>
              <h2 className="text-lg font-bold text-white group-hover:text-[#C9A84C] transition-colors mb-2">
                {titre}
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
              <p className="mt-4 text-[#C9A84C] text-sm font-semibold">
                Lire l'article →
              </p>
            </Link>
          ))}
        </div>

        {/* Back */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors"
          >
            ← Retour aux calculettes
          </Link>
        </div>
      </div>
    </main>
  );
}
