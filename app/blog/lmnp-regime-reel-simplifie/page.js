import Link from "next/link";
import ViewCounter from "@/app/components/ViewCounter";

export const metadata = {
  title: "LMNP réel simplifié : amortissements, charges et liasse 2031",
  description:
    "Guide complet du régime LMNP réel simplifié : comment calculer vos amortissements par composants, quelles charges déduire, et comment remplir la liasse fiscale 2031.",
};

export default function ArticleLMNP() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 text-xs text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#C9A84C] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-zinc-400">LMNP réel simplifié</span>
        </nav>

        <div className="mb-10">
          <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Fiscalité immobilière
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            LMNP réel simplifié : amortissements, charges et liasse 2031
          </h1>
          <ViewCounter slug="lmnp-regime-reel-simplifie" />
          <p className="text-zinc-400 text-lg leading-relaxed">
            Le régime réel simplifié est le plus avantageux pour un loueur meublé non professionnel.
            Bien utilisé, il permet de louer plusieurs années sans payer un centime d'impôt grâce aux
            amortissements. Voici comment ça fonctionne concrètement.
          </p>
        </div>

        <article className="prose prose-invert prose-zinc max-w-none space-y-10 text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Pourquoi choisir le réel simplifié ?</h2>
            <p>
              En LMNP, vous avez le choix entre deux régimes fiscaux : le <strong className="text-white">micro-BIC</strong> (abattement forfaitaire de 50 %) et le <strong className="text-white">réel simplifié</strong>. Le réel est presque toujours plus avantageux dès que vous avez un emprunt en cours ou des travaux à amortir.
            </p>
            <p>
              La raison est simple : au réel, vous déduisez vos charges <em>réelles</em> — intérêts d'emprunt, assurances, frais de gestion, taxe foncière — et surtout vous amortissez le bien et le mobilier. Ces amortissements sont souvent supérieurs à l'abattement de 50 % du micro-BIC, ce qui génère un résultat fiscal nul ou déficitaire pendant des années.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">L'amortissement par composants</h2>
            <p>
              En LMNP réel, le bien immobilier n'est pas amorti en une seule ligne. Il est décomposé en <strong className="text-white">composants</strong>, chacun ayant une durée de vie différente selon les préconisations du BOFIP :
            </p>
            <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl overflow-hidden my-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#C9A84C]/20">
                    <th className="text-left px-4 py-3 text-[#C9A84C] font-semibold">Composant</th>
                    <th className="text-right px-4 py-3 text-[#C9A84C] font-semibold">Quote-part</th>
                    <th className="text-right px-4 py-3 text-[#C9A84C] font-semibold">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Structure / gros œuvre", "55–70 %", "50 ans"],
                    ["Façade", "10–15 %", "30 ans"],
                    ["Toiture", "5–10 %", "25 ans"],
                    ["Installations techniques", "10–15 %", "15 ans"],
                    ["Agencements intérieurs", "5–10 %", "10 ans"],
                    ["Mobilier", "100 % de la valeur", "5–7 ans"],
                  ].map(([c, q, d]) => (
                    <tr key={c} className="border-b border-[#2a4a4d] last:border-0">
                      <td className="px-4 py-3 text-zinc-300">{c}</td>
                      <td className="px-4 py-3 text-right text-zinc-400">{q}</td>
                      <td className="px-4 py-3 text-right text-zinc-400">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Le terrain (généralement 10–20 % de la valeur totale) <strong className="text-white">n'est pas amortissable</strong>. Il faut donc le déduire de la base d'amortissement avant de répartir les composants.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Les charges déductibles</h2>
            <p>Au-delà des amortissements, vous pouvez déduire chaque année :</p>
            <ul className="space-y-2 mt-3">
              {[
                "Intérêts d'emprunt et assurance emprunteur",
                "Taxe foncière (hors ordures ménagères si refacturée au locataire)",
                "Frais de gestion locative ou d'agence",
                "Assurance propriétaire non occupant (PNO)",
                "Charges de copropriété non récupérables",
                "Frais d'entretien et petites réparations",
                "Honoraires d'expert-comptable (déductibles et éligibles à réduction d'impôt)",
                "Frais d'acquisition (notaire, agence) — amortissables sur 5 ans ou déduits l'année d'achat",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#C9A84C] mt-1">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">La liasse fiscale 2031</h2>
            <p>
              Au réel simplifié, vous déposez chaque année une <strong className="text-white">liasse fiscale 2031</strong> accompagnée de ses annexes (2033-A à 2033-G). C'est plus complexe qu'une déclaration micro-BIC, mais un expert-comptable spécialisé peut s'en charger pour 150 à 300 € par an — une somme largement compensée par l'économie fiscale générée.
            </p>
            <p>
              Le résultat fiscal (bénéfice ou déficit) est ensuite reporté sur votre déclaration de revenus en case 5NA (bénéfice) ou 5NY (déficit). En LMNP, le déficit <strong className="text-white">n'est pas imputable sur le revenu global</strong> — il est reportable sur les bénéfices BIC non professionnels des 10 années suivantes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Exemple chiffré</h2>
            <p>Pour un appartement acheté 150 000 € (hors terrain de 20 000 €), avec 10 000 € de mobilier :</p>
            <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-5 my-4 space-y-2 text-sm">
              {[
                ["Loyers annuels", "+ 7 200 €"],
                ["Amortissement bien (130 000 € sur 30 ans moy.)", "− 4 333 €"],
                ["Amortissement mobilier (10 000 € sur 7 ans)", "− 1 428 €"],
                ["Intérêts emprunt", "− 2 100 €"],
                ["Charges diverses (taxe foncière, assurances…)", "− 1 200 €"],
                ["Résultat fiscal", "≈ − 1 861 €"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-zinc-400">{label}</span>
                  <span className={val.startsWith("+") ? "text-emerald-400 font-medium" : val.startsWith("−") ? "text-red-400 font-medium" : "text-[#C9A84C] font-bold"}>{val}</span>
                </div>
              ))}
            </div>
            <p>Résultat : <strong className="text-white">0 € d'impôt</strong> sur ces loyers, et le déficit se reporte sur les années suivantes.</p>
          </section>

          <div className="mt-10 p-5 bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl">
            <p className="text-sm text-zinc-400 mb-3">Calculez la rentabilité de votre investissement locatif :</p>
            <Link href="/#rentabilite" className="inline-block bg-[#C9A84C] text-black font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors">
              Utiliser la calculette rentabilité →
            </Link>
          </div>

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
