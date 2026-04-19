"use client";
import { useState } from "react";
import { exportPdf, fmtNum } from "./exportPdf";

const inputClass =
  "rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20";

const CHAMPS = [
  { id: "PrixAchat",           label: "Prix d'achat",                    placeholder: "ex : 200000",  unit: "€" },
  { id: "apport",              label: "Apport personnel",                 placeholder: "ex : 30000",   unit: "€" },
  { id: "tauxEmprunt",         label: "Taux d'emprunt",                   placeholder: "ex : 3.5",     unit: "%",     step: "0.01" },
  { id: "dureeCredit",         label: "Durée du crédit",                  placeholder: "ex : 20",      unit: "ans" },
  { id: "loyer",               label: "Loyer mensuel hors charges",       placeholder: "ex : 800",     unit: "€/mois" },
  { id: "chargesRecuperables", label: "Charges récupérables",             placeholder: "ex : 100",     unit: "€/mois" },
  { id: "chargesCopropriete",  label: "Charges de copropriété",           placeholder: "ex : 80",      unit: "€/mois" },
  { id: "taxeFonciere",        label: "Taxe foncière",                    placeholder: "ex : 60",      unit: "€/mois" },
  { id: "entretien",           label: "Entretien",                        placeholder: "ex : 30",      unit: "€/mois" },
  { id: "assurance",           label: "Assurance PNO",                    placeholder: "ex : 15",      unit: "€/mois" },
  { id: "coutRenovation",      label: "Coût de rénovation total",         placeholder: "ex : 10000",   unit: "€" },
  { id: "vacanceLocative",     label: "Vacance locative",                 placeholder: "ex : 5",       unit: "%",     step: "0.1" },
];

const DEFAULTS = Object.fromEntries(CHAMPS.map(({ id }) => [id, ""]));

function calculer(vals) {
  const v = Object.fromEntries(
    Object.entries(vals).map(([k, val]) => [k, parseFloat(val) || 0])
  );

  const montantEmprunte = v.PrixAchat - v.apport;
  const tauxMensuel = v.tauxEmprunt / 100 / 12;
  const totalMois = v.dureeCredit * 12;

  const mensualite =
    (montantEmprunte * tauxMensuel * (1 + tauxMensuel) ** totalMois) /
    ((1 + tauxMensuel) ** totalMois - 1);

  const coutVacance =
    ((v.loyer + v.chargesRecuperables) * (v.vacanceLocative / 100)) / 12;
  const coutRenovMensuel = v.coutRenovation / totalMois;

  const depensesSansCredit =
    v.chargesCopropriete +
    v.taxeFonciere +
    v.entretien +
    v.assurance +
    coutVacance +
    coutRenovMensuel -
    v.chargesRecuperables;

  const depensesTotales = mensualite + depensesSansCredit;

  const rentabiliteBrute = ((v.loyer * 12) / v.PrixAchat) * 100;
  const rentabiliteNette =
    ((v.loyer * 12 - depensesSansCredit * 12) / v.PrixAchat) * 100;
  const effortNet = v.loyer - depensesTotales;

  return { mensualite, rentabiliteBrute, rentabiliteNette, effortNet };
}

const CHAMP_MAP = Object.fromEntries(CHAMPS.map((c) => [c.id, c]));

export default function Rentabilite() {
  const [champs, setChamps] = useState(DEFAULTS);
  const [resultat, setResultat] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleExportPdf = async () => {
    if (!resultat) return;
    setPdfLoading(true);
    await exportPdf({
      titre: "Rentabilité locative",
      donnees: CHAMPS
        .filter(({ id }) => champs[id] !== "")
        .map(({ id }) => {
          const { label, unit } = CHAMP_MAP[id];
          const raw = champs[id];
          const val = unit === "%" || unit === "ans"
            ? `${raw} ${unit}`
            : `${fmtNum(raw)} ${unit}`;
          return [`${label} (${unit})`, val];
        }),
      resultats: [
        ["Mensualité du prêt",   `${resultat.mensualite.toFixed(0)} €/mois`],
        ["Rentabilité brute",    `${resultat.rentabiliteBrute.toFixed(2)} %`],
        ["Rentabilité nette",    `${resultat.rentabiliteNette.toFixed(2)} %`],
        [
          resultat.effortNet >= 0 ? "Bénéfice net mensuel" : "Effort net mensuel",
          `${resultat.effortNet >= 0 ? "+" : "-"}${Math.abs(resultat.effortNet).toFixed(0)} €/mois`,
        ],
      ],
      filename: "rentabilite-locative.pdf",
    });
    setPdfLoading(false);
  };

  const handleChange = (id, value) =>
    setChamps((prev) => ({ ...prev, [id]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setResultat(calculer(champs));
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "calc-rentabilite" }),
    }).catch(() => {});
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-[#12282A] p-8">
<form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {CHAMPS.map(({ id, label, unit, placeholder, step }) => (
          <div key={id} className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-medium text-zinc-300">
              {label} ({unit})
            </label>
            <input
              id={id}
              type="number"
              min="0"
              step={step ?? "1"}
              placeholder={placeholder}
              value={champs[id]}
              onChange={(e) => handleChange(id, e.target.value)}
              className={inputClass}
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="mt-2 rounded-full bg-[#C9A84C] px-6 py-3 font-semibold text-[#12282A] transition-colors hover:bg-[#b8942d]"
        >
          Calculer
        </button>
      </form>

      {resultat && (
        <div className="mt-6 space-y-3">
        <div className="flex flex-col gap-3 rounded-xl bg-[#0d1f21] p-4">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Mensualité du prêt</span>
            <span className="font-medium text-zinc-100">
              {resultat.mensualite.toFixed(0)} €/mois
            </span>
          </div>
          <div className="h-px bg-[#2a4a4d]" />
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Rentabilité brute</span>
            <span className="font-medium text-zinc-100">
              {resultat.rentabiliteBrute.toFixed(1)} %
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Rentabilité nette</span>
            <span className="font-medium text-zinc-100">
              {resultat.rentabiliteNette.toFixed(1)} %
            </span>
          </div>
          <div className="h-px bg-[#2a4a4d]" />
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">
              {resultat.effortNet >= 0 ? "Bénéfice net mensuel" : "Effort net mensuel"}
            </span>
            <span
              className={`font-bold ${
                resultat.effortNet >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {resultat.effortNet >= 0 ? "+" : "-"}
              {Math.abs(resultat.effortNet).toFixed(0)} €/mois
            </span>
          </div>
        </div>
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={pdfLoading}
            className="w-full rounded-full border border-[#C9A84C]/50 px-6 py-2.5 text-sm font-medium text-[#C9A84C] transition-colors hover:bg-[#C9A84C]/10 disabled:opacity-50"
          >
            {pdfLoading ? "Génération…" : "Exporter en PDF"}
          </button>
        </div>
      )}
    </div>
  );
}
