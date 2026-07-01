"use client";

import { useState, useEffect } from "react";

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-[#C9A84C] mb-1">{title}</h3>
      <p className="text-sm text-zinc-300 leading-relaxed">{children}</p>
    </div>
  );
}

function ModalConfidentialite({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[80vh] flex flex-col rounded-2xl bg-[#12282A] border border-[#C9A84C]/30 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a4a4d]">
          <h2 className="text-base font-semibold text-white">Politique de Confidentialité</h2>
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
          <Section title="1. Données collectées">
            Les <strong>calculettes publiques</strong> (mensualité, capacité d'emprunt, frais de
            notaire, rentabilité, intérêts composés) n'envoient aucune donnée à nos serveurs : les
            valeurs saisies restent uniquement dans votre navigateur. Les{" "}
            <strong>modules avec compte</strong> (Tracker Crypto, LMNP) nécessitent la création
            d'un compte (email et mot de passe hashé) et stockent les transactions ou factures que
            vous saisissez dans une base de données sécurisée (Neon, UE), accessibles uniquement à
            l'utilisateur connecté et jamais revendues.
          </Section>
          <Section title="2. Cookies et traceurs">
            Le site utilise des cookies techniques nécessaires au fonctionnement, ainsi que des
            cookies publicitaires Google AdSense (si vous les acceptez via le bandeau de
            consentement) pour financer la gratuité du site. Vous pouvez refuser les cookies
            publicitaires à tout moment via le bandeau ou en effaçant vos données de navigation.
            Pour gérer la personnalisation des annonces Google, consultez{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A84C] underline hover:text-[#b8943d]"
            >
              cette page
            </a>
            .
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
          <Section title="Liens d'affiliation">
            Certains liens du site (Tipeee, Bitstack) sont des liens d'affiliation. Si vous créez
            un compte via ces liens, nous pouvons percevoir une commission, sans surcoût pour vous.
          </Section>
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

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function refuse() {
    localStorage.setItem("cookie-consent", "refused");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1f21] border-t border-[#C9A84C]/30 shadow-2xl">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <p className="text-sm text-zinc-300 leading-relaxed">
            Ce site utilise des cookies publicitaires (Google AdSense) pour rester gratuit.{" "}
            <button
              onClick={() => setShowPolicy(true)}
              className="text-[#C9A84C] underline hover:text-[#b8943d] transition-colors"
            >
              Politique de confidentialité
            </button>
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={refuse}
              className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-lg border border-zinc-600 hover:border-zinc-400"
            >
              Refuser
            </button>
            <button
              onClick={accept}
              className="text-sm font-bold text-black bg-[#C9A84C] hover:bg-[#b8943d] transition-colors px-5 py-2 rounded-lg"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>

      {showPolicy && <ModalConfidentialite onClose={() => setShowPolicy(false)} />}
    </>
  );
}
