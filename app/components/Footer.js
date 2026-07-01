export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#C9A84C]/20 bg-[#0d1f21] py-6">
      <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-4">

        {/* Ligne 1 — liens nav */}
        <nav className="flex flex-wrap items-center justify-center gap-1 text-xs text-zinc-500">
          <a href="/a-propos" className="hover:text-[#C9A84C] transition-colors px-2 py-1 rounded hover:bg-[#C9A84C]/10">À propos</a>
          <span className="text-zinc-700">·</span>
          <a href="/contact" className="hover:text-[#C9A84C] transition-colors px-2 py-1 rounded hover:bg-[#C9A84C]/10">Contact</a>
          <span className="text-zinc-700">·</span>
          <a href="/mentions-legales" className="hover:text-[#C9A84C] transition-colors px-2 py-1 rounded hover:bg-[#C9A84C]/10">Mentions légales</a>
          <span className="text-zinc-700">·</span>
          <a href="/politique-confidentialite" className="hover:text-[#C9A84C] transition-colors px-2 py-1 rounded hover:bg-[#C9A84C]/10">Politique de confidentialité</a>
        </nav>

        {/* Ligne 2 — copyright + disclaimer */}
        <p className="text-xs text-zinc-600 text-center">
          © 2026 <span className="text-zinc-400 font-medium">Calculette<span className="text-[#C9A84C]">Immo</span></span> — Estimations à titre indicatif. Les contenus de ce site ne constituent pas des conseils financiers, fiscaux ou juridiques.
        </p>

      </div>
    </footer>
  );
}
