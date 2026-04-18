import Link from "next/link";

export const metadata = {
  title: "Fiscalité crypto en France 2026 : ce qu'il faut déclarer",
  description:
    "Guide complet sur la fiscalité des cryptomonnaies en France en 2026 : flat tax, seuil de 305 €, cessions imposables, formulaire 2086 et erreurs à éviter.",
};

export default function ArticleCryptoFiscalite() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 text-xs text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#C9A84C] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-zinc-400">Fiscalité crypto France</span>
        </nav>

        <div className="mb-10">
          <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Crypto & Fiscalité
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Fiscalité crypto en France 2026 : ce qu'il faut déclarer
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Beaucoup d'investisseurs crypto ignorent leurs obligations fiscales — et se retrouvent avec
            des redressements surprises. Voici les règles en vigueur en France pour 2026, expliquées
            simplement.
          </p>
        </div>

        <article className="prose prose-invert prose-zinc max-w-none space-y-10 text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Le principe : la flat tax à 30 %</h2>
            <p>
              En France, les plus-values sur cessions de cryptomonnaies sont soumises au <strong className="text-white">Prélèvement Forfaitaire Unique (PFU)</strong> de <strong className="text-white">30 %</strong> — aussi appelé flat tax — composé de 12,8 % d'impôt sur le revenu et 17,2 % de prélèvements sociaux.
            </p>
            <p>
              Vous pouvez opter pour le barème progressif de l'impôt sur le revenu si celui-ci vous est plus favorable (revenus modestes), mais c'est rarement le cas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Qu'est-ce qu'une cession imposable ?</h2>
            <p>Une cession est imposable dès que vous convertissez de la crypto en <strong className="text-white">monnaie fiat (euros, dollars)</strong>. En revanche, les échanges crypto-to-crypto (Bitcoin contre Ethereum par exemple) ne sont <strong className="text-white">pas imposables</strong> en France — contrairement à ce qui se pratique dans d'autres pays.</p>
            <p>Sont imposables :</p>
            <ul className="space-y-2 mt-3">
              {[
                "Vente de crypto contre des euros sur une plateforme (Coinbase, Binance, Kraken…)",
                "Paiement d'un bien ou service en crypto",
                "Conversion en stablecoin adossé à une monnaie fiat (USDT, USDC)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#C9A84C] mt-1">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Le seuil de 305 €</h2>
            <p>
              Si le total de vos cessions dans l'année est <strong className="text-white">inférieur à 305 €</strong>, vous êtes exonéré d'impôt. Au-dessus, la totalité de la plus-value est imposable — pas seulement la partie au-dessus du seuil.
            </p>
            <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-5 my-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-zinc-400">Cessions totales dans l'année</span><span className="text-white font-medium">15 000 €</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Prix de revient moyen pondéré</span><span className="text-white font-medium">10 000 €</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Plus-value nette</span><span className="text-emerald-400 font-medium">5 000 €</span></div>
              <div className="flex justify-between border-t border-[#2a4a4d] pt-2"><span className="text-zinc-400">Impôt dû (30 %)</span><span className="text-[#C9A84C] font-bold">1 500 €</span></div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Le formulaire 2086</h2>
            <p>
              Chaque cession imposable doit être déclarée sur le <strong className="text-white">formulaire 2086</strong>, joint à votre déclaration de revenus. Il faut y renseigner pour chaque cession : la date, le prix de cession, la valeur globale du portefeuille au moment de la cession, et le prix de revient global.
            </p>
            <p>
              Le calcul du prix de revient utilise une méthode spécifique — la <strong className="text-white">valeur globale du portefeuille</strong> — et non pas un FIFO classique. C'est là que beaucoup d'investisseurs font des erreurs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Les erreurs les plus fréquentes</h2>
            <ul className="space-y-2">
              {[
                "Ne pas déclarer parce qu'on pense que \"personne ne le sait\" — les plateformes françaises sont tenues de déclarer à l'administration fiscale",
                "Confondre échange crypto-crypto (non imposable) et conversion en fiat (imposable)",
                "Oublier de déclarer les comptes sur plateformes étrangères (formulaire 3916-bis)",
                "Ne pas conserver ses historiques de transactions pour justifier le prix de revient",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-[#0d1f21] border border-yellow-500/20 rounded-xl p-4 mt-6 text-sm text-zinc-400">
              <strong className="text-yellow-500">⚠ Avertissement :</strong> Cet article est informatif et ne constitue pas un conseil fiscal. Pour votre situation personnelle, consultez un expert-comptable ou un conseiller fiscal.
            </div>
          </section>

          <div className="mt-6 pt-6 border-t border-[#2a4a4d]">
            <Link href="/blog" className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors">
              ← Retour au blog
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
