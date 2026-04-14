"use client";
import { useState, useEffect } from "react";

const inputClass =
  "rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20";

export default function Calculette() {
  const [montant, setMontant] = useState("");
  const [duree, setDuree] = useState("");
  const [taux, setTaux] = useState("");
  const [resultat, setResultat] = useState(null);
  const [tauxBCE, setTauxBCE] = useState(null);

  useEffect(() => {
    fetch("/api/taux")
      .then((r) => r.json())
      .then((d) => { if (d.taux) setTauxBCE(d); })
      .catch(() => {});
  }, []);

  const calculer = (e) => {
    e.preventDefault();
    const m = parseFloat(montant);
    const n = parseFloat(duree) * 12;
    const t = parseFloat(taux) / 100 / 12;
    const mensualite = (m * t) / (1 - Math.pow(1 + t, -n));
    setResultat(mensualite.toFixed(2));
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-[#12282A] p-8">
      {tauxBCE && (
        <div className="mb-5 flex items-center gap-2 rounded-full bg-[#C9A84C]/10 px-3 py-1.5 ring-1 ring-[#C9A84C]/30 w-fit">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84C] shrink-0" />
          <span className="text-xs font-medium text-[#C9A84C]">
            Taux BCE actuel : {tauxBCE.taux}%{tauxBCE.date ? ` (${tauxBCE.date})` : ""}
          </span>
        </div>
      )}
      <form onSubmit={calculer} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label htmlFor="montant" className="text-sm font-medium text-zinc-300">
            Montant emprunté (€)
          </label>
          <input
            id="montant"
            type="number"
            placeholder="ex : 200000"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="duree" className="text-sm font-medium text-zinc-300">
            Durée (années)
          </label>
          <input
            id="duree"
            type="number"
            value={duree}
            onChange={(e) => setDuree(e.target.value)}
            placeholder="ex : 20"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="taux" className="text-sm font-medium text-zinc-300">
            Taux d&apos;intérêt annuel (%)
          </label>
          <input
            id="taux"
            type="number"
            step="0.01"
            placeholder="ex : 3.5"
            value={taux}
            onChange={(e) => setTaux(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-full bg-[#C9A84C] px-6 py-3 font-semibold text-[#12282A] transition-colors hover:bg-[#b8942d]"
        >
          Calculer
        </button>
      </form>

      {resultat && (
        <div className="mt-6 rounded-xl bg-[#0d1f21] p-4 text-center">
          <p className="text-sm text-zinc-400">Mensualité estimée</p>
          <p className="text-3xl font-bold text-white">{resultat} €</p>
        </div>
      )}
    </div>
  );
}
