import Link from "next/link";
import ViewCounter from "@/app/components/ViewCounter";

export const metadata = {
  title: "Investir dans Bitcoin sur 10 ans : stratégie et risques",
  description:
    "Comment investir dans Bitcoin sur le long terme : DCA, gestion du risque, conservation des clés, et pourquoi l'horizon de 10 ans change tout.",
};

export default function ArticleBitcoinLongTerme() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 text-xs text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#C9A84C] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-zinc-400">Bitcoin investissement long terme</span>
        </nav>

        <div className="mb-10">
          <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Bitcoin
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Investir dans Bitcoin sur 10 ans : stratégie et risques
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Bitcoin est l'actif le plus performant de la dernière décennie — mais aussi l'un des plus
            volatils. Voici comment aborder un investissement long terme de façon rationnelle, sans
            FOMO ni panique.
          </p>
        </div>

        <article className="prose prose-invert prose-zinc max-w-none space-y-10 text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Pourquoi le long terme change tout</h2>
            <p>Sur 1 an, Bitcoin peut perdre 70 % de sa valeur — c'est arrivé plusieurs fois. Sur 4 ans (un cycle complet), il n'a jamais terminé en dessous de son prix de départ. Sur 10 ans, chaque investisseur qui a acheté et conservé est largement gagnant.</p>
            <p>L'horizon temporel est la variable la plus importante de votre stratégie. Plus il est long, plus la volatilité court terme devient anecdotique.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">La stratégie DCA — Dollar Cost Averaging</h2>
            <p>
              Le DCA consiste à investir une somme fixe à intervalles réguliers (chaque semaine ou chaque mois) peu importe le prix. C'est la stratégie recommandée pour les investisseurs particuliers car elle :
            </p>
            <ul className="space-y-2 mt-3">
              {[
                "Élimine le stress du timing — inutile de chercher le bon moment d'achat",
                "Lisse le prix d'achat moyen sur la durée",
                "Automatise l'investissement sans suivi quotidien",
                "Fonctionne même pendant les marchés baissiers (on achète moins cher)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#C9A84C] mt-1">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-5 my-4 text-sm">
              <p className="text-zinc-400">Exemple : 100 € par mois pendant 10 ans = 12 000 € investis. Avec un prix moyen lissé sur plusieurs cycles, l'exposition au risque est bien inférieure à un achat unique.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Conservation : exchange ou hardware wallet ?</h2>
            <p><strong className="text-white">"Not your keys, not your coins"</strong> — laisser ses Bitcoin sur une plateforme (Binance, Coinbase…) signifie que vous n'en êtes pas vraiment propriétaire. Si la plateforme fait faillite (comme FTX en 2022), vos fonds peuvent disparaître.</p>
            <p>Pour un investissement long terme :</p>
            <ul className="space-y-2 mt-3">
              {[
                ["Hardware wallet (Ledger, Trezor)", "Recommandé pour les montants importants — vos clés privées sont hors ligne"],
                ["Exchange régulé (Coinbase, Kraken)", "Acceptable pour de petits montants ou du DCA automatisé"],
                ["Exchange non régulé", "À éviter pour le long terme — risque de contrepartie élevé"],
              ].map(([titre, desc]) => (
                <li key={titre} className="flex items-start gap-2">
                  <span className="text-[#C9A84C] mt-1">›</span>
                  <span><strong className="text-white">{titre}</strong> — {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Les risques à connaître</h2>
            <ul className="space-y-2">
              {[
                "Volatilité extrême — des baisses de 50-80 % sont possibles et normales",
                "Risque réglementaire — les gouvernements peuvent restreindre l'usage",
                "Risque technologique — bug de protocole (très improbable mais non nul)",
                "Risque personnel — perte des clés privées = perte définitive des fonds",
                "Risque de concentration — ne jamais investir plus que ce qu'on peut perdre",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-[#0d1f21] border border-yellow-500/20 rounded-xl p-4 mt-6 text-sm text-zinc-400">
              <strong className="text-yellow-500">⚠ Avertissement :</strong> Cet article est informatif et ne constitue pas un conseil en investissement. N'investissez que ce que vous êtes prêt à perdre totalement.
            </div>
          </section>

          <div className="mt-6 pt-6 border-t border-[#2a4a4d] flex items-center justify-between">
            <Link href="/blog" className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors">
              ← Retour au blog
            </Link>
            <ViewCounter slug="bitcoin-investissement-long-terme" />
          </div>
        </article>
      </div>
    </main>
  );
}
