export const metadata = {
  title: "Bitcoin vs Immobilier — Quel investissement choisir en 2026 ?",
  description: "Comparatif Bitcoin vs immobilier en 2026 : rendements, risques, fiscalité, liquidité. Faut-il choisir ou combiner les deux ?",
};

export default function BitcoinVsImmobilier() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">Investissement</span>
          <h1 className="mt-2 text-4xl font-bold text-white">Bitcoin vs Immobilier — Quel investissement choisir en 2026 ?</h1>
          <p className="mt-4 text-zinc-400">Mis à jour le 25 avril 2026 · 9 min de lecture</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-zinc-300 leading-relaxed">
          <p className="text-lg">Bitcoin ou immobilier ? Les deux ont leurs partisans convaincus. En 2026, avec un Bitcoin autour de 65 000€ et des taux immobiliers en baisse, la question mérite une analyse objective.</p>

          <h2 className="text-2xl font-bold text-white mt-8">Performance historique</h2>
          <p>Sur les 10 dernières années, Bitcoin a largement surperformé l'immobilier en termes de rendement brut. Mais cette comparaison omet l'effet de levier immobilier — vous pouvez acheter un bien de 200 000€ avec 20 000€ d'apport.</p>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li><strong className="text-white">Bitcoin (2016-2026)</strong> : +50 000% environ</li>
            <li><strong className="text-white">Immobilier Paris (2016-2026)</strong> : +40% environ</li>
            <li><strong className="text-white">Immobilier avec levier x5</strong> : rendement réel x3 à x5 sur fonds propres</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">Comparatif détaillé</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-zinc-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-zinc-800">
                  <th className="text-left px-4 py-3 text-white">Critère</th>
                  <th className="text-left px-4 py-3 text-[#C9A84C]">Bitcoin</th>
                  <th className="text-left px-4 py-3 text-[#C9A84C]">Immobilier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {[
                  ["Rendement potentiel", "Très élevé", "Modéré avec levier"],
                  ["Risque", "Très élevé", "Modéré"],
                  ["Liquidité", "Immédiate", "3-6 mois"],
                  ["Ticket d'entrée", "Dès 10€", "10 000-50 000€ apport"],
                  ["Effet de levier", "Non (déconseillé)", "Oui (crédit)"],
                  ["Revenus passifs", "Non", "Oui (loyers)"],
                  ["Fiscalité", "Flat tax 30%", "Variable (LMNP avantageux)"],
                  ["Complexité gestion", "Faible", "Élevée"],
                ].map(([critere, btc, immo]) => (
                  <tr key={critere} className="hover:bg-zinc-800/50">
                    <td className="px-4 py-3 text-white font-medium">{critere}</td>
                    <td className="px-4 py-3 text-zinc-300">{btc}</td>
                    <td className="px-4 py-3 text-zinc-300">{immo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8">La vraie question : pourquoi choisir ?</h2>
          <p>Les investisseurs les plus avisés ne choisissent pas entre Bitcoin et immobilier — ils combinent les deux. Une allocation typique pourrait être :</p>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li><strong className="text-white">70-80%</strong> en immobilier locatif (LMNP) — revenus stables, effet de levier</li>
            <li><strong className="text-white">10-20%</strong> en Bitcoin — exposition à la croissance long terme</li>
            <li><strong className="text-white">5-10%</strong> en liquidités — sécurité et opportunités</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">Nos outils pour vous aider</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <a href="/calculette-rentabilite-locative" className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 hover:border-[#C9A84C]/50 transition-colors">
              <p className="font-semibold text-white text-sm">Calculette immobilier</p>
              <p className="text-xs text-zinc-400 mt-1">Simulez votre investissement locatif</p>
            </a>
            <a href="/crypto" className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 hover:border-[#C9A84C]/50 transition-colors">
              <p className="font-semibold text-white text-sm">Tracker Bitcoin</p>
              <p className="text-xs text-zinc-400 mt-1">Suivez votre portefeuille crypto</p>
            </a>
          </div>
        </div>

        <div className="mt-12">
          <a href="/blog" className="text-[#C9A84C] hover:underline">← Retour au blog</a>
        </div>
      </div>
    </main>
  );
}
