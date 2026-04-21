import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#12282A] border-b border-[#C9A84C]/30">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src="/img/logoP.webp"
              alt="Logo Calculette Immo"
              width={52}
              height={52}
              className="rounded-full shrink-0"
            />
          </Link>
          <div>
            <Link href="/">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Calculette<span className="text-[#C9A84C]">Immo</span>
              </h1>
            </Link>
            <p className="text-xs text-zinc-400 mt-0.5">
              Tous vos outils de calcul immobilier
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          <Link href="/crypto" className="text-sm font-semibold text-zinc-300 hover:text-[#C9A84C] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#C9A84C]/10">
            Crypto
          </Link>
          <Link
            href="/blog"
            className="text-sm font-semibold text-zinc-300 hover:text-[#C9A84C] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#C9A84C]/10"
          >
            Blog
          </Link>
          <Link href="/a-propos" className="text-sm font-semibold text-zinc-300 hover:text-[#C9A84C] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#C9A84C]/10">
            À propos
          </Link>
          <Link href="/contact" className="text-sm font-semibold text-zinc-300 hover:text-[#C9A84C] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#C9A84C]/10">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
