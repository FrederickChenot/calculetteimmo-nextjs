import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-[#12282A] border-b border-[#C9A84C]/30">
      <div className="mx-auto max-w-7xl flex items-center gap-4 px-6 py-5">
        <Image
          src="/img/logoP.webp"
          alt="Logo Calculette Immo"
          width={52}
          height={52}
          className="rounded-full shrink-0"
        />
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Calculette<span className="text-[#C9A84C]">Immo</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Tous vos outils de calcul immobilier
          </p>
        </div>
      </div>
    </header>
  );
}
