import Link from "next/link";
import ViewCounter from "@/app/components/ViewCounter";

export const metadata = {
  title: "Rendement locatif net net : ce que les agences ne calculent pas",
  description:
    "Rendement brut, net et net net : apprenez à calculer la vraie rentabilité de votre investissement locatif en intégrant toutes les charges, la fiscalité et la vacance locative.",
};

export default function ArticleRendementLocatif() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 text-xs text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#C9A84C] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-zinc-400">Rendement locatif net net</span>
        </nav>

        <div className="mb-10">
          <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Investissement locatif
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Rendement locatif net net : ce que les agences ne calculent pas
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Les agences immobilières affichent souvent des rendements bruts flatteurs. La réalité,
            une fois toutes les charges et la fiscalité déduites, est bien différente. Voici comment
            calculer le vrai rendement de votre investissement.
          </p>
        </div>

        <article className="prose prose-invert prose-zinc max-w-none space-y-10 text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Les 3 niveaux de rendement</h2>
            <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl overflow-hidden my-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#C9A84C]/20">
                    <th className="text-left px-4 py-3 text-[#C9A84C] font-semibold">Type</th>
                    <th className="text-left px-4 py-3 text-[#C9A84C] font-semibold">Formule</th>
                    <th className="text-right px-4 py-3 text-[#C9A84C] font-semibold">Exemple</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Brut", "Loyers annuels / Prix d'achat", "6,0 %"],
                    ["Net de charges", "Loyers − charges / Prix d'achat", "4,5 %"],
                    ["Net net (après impôts)", "Revenu net − fiscalité / Prix d'achat", "3,2 %"],
                  ].map(([t, f, e]) => (
                    <tr key={t} className="border-b border-[#2a4a4d] last:border-0">
                      <td className="px-4 py-3 text-white font-medium">{t}</td>
                      <td className="px-4 py-3 text-zinc-400">{f}</td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-medium">{e}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>Ce que les agences affichent c'est presque toujours le <strong className="text-white">rendement brut</strong> — le plus flatteur et le moins représentatif de la réalité.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Les charges à intégrer</h2>
            <p>Pour passer du brut au net, il faut déduire toutes les charges annuelles :</p>
            <ul className="space-y-2 mt-3">
              {[
                "Taxe foncière (souvent 1 à 2 mois de loyer)",
                "Charges de copropriété non récupérables",
                "Assurance propriétaire non occupant (PNO)",
                "Frais de gestion locative (6 à 10 % des loyers si agence)",
                "Provisions pour travaux et entretien (1 % de la valeur du bien par an)",
                "Vacance locative (prévoir 1 mois par an en moyenne)",
                "Assurance loyers impayés (GLI) si souscrite",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#C9A84C] mt-1">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Exemple chiffré complet</h2>
            <p>Appartement acheté 200 000 € (frais de notaire inclus), loué 800 €/mois :</p>
            <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-5 my-4 space-y-2 text-sm">
              {[
                ["Loyers annuels", "+ 9 600 €"],
                ["Taxe foncière", "− 900 €"],
                ["Charges copro non récup.", "− 600 €"],
                ["Assurance PNO", "− 200 €"],
                ["Vacance locative (1 mois)", "− 800 €"],
                ["Provision travaux", "− 1 000 €"],
                ["Revenu net de charges", "= 6 100 €"],
                ["Fiscalité (TMI 30% + PS)", "− 1 464 €"],
                ["Revenu net net", "≈ 4 636 €"],
              ].map(([label, val]) => (
                <div key={label} className={`flex justify-between ${label.startsWith("Revenu") ? "border-t border-[#2a4a4d] pt-2 mt-2" : ""}`}>
                  <span className="text-zinc-400">{label}</span>
                  <span className={val.startsWith("+") ? "text-emerald-400 font-medium" : val.startsWith("−") ? "text-red-400" : "text-[#C9A84C] font-bold"}>{val}</span>
                </div>
              ))}
            </div>
            <p>Rendement net net : <strong className="text-white">4 636 / 200 000 = 2,3 %</strong> — loin du 4,8 % brut affiché en vitrine.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Le bon seuil de rentabilité</h2>
            <p>En règle générale :</p>
            <ul className="space-y-2 mt-3">
              {[
                ["Moins de 3 % net net", "Investissement peu rentable — cherchez mieux ou négociez le prix"],
                ["3 à 5 % net net", "Correct pour une grande ville, acceptable avec une plus-value potentielle"],
                ["5 % et plus net net", "Bonne rentabilité — souvent en zone tendue ou avec une part de travaux"],
              ].map(([seuil, desc]) => (
                <li key={seuil} className="flex items-start gap-2">
                  <span className="text-[#C9A84C] mt-1">›</span>
                  <span><strong className="text-white">{seuil}</strong> — {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 p-5 bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl">
            <p className="text-sm text-zinc-400 mb-3">Calculez la rentabilité de votre investissement :</p>
            <Link href="/" className="inline-block bg-[#C9A84C] text-black font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors">
              Utiliser la calculette rentabilité →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-[#2a4a4d] flex items-center justify-between">
            <Link href="/blog" className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors">
              ← Retour au blog
            </Link>
            <ViewCounter slug="rendement-locatif-net-net" />
          </div>
        </article>
      </div>
    </main>
  );
}
