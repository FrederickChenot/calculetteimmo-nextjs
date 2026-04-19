import Link from "next/link";
import ViewCounter from "@/app/components/ViewCounter";

export const metadata = {
  title: "Bitcoin halving : historique, mécanisme et impact sur le prix",
  description:
    "Comprendre le halving Bitcoin : pourquoi il se produit tous les 4 ans, comment il a fait évoluer le prix historiquement, et ce qu'on peut attendre des prochains cycles.",
};

export default function ArticleBitcoinHalving() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 text-xs text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#C9A84C] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-zinc-400">Bitcoin halving</span>
        </nav>

        <div className="mb-10">
          <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Bitcoin
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Bitcoin halving : historique, mécanisme et impact sur le prix
          </h1>
          <ViewCounter slug="bitcoin-halving-impact-prix" />
          <p className="text-zinc-400 text-lg leading-relaxed">
            Tous les quatre ans environ, la récompense des mineurs Bitcoin est divisée par deux.
            Cet événement — le halving — est l'un des mécanismes les plus influents sur le prix du BTC.
            Voici ce qu'il faut comprendre avant le prochain cycle.
          </p>
        </div>

        <article className="prose prose-invert prose-zinc max-w-none space-y-10 text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Qu'est-ce que le halving ?</h2>
            <p>
              Le protocole Bitcoin prévoit qu'il n'existera jamais plus de <strong className="text-white">21 millions de BTC</strong>. Pour contrôler l'émission, Satoshi Nakamoto a intégré un mécanisme automatique : tous les 210 000 blocs (environ 4 ans), la récompense accordée aux mineurs pour chaque bloc validé est divisée par deux.
            </p>
            <p>
              Au lancement en 2009, la récompense était de <strong className="text-white">50 BTC par bloc</strong>. Aujourd'hui, après 4 halvings, elle est de <strong className="text-white">3,125 BTC</strong>. Ce rythme décroissant fait du Bitcoin un actif <em>déflationniste par conception</em>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Historique des halvings</h2>
            <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl overflow-hidden my-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#C9A84C]/20">
                    <th className="text-left px-4 py-3 text-[#C9A84C] font-semibold">Halving</th>
                    <th className="text-right px-4 py-3 text-[#C9A84C] font-semibold">Date</th>
                    <th className="text-right px-4 py-3 text-[#C9A84C] font-semibold">Récompense</th>
                    <th className="text-right px-4 py-3 text-[#C9A84C] font-semibold">Prix ~1 an après</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["#1", "Nov. 2012", "25 BTC", "~1 000 $"],
                    ["#2", "Juil. 2016", "12,5 BTC", "~19 000 $"],
                    ["#3", "Mai 2020", "6,25 BTC", "~69 000 $"],
                    ["#4", "Avr. 2024", "3,125 BTC", "En cours…"],
                  ].map(([h, d, r, p]) => (
                    <tr key={h} className="border-b border-[#2a4a4d] last:border-0">
                      <td className="px-4 py-3 text-zinc-300 font-medium">{h}</td>
                      <td className="px-4 py-3 text-right text-zinc-400">{d}</td>
                      <td className="px-4 py-3 text-right text-zinc-400">{r}</td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-medium">{p}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Chaque halving a historiquement été suivi d'un bull run majeur dans les 12 à 18 mois suivants. Ce n'est pas une garantie — les conditions macroéconomiques, la régulation et l'adoption institutionnelle jouent également un rôle déterminant.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Pourquoi le halving influence-t-il le prix ?</h2>
            <p>Le mécanisme est simple : si la demande reste constante et que l'offre nouvelle est réduite de moitié, le prix doit monter pour équilibrer le marché. C'est la loi de l'offre et de la demande appliquée à un actif numérique rare.</p>
            <p>Mais ce n'est pas que mécanique. Le halving génère aussi un effet médiatique et psychologique important : il attire l'attention des investisseurs retail et institutionnels, amplifiant la demande au moment même où l'offre se contracte.</p>
            <p>Depuis 2020, un facteur supplémentaire s'est ajouté : l'entrée massive des <strong className="text-white">institutionnels</strong> (BlackRock, Fidelity, MicroStrategy) et le lancement des <strong className="text-white">ETF Bitcoin spot</strong> aux États-Unis en janvier 2024, qui ont créé une demande structurelle inédite.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Ce que ça change pour un investisseur particulier</h2>
            <p>Le halving ne signifie pas que le prix va automatiquement monter — mais il modifie structurellement l'équilibre offre/demande. Pour un investisseur long terme, comprendre ce cycle permet de :</p>
            <ul className="space-y-2 mt-3">
              {[
                "Éviter d'acheter au sommet d'un cycle (12-18 mois après le halving)",
                "Profiter des phases de correction pré-halving pour accumuler",
                "Comprendre pourquoi la volatilité est structurelle, pas accidentelle",
                "Calibrer son horizon d'investissement sur des cycles de 4 ans",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#C9A84C] mt-1">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-[#0d1f21] border border-yellow-500/20 rounded-xl p-4 mt-6 text-sm text-zinc-400">
              <strong className="text-yellow-500">⚠ Avertissement :</strong> Cet article est informatif et ne constitue pas un conseil en investissement. Le Bitcoin est un actif hautement volatil. N'investissez que ce que vous êtes prêt à perdre.
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
