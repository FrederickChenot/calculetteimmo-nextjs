import Link from "next/link";

export const metadata = {
  title: "Blog immobilier — Guides et conseils — CalculetteImmo",
  description:
    "Guides pratiques pour comprendre le prêt immobilier : mensualités, frais de notaire, capacité d'emprunt. Des explications claires pour prendre les bonnes décisions.",
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
];

export default function BlogIndex() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
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
