"use client";
import { useState } from "react";

const PENTE_NEUF = 55.8108995;
const PENTE_ANCIEN = 14.5264381;
const B_NEUF = -103003.94;
const B_ANCIEN = -26801.2783;

function getFraisDeNotaire(capital, etat) {
  if (etat === "neuf") {
    return Math.round((capital - B_NEUF) / PENTE_NEUF);
  }
  return Math.round((capital - B_ANCIEN) / PENTE_ANCIEN);
}

const inputClass =
  "rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20";

export default function FraisNotaire() {
  const [capital, setCapital] = useState("");
  const [etat, setEtat] = useState("ancien");

  const resultat = capital
    ? getFraisDeNotaire(parseFloat(capital), etat)
    : null;

  const tauxEstime =
    resultat && capital
      ? ((resultat / parseFloat(capital)) * 100).toFixed(1)
      : null;

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-[#12282A] p-8">
<div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label htmlFor="capital" className="text-sm font-medium text-zinc-300">
            Prix du bien (€)
          </label>
          <input
            id="capital"
            type="number"
            placeholder="ex : 250000"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-300">Type de bien</span>
          <div className="flex gap-4">
            {["ancien", "neuf"].map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300"
              >
                <input
                  type="radio"
                  name="etat"
                  value={option}
                  checked={etat === option}
                  onChange={() => setEtat(option)}
                  className="accent-[#C9A84C]"
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>

      {resultat !== null && (
        <div className="mt-6 rounded-xl bg-[#0d1f21] p-4 text-center">
          <p className="text-sm text-zinc-400">
            Frais de notaire estimés ({etat})
          </p>
          <p className="text-3xl font-bold text-white">
            {resultat.toLocaleString("fr-FR")} €
          </p>
          {tauxEstime && (
            <p className="mt-1 text-xs text-zinc-500">
              Soit environ {tauxEstime} % du prix du bien
            </p>
          )}
        </div>
      )}
    </div>
  );
}
