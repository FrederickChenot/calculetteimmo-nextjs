import Link from "next/link";

export const metadata = {
  title: "Contact",
  description: "Contactez CalculetteImmo pour toute question, suggestion ou signalement de bug.",
};

export default function Contact() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Contact
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Nous contacter
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Une question, une suggestion ou un bug à signaler ? On vous répond dans les plus brefs délais.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Par email</h2>
            <p className="text-zinc-400 text-sm mb-4">Pour toute question générale, suggestion d'outil ou signalement de bug.</p>
            <a
              href="mailto:6thfc@proton.me"
              className="inline-flex items-center gap-2 bg-[#C9A84C] text-black font-bold px-6 py-2 rounded-lg hover:bg-[#d4b86a] transition-colors"
            >
              ✉️ 6thfc@proton.me
            </a>
          </div>

          <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Soutenir le projet</h2>
            <p className="text-zinc-400 text-sm mb-4">CalculetteImmo est gratuit. Si les outils vous sont utiles, vous pouvez soutenir le développement.</p>
            <a
              href="https://fr.tipeee.com/boite-a-outils"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#12282A] ring-1 ring-[#C9A84C]/40 text-[#C9A84C] font-bold px-6 py-2 rounded-lg hover:ring-[#C9A84C] transition-colors"
            >
              ❤️ Soutenir sur Tipeee
            </a>
          </div>

          <div className="pt-6 border-t border-[#2a4a4d]">
            <Link href="/" className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors">
              ← Retour aux calculettes
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
