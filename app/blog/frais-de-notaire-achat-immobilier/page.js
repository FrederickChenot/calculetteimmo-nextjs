import Link from "next/link";

export const metadata = {
  title: "Frais de notaire lors d'un achat immobilier : montant et calcul — CalculetteImmo",
  description:
    "Combien coûtent les frais de notaire en 2024 ? Découvrez comment ils se calculent pour un bien ancien ou neuf, les tranches officielles et comment les réduire légalement.",
};

export default function ArticleFraisNotaire() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-zinc-400">Frais de notaire</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Guide pratique
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Frais de notaire lors d'un achat immobilier : tout comprendre
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Souvent appelés « frais d'acquisition », les frais de notaire représentent un poste
            budgétaire incontournable lors d'un achat immobilier. Voici comment les calculer
            précisément et comment les optimiser.
          </p>
        </div>

        {/* Content */}
        <article className="space-y-10 text-zinc-300 leading-relaxed">

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Que comprennent réellement les frais de notaire ?
            </h2>
            <p>
              Contrairement à ce que leur nom suggère, les frais de notaire ne reviennent pas
              entièrement au notaire. Ils se décomposent en trois grandes parties :
            </p>
            <div className="grid gap-4 mt-4 sm:grid-cols-3">
              {[
                ["~80 %", "Droits et taxes", "collectés par l'État et les collectivités (droits de mutation, taxe de publicité foncière)"],
                ["~10 %", "Débours", "frais avancés par le notaire pour les formalités (cadastre, hypothèques, géomètre…)"],
                ["~10 %", "Émoluments", "la rémunération réelle du notaire, encadrée par décret"],
              ].map(([pct, titre, detail]) => (
                <div key={titre} className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-4">
                  <p className="text-[#C9A84C] text-2xl font-bold mb-1">{pct}</p>
                  <p className="text-white font-semibold text-sm mb-1">{titre}</p>
                  <p className="text-zinc-500 text-xs">{detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Ancien vs neuf : des taux très différents
            </h2>
            <p>
              Le montant des frais varie fortement selon que vous achetez un bien{" "}
              <strong className="text-white">ancien</strong> ou{" "}
              <strong className="text-white">neuf</strong> (moins de 5 ans ou vendu pour la
              première fois après achèvement).
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">
              Bien ancien : environ 7 à 8 % du prix de vente
            </h3>
            <p>
              Pour un logement ancien, les droits de mutation (appelés couramment « droits
              d'enregistrement ») s'élèvent à{" "}
              <strong className="text-white">5,80 % du prix</strong> dans la plupart des
              départements français (certains appliquent 5,09 %). Ajoutez les émoluments et les
              débours, et la facture totale atteint <strong className="text-white">7 à 8 %</strong>{" "}
              du prix d'achat.
            </p>
            <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-5 mt-4">
              <p className="text-zinc-400 text-sm">Exemple — Achat d'un appartement ancien à 250 000 €</p>
              <p className="text-[#C9A84C] font-bold text-lg mt-1">
                Frais estimés : 17 500 € à 20 000 €
              </p>
            </div>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">
              Bien neuf : environ 2 à 3 % du prix de vente
            </h3>
            <p>
              Pour un bien neuf (VEFA, maison neuve), la TVA est déjà intégrée dans le prix de
              vente et les droits de mutation sont réduits à{" "}
              <strong className="text-white">0,715 %</strong>. Les frais totaux restent autour de{" "}
              <strong className="text-white">2 à 3 %</strong>, ce qui représente une économie
              substantielle par rapport à l'ancien.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Les tranches des émoluments du notaire
            </h2>
            <p>
              Les honoraires du notaire sont calculés par tranches dégressives, fixées par décret.
              Plus le prix du bien est élevé, plus le pourcentage appliqué est faible :
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#C9A84C]/20">
                    <th className="text-left py-2 pr-4 text-[#C9A84C] font-semibold">Tranche</th>
                    <th className="text-right py-2 text-[#C9A84C] font-semibold">Taux</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-400">
                  <tr><td className="py-2 pr-4">De 0 à 6 500 €</td><td className="py-2 text-right">3,945 %</td></tr>
                  <tr><td className="py-2 pr-4">De 6 500 € à 17 000 €</td><td className="py-2 text-right">1,627 %</td></tr>
                  <tr><td className="py-2 pr-4">De 17 000 € à 60 000 €</td><td className="py-2 text-right">1,085 %</td></tr>
                  <tr><td className="py-2 pr-4">Au-delà de 60 000 €</td><td className="py-2 text-right">0,814 %</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-zinc-500 mt-2">
              Ces taux sont appliqués HT, puis majorés de 20 % de TVA.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Comment réduire légalement les frais de notaire ?
            </h2>
            <ul className="space-y-4 list-none pl-0">
              {[
                {
                  titre: "Déduire la valeur des meubles",
                  detail:
                    "Si le bien est vendu avec des équipements (cuisine équipée, électroménager, meubles), leur valeur peut être déduite du prix de vente soumis aux droits. Un inventaire précis et valorisé dans le compromis peut réduire l'assiette de calcul.",
                },
                {
                  titre: "Acheter dans le neuf",
                  detail:
                    "Comme vu précédemment, les frais en VEFA sont nettement inférieurs. Si vous hésitez entre ancien et neuf, ce critère peut peser dans la balance.",
                },
                {
                  titre: "Négocier les honoraires d'agence à la charge du vendeur",
                  detail:
                    "Si la commission d'agence est à la charge du vendeur, elle ne rentre pas dans l'assiette des droits de mutation, ce qui réduit légèrement les frais.",
                },
              ].map(({ titre, detail }) => (
                <li key={titre} className="flex gap-3">
                  <span className="text-[#C9A84C] mt-1 shrink-0">▸</span>
                  <div>
                    <strong className="text-white">{titre}</strong>
                    <p className="text-zinc-400 mt-1">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <div className="bg-[#0d1f21] border border-[#C9A84C]/30 rounded-2xl p-8 text-center mt-8">
            <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-2">
              Outil gratuit
            </p>
            <h2 className="text-2xl font-bold text-white mb-3">
              Estimez vos frais de notaire en quelques secondes
            </h2>
            <p className="text-zinc-400 mb-6">
              Renseignez le prix du bien et son type (ancien ou neuf) : notre calculette applique
              les vrais barèmes officiels.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#C9A84C] hover:bg-[#b8943d] text-black font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Calculer mes frais de notaire →
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
