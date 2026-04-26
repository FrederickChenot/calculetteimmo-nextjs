export const metadata = {
  title: "SCI ou LMNP — Quelle structure choisir pour investir dans l'immobilier locatif ?",
  description: "Comparatif SCI vs LMNP : fiscalité, avantages, inconvénients et cas pratiques pour choisir la meilleure structure d'investissement locatif.",
};

export default function SciVsLmnp() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">Immobilier</span>
          <h1 className="mt-2 text-4xl font-bold text-white">SCI ou LMNP — Quelle structure choisir pour investir dans l'immobilier locatif ?</h1>
          <p className="mt-4 text-zinc-400">Mis à jour le 25 avril 2026 · 10 min de lecture</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-zinc-300 leading-relaxed">
          <p className="text-lg">SCI ou LMNP ? C'est la question que se posent tous les investisseurs immobiliers. Ces deux structures ont des avantages bien différents selon votre situation personnelle, votre projet et vos objectifs patrimoniaux.</p>

          <h2 className="text-2xl font-bold text-white mt-8">Le LMNP — Location Meublée Non Professionnelle</h2>
          <p>Le statut LMNP permet de louer un bien meublé en bénéficiant d'une fiscalité avantageuse. C'est un statut individuel, accessible sans création de société.</p>
          <h3 className="text-xl font-semibold text-white mt-4">Avantages du LMNP</h3>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li><strong className="text-white">Amortissement du bien</strong> — déduire la dépréciation du bien et du mobilier</li>
            <li><strong className="text-white">Charges déductibles</strong> — travaux, intérêts d'emprunt, frais de gestion</li>
            <li><strong className="text-white">Résultat fiscal souvent nul</strong> — peu ou pas d'impôt sur les loyers pendant 10-20 ans</li>
            <li><strong className="text-white">Simple à gérer</strong> — pas de création de société, comptable suffisant</li>
            <li><strong className="text-white">Loyers plus élevés</strong> — les meublés se louent 15-30% plus cher que le nu</li>
          </ul>
          <h3 className="text-xl font-semibold text-white mt-4">Inconvénients du LMNP</h3>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li>Transmission patrimoniale moins optimisée que la SCI</li>
            <li>Plus-value de cession imposée (régime des particuliers)</li>
            <li>Limité aux biens meublés</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">La SCI — Société Civile Immobilière</h2>
          <p>La SCI est une société créée pour détenir et gérer des biens immobiliers. Elle peut être à l'IR (impôt sur le revenu) ou à l'IS (impôt sur les sociétés).</p>
          <h3 className="text-xl font-semibold text-white mt-4">Avantages de la SCI</h3>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li><strong className="text-white">Transmission facilitée</strong> — idéal pour transmettre un patrimoine à ses enfants</li>
            <li><strong className="text-white">Multi-associés</strong> — investir à plusieurs facilement</li>
            <li><strong className="text-white">SCI à l'IS</strong> — amortissement possible + taux d'IS avantageux (15% jusqu'à 42 500€)</li>
            <li><strong className="text-white">Séparation patrimoine</strong> — bien isolé dans la société</li>
          </ul>
          <h3 className="text-xl font-semibold text-white mt-4">Inconvénients de la SCI</h3>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li>Création et gestion plus complexes (statuts, AG, comptabilité)</li>
            <li>Coût annuel (expert-comptable, frais de gestion)</li>
            <li>SCI à l'IR : pas d'amortissement, revenus imposés comme revenus fonciers</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">Tableau comparatif SCI vs LMNP</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-zinc-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-zinc-800">
                  <th className="text-left px-4 py-3 text-white">Critère</th>
                  <th className="text-left px-4 py-3 text-[#C9A84C]">LMNP</th>
                  <th className="text-left px-4 py-3 text-[#C9A84C]">SCI à l'IS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {[
                  ["Fiscalité loyers", "Très avantageuse (amortissement)", "Avantageuse (IS 15-25%)"],
                  ["Transmission", "Standard", "Très optimisée"],
                  ["Complexité", "Faible", "Élevée"],
                  ["Coût annuel", "500-1000€ (comptable)", "1500-3000€"],
                  ["Type de bien", "Meublé uniquement", "Tous types"],
                  ["Plus-value cession", "Régime particuliers", "Régime IS (lourd)"],
                ].map(([critere, lmnp, sci]) => (
                  <tr key={critere} className="hover:bg-zinc-800/50">
                    <td className="px-4 py-3 text-white font-medium">{critere}</td>
                    <td className="px-4 py-3 text-zinc-300">{lmnp}</td>
                    <td className="px-4 py-3 text-zinc-300">{sci}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8">Quelle structure choisir ?</h2>
          <p><strong className="text-white">Choisissez le LMNP si :</strong> vous investissez seul, dans un bien meublé, avec un objectif de revenus complémentaires défiscalisés à court/moyen terme.</p>
          <p><strong className="text-white">Choisissez la SCI si :</strong> vous investissez à plusieurs, avez un objectif de transmission patrimoniale, ou détenez plusieurs biens immobiliers.</p>
          <p>Dans tous les cas, consultez un expert-comptable ou un conseiller en gestion de patrimoine avant de vous décider.</p>

          <div className="mt-6">
            <a href="/calculette-rentabilite-locative" className="inline-block bg-[#C9A84C] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#d4b86a] transition-colors">
              Calculer la rentabilité de mon investissement →
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
