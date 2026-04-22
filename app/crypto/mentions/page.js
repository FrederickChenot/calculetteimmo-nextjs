export const metadata = { title: "Mentions légales — Tracker Crypto" };

export default function MentionsCrypto() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 bg-[#12282A] min-h-screen">
      <div className="mx-auto max-w-3xl space-y-8 text-sm text-zinc-300 leading-relaxed">
        <h1 className="text-3xl font-bold text-white">
          Mentions légales <span className="text-[#C9A84C]">Tracker Crypto</span>
        </h1>

        {[
          {
            titre: "⚠️ Avertissement fiscal important",
            texte: `Ce tracker est un outil de simulation fourni à titre informatif uniquement. \nLes calculs utilisent la méthode PMP (Prix Moyen Pondéré) conformément à l'Article 150 VH bis du CGI et à la doctrine fiscale française sur les actifs numériques.\n\nCes calculs ne constituent PAS :\n- Une déclaration fiscale officielle\n- Un conseil fiscal ou juridique\n- Une garantie d'exactitude\n\nL'utilisateur est seul responsable de sa déclaration fiscale. Consultez un expert-comptable ou conseiller fiscal agréé avant toute déclaration aux impôts.`,
          },
          {
            titre: "Limitation de responsabilité",
            texte: "CalculetteImmo ne peut être tenu responsable d'erreurs dans les calculs, d'omissions, de changements législatifs postérieurs à la mise à jour de l'outil, ou de toute conséquence fiscale résultant de l'utilisation de ce tracker. L'utilisation de cet outil se fait sous l'entière responsabilité de l'utilisateur.",
          },
          {
            titre: "Méthode de calcul",
            texte: "Les plus-values sont calculées selon la méthode du Prix Moyen Pondéré global du portefeuille, conformément à l'Article 150 VH bis du CGI et au formulaire 2086. La flat tax de 30% (12,8% IR + 17,2% prélèvements sociaux) est appliquée sur les plus-values nettes positives. Les moins-values ne sont pas imputables sur d'autres revenus.",
          },
          {
            titre: "Données personnelles",
            texte: "Vos transactions et données de portefeuille sont stockées de manière sécurisée sur des serveurs européens. Elles ne sont accessibles qu'à vous et ne sont jamais revendues ni partagées avec des tiers. Conformément au RGPD, vous pouvez demander la suppression de vos données à tout moment via notre page Contact.",
          },
          {
            titre: "Liens partenaires",
            texte: "Certains liens présents sur ce site (notamment vers Bitstack) sont des liens d'affiliation. Si vous créez un compte via ces liens, nous pouvons percevoir une commission. Cela ne change pas le prix ni les conditions pour vous.",
          },
          {
            titre: "Évolutions législatives",
            texte: "La fiscalité des cryptomonnaies est susceptible d'évoluer. CalculetteImmo s'efforce de maintenir cet outil à jour mais ne garantit pas que les calculs reflètent en temps réel les dernières évolutions législatives ou doctrinales.",
          },
        ].map(({ titre, texte }) => (
          <div key={titre} className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-3">{titre}</h2>
            <p className="text-zinc-400 whitespace-pre-line">{texte}</p>
          </div>
        ))}

        <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-6 text-center">
          <p className="text-[#C9A84C] font-semibold mb-2">Besoin d&apos;aide pour votre déclaration ?</p>
          <p className="text-zinc-400 text-xs">Consultez un expert-comptable spécialisé en cryptomonnaies pour valider vos calculs avant déclaration.</p>
        </div>
      </div>
    </main>
  );
}
