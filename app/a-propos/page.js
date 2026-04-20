import Link from "next/link";

export const metadata = {
  title: "À propos",
  description: "CalculetteImmo est un site gratuit de simulateurs immobiliers créé pour aider les particuliers à prendre les meilleures décisions financières.",
};

export default function APropos() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            À propos
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Qui sommes-nous ?
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            CalculetteImmo est un site gratuit de simulateurs immobiliers, créé pour aider les particuliers à prendre les meilleures décisions financières sans jargon ni frais cachés.
          </p>
        </div>

        <article className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Notre mission</h2>
            <p>
              L'immobilier est souvent l'investissement le plus important d'une vie. Pourtant, les outils de simulation sont soit trop complexes, soit trop simplistes. CalculetteImmo propose des calculettes précises, gratuites et accessibles à tous — que vous soyez primo-accédant, investisseur locatif ou simplement curieux.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Nos outils</h2>
            <ul className="space-y-2">
              {[
                ["Mensualité", "Calculez vos remboursements mensuels selon le taux et la durée"],
                ["Capacité d'emprunt", "Estimez le budget maximum que votre banque peut vous accorder"],
                ["Frais de notaire", "Ancien ou neuf, calculez vos frais d'acquisition"],
                ["Intérêts composés", "Simulez la croissance de votre épargne dans le temps"],
                ["Rentabilité locative", "Analysez la rentabilité brute et nette d'un investissement"],
              ].map(([titre, desc]) => (
                <li key={titre} className="flex items-start gap-2">
                  <span className="text-[#C9A84C] mt-1">›</span>
                  <span><strong className="text-white">{titre}</strong> — {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Soutenir le projet</h2>
            <p>
              CalculetteImmo est entièrement gratuit et sans abonnement. Si les outils vous sont utiles, vous pouvez soutenir le projet sur Tipeee — chaque contribution aide à maintenir et améliorer le site.
            </p>
            <a
              href="https://fr.tipeee.com/boite-a-outils"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 bg-[#C9A84C] text-black font-bold px-6 py-2 rounded-lg hover:bg-[#d4b86a] transition-colors"
            >
              ❤️ Soutenir sur Tipeee
            </a>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
            <p>
              Une question, une suggestion ou un bug à signaler ?{" "}
              <a href="mailto:6thfc@proton.me" className="text-[#C9A84C] underline hover:text-[#d4b86a] transition-colors">
                6thfc@proton.me
              </a>
            </p>
          </section>

          <div className="pt-6 border-t border-[#2a4a4d]">
            <Link href="/" className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors">
              ← Retour aux calculettes
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
