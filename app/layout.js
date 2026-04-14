import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CalculetteImmo — Outils de calcul immobilier",
  description:
    "Calculez votre mensualité, capacité d'emprunt, frais de notaire, rentabilité locative et intérêts composés.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#12282A]">
        <Header />
        {children}
        <footer className="border-t border-[#C9A84C]/20 py-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} CalculetteImmo — Estimations à titre indicatif
        </footer>
      </body>
    </html>
  );
}
