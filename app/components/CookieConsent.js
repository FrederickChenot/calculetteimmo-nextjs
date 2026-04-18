"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1f21] border-t border-[#C9A84C]/30 shadow-2xl">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <p className="text-sm text-zinc-300 leading-relaxed">
          Ce site utilise des cookies publicitaires (Google AdSense) pour rester gratuit.{" "}
          <Link
            href="/politique-confidentialite"
            className="text-[#C9A84C] underline hover:text-[#b8943d] transition-colors"
          >
            Politique de confidentialité
          </Link>
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
  );
}
