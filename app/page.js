import Image from "next/image";
import Calculette from "./components/Calculette";
import CapaciteEmprunt from "./components/CapaciteEmprunt";
import FraisNotaire from "./components/FraisNotaire";
import InteretsComposes from "./components/InteretsComposes";
import Rentabilite from "./components/Rentabilite";

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

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 items-start">
          {CARDS.map(({ Component, image, alt, titre, description }) => (
            <div
              key={titre}
              className="rounded-2xl overflow-hidden shadow-2xl bg-[#12282A] ring-1 ring-[#C9A84C]/20"
            >
              {/* Image banner */}
              <div className="relative h-44">
                <Image
                  src={image}
                  alt={alt}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                {/* Gradient overlay with title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end px-5 pb-4">
                  <span className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest">
                    {description}
                  </span>
                  <h3 className="text-white text-xl font-bold leading-tight">
                    {titre}
                  </h3>
                </div>
              </div>

              {/* Calculator component */}
              <Component />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
