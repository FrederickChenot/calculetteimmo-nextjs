"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const CAT_COLORS = {
  travaux:    { badge: "bg-green-500/20 text-green-400",   bar: "bg-green-500"  },
  mobilier:   { badge: "bg-blue-500/20 text-blue-400",     bar: "bg-blue-500"   },
  equipement: { badge: "bg-teal-500/20 text-teal-400",     bar: "bg-teal-500"   },
  charges:    { badge: "bg-amber-500/20 text-amber-400",   bar: "bg-amber-500"  },
  honoraires: { badge: "bg-violet-500/20 text-violet-400", bar: "bg-violet-500" },
  divers:     { badge: "bg-zinc-500/20 text-zinc-400",     bar: "bg-zinc-500"   },
};

const inputClass =
  "rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none text-sm w-full";

function fmt(n) {
  return Number(n || 0).toLocaleString("fr-FR", { maximumFractionDigits: 2 });
}

function CategoryBadge({ cat }) {
  const c = CAT_COLORS[cat] || CAT_COLORS.divers;
  return <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.badge}`}>{cat}</span>;
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

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}

function AnalyseCard({ analyse, filename }) {
  return (
    <div className="bg-[#0d1f21] rounded-xl p-4 space-y-3">
      {filename && <p className="text-xs text-zinc-500 truncate">{filename}</p>}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-white font-bold text-base">{analyse.fournisseur}</p>
          <p className="text-zinc-400 text-sm">{analyse.date_facture}</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end flex-shrink-0">
          <CategoryBadge cat={analyse.categorie} />
          <TraitementBadge traitement={analyse.traitement} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          ["Montant HT", fmt(analyse.montant_ht) + " €", "text-white"],
          ["TVA", fmt(analyse.tva) + " €", "text-white"],
          ["Montant TTC", fmt(analyse.montant_ttc) + " €", "text-[#C9A84C]"],
        ].map(([label, val, cls]) => (
          <div key={label} className="bg-[#12282A] rounded-lg p-2.5">
            <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
            <p className={`text-sm font-semibold ${cls}`}>{val}</p>
          </div>
        ))}
      </div>
      {analyse.duree_amort && (
        <p className="text-xs text-zinc-400">
          Amortissement sur{" "}
          <span className="text-white font-medium">{analyse.duree_amort} ans</span>
          {" "}→{" "}
          <span className="text-orange-400 font-medium">
            {fmt(Number(analyse.montant_ht || 0) / analyse.duree_amort)} €/an
          </span>
        </p>
      )}
      {analyse.description && <p className="text-sm text-zinc-300">{analyse.description}</p>}
      {analyse.note && <p className="text-xs text-zinc-500 italic">{analyse.note}</p>}
    </div>
  );
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadToBlob(file) {
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/lmnp/upload", { method: "POST", body: fd });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url || null;
  } catch {
    return null;
  }
}

export default function LmnpPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("factures");
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [factures, setFactures] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [facturesLoading, setFacturesLoading] = useState(false);

  // Upload / analyse state
  const [pdfFiles, setPdfFiles] = useState([]);
  const [analyseResults, setAnalyseResults] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(null);
  const [saveConfirm, setSaveConfirm] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const addMoreRef = useRef(null);

  // Simulation state
  const [showSimulation, setShowSimulation] = useState(false);
  const [loyerAnnuel, setLoyerAnnuel] = useState("");

  // Edit classification state
  const [editingFacture, setEditingFacture] = useState(null);
  const [editForm, setEditForm] = useState({ categorie: "divers", traitement: "deductible", duree_amort: "" });

  // Ventilation expand state
  const [expandedVentRows, setExpandedVentRows] = useState(new Set());

  // PDF loading state
  const [pdfLoading, setPdfLoading] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/crypto/login");
  }, [status, router]);

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

  function addFiles(fileList) {
    const valid = Array.from(fileList).filter(f => f.type === "application/pdf");
    if (valid.length) setPdfFiles(prev => [...prev, ...valid]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
    setAnalyseResults([]);
  }

  function removeFile(idx) {
    setPdfFiles(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleAnalyzeAll() {
    if (!pdfFiles.length || analyzing) return;
    setAnalyzing(true);
    setAnalyseResults([]);
    setSaveConfirm(null);

    let savedCount = 0;

    for (let i = 0; i < pdfFiles.length; i++) {
      const file = pdfFiles[i];
      setAnalyzeProgress({ current: i + 1, total: pdfFiles.length, filename: file.name });

      try {
        const [base64, url_pdf] = await Promise.all([
          readFileAsBase64(file),
          session ? uploadToBlob(file) : Promise.resolve(null),
        ]);

        const res = await fetch("/api/lmnp/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pdf_base64: base64,
            filename: file.name,
            annee,
            save: !!session,
            url_pdf,
          }),
        });
        const data = await res.json();
        setAnalyseResults(prev => [...prev, {
          file,
          analyse: data.analyse || null,
          saved: data.saved || false,
          error: data.error || null,
        }]);
        if (data.saved) { savedCount++; fetchFactures(); }
      } catch {
        setAnalyseResults(prev => [...prev, {
          file,
          analyse: null,
          saved: false,
          error: "Erreur lors de l'analyse",
        }]);
      }
    }

    setAnalyzing(false);
    setAnalyzeProgress(null);
    if (savedCount > 0) {
      setSaveConfirm(
        `${savedCount} facture${savedCount > 1 ? "s" : ""} sauvegardée${savedCount > 1 ? "s" : ""} dans votre historique ${annee}`
      );
    }
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

  async function openPdf(url_pdf, id) {
    setPdfLoading(id);
    // Ouvrir l'onglet immédiatement (contexte click) pour éviter le popup blocker
    const newTab = window.open("", "_blank");
    try {
      const res = await fetch(`/api/lmnp/blob-url?url=${encodeURIComponent(url_pdf)}`);
      const data = await res.json();
      if (data.signedUrl && newTab) {
        newTab.location.href = data.signedUrl;
      } else {
        newTab?.close();
      }
    } catch {
      newTab?.close();
    } finally {
      setPdfLoading(null);
    }
  }

  function openEdit(f) {
    setEditingFacture(f);
    setEditForm({
      categorie: f.categorie || "divers",
      traitement: f.traitement || "deductible",
      duree_amort: f.duree_amort || "",
    });
  }

  async function saveEdit() {
    const res = await fetch("/api/lmnp/factures", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analyse_id: editingFacture.analyse_id,
        categorie: editForm.categorie,
        traitement: editForm.traitement,
        duree_amort: editForm.traitement === "amortissable" && editForm.duree_amort
          ? parseInt(editForm.duree_amort)
          : null,
      }),
    });
    if (res.ok) {
      await fetchFactures();
      setEditingFacture(null);
    }
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

  // Ventilation groupée par (categorie + traitement)
  const ventilation = factures.reduce((acc, f) => {
    const cat = f.categorie || "divers";
    const trait = f.traitement || "deductible";
    const key = `${cat}__${trait}`;
    if (!acc[key]) acc[key] = { cat, traitement: trait, count: 0, totalHt: 0, totalTtc: 0, amortAnnuel: 0, items: [], totalAmortHt: 0, sumWeightedDuree: 0 };
    acc[key].count++;
    acc[key].totalHt += Number(f.montant_ht || 0);
    acc[key].totalTtc += Number(f.montant_ttc || 0);
    acc[key].items.push(f);
    if (trait === "amortissable" && f.duree_amort) {
      const ht = Number(f.montant_ht || 0);
      acc[key].amortAnnuel += ht / Number(f.duree_amort);
      acc[key].totalAmortHt += ht;
      acc[key].sumWeightedDuree += ht * Number(f.duree_amort);
    }
    return acc;
  }, {});

  // Ventilation agrégée par catégorie pour les barres du dashboard
  const ventilationByCat = Object.values(ventilation).reduce((acc, v) => {
    if (!acc[v.cat]) acc[v.cat] = { totalTtc: 0 };
    acc[v.cat].totalTtc += v.totalTtc;
    return acc;
  }, {});

  const totalHtAll = factures.reduce((s, f) => s + Number(f.montant_ht || 0), 0);
  const totalTtcAll = factures.reduce((s, f) => s + Number(f.montant_ttc || 0), 0);
  const deductibleHt = factures.filter(f => f.traitement === "deductible").reduce((s, f) => s + Number(f.montant_ht || 0), 0);
  const totalTva = factures.reduce((s, f) => s + Number(f.tva || 0), 0);

  // Amortissements annuels : somme des annuités (montant_ht / duree_amort)
  const amortDetails = factures
    .filter(f => f.traitement === "amortissable" && f.duree_amort)
    .map(f => ({
      label: f.fournisseur || f.description || f.filename,
      annuite: Number(f.montant_ht || 0) / Number(f.duree_amort),
      montantHt: Number(f.montant_ht || 0),
      dureeAmort: Number(f.duree_amort),
    }));
  const amortAnnuel = amortDetails.reduce((s, d) => s + d.annuite, 0);

  const loyer = parseFloat(loyerAnnuel) || 0;
  const resultatFiscal = loyer - deductibleHt - amortAnnuel;

  if (status === "loading") return null;
  if (!session) return null;

  const analyzeButtonLabel = pdfFiles.length > 1
    ? `Analyser tout (${pdfFiles.length})`
    : "Analyser";

  return (
    <main className="min-h-screen bg-[#0a1628]">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* Barre utilisateur */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">{session.user?.email}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/crypto/login" })}
            className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors"
          >
            Se déconnecter
          </button>
        </div>

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
          <h2 className="text-lg font-bold text-white">Analyser des factures</h2>

          {/* Drop zone */}
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
              multiple
              className="hidden"
              onChange={e => { addFiles(e.target.files); setAnalyseResults([]); e.target.value = ""; }}
            />
            <input
              ref={addMoreRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={e => { addFiles(e.target.files); e.target.value = ""; }}
            />
            <p className="text-zinc-300 font-medium">Glissez vos factures PDF ici</p>
            <p className="text-zinc-500 text-sm mt-1">ou cliquez pour sélectionner · plusieurs fichiers acceptés</p>
          </div>

          {/* File list */}
          {pdfFiles.length > 0 && (
            <div className="space-y-2">
              {pdfFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-[#0d1f21] rounded-lg px-3 py-2">
                  <span className="text-zinc-300 text-sm truncate flex-1">{f.name}</span>
                  <button
                    onClick={() => removeFile(i)}
                    className="text-zinc-600 hover:text-red-400 transition-colors text-xs ml-3 flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => addMoreRef.current?.click()}
                className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors"
              >
                + Ajouter d&apos;autres fichiers
              </button>
            </div>
          )}

          {/* Progress bar */}
          {analyzing && analyzeProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-300 truncate">
                  Analyse {analyzeProgress.current}/{analyzeProgress.total} — {analyzeProgress.filename}
                </span>
                <span className="text-zinc-500 flex-shrink-0 ml-2">
                  {Math.round(((analyzeProgress.current - 1) / analyzeProgress.total) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-[#0d1f21] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C9A84C] rounded-full transition-all"
                  style={{ width: `${((analyzeProgress.current - 1) / analyzeProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3">
            <button
              onClick={handleAnalyzeAll}
              disabled={!pdfFiles.length || analyzing}
              className="flex-1 bg-[#C9A84C] text-black font-bold py-3 rounded-xl hover:bg-[#d4b86a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {analyzing ? <><Spinner />Analyse en cours par l&apos;IA...</> : analyzeButtonLabel}
            </button>
          </div>

          {/* Results */}
          {analyseResults.length > 0 && (
            <div className="space-y-3">
              {analyseResults.map((r, i) => (
                <div key={i}>
                  {r.error && (
                    <p className="text-red-400 text-sm px-1">
                      {r.file.name} : {r.error}
                    </p>
                  )}
                  {r.analyse && (
                    <AnalyseCard
                      analyse={r.analyse}
                      filename={analyseResults.length > 1 ? r.file.name : null}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {saveConfirm && (
            <p className="text-emerald-400 text-sm text-center">{saveConfirm}</p>
          )}
        </div>

        {/* Tabs */}
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

            {/* ── Mes factures ── */}
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
                        className="bg-[#0d1f21] rounded-xl p-4 flex items-start justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          {f.url_pdf ? (
                            <button
                              onClick={() => openPdf(f.url_pdf, f.id)}
                              disabled={pdfLoading === f.id}
                              className="text-white font-medium truncate block max-w-full text-left hover:underline hover:text-[#C9A84C] transition-colors disabled:cursor-wait"
                            >
                              {pdfLoading === f.id ? (
                                <span className="flex items-center gap-1.5">
                                  <Spinner />{f.filename}
                                </span>
                              ) : f.filename}
                            </button>
                          ) : (
                            <p className="text-white font-medium truncate">{f.filename}</p>
                          )}
                          <p className="text-zinc-500 text-xs mt-0.5">
                            {f.fournisseur} · {f.date_facture || new Date(f.created_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                          <span className="text-white font-semibold text-sm">{fmt(f.montant_ttc)} €</span>
                          <CategoryBadge cat={f.categorie} />
                          <TraitementBadge traitement={f.traitement} />
                          {f.traitement === "amortissable" && f.duree_amort && (
                            <span className="text-xs text-zinc-500">· {f.duree_amort} ans</span>
                          )}
                          <button
                            onClick={() => openEdit(f)}
                            className="text-xs text-zinc-400 hover:text-[#C9A84C] transition-colors ml-1 border border-[#2a4a4d] px-2 py-0.5 rounded"
                          >
                            Modifier
                          </button>
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

            {/* ── Ventilation ── */}
            {activeTab === "ventilation" && (
              <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h2 className="text-lg font-bold text-white">
                    Ventilation fiscale — {annee}
                  </h2>
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
                          {["Catégorie", "Traitement", "Nb", "Total HT", "Total TTC", "Annuité/an"].map(h => (
                            <th key={h} className="text-left px-3 py-2 text-xs text-zinc-400 font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(ventilation).map(([key, v]) => {
                          const isExpanded = expandedVentRows.has(key);
                          const avgDuree = v.traitement === "amortissable" && v.totalAmortHt > 0
                            ? Math.round(v.sumWeightedDuree / v.totalAmortHt)
                            : null;
                          return (
                            <React.Fragment key={key}>
                              <tr
                                className="border-b border-[#2a4a4d] last:border-0 hover:bg-[#0d1f21] transition-colors cursor-pointer"
                                onClick={() => setExpandedVentRows(prev => {
                                  const next = new Set(prev);
                                  next.has(key) ? next.delete(key) : next.add(key);
                                  return next;
                                })}
                              >
                                <td className="px-3 py-3"><CategoryBadge cat={v.cat} /></td>
                                <td className="px-3 py-3">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <TraitementBadge traitement={v.traitement} />
                                    {avgDuree && <span className="text-xs text-zinc-500">moy. {avgDuree} ans</span>}
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-zinc-300">{v.count}</td>
                                <td className="px-3 py-3 text-zinc-300">{fmt(v.totalHt)} €</td>
                                <td className="px-3 py-3 text-white font-medium">{fmt(v.totalTtc)} €</td>
                                <td className="px-3 py-3 text-orange-400">
                                  <div className="flex items-center justify-between">
                                    <span>{v.amortAnnuel > 0 ? `${fmt(v.amortAnnuel)} €` : "—"}</span>
                                    <span className="text-zinc-500 ml-3 text-xs">{isExpanded ? "▲" : "▼"}</span>
                                  </div>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="bg-[#0a1a1c]">
                                  <td colSpan={6} className="px-3 py-0">
                                    <table className="w-full text-xs mb-2 mt-1">
                                      <thead>
                                        <tr className="text-zinc-500 border-b border-[#1a3a3d]">
                                          <th className="text-left py-1 pl-4 font-medium">Fichier</th>
                                          <th className="text-left py-1 font-medium">Fournisseur</th>
                                          <th className="text-left py-1 font-medium">Montant HT</th>
                                          <th className="text-left py-1 font-medium">Annuité/an</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {v.items.map((item, idx) => (
                                          <tr key={idx} className="border-t border-[#1a3a3d]">
                                            <td className="py-1.5 pl-4 text-zinc-400 max-w-[180px] truncate">{item.filename}</td>
                                            <td className="py-1.5 text-zinc-400">{item.fournisseur || "—"}</td>
                                            <td className="py-1.5 text-zinc-300">{fmt(item.montant_ht)} €</td>
                                            <td className="py-1.5 text-orange-400">
                                              {item.traitement === "amortissable" && item.duree_amort
                                                ? `${fmt(Number(item.montant_ht || 0) / Number(item.duree_amort))} €/an`
                                                : "—"}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                        <tr className="border-t-2 border-[#C9A84C]/30 bg-[#0d1f21]">
                          <td className="px-3 py-3 font-bold text-white" colSpan={2}>Total</td>
                          <td className="px-3 py-3 font-bold text-white">{factures.length}</td>
                          <td className="px-3 py-3 font-bold text-white">{fmt(totalHtAll)} €</td>
                          <td className="px-3 py-3 font-bold text-[#C9A84C]">{fmt(totalTtcAll)} €</td>
                          <td className="px-3 py-3 font-bold text-orange-400">{fmt(amortAnnuel)} €/an</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── Tableau de bord ── */}
            {activeTab === "dashboard" && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    ["Total factures TTC", `${fmt(totalTtcAll)} €`, "text-white"],
                    ["Amortissements annuels", `${fmt(amortAnnuel)} €/an`, "text-orange-400"],
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
                      {Object.entries(ventilationByCat).map(([cat, v]) => {
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
      </div>

      {/* ── Modale modification classification ── */}
      {editingFacture && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setEditingFacture(null)}
        >
          <div
            className="w-full max-w-sm bg-[#0d1f21] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Modifier la classification</h3>
            <p className="text-xs text-zinc-500 truncate">{editingFacture.filename}</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Catégorie</label>
                <select
                  value={editForm.categorie}
                  onChange={e => setEditForm(f => ({ ...f, categorie: e.target.value }))}
                  className={inputClass}
                >
                  {["travaux", "mobilier", "equipement", "charges", "honoraires", "divers"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Traitement</label>
                <select
                  value={editForm.traitement}
                  onChange={e => setEditForm(f => ({ ...f, traitement: e.target.value }))}
                  className={inputClass}
                >
                  <option value="amortissable">amortissable</option>
                  <option value="deductible">deductible</option>
                </select>
              </div>
              {editForm.traitement === "amortissable" && (
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Durée d&apos;amortissement (années)</label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.duree_amort}
                    onChange={e => setEditForm(f => ({ ...f, duree_amort: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={saveEdit}
                className="flex-1 bg-[#C9A84C] text-black font-bold py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setEditingFacture(null)}
                className="flex-1 border border-[#2a4a4d] text-zinc-400 py-2 rounded-lg text-sm hover:border-zinc-500 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modale simulation fiscale ── */}
      {showSimulation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowSimulation(false)}
        >
          <div
            className="w-full max-w-lg bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
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
              {/* Loyer */}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Loyer annuel</span>
                <span className="font-semibold text-white">{fmt(loyer)} €</span>
              </div>

              {/* Charges déductibles */}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Charges déductibles HT ({annee})</span>
                <span className="font-semibold text-emerald-400">−{fmt(deductibleHt)} €</span>
              </div>

              {/* Amortissements */}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Amortissements annuels estimés</span>
                <span className="font-semibold text-orange-400">−{fmt(amortAnnuel)} €</span>
              </div>
              {amortDetails.length > 0 && (
                <div className="ml-4 space-y-1 pt-1">
                  {amortDetails.map((d, i) => (
                    <div key={i} className="flex justify-between text-xs text-zinc-500">
                      <span className="truncate mr-2">{d.label}</span>
                      <span className="flex-shrink-0">{fmt(d.annuite)} €/an ({fmt(d.montantHt)} € / {d.dureeAmort} ans)</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="h-px bg-[#2a4a4d]" />

              {/* Résultat */}
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Résultat fiscal estimé</span>
                <span className={`text-xl font-bold ${resultatFiscal >= 0 ? "text-[#C9A84C]" : "text-emerald-400"}`}>
                  {resultatFiscal < 0 ? "−" : ""}{fmt(Math.abs(resultatFiscal))} €
                </span>
              </div>
              <p className={`text-xs font-medium ${resultatFiscal >= 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {resultatFiscal >= 0
                  ? "Bénéfice imposable — à déclarer sur formulaire 2031"
                  : "Déficit — report possible sur les années suivantes (BIC)"}
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
