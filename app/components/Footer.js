"use client";
import { useState } from "react";

const MODALS = {
  cgu: {
    title: "Conditions Générales d'Utilisation",
    content: (
      <>
        <Section title="1. Objet">
          CalculetteImmo est un service gratuit en ligne proposant des outils de calcul à usage
          immobilier (mensualités de prêt, capacité d'emprunt, frais de notaire, rentabilité
          locative, intérêts composés). Les résultats fournis sont des <strong>estimations
          indicatives</strong> et ne constituent en aucun cas un conseil financier, fiscal ou
          juridique.
        </Section>
        <Section title="2. Limitations de responsabilité">
          Les calculs sont réalisés sur la base de paramètres saisis par l'utilisateur et de
          données de référence susceptibles d'évoluer (taux légaux, barèmes notariaux…).
          CalculetteImmo décline toute responsabilité quant à l'utilisation des résultats obtenus.
          Toute décision d'investissement doit être prise en concertation avec un professionnel
          qualifié (notaire, conseiller financier, courtier en crédit).
        </Section>
        <Section title="3. Propriété intellectuelle">
          L'ensemble du contenu du site (textes, interfaces, calculs) est protégé par le droit
          d'auteur. Toute reproduction, même partielle, sans autorisation écrite préalable est
          interdite.
        </Section>
        <Section title="4. Disponibilité">
          CalculetteImmo s'efforce d'assurer la disponibilité permanente du service mais ne peut
          garantir une continuité sans interruption. Des maintenances peuvent survenir sans
          préavis.
        </Section>
        <Section title="5. Droit applicable">
          Les présentes CGU sont soumises au droit français. Tout litige relève de la compétence
          exclusive des tribunaux français.
        </Section>
        <Section title="6. Tracker de portefeuille crypto">
          Le tracker crypto de CalculetteImmo est un outil de simulation fiscale fourni à titre purement informatif. Les calculs sont basés sur la méthode PMP (Prix Moyen Pondéré) conformément à l'Article 150 VH bis du Code Général des Impôts, mais ne constituent en aucun cas une déclaration fiscale officielle ni un conseil fiscal ou juridique. L'utilisateur est seul responsable de sa déclaration fiscale auprès de l'administration. CalculetteImmo décline toute responsabilité en cas d'erreur de calcul ou d'utilisation des résultats. Consultez un expert-comptable agréé pour votre situation personnelle.
        </Section>
        <Section title="7. Données financières et confidentialité">
          Les transactions et données de portefeuille saisies dans le tracker sont stockées de manière sécurisée et ne sont accessibles qu'à l'utilisateur connecté. Elles ne sont jamais revendues ni partagées avec des tiers. Vous pouvez supprimer votre compte et toutes vos données à tout moment en nous contactant.
        </Section>
        <Section title="8. Liens partenaires">
          Certains liens présents sur ce site sont des liens d'affiliation. Si vous créez un compte via ces liens, nous pouvons percevoir une commission. Cela ne change pas le prix pour vous.
        </Section>
      </>
    ),
  },
};

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-[#C9A84C] mb-1">{title}</h3>
      <p className="text-sm text-zinc-300 leading-relaxed">{children}</p>
    </div>
  );
}

function Modal({ id, onClose }) {
  const modal = MODALS[id];
  if (!modal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[80vh] flex flex-col rounded-2xl bg-[#12282A] border border-[#C9A84C]/30 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a4a4d]">
          <h2 className="text-base font-semibold text-white">{modal.title}</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="text-zinc-400 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {modal.content}
        </div>
        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2a4a4d] text-right">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#C9A84C] px-5 py-2 text-sm font-medium text-[#0d1f21] hover:bg-[#d4b86a] transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [openModal, setOpenModal] = useState(null);

  return (
    <>
      <footer className="mt-auto border-t border-[#C9A84C]/20 bg-[#0d1f21] py-6">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-4">

          {/* Ligne 1 — liens nav */}
          <nav className="flex flex-wrap items-center justify-center gap-1 text-xs text-zinc-500">
            <a href="/a-propos" className="hover:text-[#C9A84C] transition-colors px-2 py-1 rounded hover:bg-[#C9A84C]/10">À propos</a>
            <span className="text-zinc-700">·</span>
            <a href="/contact" className="hover:text-[#C9A84C] transition-colors px-2 py-1 rounded hover:bg-[#C9A84C]/10">Contact</a>
            <span className="text-zinc-700">·</span>
            <button onClick={() => setOpenModal("cgu")} className="hover:text-[#C9A84C] transition-colors px-2 py-1 rounded hover:bg-[#C9A84C]/10">CGU</button>
            <span className="text-zinc-700">·</span>
            <a href="/politique-confidentialite" className="hover:text-[#C9A84C] transition-colors px-2 py-1 rounded hover:bg-[#C9A84C]/10">Politique de confidentialité</a>
          </nav>

          {/* Ligne 2 — copyright + disclaimer */}
          <p className="text-xs text-zinc-600 text-center">
            © 2026 <span className="text-zinc-400 font-medium">Calculette<span className="text-[#C9A84C]">Immo</span></span> — Estimations à titre indicatif. Les contenus de ce site ne constituent pas des conseils financiers, fiscaux ou juridiques.
          </p>

        </div>
      </footer>

      {openModal && (
        <Modal id={openModal} onClose={() => setOpenModal(null)} />
      )}
    </>
  );
}
