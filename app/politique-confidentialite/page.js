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
              Le traitement des données dépend de l'outil utilisé :
            </p>
            <p className="mt-2">
              <strong className="text-white">Calculettes publiques</strong> (mensualité, capacité
              d'emprunt, frais de notaire, rentabilité, intérêts composés) : aucune donnée n'est
              envoyée à nos serveurs. Les valeurs saisies (prix, revenus, taux…) restent
              uniquement dans votre navigateur.
            </p>
            <p className="mt-2">
              <strong className="text-white">Modules avec compte</strong> (Tracker Crypto, LMNP) :
              ces outils nécessitent la création d'un compte (email et mot de passe hashé) et
              stockent les transactions ou factures que vous saisissez dans une base de données
              sécurisée hébergée par Neon (Union Européenne). Ces données ne sont accessibles qu'à
              l'utilisateur connecté et ne sont jamais revendues.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C9A84C] mb-3">2. Cookies et traceurs</h2>
            <p>
              Le site utilise des cookies techniques nécessaires au fonctionnement, ainsi que des
              cookies publicitaires Google AdSense (si vous les acceptez via le bandeau de
              consentement) pour financer la gratuité du site. Vous pouvez refuser les cookies
              publicitaires à tout moment via le bandeau ou en effaçant vos données de navigation.
              Pour gérer la personnalisation des annonces Google, consultez{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A84C] underline hover:text-[#b8943d] transition-colors"
              >
                cette page
              </a>
              .
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

          <section>
            <h2 className="text-xl font-bold text-[#C9A84C] mb-3">Liens d'affiliation</h2>
            <p>
              Certains liens du site (Tipeee, Bitstack) sont des liens d'affiliation. Si vous
              créez un compte via ces liens, nous pouvons percevoir une commission, sans surcoût
              pour vous.
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
