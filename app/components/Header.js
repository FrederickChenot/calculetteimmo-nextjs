"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/crypto", label: "Crypto" },
  { href: "/lmnp", label: "Comptabilité LMNP" },
  { href: "/blog", label: "Blog" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

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

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-semibold text-zinc-300 hover:text-[#C9A84C] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#C9A84C]/10"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Bouton hamburger mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-9 h-9 rounded-lg hover:bg-[#C9A84C]/10 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          <span className={`block w-5 h-0.5 bg-zinc-300 transition-transform duration-200 ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block w-5 h-0.5 bg-zinc-300 transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-zinc-300 transition-transform duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Menu déroulant mobile */}
      {open && (
        <nav className="md:hidden border-t border-[#C9A84C]/20 bg-[#12282A] px-6 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm font-semibold text-zinc-300 hover:text-[#C9A84C] transition-colors px-3 py-2 rounded-lg hover:bg-[#C9A84C]/10"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
