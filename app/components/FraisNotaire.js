"use client";
import { useState } from "react";

// DMTO — Droits de Mutation à Titre Onéreux 2024
// Ancien : taxe départ. 4,5% + taxe communale 1,20% + frais d'assiette 2,37% × taxe départ.
// Neuf   : taux réduit 0,715%
const DEBOURS_FIXES = 1000;

function calcul(prix, etat) {
  let dmtoDetail;
  let dmtoTotal;

  if (etat === "ancien") {
    const taxeDept    = prix * 0.045;
    const taxeCommune = prix * 0.012;
    const fraisAssiette = taxeDept * 0.0237;
    dmtoTotal = Math.round(taxeDept + taxeCommune + fraisAssiette);
    dmtoDetail = [
      { label: "Taxe départementale (4,50 %)",              montant: taxeDept },
      { label: "Taxe communale (1,20 %)",                    montant: taxeCommune },
      { label: "Frais d'assiette (2,37 % × taxe dept.)",    montant: fraisAssiette },
    ];
  } else {
    // Neuf : TVA déjà incluse dans le prix, DMTO réduits
    const dmtoNeuf = prix * 0.00715;
    dmtoTotal = Math.round(dmtoNeuf);
    dmtoDetail = [
      { label: "DMTO réduits neuf (0,715 %)", montant: dmtoNeuf },
    ];
  }

  const tauxEmoluments = etat === "neuf" ? 0.008 : 0.01;
  const emoluments     = Math.round(prix * tauxEmoluments);
  const tvaEmoluments  = Math.round(emoluments * 0.2);
  const debours        = DEBOURS_FIXES;

  const total = dmtoTotal + emoluments + tvaEmoluments + debours;
  const taux  = ((total / prix) * 100).toFixed(2);

  return { dmtoTotal, dmtoDetail, emoluments, tvaEmoluments, debours, total, taux };
}

const inputClass =
  "rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20";

function fmt(n) {
  return Math.round(n).toLocaleString("fr-FR");
}

function Row({ label, value, sub }) {
  return (
    <div className={`flex justify-between ${sub ? "text-zinc-500 text-xs pl-3" : "text-zinc-300"}`}>
      <span>{label}</span>
      <span className={sub ? "" : "font-medium text-zinc-100"}>{value}</span>
    </div>
  );
}

export default function FraisNotaire() {
  const [capital, setCapital]     = useState("");
  const [etat, setEtat]           = useState("ancien");
  const [showDetail, setShowDetail] = useState(false);

  const prix   = parseFloat(capital);
  const result = capital && prix > 0 ? calcul(prix, etat) : null;

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
            min="0"
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

      {result && (
        <div className="mt-6 space-y-3">
          {/* Total */}
          <div className="rounded-xl bg-[#0d1f21] p-4 text-center">
            <p className="text-sm text-zinc-400">
              Frais de notaire estimés ({etat})
            </p>
            <p className="text-3xl font-bold text-white">
              {fmt(result.total)} €
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Soit environ {result.taux} % du prix du bien
            </p>
          </div>

          {/* Résumé */}
          <div className="rounded-xl bg-[#0d1f21] p-4 space-y-2 text-sm">
            <Row label="Droits de mutation (DMTO)" value={`${fmt(result.dmtoTotal)} €`} />
            {showDetail && result.dmtoDetail.map((l, i) => (
              <Row key={i} label={l.label} value={`${fmt(l.montant)} €`} sub />
            ))}
            <Row
              label={`Émoluments notaire (${etat === "neuf" ? "0,8" : "1"} %)`}
              value={`${fmt(result.emoluments)} €`}
            />
            <Row label="TVA émoluments (20 %)" value={`${fmt(result.tvaEmoluments)} €`} />
            <Row label="Débours et frais fixes" value={`${fmt(result.debours)} €`} />
          </div>

          <button
            onClick={() => setShowDetail((v) => !v)}
            className="w-full text-xs text-[#C9A84C] hover:underline text-left px-1"
          >
            {showDetail ? "Masquer" : "Afficher"} le détail du calcul DMTO
          </button>
        </div>
      )}
    </div>
  );
}
