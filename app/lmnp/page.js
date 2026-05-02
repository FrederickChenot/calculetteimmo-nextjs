"use client";
import { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";

const CAT_COLORS = {
  travaux:    { badge: "bg-green-500/20 text-green-400",  bar: "bg-green-500"  },
  mobilier:   { badge: "bg-blue-500/20 text-blue-400",    bar: "bg-blue-500"   },
  equipement: { badge: "bg-teal-500/20 text-teal-400",    bar: "bg-teal-500"   },
  charges:    { badge: "bg-amber-500/20 text-amber-400",  bar: "bg-amber-500"  },
  honoraires: { badge: "bg-violet-500/20 text-violet-400", bar: "bg-violet-500" },
  divers:     { badge: "bg-zinc-500/20 text-zinc-400",    bar: "bg-zinc-500"   },
};

const inputClass =
  "rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none text-sm w-full";

function fmt(n) {
  return Number(n || 0).toLocaleString("fr-FR", { maximumFractionDigits: 2 });
}

function CategoryBadge({ cat }) {
  const c = CAT_COLORS[cat] || CAT_COLORS.divers;
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.badge}`}>{cat}</span>
  );
}

function TraitementBadge({ traitement }) {
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
      traitement === "amortissable"
        ? "bg-orange-500/20 text-orange-400"
        : "bg-emerald-500/20 text-emerald-400"
    }`}>{traitement}</span>
  );
}

function AnalyseCard({ analyse }) {
  return (
    <div className="bg-[#0d1f21] rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-white font-bold text-lg">{analyse.fournisseur}</p>
          <p className="text-zinc-400 text-sm">{analyse.date_facture}</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end flex-shrink-0">
          <CategoryBadge cat={analyse.categorie} />
          <TraitementBadge traitement={analyse.traitement} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          ["Montant HT", fmt(analyse.montant_ht) + " €", "text-white"],
          ["TVA", fmt(analyse.tva) + " €", "text-white"],
          ["Montant TTC", fmt(analyse.montant_ttc) + " €", "text-[#C9A84C]"],
        ].map(([label, val, cls]) => (
          <div key={label} className="bg-[#12282A] rounded-lg p-3">
            <p className="text-xs text-zinc-500 mb-1">{label}</p>
            <p className={`font-semibold ${cls}`}>{val}</p>
          </div>
        ))}
      </div>
      {analyse.duree_amort && (
        <p className="text-xs text-zinc-400">
          Durée d&apos;amortissement :{" "}
          <span className="text-white font-medium">{analyse.duree_amort} ans</span>
        </p>
      )}
      {analyse.description && <p className="text-sm text-zinc-300">{analyse.description}</p>}
      {analyse.note && <p className="text-xs text-zinc-500 italic">{analyse.note}</p>}
    </div>
  );
}

