import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de CalculetteImmo : données collectées, cookies, hébergement et vos droits RGPD.",
};

export default function PolitiqueConfidentialite() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Légal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Comment CalculetteImmo traite vos données personnelles et respecte votre vie privée.
          </p>
        </div>

        <article className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#C9A84C] mb-3">1. Données collectées</h2>
            <p>
              CalculetteImmo ne collecte <strong className="text-white">aucune donnée personnelle identifiable</strong>. Les
              valeurs saisies dans les calculettes (prix, revenus, taux…) ne sont pas transmises à nos
              serveurs et restent uniquement dans votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C9A84C] mb-3">2. Cookies et traceurs</h2>
            <p>
              Le site peut utiliser des cookies techniques strictement nécessaires au fonctionnement
              (aucun cookie publicitaire ou de profilage). Aucune donnée de navigation n'est revendue
              à des tiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C9A84C] mb-3">3. Hébergement</h2>
            <p>
              Le site est hébergé dans l'Union Européenne. Les données de navigation (logs serveur)
              sont conservées au maximum 30 jours à des fins de sécurité et de débogage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C9A84C] mb-3">4. Vos droits (RGPD)</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (UE 2016/679), vous
              disposez d'un droit d'accès, de rectification et d'effacement. Pour exercer ces droits,
              contactez-nous à l'adresse indiquée sur le site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C9A84C] mb-3">5. Tiers</h2>
            <p>
              Le site peut intégrer des ressources externes (polices Google Fonts, CDN). Ces tiers
              disposent de leurs propres politiques de confidentialité.
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
