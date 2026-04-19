import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import Providers from "./components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "CalculetteImmo — Outils de calcul immobilier",
    template: "%s — CalculetteImmo",
  },
  description:
    "Calculez votre mensualité, capacité d'emprunt, frais de notaire, rentabilité locative et intérêts composés.",
  openGraph: {
    images: [
      {
        url: "/img/og-image.webp",
        width: 1200,
        height: 630,
        alt: "CalculetteImmo — Vos outils de calcul immobilier",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#12282A]">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9574641219746800"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Providers>
          <Header />
          {children}
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
