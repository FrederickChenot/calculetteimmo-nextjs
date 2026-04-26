export const metadata = {
  title: "DCA Bitcoin — Comment investir 50€/mois et construire un patrimoine",
  description: "Le DCA (Dollar Cost Averaging) appliqué au Bitcoin : stratégie, avantages, calculs et plateformes recommandées pour investir régulièrement.",
};

export default function DcaBitcoin() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">Bitcoin</span>
          <h1 className="mt-2 text-4xl font-bold text-white">DCA Bitcoin — Comment investir 50€/mois et construire un patrimoine</h1>
          <p className="mt-4 text-zinc-400">Mis à jour le 25 avril 2026 · 7 min de lecture</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-zinc-300 leading-relaxed">
          <p className="text-lg">Le DCA (Dollar Cost Averaging) ou investissement programmé est la stratégie la plus simple et la plus efficace pour investir en Bitcoin sur le long terme. Voici comment ça fonctionne et pourquoi ça marche.</p>

          <h2 className="text-2xl font-bold text-white mt-8">Qu'est-ce que le DCA ?</h2>
          <p>Le DCA consiste à <strong className="text-white">investir un montant fixe à intervalles réguliers</strong>, peu importe le prix du marché. Par exemple, 50€ chaque semaine ou chaque mois en Bitcoin.</p>
          <p>L'idée est simple : au lieu d'essayer de deviner le meilleur moment pour acheter (ce que personne ne sait faire de manière consistante), vous achetez régulièrement. Quand le prix est bas, vos 50€ achètent plus de Bitcoin. Quand le prix est haut, ils en achètent moins. Sur la durée, vous lissez votre prix d'achat moyen.</p>

          <h2 className="text-2xl font-bold text-white mt-8">Exemple concret : 50€/mois pendant 3 ans</h2>
          <p>Imaginons que vous investissez 50€ par mois en Bitcoin depuis janvier 2023 :</p>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li>Total investi sur 3 ans : <strong className="text-white">1 800 €</strong></li>
            <li>Prix moyen d'achat lissé : environ <strong className="text-white">45 000 €/BTC</strong></li>
            <li>Bitcoin accumulé : environ <strong className="text-white">0.04 BTC</strong></li>
            <li>Valeur en avril 2026 (~65 000€/BTC) : environ <strong className="text-white">2 600 €</strong></li>
            <li>Plus-value : <strong className="text-[#C9A84C]">+800 € soit +44%</strong></li>
          </ul>
          <p>Et ce sans jamais avoir à surveiller les marchés ni à décider du bon moment pour acheter.</p>

          <h2 className="text-2xl font-bold text-white mt-8">Pourquoi le DCA est particulièrement adapté au Bitcoin ?</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li><strong className="text-white">Volatilité élevée</strong> — le DCA réduit l'impact des grosses corrections</li>
            <li><strong className="text-white">Tendance longue haussière</strong> — sur 10 ans, Bitcoin n'a jamais terminé négatif</li>
            <li><strong className="text-white">Psychologie</strong> — pas de stress lié au timing, on reste discipliné</li>
            <li><strong className="text-white">Accessibilité</strong> — on peut commencer avec 10€</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">Quelle plateforme choisir pour le DCA ?</h2>
          <p>Pour les Français qui veulent faire du DCA Bitcoin simplement, <strong className="text-white">Bitstack</strong> est l'option la plus adaptée :</p>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li>Application française, régulée</li>
            <li>DCA automatique depuis 1€</li>
            <li>Interface simple et intuitive</li>
            <li>Arrondi sur vos achats quotidiens (comme Lydia pour la crypto)</li>
          </ul>

          <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-5 my-6">
            <p className="text-sm font-semibold text-white mb-2">Essayez Bitstack</p>
            <p className="text-xs text-zinc-400 mb-4">Créez votre compte et recevez <span className="text-[#C9A84C] font-bold">5 € en Bitcoin offerts</span> après un premier achat de 100 € minimum.</p>
            <a href="https://bitstack-app.com/referral/CVXsenOtiMlY" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-[#C9A84C] text-black font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors">
              Rejoindre Bitstack →
            </a>
            <p className="text-xs text-zinc-600 mt-2">Lien partenaire — je perçois une commission si vous vous inscrivez via ce lien.</p>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8">Suivez vos investissements</h2>
          <p>Pour tracker votre portefeuille Bitcoin et calculer vos plus-values fiscales, utilisez notre outil gratuit :</p>
          <a href="/crypto" className="inline-block bg-[#C9A84C] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#d4b86a] transition-colors mt-2">
            Accéder au Tracker Crypto →
          </a>
        </div>

        <div className="mt-12">
          <a href="/blog" className="text-[#C9A84C] hover:underline">← Retour au blog</a>
        </div>
      </div>
    </main>
  );
}
