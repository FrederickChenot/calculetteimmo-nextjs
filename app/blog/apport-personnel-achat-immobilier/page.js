import Link from "next/link";
import ViewCounter from "@/app/components/ViewCounter";

export const metadata = {
  title: "Apport personnel achat immobilier : quel montant minimum en 2026 ?",
  description:
    "Combien faut-il d'apport pour acheter un bien immobilier en 2026 ? Règles des banques, apport minimum, et comment emprunter sans apport.",
};

export default function ArticleApportPersonnel() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 text-xs text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#C9A84C] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-zinc-400">Apport personnel immobilier</span>
        </nav>

        <div className="mb-10">
          <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Financement immobilier
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Apport personnel : quel montant minimum en 2026 ?
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            L'apport personnel est souvent le premier obstacle pour les primo-accédants. Combien faut-il vraiment ? Que couvre-t-il exactement ? Et peut-on acheter sans apport ? Voici les réponses claires.
          </p>
        </div>

        <article className="prose prose-invert prose-zinc max-w-none space-y-10 text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">À quoi sert l'apport ?</h2>
            <p>L'apport personnel sert principalement à couvrir les <strong className="text-white">frais annexes</strong> que la banque ne finance pas :</p>
            <ul className="space-y-2 mt-3">
              {[
                "Frais de notaire (7-8 % dans l'ancien, 2-3 % dans le neuf)",
                "Frais de garantie (caution bancaire ou hypothèque)",
                "Frais de dossier bancaire",
                "Frais d'agence immobilière si à la charge de l'acheteur",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#C9A84C] mt-1">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">Au total, ces frais représentent <strong className="text-white">8 à 12 % du prix d'achat</strong> dans l'ancien.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Le minimum exigé par les banques</h2>
            <p>En 2026, la grande majorité des banques exigent un apport minimum de <strong className="text-white">10 % du prix du bien</strong> — juste de quoi couvrir les frais de notaire et de garantie.</p>
            <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-5 my-4 space-y-2 text-sm">
              {[
                ["Bien à 200 000 €", ""],
                ["Apport minimum (10 %)", "20 000 €"],
                ["Frais de notaire (8 %)", "16 000 €"],
                ["Frais de garantie", "≈ 2 000 €"],
                ["Reste pour l'apport \"pur\"", "≈ 2 000 €"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-zinc-400">{label}</span>
                  <span className="text-white font-medium">{val}</span>
                </div>
              ))}
            </div>
            <p>Plus votre apport est élevé, meilleures sont les conditions : taux plus bas, mensualités réduites, meilleure image auprès de la banque.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Emprunter sans apport : possible ?</h2>
            <p>Oui, c'est possible mais de plus en plus rare depuis les recommandations du HCSF (Haut Conseil de Stabilité Financière). Les banques accordent des prêts à 110 % (prix + frais) principalement à :</p>
            <ul className="space-y-2 mt-3">
              {[
                "Jeunes actifs avec CDI récent et bon salaire",
                "Investisseurs locatifs avec un dossier solide",
                "Clients ayant déjà un patrimoine significatif dans la banque",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#C9A84C] mt-1">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Comment constituer son apport</h2>
            <ul className="space-y-2">
              {[
                ["Livret A et LDDS", "Disponible immédiatement, idéal pour l'apport à court terme"],
                ["PEL (Plan Épargne Logement)", "Conçu pour l'achat immobilier, taux garanti"],
                ["Donation familiale", "Jusqu'à 100 000 € par parent tous les 15 ans sans impôt"],
                ["Déblocage épargne salariale", "PEE ou PERCO débloquables pour achat résidence principale"],
                ["PTZ (Prêt à Taux Zéro)", "Peut compléter l'apport pour les primo-accédants éligibles"],
              ].map(([titre, desc]) => (
                <li key={titre} className="flex items-start gap-2">
                  <span className="text-[#C9A84C] mt-1">›</span>
                  <span><strong className="text-white">{titre}</strong> — {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 p-5 bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl">
            <p className="text-sm text-zinc-400 mb-3">Estimez votre capacité d'emprunt selon votre apport :</p>
            <Link href="/" className="inline-block bg-[#C9A84C] text-black font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors">
              Utiliser la calculette capacité d'emprunt →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-[#2a4a4d] flex items-center justify-between">
            <Link href="/blog" className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors">
              ← Retour au blog
            </Link>
            <ViewCounter slug="apport-personnel-achat-immobilier" />
          </div>
        </article>
      </div>
    </main>
  );
}
