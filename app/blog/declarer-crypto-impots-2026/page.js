export const metadata = {
  title: "Déclarer ses crypto aux impôts en 2026 — Guide complet formulaire 2086",
  description: "Comment déclarer ses cryptomonnaies aux impôts en 2026 ? Guide complet sur le formulaire 2086, la méthode PMP et la flat tax 30%.",
};

export default function DeclarerCryptoImpots2026() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">Fiscalité crypto</span>
          <h1 className="mt-2 text-4xl font-bold text-white">Déclarer ses crypto aux impôts en 2026 — Guide complet formulaire 2086</h1>
          <p className="mt-4 text-zinc-400">Mis à jour le 25 avril 2026 · 12 min de lecture</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-zinc-300 leading-relaxed">
          <p className="text-lg">Vous avez vendu des cryptomonnaies en 2025 ? Vous devez déclarer vos plus-values aux impôts via le formulaire 2086. Voici le guide complet pour ne rien rater.</p>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-400 text-sm">⚠️ Cet article est fourni à titre informatif. Consultez un expert-comptable pour votre situation personnelle.</p>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8">Qui doit déclarer ?</h2>
          <p>Vous devez déclarer vos plus-values crypto si vous avez effectué des <strong className="text-white">cessions à titre onéreux d'actifs numériques</strong> en 2025. Concrètement :</p>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li>Vente de crypto contre des euros ✅</li>
            <li>Échange crypto contre crypto ✅ (depuis 2023)</li>
            <li>Achat d'un bien ou service en crypto ✅</li>
            <li>Simple détention sans vente ❌ (pas de déclaration)</li>
            <li>Achat de crypto ❌ (pas de déclaration)</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">La méthode de calcul — PMP (Article 150 VH bis CGI)</h2>
          <p>La France utilise une méthode spécifique de calcul des plus-values crypto, différente du FIFO utilisé dans d'autres pays.</p>
          <p>La formule officielle :</p>
          <div className="bg-zinc-800 rounded-xl p-4 font-mono text-sm text-[#C9A84C]">
            Plus-value = Prix de cession − (Prix de revient global × Prix de cession / Valeur globale du portefeuille)
          </div>
          <p className="mt-4">Cette formule prend en compte <strong className="text-white">l'ensemble de votre portefeuille crypto</strong> au moment de la cession, pas seulement la crypto vendue. C'est là que beaucoup font des erreurs.</p>

          <h2 className="text-2xl font-bold text-white mt-8">Le formulaire 2086 — Cases à remplir</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li><strong className="text-white">Case 3AN</strong> — Total des prix de cession (somme de toutes vos ventes)</li>
            <li><strong className="text-white">Case 3BN</strong> — Total des prix de revient (calculé selon la méthode PMP)</li>
            <li><strong className="text-white">Case 3BN résultat</strong> — Plus-value nette (3AN − 3BN)</li>
            <li><strong className="text-white">Case 3CA</strong> — Impôt à 12,8% (IR)</li>
            <li><strong className="text-white">Prélèvements sociaux</strong> — 17,2% sur la plus-value nette</li>
          </ul>
          <p>La flat tax totale est donc de <strong className="text-white">30%</strong> (12,8% + 17,2%) sur vos plus-values nettes positives.</p>

          <h2 className="text-2xl font-bold text-white mt-8">Exemple de calcul</h2>
          <p>Imaginons que vous avez :</p>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li>Acheté 0.5 BTC à 40 000€/BTC → investi 20 000€</li>
            <li>Vendu 0.1 BTC à 65 000€/BTC → cession 6 500€</li>
            <li>Valeur totale portefeuille au moment de la vente : 32 500€</li>
          </ul>
          <div className="bg-zinc-800 rounded-xl p-4 text-sm space-y-2">
            <p>Prix de revient = 20 000 × (6 500 / 32 500) = <strong className="text-[#C9A84C]">4 000 €</strong></p>
            <p>Plus-value = 6 500 − 4 000 = <strong className="text-[#C9A84C]">2 500 €</strong></p>
            <p>Impôt = 2 500 × 30% = <strong className="text-[#C9A84C]">750 €</strong></p>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8">Calculez automatiquement avec notre outil</h2>
          <p>Notre tracker crypto calcule automatiquement vos plus-values selon la méthode PMP et génère un PDF avec les cases pré-remplies du formulaire 2086 :</p>
          <a href="/crypto" className="inline-block bg-[#C9A84C] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#d4b86a] transition-colors mt-2">
            Calculer mes plus-values →
          </a>

          <h2 className="text-2xl font-bold text-white mt-8">Les erreurs fréquentes à éviter</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li>Oublier de déclarer les échanges crypto/crypto</li>
            <li>Ne pas inclure les frais dans le prix de revient</li>
            <li>Calculer par crypto et non sur l'ensemble du portefeuille</li>
            <li>Confondre moins-value (non imputable) et plus-value</li>
            <li>Ne pas conserver les justificatifs de chaque transaction</li>
          </ul>

          <div className="mt-8 bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
            <p className="text-xs text-zinc-500">Cet article est fourni à titre informatif uniquement. La fiscalité crypto est complexe et peut évoluer. Consultez un expert-comptable agréé avant votre déclaration.</p>
          </div>
        </div>

        <div className="mt-12">
          <a href="/blog" className="text-[#C9A84C] hover:underline">← Retour au blog</a>
        </div>
      </div>
    </main>
  );
}
