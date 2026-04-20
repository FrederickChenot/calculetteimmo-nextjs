import Link from "next/link";
import ViewCounter from "@/app/components/ViewCounter";

export const metadata = {
  title: "Capacité d'emprunt immobilier : comment la calculer ?",
  description:
    "Découvrez comment calculer votre capacité d'emprunt immobilier : taux d'endettement, revenus pris en compte, apport personnel et conseils pour maximiser votre budget d'achat.",
};

export default function ArticleCapaciteEmprunt() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-zinc-400">Capacité d'emprunt immobilier</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Guide pratique
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Capacité d'emprunt immobilier : comment la calculer ?
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Avant de visiter des biens ou de contacter une banque, il est essentiel de connaître
            votre capacité d'emprunt. C'est le montant maximum que vous pouvez financer par crédit
            immobilier, en fonction de vos revenus, de vos charges et de votre apport.
          </p>
        </div>

        {/* Content */}
        <article className="space-y-10 text-zinc-300 leading-relaxed">

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              La règle des 35 % de taux d'endettement
            </h2>
            <p>
              En France, le Haut Conseil de Stabilité Financière (HCSF) impose aux banques de ne
              pas accorder de prêt immobilier si le taux d'endettement de l'emprunteur dépasse{" "}
              <strong className="text-white">35 % de ses revenus nets</strong>, assurance
              emprunteur comprise.
            </p>
            <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-5 my-4 font-mono text-sm">
              <p className="text-zinc-400">Taux d'endettement = (Total des mensualités de crédit / Revenus nets) × 100</p>
              <p className="text-[#C9A84C] font-bold mt-2">Limite légale : 35 %</p>
            </div>
            <p>
              Si vos revenus nets mensuels s'élèvent à <strong className="text-white">5 000 €</strong>,
              votre mensualité maximale tous crédits confondus est de{" "}
              <strong className="text-white">1 750 €</strong> (assurance incluse). C'est à partir
              de ce plafond que la banque calcule le montant maximum qu'elle peut vous prêter.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Quels revenus la banque prend-elle en compte ?
            </h2>
            <p>
              Toutes les sources de revenus ne se valent pas aux yeux des établissements de crédit.
              Voici ce qui est généralement retenu :
            </p>
            <div className="grid gap-3 mt-4 sm:grid-cols-2">
              {[
                { label: "Salaires en CDI", statut: "✅ Retenus à 100 %", couleur: "text-emerald-400" },
                { label: "Salaires en CDD / intérim", statut: "⚠️ Rarement retenus", couleur: "text-amber-400" },
                { label: "Revenus locatifs", statut: "✅ Retenus à 70 %", couleur: "text-emerald-400" },
                { label: "Revenus d'indépendant", statut: "✅ Moyenne sur 3 ans", couleur: "text-emerald-400" },
                { label: "Primes / 13e mois", statut: "⚠️ Selon régularité", couleur: "text-amber-400" },
                { label: "Allocations familiales", statut: "✅ Retenues selon banque", couleur: "text-emerald-400" },
              ].map(({ label, statut, couleur }) => (
                <div
                  key={label}
                  className="bg-[#0d1f21] border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between gap-4"
                >
                  <span className="text-zinc-300 text-sm">{label}</span>
                  <span className={`text-xs font-semibold shrink-0 ${couleur}`}>{statut}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Exemple de calcul de capacité d'emprunt
            </h2>
            <p>
              Prenons un couple avec des revenus nets combinés de{" "}
              <strong className="text-white">6 000 € par mois</strong>, sans autre crédit en cours,
              souhaitant emprunter sur <strong className="text-white">20 ans</strong> à un taux de{" "}
              <strong className="text-white">3,5 %</strong>.
            </p>
            <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-5 space-y-2 text-sm mt-4">
              <p className="text-zinc-400">Mensualité maximale (35 % de 6 000 €) = <span className="text-white">2 100 €</span></p>
              <p className="text-zinc-400">Dont assurance (0,30 %) ≈ <span className="text-white">−100 €</span></p>
              <p className="text-zinc-400">Mensualité hors assurance disponible = <span className="text-white">2 000 €</span></p>
              <p className="text-[#C9A84C] font-bold text-base border-t border-zinc-700 pt-2 mt-2">
                Capacité d'emprunt ≈ 345 000 €
              </p>
            </div>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">
              L'apport personnel : un levier important
            </h3>
            <p>
              La capacité d'emprunt ne détermine pas à elle seule votre budget total. Si vous
              disposez d'un <strong className="text-white">apport personnel</strong>, celui-ci
              s'ajoute au montant emprunté pour constituer votre budget d'achat global.
            </p>
            <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-5 text-sm mt-4">
              <p className="text-zinc-400">
                Budget d'achat = Capacité d'emprunt + Apport personnel − Frais d'acquisition
              </p>
              <p className="text-[#C9A84C] font-bold mt-2">
                Ex : 345 000 € + 50 000 € apport − 25 000 € frais = <span className="text-white">370 000 € de bien finançable</span>
              </p>
            </div>
            <p className="mt-4">
              Les banques apprécient généralement un apport couvrant au minimum les{" "}
              <strong className="text-white">frais de notaire et de garantie</strong> (soit environ
              10 % du prix du bien), ce qui rassure sur votre capacité d'épargne.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Comment augmenter sa capacité d'emprunt ?
            </h2>
            <ul className="space-y-4 list-none pl-0">
              {[
                {
                  titre: "Allonger la durée du prêt",
                  detail:
                    "Passer de 20 à 25 ans réduit la mensualité et permet d'emprunter davantage. Attention, cela augmente le coût total du crédit.",
                },
                {
                  titre: "Solder ses crédits en cours",
                  detail:
                    "Un crédit à la consommation ou un leasing auto réduit directement votre capacité d'emprunt. Les rembourser avant la demande peut significativement améliorer votre dossier.",
                },
                {
                  titre: "Emprunter à deux",
                  detail:
                    "Co-emprunter avec un conjoint ou un associé permet de cumuler les revenus et donc d'accéder à un budget plus important.",
                },
                {
                  titre: "Négocier le taux",
                  detail:
                    "Un taux plus bas augmente mécaniquement la capacité d'emprunt. Faire jouer la concurrence entre banques ou passer par un courtier peut faire une vraie différence.",
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
              Calculez votre capacité d'emprunt
            </h2>
            <p className="text-zinc-400 mb-6">
              Renseignez vos revenus, vos charges et votre apport : notre simulateur estime
              instantanément le budget d'achat maximum que vous pouvez viser.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#C9A84C] hover:bg-[#b8943d] text-black font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Estimer ma capacité d'emprunt →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-[#2a4a4d] flex items-center justify-between">
            <Link href="/blog" className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors">
              ← Retour au blog
            </Link>
            <ViewCounter slug="capacite-emprunt-immobilier" />
          </div>
        </article>
      </div>
    </main>
  );
}
