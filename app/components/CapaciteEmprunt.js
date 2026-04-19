"use client";
import { useState, useEffect } from "react";
import { exportPdf, fmtNum } from "./exportPdf";

const inputClass =
  "rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20";

export default function CapaciteEmprunt() {
  const [salaire, setSalaire] = useState("");
  const [autreEmprunt, setAutreEmprunt] = useState("");
  const [taux, setTaux] = useState("");
  const [duree, setDuree] = useState("");
  const [resultat, setResultat] = useState(null);
  const [tauxBCE, setTauxBCE] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleExportPdf = async () => {
    if (!resultat) return;
    setPdfLoading(true);
    const mensualiteMax = parseFloat(salaire) * 0.35 - (parseFloat(autreEmprunt) || 0);
    await exportPdf({
      titre: "Capacité d'emprunt",
      donnees: [
        ["Revenus mensuels nets",         `${fmtNum(salaire)} €`],
        ["Autres emprunts en cours",       `${fmtNum(parseFloat(autreEmprunt) || 0)} €/mois`],
        ["Taux d'intérêt annuel",          `${taux} %`],
        ["Durée",                          `${duree} ans`],
      ],
      resultats: [
        ["Capacité d'emprunt estimée",    `${fmtNum(resultat)} €`],
        ["Mensualité maximale (35 %)",     `${fmtNum(mensualiteMax)} €/mois`],
      ],
      filename: "capacite-emprunt.pdf",
    });
    setPdfLoading(false);
  };

  useEffect(() => {
    fetch("/api/taux")
      .then((r) => r.json())
      .then((d) => { if (d.taux) setTauxBCE(d); })
      .catch(() => {});
  }, []);

  const calculer = (e) => {
    e.preventDefault();
    const s = parseFloat(salaire);
    const a = parseFloat(autreEmprunt) || 0;
    const r = parseFloat(taux) / 100 / 12;
    const n = parseFloat(duree) * 12;

    const mensualiteMax = s * 0.35 - a;
    const capacite = (mensualiteMax * (1 - Math.pow(1 + r, -n))) / r;

    setResultat(capacite > 0 ? capacite.toFixed(0) : null);
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "calc-capacite" }),
    }).catch(() => {});
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
          <label htmlFor="salaire" className="text-sm font-medium text-zinc-300">
            Revenus mensuels nets (€)
          </label>
          <input
            id="salaire"
            type="number"
            min="0"
            placeholder="ex : 3000"
            value={salaire}
            onChange={(e) => setSalaire(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="autreEmprunt" className="text-sm font-medium text-zinc-300">
            Autres emprunts en cours (€/mois)
          </label>
          <input
            id="autreEmprunt"
            type="number"
            min="0"
            placeholder="ex : 200"
            value={autreEmprunt}
            onChange={(e) => setAutreEmprunt(e.target.value)}
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
            min="0"
            step="0.01"
            placeholder="ex : 3.5"
            value={taux}
            onChange={(e) => setTaux(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="duree" className="text-sm font-medium text-zinc-300">
            Durée (années)
          </label>
          <input
            id="duree"
            type="number"
            min="0"
            placeholder="ex : 20"
            value={duree}
            onChange={(e) => setDuree(e.target.value)}
            className={inputClass}
            required
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
        <div className="mt-6 space-y-3">
          <div className="rounded-xl bg-[#0d1f21] p-4 text-center">
            <p className="text-sm text-zinc-400">Capacité d&apos;emprunt estimée</p>
            <p className="text-3xl font-bold text-white">
              {parseInt(resultat).toLocaleString("fr-FR")} €
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Basé sur un taux d&apos;endettement maximum de 35 %
            </p>
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

      {resultat === null && salaire && taux && duree && (
        <div className="mt-6 rounded-xl bg-red-900/30 p-4 text-center">
          <p className="text-sm text-red-400">
            Les charges mensuelles dépassent la capacité d&apos;emprunt.
          </p>
        </div>
      )}
    </div>
  );
}
