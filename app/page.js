import Image from "next/image";
import Calculette from "./components/Calculette";
import CapaciteEmprunt from "./components/CapaciteEmprunt";
import FraisNotaire from "./components/FraisNotaire";
import InteretsComposes from "./components/InteretsComposes";
import Rentabilite from "./components/Rentabilite";
import AdSense from "./components/AdSense";

const CARDS = [
  {
    Component: Calculette,
    image: "/img/pret2.webp",
    alt: "Tirelire dorée",
    titre: "Mensualité",
    description: "Calculez vos remboursements mensuels",
  },
  {
    Component: CapaciteEmprunt,
    image: "/img/greenPlanet.webp",
    alt: "Planète verte",
    titre: "Capacité d'emprunt",
    description: "Estimez votre budget d'achat maximum",
  },
  {
    Component: FraisNotaire,
    image: "/img/notaire.webp",
    alt: "Panneau notaire",
    titre: "Frais de notaire",
    description: "Ancien ou neuf, estimez vos frais",
  },
  {
    Component: InteretsComposes,
    image: "/img/interetsComposesImg.webp",
    alt: "Arbres sur pièces",
    titre: "Intérêts composés",
    description: "Faites fructifier votre épargne",
  },
  {
    Component: Rentabilite,
    image: "/img/effort.webp",
    alt: "Écureuil et glands",
    titre: "Rentabilité locative",
    description: "Analysez la rentabilité de votre investissement",
  },
];

function Card({ Component, image, alt, titre, description }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl bg-[#12282A] ring-1 ring-[#C9A84C]/20">
      <div className="relative h-44">
        <Image
          src={image}
          alt={alt}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end px-5 pb-4">
          <span className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest">
            {description}
          </span>
          <h3 className="text-white text-xl font-bold leading-tight">{titre}</h3>
        </div>
      </div>
      <Component />
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex-1 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Intro */}
        <div className="mb-10 text-center bg-[#0d1f21] py-6 rounded-xl">
          <h2 className="text-3xl font-bold text-white">
            Vos outils <span className="text-[#C9A84C]">immobiliers</span>
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Des calculettes précises pour prendre les meilleures décisions
          </p>
        </div>

        {/* Row 1 — 3 cards, grille complète sur xl */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 items-start">
          {CARDS.slice(0, 3).map((card) => (
            <Card key={card.titre} {...card} />
          ))}
        </div>

        {/* Ad 1 — hors grille, pleine largeur */}
        <AdSense slot="1234567890" />

        {/* Row 2 — 2 cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 items-start mt-8">
          {CARDS.slice(3, 5).map((card) => (
            <Card key={card.titre} {...card} />
          ))}
        </div>

        {/* Ad 2 — hors grille, pleine largeur */}
        <AdSense slot="0987654321" />
      </div>
    </main>
  );
}
