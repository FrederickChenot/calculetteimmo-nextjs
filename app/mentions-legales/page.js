import Link from "next/link";

export const metadata = {
  title: "Mentions légales",
};

export default function MentionsLegales() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Légal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Mentions légales
          </h1>
        </div>

        <article className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#C9A84C] mb-3">Éditeur du site</h2>
            <p>
              CalculetteImmo est édité à titre personnel par Frédérick Chenot, particulier
              domicilié en France.
              <br />
              Contact : 6thfc@proton.me
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C9A84C] mb-3">Hébergement</h2>
            <p>
              Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723,
              États-Unis (
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A84C] underline hover:text-[#b8943d] transition-colors"
              >
                https://vercel.com
              </a>
              ).
              <br />
              La base de données est hébergée par Neon (Union Européenne).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C9A84C] mb-3">Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu (textes, calculettes, interfaces) est protégé par le droit
              d'auteur. Toute reproduction sans autorisation est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C9A84C] mb-3">Publicité</h2>
            <p>
              Ce site diffuse des publicités via Google AdSense. Voir notre{" "}
              <Link
                href="/politique-confidentialite"
                className="text-[#C9A84C] underline hover:text-[#b8943d] transition-colors"
              >
                politique de confidentialité
              </Link>{" "}
              pour le détail des cookies utilisés.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C9A84C] mb-3">
              Conditions d'utilisation
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">1. Objet</h3>
                <p>
                  CalculetteImmo est un service gratuit en ligne proposant des outils de calcul à
                  usage immobilier (mensualités de prêt, capacité d'emprunt, frais de notaire,
                  rentabilité locative, intérêts composés). Les résultats fournis sont des{" "}
                  <strong className="text-white">estimations indicatives</strong> et ne
                  constituent en aucun cas un conseil financier, fiscal ou juridique.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  2. Limitations de responsabilité
                </h3>
                <p>
                  Les calculs sont réalisés sur la base de paramètres saisis par l'utilisateur et
                  de données de référence susceptibles d'évoluer (taux légaux, barèmes
                  notariaux…). CalculetteImmo décline toute responsabilité quant à l'utilisation
                  des résultats obtenus. Toute décision d'investissement doit être prise en
                  concertation avec un professionnel qualifié (notaire, conseiller financier,
                  courtier en crédit).
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">3. Disponibilité</h3>
                <p>
                  CalculetteImmo s'efforce d'assurer la disponibilité permanente du service mais
                  ne peut garantir une continuité sans interruption. Des maintenances peuvent
                  survenir sans préavis.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">4. Droit applicable</h3>
                <p>
                  Les présentes conditions sont soumises au droit français. Tout litige relève de
                  la compétence exclusive des tribunaux français.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  5. Tracker de portefeuille crypto
                </h3>
                <p>
                  Le tracker crypto de CalculetteImmo est un outil de simulation fiscale fourni à
                  titre purement informatif. Les calculs sont basés sur la méthode PMP (Prix Moyen
                  Pondéré) conformément à l'Article 150 VH bis du Code Général des Impôts, mais ne
                  constituent en aucun cas une déclaration fiscale officielle ni un conseil fiscal
                  ou juridique. L'utilisateur est seul responsable de sa déclaration fiscale auprès
                  de l'administration. CalculetteImmo décline toute responsabilité en cas d'erreur
                  de calcul ou d'utilisation des résultats. Consultez un expert-comptable agréé
                  pour votre situation personnelle.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  6. Données financières et confidentialité
                </h3>
                <p>
                  Les transactions et données de portefeuille saisies dans le tracker sont
                  stockées de manière sécurisée et ne sont accessibles qu'à l'utilisateur
                  connecté. Elles ne sont jamais revendues ni partagées avec des tiers. Vous
                  pouvez supprimer votre compte et toutes vos données à tout moment en nous
                  contactant.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">7. Liens partenaires</h3>
                <p>
                  Certains liens présents sur ce site sont des liens d'affiliation. Si vous créez
                  un compte via ces liens, nous pouvons percevoir une commission. Cela ne change
                  pas le prix pour vous.
                </p>
              </div>
            </div>
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
