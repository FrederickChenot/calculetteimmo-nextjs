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
      </>
    ),
  },
  confidentialite: {
    title: "Politique de Confidentialité",
    content: (
      <>
        <Section title="1. Données collectées">
          CalculetteImmo ne collecte <strong>aucune donnée personnelle identifiable</strong>. Les
          valeurs saisies dans les calculettes (prix, revenus, taux…) ne sont pas transmises à nos
          serveurs et restent uniquement dans votre navigateur.
        </Section>
        <Section title="2. Cookies et traceurs">
          Le site peut utiliser des cookies techniques strictement nécessaires au fonctionnement
          (aucun cookie publicitaire ou de profilage). Aucune donnée de navigation n'est revendue
          à des tiers.
        </Section>
        <Section title="3. Hébergement">
          Le site est hébergé dans l'Union Européenne. Les données de navigation (logs serveur)
          sont conservées au maximum 30 jours à des fins de sécurité et de débogage.
        </Section>
        <Section title="4. Vos droits (RGPD)">
          Conformément au Règlement Général sur la Protection des Données (UE 2016/679), vous
          disposez d'un droit d'accès, de rectification et d'effacement. Pour exercer ces droits,
          contactez-nous à l'adresse indiquée sur le site.
        </Section>
        <Section title="5. Tiers">
          Le site peut intégrer des ressources externes (polices Google Fonts, CDN). Ces tiers
          disposent de leurs propres politiques de confidentialité.
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
      <footer className="mt-auto border-t border-[#C9A84C]/20 bg-[#0d1f21] py-5">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-xs text-zinc-500">
            © 2026{" "}
            <span className="text-zinc-400 font-medium">
              Calculette<span className="text-[#C9A84C]">Immo</span>
            </span>{" "}
            — Estimations à titre indicatif
          </p>
          <nav className="flex items-center gap-1 text-xs text-zinc-500">
            <button
              onClick={() => setOpenModal("cgu")}
              className="hover:text-[#C9A84C] transition-colors px-2 py-1 rounded hover:bg-[#C9A84C]/10"
            >
              CGU
            </button>
            <span className="text-zinc-700">·</span>
            <button
              onClick={() => setOpenModal("confidentialite")}
              className="hover:text-[#C9A84C] transition-colors px-2 py-1 rounded hover:bg-[#C9A84C]/10"
            >
              Politique de confidentialité
            </button>
          </nav>
        </div>
      </footer>

      {openModal && (
        <Modal id={openModal} onClose={() => setOpenModal(null)} />
      )}
    </>
  );
}