export default function LmnpPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("factures");
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [factures, setFactures] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [facturesLoading, setFacturesLoading] = useState(false);

  const [pdfFile, setPdfFile] = useState(null);
  const [analyse, setAnalyse] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saveConfirm, setSaveConfirm] = useState(null);
  const [analyzeError, setAnalyzeError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const [showSimulation, setShowSimulation] = useState(false);
  const [loyerAnnuel, setLoyerAnnuel] = useState("");

  useEffect(() => { fetch("/api/lmnp/init"); }, []);

  useEffect(() => {
    if (session) fetchFactures();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, annee]);

  async function fetchFactures() {
    setFacturesLoading(true);
    const res = await fetch(`/api/lmnp/factures?annee=${annee}`);
    const data = await res.json();
    if (Array.isArray(data.factures)) setFactures(data.factures);
    if (data.isOwner !== undefined) setIsOwner(data.isOwner);
    setFacturesLoading(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") { setPdfFile(file); setAnalyse(null); }
  }

  async function handleAnalyze() {
    if (!pdfFile) return;
    setAnalyzing(true);
    setAnalyse(null);
    setAnalyzeError(null);
    setSaveConfirm(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target.result.split(",")[1];
        const res = await fetch("/api/lmnp/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pdf_base64: base64,
            filename: pdfFile.name,
            annee,
            save: !!session,
          }),
        });
        const data = await res.json();
        if (data.error) {
          setAnalyzeError(data.error);
        } else {
          setAnalyse(data.analyse);
          if (data.saved) {
            setSaveConfirm(`Facture sauvegardée dans votre historique ${annee}`);
            fetchFactures();
          }
        }
      } catch {
        setAnalyzeError("Erreur lors de l'analyse. Veuillez réessayer.");
      }
      setAnalyzing(false);
    };
    reader.readAsDataURL(pdfFile);
  }

  async function deleteFacture(id) {
    if (!confirm("Supprimer cette facture ?")) return;
    await fetch("/api/lmnp/factures", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setFactures(prev => prev.filter(f => f.id !== id));
  }

  async function exportCSV() {
    const res = await fetch(`/api/lmnp/export?annee=${annee}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lmnp_${annee}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const ventilation = factures.reduce((acc, f) => {
    const cat = f.categorie || "divers";
    if (!acc[cat]) acc[cat] = { count: 0, totalHt: 0, totalTtc: 0, traitement: f.traitement };
    acc[cat].count++;
    acc[cat].totalHt += Number(f.montant_ht || 0);
    acc[cat].totalTtc += Number(f.montant_ttc || 0);
    return acc;
  }, {});

  const totalHtAll = factures.reduce((s, f) => s + Number(f.montant_ht || 0), 0);
  const totalTtcAll = factures.reduce((s, f) => s + Number(f.montant_ttc || 0), 0);
  const amortissableHt = factures.filter(f => f.traitement === "amortissable").reduce((s, f) => s + Number(f.montant_ht || 0), 0);
  const deductibleHt = factures.filter(f => f.traitement === "deductible").reduce((s, f) => s + Number(f.montant_ht || 0), 0);
  const totalTva = factures.reduce((s, f) => s + Number(f.tva || 0), 0);
  const amortAnnuel = factures
    .filter(f => f.traitement === "amortissable" && f.duree_amort)
    .reduce((s, f) => s + Number(f.montant_ht || 0) / Number(f.duree_amort), 0);

  const loyer = parseFloat(loyerAnnuel) || 0;
  const resultatFiscal = loyer - deductibleHt - amortAnnuel;

  return (
    <main className="min-h-screen bg-[#0a1628]">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* Hero */}
        <div className="text-center space-y-3">
          <span className="inline-block text-xs font-semibold bg-[#C9A84C]/10 text-[#C9A84C] px-3 py-1 rounded-full ring-1 ring-[#C9A84C]/30">
            Propulsé par Claude AI
          </span>
          <h1 className="text-4xl font-bold text-white">
            Comptabilité <span className="text-[#C9A84C]">LMNP</span>
          </h1>
          <p className="text-zinc-400">
            Analysez vos factures par IA · Ventilation automatique · Export 2031
          </p>
        </div>

        {/* Upload & Analyse */}
        <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-white">Analyser une facture</h2>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragOver ? "border-[#C9A84C] bg-[#C9A84C]/5" : "border-[#2a4a4d] hover:border-[#C9A84C]/50"
            }`}
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={e => {
                if (e.target.files[0]) { setPdfFile(e.target.files[0]); setAnalyse(null); }
              }}
            />
            {pdfFile ? (
              <p className="text-[#C9A84C] font-medium">{pdfFile.name}</p>
            ) : (
              <>
                <p className="text-zinc-300 font-medium">Glissez votre facture PDF ici</p>
                <p className="text-zinc-500 text-sm mt-1">ou cliquez pour sélectionner</p>
              </>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!pdfFile || analyzing}
            className="w-full bg-[#C9A84C] text-black font-bold py-3 rounded-xl hover:bg-[#d4b86a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Analyse en cours par l&apos;IA...
              </>
            ) : "Analyser"}
          </button>

          {analyzeError && <p className="text-red-400 text-sm">{analyzeError}</p>}

          {analyse && <AnalyseCard analyse={analyse} />}

          {analyse && !session && (
            <div className="bg-[#0d1f21] rounded-xl p-4 flex items-center justify-between gap-4">
              <p className="text-zinc-300 text-sm">
                Connectez-vous pour sauvegarder et accéder à l&apos;historique
              </p>
              <button
                onClick={() => signIn(undefined, { callbackUrl: "/lmnp" })}
                className="flex-shrink-0 bg-[#C9A84C] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors"
              >
                Se connecter
              </button>
            </div>
          )}

          {saveConfirm && (
            <p className="text-emerald-400 text-sm text-center">{saveConfirm}</p>
          )}
        </div>

        {/* Tabs — only if authenticated */}
        {session && (
          <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "factures", label: "Mes factures" },
                { key: "ventilation", label: "Ventilation" },
                { key: "dashboard", label: "Tableau de bord" },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === t.key
                      ? "bg-[#C9A84C] text-black"
                      : "bg-[#12282A] text-zinc-300 hover:text-[#C9A84C] ring-1 ring-[#C9A84C]/20"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Onglet Mes factures ── */}
            {activeTab === "factures" && (
              <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h2 className="text-lg font-bold text-white">Mes factures</h2>
                  <div className="flex gap-2">
                    {[2024, 2025, 2026].map(y => (
                      <button
                        key={y}
                        onClick={() => setAnnee(y)}
                        className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                          annee === y
                            ? "bg-[#C9A84C] text-black"
                            : "border border-[#2a4a4d] text-zinc-400 hover:border-[#C9A84C]/50"
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>

                {facturesLoading && <p className="text-zinc-400 text-sm">Chargement...</p>}

                {!facturesLoading && factures.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-zinc-400 text-sm">Uploadez votre première facture ci-dessus</p>
                  </div>
                )}

                {factures.length > 0 && (
                  <div className="space-y-3">
                    {factures.map(f => (
                      <div
                        key={f.id}
                        className="bg-[#0d1f21] rounded-xl p-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{f.filename}</p>
                          <p className="text-zinc-500 text-xs mt-0.5">
                            {f.fournisseur} · {new Date(f.created_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                          <span className="text-white font-semibold text-sm">{fmt(f.montant_ttc)} €</span>
                          <CategoryBadge cat={f.categorie} />
                          <TraitementBadge traitement={f.traitement} />
                          <button
                            onClick={() => deleteFacture(f.id)}
                            className="text-zinc-600 hover:text-red-400 transition-colors text-xs ml-1"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Onglet Ventilation ── */}
            {activeTab === "ventilation" && (
              <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h2 className="text-lg font-bold text-white">Ventilation par catégorie — {annee}</h2>
                  {isOwner && (
                    <button
                      onClick={exportCSV}
                      className="bg-[#C9A84C] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors"
                    >
                      Exporter CSV 2031
                    </button>
                  )}
                </div>

                {factures.length === 0 ? (
                  <p className="text-zinc-400 text-sm text-center py-4">
                    Aucune facture pour {annee}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#2a4a4d]">
                          {["Catégorie", "Nb factures", "Traitement", "Total HT", "Total TTC"].map(h => (
                            <th key={h} className="text-left px-3 py-2 text-xs text-zinc-400 font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(ventilation).map(([cat, v]) => (
                          <tr key={cat} className="border-b border-[#2a4a4d] last:border-0 hover:bg-[#0d1f21] transition-colors">
                            <td className="px-3 py-3"><CategoryBadge cat={cat} /></td>
                            <td className="px-3 py-3 text-zinc-300">{v.count}</td>
                            <td className="px-3 py-3"><TraitementBadge traitement={v.traitement} /></td>
                            <td className="px-3 py-3 text-zinc-300">{fmt(v.totalHt)} €</td>
                            <td className="px-3 py-3 text-white font-medium">{fmt(v.totalTtc)} €</td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-[#C9A84C]/30 bg-[#0d1f21]">
                          <td className="px-3 py-3 font-bold text-white">Total</td>
                          <td className="px-3 py-3 font-bold text-white">{factures.length}</td>
                          <td className="px-3 py-3"/>
                          <td className="px-3 py-3 font-bold text-white">{fmt(totalHtAll)} €</td>
                          <td className="px-3 py-3 font-bold text-[#C9A84C]">{fmt(totalTtcAll)} €</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── Onglet Tableau de bord ── */}
            {activeTab === "dashboard" && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    ["Total factures TTC", `${fmt(totalTtcAll)} €`, "text-white"],
                    ["Amortissable HT", `${fmt(amortissableHt)} €`, "text-orange-400"],
                    ["Charges déductibles HT", `${fmt(deductibleHt)} €`, "text-emerald-400"],
                    ["TVA totale", `${fmt(totalTva)} €`, "text-[#C9A84C]"],
                  ].map(([label, val, cls]) => (
                    <div key={label} className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-xl p-4">
                      <p className="text-xs text-zinc-400 mb-1">{label}</p>
                      <p className={`text-xl font-bold ${cls}`}>{val}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Répartition par catégorie</h3>
                  {factures.length === 0 ? (
                    <p className="text-zinc-400 text-sm">Aucune facture pour {annee}</p>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(ventilation).map(([cat, v]) => {
                        const colors = CAT_COLORS[cat] || CAT_COLORS.divers;
                        const pct = totalTtcAll > 0 ? (v.totalTtc / totalTtcAll) * 100 : 0;
                        return (
                          <div key={cat}>
                            <div className="flex justify-between items-center mb-1.5">
                              <CategoryBadge cat={cat} />
                              <span className="text-zinc-300 text-sm">
                                {fmt(v.totalTtc)} € ({pct.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="h-2 bg-[#0d1f21] rounded-full overflow-hidden">
                              <div
                                className={`h-full ${colors.bar} rounded-full transition-all`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {isOwner && (
                  <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Simulation fiscale</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Résultat LMNP réel simplifié — loyer vs charges + amortissements
                      </p>
                    </div>
                    <button
                      onClick={() => setShowSimulation(true)}
                      className="bg-[#C9A84C] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors"
                    >
                      Simulation fiscale
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modale simulation fiscale ── */}
      {showSimulation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowSimulation(false)}
        >
          <div
            className="w-full max-w-lg bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">
              Simulation fiscale LMNP réel simplifié — {annee}
            </h3>

            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Loyer annuel estimé (€)</label>
              <input
                type="number"
                placeholder="12000"
                value={loyerAnnuel}
                onChange={e => setLoyerAnnuel(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="bg-[#0d1f21] rounded-xl p-4 space-y-3">
              {[
                ["Loyer annuel", loyer, false, "text-white"],
                ["Charges déductibles HT", deductibleHt, true, "text-emerald-400"],
                ["Amortissements annuels estimés", amortAnnuel, true, "text-orange-400"],
              ].map(([label, val, minus, cls]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-zinc-400">{label}</span>
                  <span className={`font-semibold ${cls}`}>
                    {minus ? "−" : ""}{fmt(val)} €
                  </span>
                </div>
              ))}
              <div className="h-px bg-[#2a4a4d]" />
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Résultat fiscal estimé</span>
                <span className={`text-xl font-bold ${resultatFiscal >= 0 ? "text-[#C9A84C]" : "text-emerald-400"}`}>
                  {resultatFiscal < 0 ? "−" : ""}{fmt(Math.abs(resultatFiscal))} €
                </span>
              </div>
              <p className={`text-xs ${resultatFiscal >= 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {resultatFiscal >= 0
                  ? "Bénéfice imposable estimé"
                  : "Déficit foncier — aucune imposition sur ces revenus"}
              </p>
            </div>

            <p className="text-xs text-zinc-500 italic">
              Simulation indicative, consultez un expert-comptable
            </p>

            <button
              onClick={() => setShowSimulation(false)}
              className="w-full border border-[#2a4a4d] text-zinc-400 py-2 rounded-lg text-sm hover:border-zinc-500 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
