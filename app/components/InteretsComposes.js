"use client";
import { useState, useRef } from "react";

function calculerInteretsComposes(capital, epargne, taux, horizon, intervalle) {
  const tauxAnnuel = taux / 100;
  const periodesParAn = 12 / intervalle;
  const tauxParPeriode = tauxAnnuel / periodesParAn;
  const nombrePeriodes = horizon * periodesParAn;

  const capitalAvecInterets = capital * (1 + tauxParPeriode) ** nombrePeriodes;

  let totalVersement = 0;
  if (epargne > 0) {
    const facteur = (1 + tauxParPeriode) ** nombrePeriodes;
    totalVersement = (epargne * intervalle * (facteur - 1)) / tauxParPeriode;
  }

  const capitalFinal = capitalAvecInterets + totalVersement;
  const totalInterets = capitalFinal - capital - epargne * 12 * horizon;
  const totalVersements = capitalFinal - totalInterets;

  return {
    capitalFinal: Math.round(capitalFinal * 100) / 100,
    totalVersements: Math.round(totalVersements * 100) / 100,
    totalInterets: Math.round(totalInterets * 100) / 100,
  };
}

const inputClass =
  "rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20";

const INTERVALLES = [
  { label: "Mensuel", value: 1 },
  { label: "Trimestriel", value: 3 },
  { label: "Annuel", value: 12 },
];

export default function InteretsComposes() {
  const [capital, setCapital] = useState(10000);
  const [epargne, setEpargne] = useState(200);
  const [taux, setTaux] = useState(5);
  const [horizon, setHorizon] = useState(10);
  const [intervalle, setIntervalle] = useState(1);
  const [modeAvance, setModeAvance] = useState(false);
  const tracked = useRef(false);

  const trackUsage = () => {
    if (!tracked.current) {
      tracked.current = true;
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "calc-interets" }),
      }).catch(() => {});
    }
  };

  const tousValides = capital !== "" && taux !== "" && horizon !== "";

  const resultat = tousValides
    ? calculerInteretsComposes(
        parseFloat(capital) || 0,
        parseFloat(epargne) || 0,
        parseFloat(taux) || 0,
        parseFloat(horizon) || 0,
        intervalle,
      )
    : null;

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-[#12282A] p-8">
<div className="flex flex-col gap-5">
        {/* Capital initial */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-zinc-300">
              Capital initial (€)
            </label>
            <span className="text-sm font-medium text-[#C9A84C]">
              {Number(capital).toLocaleString("fr-FR")} €
            </span>
          </div>
          <input
            type="number"
            min="0"
            value={capital}
            onChange={(e) => { setCapital(e.target.value); trackUsage(); }}
            className={inputClass}
          />
          <input
            type="range"
            min="0"
            max="500000"
            step="1000"
            value={capital}
            onChange={(e) => { setCapital(e.target.value); trackUsage(); }}
            className="w-full accent-[#C9A84C]"
          />
        </div>

        {/* Épargne mensuelle */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-zinc-300">
              Épargne mensuelle (€)
            </label>
            <span className="text-sm font-medium text-[#C9A84C]">
              {Number(epargne).toLocaleString("fr-FR")} €
            </span>
          </div>
          <input
            type="number"
            min="0"
            value={epargne}
            onChange={(e) => setEpargne(e.target.value)}
            className={inputClass}
          />
          <input
            type="range"
            min="0"
            max="5000"
            step="50"
            value={epargne}
            onChange={(e) => setEpargne(e.target.value)}
            className="w-full accent-[#C9A84C]"
          />
        </div>

        {/* Taux */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-zinc-300">
              Taux d&apos;intérêt annuel (%)
            </label>
            <span className="text-sm font-medium text-[#C9A84C]">
              {taux} %
            </span>
          </div>
          <input
            type="number"
            min="0"
            step="0.01"
            value={taux}
            onChange={(e) => setTaux(e.target.value)}
            className={inputClass}
          />
          <input
            type="range"
            min="0"
            max="15"
            step="0.1"
            value={taux}
            onChange={(e) => setTaux(e.target.value)}
            className="w-full accent-[#C9A84C]"
          />
        </div>

        {/* Horizon */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-zinc-300">
              Horizon de placement (années)
            </label>
            <span className="text-sm font-medium text-[#C9A84C]">
              {horizon} ans
            </span>
          </div>
          <input
            type="number"
            min="0"
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            className={inputClass}
          />
          <input
            type="range"
            min="1"
            max="40"
            step="1"
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            className="w-full accent-[#C9A84C]"
          />
        </div>

        {/* Options avancées */}
        <button
          type="button"
          onClick={() => setModeAvance(!modeAvance)}
          className="text-left text-sm text-zinc-400 underline hover:text-zinc-200"
        >
          {modeAvance ? "Masquer les options avancées ▲" : "Options avancées ▼"}
        </button>

        {modeAvance && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-300">
              Fréquence des versements
            </span>
            <div className="flex gap-4">
              {INTERVALLES.map(({ label, value }) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300"
                >
                  <input
                    type="radio"
                    name="intervalle"
                    value={value}
                    checked={intervalle === value}
                    onChange={() => setIntervalle(value)}
                    className="accent-[#C9A84C]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Résultat */}
      {resultat && (
        <div className="mt-6 flex flex-col gap-3 rounded-xl bg-[#0d1f21] p-4">
          <div className="text-center">
            <p className="text-sm text-zinc-400">Capital final</p>
            <p className="text-3xl font-bold text-white">
              {resultat.capitalFinal.toLocaleString("fr-FR")} €
            </p>
          </div>
          <div className="h-px bg-[#2a4a4d]" />
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Total versé</span>
            <span className="font-medium text-zinc-100">
              {resultat.totalVersements.toLocaleString("fr-FR")} €
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Intérêts générés</span>
            <span className="font-medium text-emerald-400">
              +{resultat.totalInterets.toLocaleString("fr-FR")} €
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
