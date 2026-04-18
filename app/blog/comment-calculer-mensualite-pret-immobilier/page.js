import Link from "next/link";

export const metadata = {
  title: "Comment calculer la mensualité d'un prêt immobilier ? — CalculetteImmo",
  description:
    "Formule, exemples concrets et simulateur en ligne : apprenez à calculer précisément la mensualité de votre prêt immobilier en fonction du taux, de la durée et du capital emprunté.",
};

export default function ArticleMensualite() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-zinc-400">Mensualité d'un prêt immobilier</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Guide pratique
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Comment calculer la mensualité d'un prêt immobilier ?
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Comprendre comment se calcule votre mensualité vous permet de mieux négocier votre prêt
            et d'anticiper votre budget. Voici tout ce qu'il faut savoir, avec la formule et des
            exemples concrets.
          </p>
        </div>

        {/* Content */}
        <article className="prose prose-invert prose-zinc max-w-none space-y-10 text-zinc-300 leading-relaxed">

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              La formule de calcul d'une mensualité
            </h2>
            <p>
              La mensualité d'un prêt immobilier se calcule à partir de trois paramètres : le
              <strong className="text-white"> capital emprunté</strong>, le{" "}
              <strong className="text-white">taux d'intérêt annuel</strong> et la{" "}
              <strong className="text-white">durée du prêt</strong> en mois. La formule
              mathématique utilisée par les banques est la suivante :
            </p>
            <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-5 my-4 font-mono text-sm text-[#C9A84C]">
              M = C × (t / 12) / [1 − (1 + t / 12)^(−n)]
            </div>
            <ul className="space-y-1 list-none pl-0">
              {[
                ["M", "mensualité"],
                ["C", "capital emprunté"],
                ["t", "taux d'intérêt annuel (ex : 0,035 pour 3,5 %)"],
                ["n", "nombre de mensualités (durée × 12)"],
              ].map(([sym, def]) => (
                <li key={sym} className="flex gap-2">
                  <span className="text-[#C9A84C] font-bold w-4 shrink-0">{sym}</span>
                  <span className="text-zinc-400">= {def}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Exemple concret : 200 000 € sur 20 ans à 3,5 %
            </h2>
            <p>
              Prenons un exemple classique : vous empruntez <strong className="text-white">200 000 €</strong>{" "}
              sur <strong className="text-white">20 ans</strong> (240 mois) à un taux de{" "}
              <strong className="text-white">3,5 %</strong> par an.
            </p>
            <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-5 space-y-2 text-sm">
              <p className="text-zinc-400">Taux mensuel = 3,5 % / 12 = <span className="text-white">0,2917 %</span></p>
              <p className="text-zinc-400">Mensualité = 200 000 × 0,002917 / [1 − (1,002917)^(−240)]</p>
              <p className="text-[#C9A84C] font-bold text-base">Mensualité ≈ 1 159 € / mois</p>
            </div>
            <p className="mt-4">
              Sur 20 ans, vous rembourserez au total environ <strong className="text-white">278 160 €</strong>,
              dont <strong className="text-white">78 160 € d'intérêts</strong>. Ce coût du crédit
              illustre l'importance de comparer les offres et de négocier le taux.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">
              Impact de la durée sur la mensualité
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#C9A84C]/20">
                    <th className="text-left py-2 pr-4 text-[#C9A84C] font-semibold">Durée</th>
                    <th className="text-right py-2 pr-4 text-[#C9A84C] font-semibold">Mensualité</th>
                    <th className="text-right py-2 text-[#C9A84C] font-semibold">Coût total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {[
                    ["15 ans", "1 429 €", "257 220 €"],
                    ["20 ans", "1 159 €", "278 160 €"],
                    ["25 ans", "1 001 €", "300 300 €"],
                  ].map(([duree, m, total]) => (
                    <tr key={duree} className="text-zinc-400">
                      <td className="py-2 pr-4">{duree}</td>
                      <td className="py-2 pr-4 text-right text-white font-medium">{m}</td>
                      <td className="py-2 text-right">{total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-zinc-500 mt-2">Pour 200 000 € empruntés à 3,5 %.</p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Ce que la mensualité ne prend pas en compte
            </h2>
            <p>
              La mensualité calculée par la formule correspond uniquement au remboursement du
              capital et des intérêts. Elle n'inclut pas :
            </p>
            <ul className="space-y-2 list-none pl-0 mt-3">
              {[
                ["Assurance emprunteur", "obligatoire, elle représente généralement 0,1 % à 0,4 % du capital emprunté par an"],
                ["Frais de dossier", "facturés par la banque, de l'ordre de 500 € à 1 500 €"],
                ["Garantie (hypothèque ou caution)", "à prévoir en plus du financement"],
              ].map(([titre, detail]) => (
                <li key={titre} className="flex gap-3">
                  <span className="text-[#C9A84C] mt-1">▸</span>
                  <span>
                    <strong className="text-white">{titre}</strong> — {detail}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Pour évaluer le coût réel d'un prêt, comparez toujours le{" "}
              <strong className="text-white">TAEG (Taux Annuel Effectif Global)</strong>, qui
              intègre tous ces frais.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Taux fixe ou taux variable : quelle mensualité choisir ?
            </h2>
            <p>
              En France, la grande majorité des prêts immobiliers sont accordés à{" "}
              <strong className="text-white">taux fixe</strong>. La mensualité reste identique
              pendant toute la durée du crédit, ce qui facilite la planification budgétaire.
            </p>
            <p className="mt-3">
              Les prêts à <strong className="text-white">taux variable</strong> (ou révisables)
              peuvent démarrer avec une mensualité plus basse, mais celle-ci évolue en fonction
              des indices de référence (euribor). En période de hausse des taux, votre mensualité
              peut augmenter significativement, ce qui représente un risque à ne pas négliger.
            </p>
            <h3 className="text-xl font-semibold text-white mt-6 mb-3">
              Le taux d'endettement maximal
            </h3>
            <p>
              Les banques limitent généralement votre mensualité totale de crédits à{" "}
              <strong className="text-white">35 % de vos revenus nets</strong> (recommandation
              HCSF). Si vos revenus nets sont de 4 000 € par mois, votre mensualité maximale est
              de 1 400 €, assurance comprise.
            </p>
          </section>

          {/* CTA */}
          <div className="bg-[#0d1f21] border border-[#C9A84C]/30 rounded-2xl p-8 text-center mt-8">
            <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-2">
              Outil gratuit
            </p>
            <h2 className="text-2xl font-bold text-white mb-3">
              Calculez votre mensualité en 30 secondes
            </h2>
            <p className="text-zinc-400 mb-6">
              Renseignez votre montant, votre taux et votre durée : notre simulateur fait le calcul
              instantanément.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#C9A84C] hover:bg-[#b8943d] text-black font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Utiliser le simulateur de mensualité →
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
