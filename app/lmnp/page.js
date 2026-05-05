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
  const timerRef = useRef(null);
  const warningRef = useRef(null);

  // Simulation state
  const [showSimulation, setShowSimulation] = useState(false);
  const [loyerAnnuel, setLoyerAnnuel] = useState("");

  // Edit classification state
  const [editingFacture, setEditingFacture] = useState(null);
  const [editForm, setEditForm] = useState({ categorie: "divers", traitement: "deductible", duree_amort: "", fournisseur: "", date_facture: "", montant_ht: "", tva: "", montant_ttc: "" });

  // Ventilation expand state
  const [expandedVentRows, setExpandedVentRows] = useState(new Set());

  // Résultats analyse pliables
  const [expandedResults, setExpandedResults] = useState(new Set());

  // Counts factures par année
  const [yearCounts, setYearCounts] = useState({});

  // Sélection en masse
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkForm, setBulkForm] = useState({ categorie: "divers", traitement: "deductible", duree_amort: "" });

  // Bien immobilier
  const [bien, setBien] = useState({ valeur_venale: "", quote_part_terrain: 15, duree_amort: 30, date_debut: "2025-05-19", date_mise_en_location: "" });

  // Charges récurrentes
  const [charges, setCharges] = useState({ loyer_annuel: "", taxe_fonciere: "", assurance_pno: "", cfe: "", frais_comptabilite: "", interets_emprunt: "", autres: "", autres_libelle: "" });

  // Simulation avancée
  const [deficitReporte, setDeficitReporte] = useState("");
  const [tmi, setTmi] = useState("11");

  // Recherche factures
  const [searchQuery, setSearchQuery] = useState("");

  // Déclaration
  const [declarationAnnee, setDeclarationAnnee] = useState(2025);
  const [declarationData, setDeclarationData] = useState(null);
  const [declarationLoading, setDeclarationLoading] = useState(false);
  const [checklist, setChecklist] = useState([false, false, false, false, false, false, false]);
  const [copyConfirm, setCopyConfirm] = useState(false);
  const [copyConfirmA, setCopyConfirmA] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [copyN1Toast, setCopyN1Toast] = useState(null);


  useEffect(() => {
    if (status === "unauthenticated") router.push("/crypto/login");
  }, [status, router]);

  useEffect(() => { fetch("/api/lmnp/init"); }, []);

  useEffect(() => {
    if (session) fetchFactures();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, annee]);

  useEffect(() => {
    if (session) fetchYearCounts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (session) fetchBien();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (session) fetchCharges();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, annee]);

  useEffect(() => {
    if (session && activeTab === "declaration") fetchDeclaration(declarationAnnee);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, activeTab, declarationAnnee]);

  useEffect(() => {
    if (!session) return;
    const reset = () => {
      clearTimeout(timerRef.current);
      clearTimeout(warningRef.current);
      setShowWarning(false);
      warningRef.current = setTimeout(() => setShowWarning(true), 29 * 60 * 1000);
      timerRef.current = setTimeout(() => signOut({ callbackUrl: "/crypto/login" }), 30 * 60 * 1000);
    };
    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart", "click"];
    events.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach(e => window.removeEventListener(e, reset));
      clearTimeout(timerRef.current);
      clearTimeout(warningRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function fetchDeclaration(yr) {
    setDeclarationLoading(true);
    const res = await fetch(`/api/lmnp/declaration?annee=${yr}`);
    const data = await res.json();
    setDeclarationData(data);
    setDeclarationLoading(false);
  }

  async function fetchFactures() {
    setFacturesLoading(true);
    const res = await fetch(`/api/lmnp/factures?annee=${annee}`);
    const data = await res.json();
    if (Array.isArray(data.factures)) setFactures(data.factures);
    if (data.isOwner !== undefined) setIsOwner(data.isOwner);
    setFacturesLoading(false);
  }

  async function fetchYearCounts() {
    const res = await fetch("/api/lmnp/factures");
    const data = await res.json();
    if (Array.isArray(data.factures)) {
      const counts = {};
      data.factures.forEach(f => {
        counts[f.annee] = (counts[f.annee] || 0) + 1;
      });
      setYearCounts(counts);
    }
  }

  async function fetchBien() {
    const res = await fetch("/api/lmnp/bien");
    const data = await res.json();
    if (data.bien) setBien({
      valeur_venale: data.bien.valeur_venale || "",
      quote_part_terrain: data.bien.quote_part_terrain ?? 15,
      duree_amort: data.bien.duree_amort ?? 30,
      date_debut: data.bien.date_debut ? data.bien.date_debut.slice(0, 10) : "",
      date_mise_en_location: data.bien.date_mise_en_location ? data.bien.date_mise_en_location.slice(0, 10) : "",
    });
  }

  async function fetchCharges() {
    const res = await fetch(`/api/lmnp/charges?annee=${annee}`);
    const data = await res.json();
    if (data.charges) setCharges({
      loyer_annuel: data.charges.loyer_annuel || "",
      taxe_fonciere: data.charges.taxe_fonciere || "",
      assurance_pno: data.charges.assurance_pno || "",
      cfe: data.charges.cfe || "",
      frais_comptabilite: data.charges.frais_comptabilite || "",
      interets_emprunt: data.charges.interets_emprunt || "",
      autres: data.charges.autres || "",
      autres_libelle: data.charges.autres_libelle || "",
    });
  }

  async function saveBien() {
    await fetch("/api/lmnp/bien", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        valeur_venale: parseFloat(bien.valeur_venale) || 0,
        quote_part_terrain: parseFloat(bien.quote_part_terrain) || 15,
        duree_amort: parseInt(bien.duree_amort) || 30,
        date_debut: bien.date_debut || null,
        date_mise_en_location: bien.date_mise_en_location || null,
      }),
    });
  }

  async function saveCharges() {
    await fetch("/api/lmnp/charges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        annee,
        loyer_annuel: parseFloat(charges.loyer_annuel) || 0,
        taxe_fonciere: parseFloat(charges.taxe_fonciere) || 0,
        assurance_pno: parseFloat(charges.assurance_pno) || 0,
        cfe: parseFloat(charges.cfe) || 0,
        frais_comptabilite: parseFloat(charges.frais_comptabilite) || 0,
        interets_emprunt: parseFloat(charges.interets_emprunt) || 0,
        autres: parseFloat(charges.autres) || 0,
        autres_libelle: charges.autres_libelle || null,
      }),
    });
  }

  async function copyChargesFromN1() {
    const prevAnnee = annee - 1;
    const res = await fetch(`/api/lmnp/charges?annee=${prevAnnee}`);
    const data = await res.json();
    if (data.charges) {
      setCharges({
        loyer_annuel: data.charges.loyer_annuel || "",
        taxe_fonciere: data.charges.taxe_fonciere || "",
        assurance_pno: data.charges.assurance_pno || "",
        cfe: data.charges.cfe || "",
        frais_comptabilite: data.charges.frais_comptabilite || "",
        interets_emprunt: data.charges.interets_emprunt || "",
        autres: data.charges.autres || "",
        autres_libelle: data.charges.autres_libelle || "",
      });
    } else {
      setCopyN1Toast(`Aucune donnée trouvée pour ${prevAnnee}`);
      setTimeout(() => setCopyN1Toast(null), 3000);
    }
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
    const savedAnnees = new Set();

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
          doublon: data.doublon || false,
          error: data.error || null,
        }]);
        if (data.saved) { savedCount++; if (data.annee) savedAnnees.add(data.annee); fetchFactures(); fetchYearCounts(); }
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
      const anneesLabel = savedAnnees.size > 0
        ? [...savedAnnees].sort().join(", ")
        : annee;
      setSaveConfirm(
        `${savedCount} facture${savedCount > 1 ? "s" : ""} sauvegardée${savedCount > 1 ? "s" : ""} dans votre historique ${anneesLabel}`
      );
      setPdfFiles([]);
      setTimeout(() => setSaveConfirm(null), 5000);
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
    fetchYearCounts();
  }

  function toggleSelect(analyse_id) {
    if (!analyse_id) return;
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(analyse_id) ? next.delete(analyse_id) : next.add(analyse_id);
      return next;
    });
  }

  function toggleSelectAll() {
    const ids = factures.filter(f => f.analyse_id).map(f => f.analyse_id);
    const allSelected = ids.length > 0 && ids.every(id => selectedIds.has(id));
    setSelectedIds(allSelected ? new Set() : new Set(ids));
  }

  async function applyBulk() {
    const ids = [...selectedIds];
    if (!ids.length) return;
    await fetch("/api/lmnp/factures", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analyse_ids: ids,
        categorie: bulkForm.categorie,
        traitement: bulkForm.traitement,
        duree_amort: bulkForm.traitement === "amortissable" && bulkForm.duree_amort
          ? parseInt(bulkForm.duree_amort)
          : null,
      }),
    });
    setSelectedIds(new Set());
    await fetchFactures();
  }

  function openEdit(f) {
    setEditingFacture(f);
    setEditForm({
      categorie: f.categorie || "divers",
      traitement: f.traitement || "deductible",
      duree_amort: f.duree_amort || "",
      fournisseur: f.fournisseur || "",
      date_facture: f.date_facture || "",
      montant_ht: f.montant_ht || "",
      tva: f.tva || "",
      montant_ttc: f.montant_ttc || "",
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
        fournisseur: editForm.fournisseur || null,
        date_facture: editForm.date_facture || null,
        montant_ht: editForm.montant_ht !== "" ? parseFloat(editForm.montant_ht) : null,
        tva: editForm.tva !== "" ? parseFloat(editForm.tva) : null,
        montant_ttc: editForm.montant_ttc !== "" ? parseFloat(editForm.montant_ttc) : null,
      }),
    });
    if (res.ok) {
      await fetchFactures();
      setEditingFacture(null);
    }
  }

  function downloadCsv(content, filename) {
    const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function export2033C() {
    if (!declarationData) return;
    const rows = [
      ["Désignation", "Valeur (€)", "Durée (ans)", "Amort/an (€)", "Cumul (€)", "VNC (€)"],
      ...declarationData.tableau2033C.map(r => [
        r.designation,
        r.valeur.toFixed(2),
        r.duree,
        r.amortAn.toFixed(2),
        r.cumul.toFixed(2),
        r.vnc.toFixed(2),
      ]),
      ["TOTAL", "", "", declarationData.totalAmort.toFixed(2), "", ""],
    ];
    downloadCsv(rows.map(r => r.join(";")).join("\n"), `lmnp_2033C_${declarationAnnee}.csv`);
  }

  function exportDossierComplet() {
    if (!declarationData) return;
    const lines = [];
    const d = declarationData;

    lines.push("=== RECAPITULATIF 2031 ===");
    lines.push(`Année;${declarationAnnee}`);
    lines.push(`Case DA — Recettes brutes;${d.cases2031.DA.toFixed(2)}`);
    lines.push(`Case 10 — Charges externes;${d.cases2031.case10.toFixed(2)}`);
    lines.push(`Case 14 — Amortissements;${d.cases2031.case14.toFixed(2)}`);
    lines.push(`Case GG — Résultat ${d.cases2031.isDeficit ? "déficit" : "bénéfice"};${d.cases2031.caseGG.toFixed(2)}`);
    lines.push(`Amortissements différés (hors bilan fiscal);${d.cases2031.amortDifferes.toFixed(2)}`);
    lines.push("");
    lines.push("=== TABLEAU AMORTISSEMENTS 2033-C ===");
    lines.push("Désignation;Valeur (€);Durée (ans);Amort/an (€);Cumul (€);VNC (€)");
    d.tableau2033C.forEach(r => {
      lines.push(`${r.designation};${r.valeur.toFixed(2)};${r.duree};${r.amortAn.toFixed(2)};${r.cumul.toFixed(2)};${r.vnc.toFixed(2)}`);
    });
    lines.push(`TOTAL;;;${d.totalAmort.toFixed(2)};;`);
    lines.push("");
    lines.push("=== DETAIL CHARGES ===");
    lines.push(`Factures déductibles HT;${d.detail.deductibleHt.toFixed(2)}`);
    lines.push(`Charges récurrentes;${d.detail.totalChargesRec.toFixed(2)}`);
    lines.push(`Amortissements factures;${d.detail.amortAnnuel.toFixed(2)}`);
    lines.push(`Amortissement bien;${d.detail.amortBienAnnuel.toFixed(2)}`);

    downloadCsv(lines.join("\n"), `lmnp_dossier_comptable_${declarationAnnee}.csv`);
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

  // Amortissement du bien immobilier
  const valeurVenale = parseFloat(bien.valeur_venale) || 0;
  const quotePart = parseFloat(bien.quote_part_terrain) || 15;
  const dureeAmortBien = parseInt(bien.duree_amort) || 30;
  const baseAmortissable = valeurVenale * (1 - quotePart / 100);
  const amortBienAnnuel = dureeAmortBien > 0 ? baseAmortissable / dureeAmortBien : 0;

  // Amortissement bien effectif — ne démarre qu'à la date de mise en location
  const miseEnLocationStr = bien.date_mise_en_location;
  const miseEnLocationAnnee = miseEnLocationStr ? parseInt(miseEnLocationStr.slice(0, 4)) : null;
  const amortBienEffectif = (miseEnLocationAnnee && miseEnLocationAnnee > annee) ? 0 : amortBienAnnuel;

  // Charges récurrentes totales
  const totalChargesRec = [
    parseFloat(charges.taxe_fonciere) || 0,
    parseFloat(charges.assurance_pno) || 0,
    parseFloat(charges.cfe) || 0,
    parseFloat(charges.frais_comptabilite) || 0,
    parseFloat(charges.interets_emprunt) || 0,
    parseFloat(charges.autres) || 0,
  ].reduce((a, b) => a + b, 0);

  const totalAmortAll = amortAnnuel + amortBienEffectif;
  const totalDeductibleAll = deductibleHt + totalChargesRec;

  // Simulation fiscale — règle art. 39C CGI (plafonnement amortissements)
  const loyer = parseFloat(loyerAnnuel) || 0;
  const deficitN1 = parseFloat(deficitReporte) || 0;
  const resultatAvantAmort = loyer - totalDeductibleAll;
  const amortDeductibles = resultatAvantAmort >= 0
    ? Math.min(totalAmortAll, resultatAvantAmort)
    : 0;
  const amortDifferes = totalAmortAll - amortDeductibles;
  const resultatFiscal = resultatAvantAmort - amortDeductibles;
  const resultatFiscalNet = resultatFiscal > 0 ? Math.max(0, resultatFiscal - deficitN1) : resultatFiscal;

  const tmiPct = parseFloat(tmi) || 0;
  const imposable = Math.max(0, resultatFiscalNet);
  const impotTMI = imposable * (tmiPct / 100);
  const prelevement = imposable * 0.172;
  const totalImpot = impotTMI + prelevement;

  // Filtrage des factures par recherche
  const filteredFactures = searchQuery.trim()
    ? factures.filter(f =>
        (f.filename || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.fournisseur || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : factures;

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
            <div className="space-y-2">
              {analyseResults.map((r, i) => (
                <div key={i}>
                  {r.doublon && (
                    <p className="text-amber-400 text-sm px-1">
                      ⚠ {r.file.name} : Facture déjà existante (même fournisseur et montant)
                    </p>
                  )}
                  {r.error && (
                    <p className="text-red-400 text-sm px-1">
                      {r.file.name} : {r.error}
                    </p>
                  )}
                  {r.analyse && (
                    <div className="bg-[#0d1f21] rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedResults(prev => {
                          const next = new Set(prev);
                          next.has(i) ? next.delete(i) : next.add(i);
                          return next;
                        })}
                        className="w-full flex items-center justify-between px-4 py-3 text-left gap-3"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-emerald-400 text-sm flex-shrink-0">✓</span>
                          <span className="text-white font-medium truncate">{r.analyse.fournisseur}</span>
                          <span className="text-zinc-400 text-sm flex-shrink-0">— {fmt(r.analyse.montant_ttc)} €</span>
                          <CategoryBadge cat={r.analyse.categorie} />
                        </div>
                        <span className="text-zinc-500 text-xs flex-shrink-0">
                          {expandedResults.has(i) ? "▲" : "▼"}
                        </span>
                      </button>
                      {expandedResults.has(i) && (
                        <div className="px-4 pb-4">
                          <AnalyseCard
                            analyse={r.analyse}
                            filename={analyseResults.length > 1 ? r.file.name : null}
                          />
                        </div>
                      )}
                    </div>
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
                { key: "declaration", label: "Déclaration 2031" },
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
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-white">Mes factures</h2>
                    {factures.length > 0 && (
                      <button
                        onClick={toggleSelectAll}
                        className="text-xs text-zinc-400 hover:text-[#C9A84C] transition-colors"
                      >
                        {factures.filter(f => f.analyse_id).length > 0 &&
                         factures.filter(f => f.analyse_id).every(f => selectedIds.has(f.analyse_id))
                          ? "Désélectionner tout"
                          : "Tout sélectionner"}
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {[2024, 2025, 2026].map(y => (
                      <button
                        key={y}
                        onClick={() => { setAnnee(y); setSelectedIds(new Set()); }}
                        className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                          annee === y
                            ? "bg-[#C9A84C] text-black"
                            : "border border-[#2a4a4d] text-zinc-400 hover:border-[#C9A84C]/50"
                        }`}
                      >
                        {y}
                        <span className={`ml-1.5 text-xs font-normal ${annee === y ? "text-black/60" : "text-zinc-600"}`}>
                          ({yearCounts[y] || 0})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Barre de recherche */}
                {factures.length > 0 && (
                  <div className="space-y-1">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher par fichier ou fournisseur…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className={inputClass + " pr-8"}
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {searchQuery && (
                      <p className="text-xs text-zinc-500">
                        {filteredFactures.length} résultat{filteredFactures.length !== 1 ? "s" : ""} sur {factures.length}
                      </p>
                    )}
                  </div>
                )}

                {facturesLoading && <p className="text-zinc-400 text-sm">Chargement...</p>}

                {!facturesLoading && factures.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-zinc-400 text-sm">Uploadez votre première facture ci-dessus</p>
                  </div>
                )}

                {!facturesLoading && factures.length > 0 && filteredFactures.length === 0 && (
                  <p className="text-zinc-400 text-sm text-center py-4">Aucun résultat pour « {searchQuery} »</p>
                )}

                {factures.length > 0 && filteredFactures.length > 0 && (
                  <div className="space-y-3">
                    {filteredFactures.map(f => (
                      <div
                        key={f.id}
                        className="bg-[#0d1f21] rounded-xl p-4 flex items-start gap-3"
                      >
                        <input
                          type="checkbox"
                          checked={!!f.analyse_id && selectedIds.has(f.analyse_id)}
                          onChange={() => toggleSelect(f.analyse_id)}
                          disabled={!f.analyse_id}
                          className="mt-1 h-4 w-4 accent-[#C9A84C] cursor-pointer flex-shrink-0"
                        />
                        <div className="flex flex-1 items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {f.url_pdf ? (
                            <span
                              onClick={() => window.open(f.url_pdf, "_blank")}
                              className="cursor-pointer hover:underline text-[#C9A84C] font-medium truncate block"
                            >
                              {f.filename}
                            </span>
                          ) : (
                            <>
                              <span className="text-zinc-300 font-medium truncate block">{f.filename}</span>
                              <span className="text-zinc-600 text-xs">(PDF non disponible)</span>
                            </>
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
                      </div>
                    ))}
                  </div>
                )}

                {/* Barre modification en masse */}
                {selectedIds.size > 0 && (
                  <div className="bg-[#0d1f21] ring-1 ring-[#C9A84C]/30 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-semibold text-white">
                      {selectedIds.size} facture{selectedIds.size > 1 ? "s" : ""} sélectionnée{selectedIds.size > 1 ? "s" : ""}
                    </p>
                    <div className="flex flex-wrap gap-3 items-end">
                      <div>
                        <label className="text-xs text-zinc-400 mb-1 block">Catégorie</label>
                        <select
                          value={bulkForm.categorie}
                          onChange={e => setBulkForm(f => ({ ...f, categorie: e.target.value }))}
                          className="rounded-lg border border-[#2a4a4d] bg-[#12282A] px-3 py-2 text-zinc-100 focus:border-[#C9A84C] focus:outline-none text-sm"
                        >
                          {["travaux", "mobilier", "equipement", "charges", "honoraires", "divers"].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 mb-1 block">Traitement</label>
                        <select
                          value={bulkForm.traitement}
                          onChange={e => setBulkForm(f => ({ ...f, traitement: e.target.value }))}
                          className="rounded-lg border border-[#2a4a4d] bg-[#12282A] px-3 py-2 text-zinc-100 focus:border-[#C9A84C] focus:outline-none text-sm"
                        >
                          <option value="amortissable">amortissable</option>
                          <option value="deductible">deductible</option>
                        </select>
                      </div>
                      {bulkForm.traitement === "amortissable" && (
                        <div>
                          <label className="text-xs text-zinc-400 mb-1 block">Durée (ans)</label>
                          <input
                            type="number"
                            min="1"
                            value={bulkForm.duree_amort}
                            onChange={e => setBulkForm(f => ({ ...f, duree_amort: e.target.value }))}
                            className="rounded-lg border border-[#2a4a4d] bg-[#12282A] px-3 py-2 text-zinc-100 focus:border-[#C9A84C] focus:outline-none text-sm w-24"
                          />
                        </div>
                      )}
                      <button
                        onClick={applyBulk}
                        className="bg-[#C9A84C] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors"
                      >
                        Appliquer à la sélection
                      </button>
                      <button
                        onClick={() => setSelectedIds(new Set())}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
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
                                          <th className="text-left py-1 font-medium">Durée</th>
                                          <th className="text-left py-1 font-medium">Annuité/an</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {v.items.map((item, idx) => (
                                          <tr key={idx} className="border-t border-[#1a3a3d]">
                                            <td className="py-1.5 pl-4 text-zinc-400 max-w-[180px] truncate">{item.filename}</td>
                                            <td className="py-1.5 text-zinc-400">{item.fournisseur || "—"}</td>
                                            <td className="py-1.5 text-zinc-300">{fmt(item.montant_ht)} €</td>
                                            <td className="py-1.5 text-zinc-400">
                                              {item.traitement === "amortissable" && item.duree_amort
                                                ? `${item.duree_amort} ans`
                                                : "—"}
                                            </td>
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

                {/* Sélecteur d'année */}
                <div className="flex gap-2">
                  {[2024, 2025, 2026].map(y => (
                    <button
                      key={y}
                      onClick={() => { setAnnee(y); setSelectedIds(new Set()); }}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                        annee === y
                          ? "bg-[#C9A84C] text-black"
                          : "border border-[#2a4a4d] text-zinc-400 hover:border-[#C9A84C]/50"
                      }`}
                    >
                      {y}
                      <span className={`ml-1.5 text-xs font-normal ${annee === y ? "text-black/60" : "text-zinc-600"}`}>
                        ({yearCounts[y] || 0})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Bien immobilier */}
                <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Bien immobilier</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Valeur vénale (€)</label>
                      <input
                        type="number" value={bien.valeur_venale} placeholder="200000"
                        onChange={e => setBien(b => ({ ...b, valeur_venale: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Quote-part terrain (%)</label>
                      <input
                        type="number" value={bien.quote_part_terrain} placeholder="15"
                        onChange={e => setBien(b => ({ ...b, quote_part_terrain: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Durée amortissement (ans)</label>
                      <input
                        type="number" value={bien.duree_amort} placeholder="30"
                        onChange={e => setBien(b => ({ ...b, duree_amort: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Date début activité LMNP</label>
                      <input
                        type="date" value={bien.date_debut}
                        onChange={e => setBien(b => ({ ...b, date_debut: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Date de mise en location effective</label>
                      <input
                        type="date" value={bien.date_mise_en_location}
                        placeholder="ex: 01/07/2026"
                        onChange={e => setBien(b => ({ ...b, date_mise_en_location: e.target.value }))}
                        className={inputClass}
                      />
                      <p className="text-xs text-zinc-600 mt-1">
                        L&apos;amortissement du bien commence à la première mise en location, pas à l&apos;immatriculation LMNP
                      </p>
                    </div>
                  </div>
                  {valeurVenale > 0 && (
                    <div className="bg-[#0d1f21] rounded-xl p-3 flex flex-wrap gap-6 text-sm">
                      <span className="text-zinc-400">Base amortissable : <span className="text-white font-semibold">{fmt(baseAmortissable)} €</span></span>
                      {miseEnLocationAnnee && miseEnLocationAnnee > annee ? (
                        <span className="text-zinc-500">
                          Amortissement bien : <span className="text-zinc-400 font-semibold">0 € (démarrage en {miseEnLocationAnnee})</span>
                        </span>
                      ) : (
                        <span className="text-zinc-400">Amortissement annuel : <span className="text-orange-400 font-semibold">{fmt(amortBienAnnuel)} €/an</span></span>
                      )}
                    </div>
                  )}
                  <button
                    onClick={saveBien}
                    className="bg-[#C9A84C] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>

                {/* Charges récurrentes */}
                <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-lg font-bold text-white">Charges récurrentes — {annee}</h3>
                    <button
                      onClick={copyChargesFromN1}
                      className="text-xs px-3 py-1.5 rounded-lg border border-[#2a4a4d] text-zinc-400 hover:border-[#C9A84C]/50 hover:text-zinc-300 transition-colors"
                    >
                      Copier depuis {annee - 1}
                    </button>
                  </div>
                  {copyN1Toast && (
                    <p className="text-xs text-amber-400 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-lg px-3 py-2">{copyN1Toast}</p>
                  )}
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Loyers annuels perçus (€) — utilisé pour la déclaration 2031 Case DA</label>
                    <input
                      type="number" value={charges.loyer_annuel} placeholder="0"
                      onChange={e => setCharges(c => ({ ...c, loyer_annuel: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div className="h-px bg-[#2a4a4d]" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      ["taxe_fonciere", "Taxe foncière"],
                      ["assurance_pno", "Assurance PNO"],
                      ["cfe", "CFE"],
                      ["frais_comptabilite", "Frais de comptabilité"],
                      ["interets_emprunt", "Intérêts d'emprunt"],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <label className="text-xs text-zinc-400 mb-1 block">{label} (€)</label>
                        <input
                          type="number" value={charges[key]} placeholder="0"
                          onChange={e => setCharges(c => ({ ...c, [key]: e.target.value }))}
                          className={inputClass}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Autres (€)</label>
                      <input
                        type="number" value={charges.autres} placeholder="0"
                        onChange={e => setCharges(c => ({ ...c, autres: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Libellé autres charges</label>
                    <input
                      type="text" value={charges.autres_libelle} placeholder="ex : frais de gestion"
                      onChange={e => setCharges(c => ({ ...c, autres_libelle: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <span className="text-sm text-zinc-400">
                      Total : <span className="text-emerald-400 font-semibold">{fmt(totalChargesRec)} €</span>
                    </span>
                    <button
                      onClick={saveCharges}
                      className="bg-[#C9A84C] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    ["Total factures TTC", `${fmt(totalTtcAll)} €`, "text-white"],
                    ["Amortissements annuels", `${fmt(totalAmortAll)} €/an`, "text-orange-400"],
                    ["Charges déductibles", `${fmt(totalDeductibleAll)} €`, "text-emerald-400"],
                    ["TVA totale", `${fmt(totalTva)} €`, "text-[#C9A84C]"],
                  ].map(([label, val, cls]) => (
                    <div key={label} className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-xl p-4">
                      <p className="text-xs text-zinc-400 mb-1">{label}</p>
                      <p className={`text-xl font-bold ${cls}`}>{val}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-500/10 ring-1 ring-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
                  <span className="text-amber-400 text-xl flex-shrink-0 mt-0.5">⚠️</span>
                  <p className="text-sm text-zinc-400">
                    <span className="text-amber-400 font-semibold">Règle fiscale LMNP (art. 39C CGI) : </span>
                    Les amortissements ne peuvent pas créer ou aggraver un déficit fiscal.
                    Ils sont automatiquement différés et reportés sur vos futurs bénéfices LMNP,
                    sans limite de temps mais dans la limite de 10 ans pour les déficits de charges.
                  </p>
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
            {/* ── Déclaration 2031 ── */}
            {activeTab === "declaration" && (
              <div className="space-y-6">

                {/* Sélecteur d'année */}
                <div className="flex gap-2">
                  {[2025, 2026].map(y => (
                    <button
                      key={y}
                      onClick={() => setDeclarationAnnee(y)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        declarationAnnee === y
                          ? "bg-[#C9A84C] text-black"
                          : "border border-[#2a4a4d] text-zinc-400 hover:border-[#C9A84C]/50"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>

                {/* ══ SECTION 1 — CHECKLIST ══ */}
                <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Checklist avant déclaration {declarationAnnee}</h3>
                  <div className="space-y-3">
                    {[
                      "Toutes mes factures uploadées et classifiées",
                      "Charges récurrentes saisies (taxe foncière, PNO…)",
                      "Valeur vénale du bien immobilier renseignée",
                      "Ventilation vérifiée facture par facture",
                      "SIRET disponible : 833 889 918 00029",
                      "Espace professionnel impots.gouv.fr créé",
                      `Date limite 2031 notée : 18 septembre ${declarationAnnee + 1}`,
                    ].map((item, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={checklist[i] || false}
                          onChange={() => setChecklist(prev => prev.map((v, j) => j === i ? !v : v))}
                          className="h-4 w-4 accent-[#C9A84C] cursor-pointer flex-shrink-0"
                        />
                        <span className={`text-sm transition-colors ${checklist[i] ? "text-zinc-500 line-through" : "text-zinc-300"}`}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>{checklist.filter(Boolean).length}/7 complété</span>
                      <span>{checklist.filter(Boolean).length === 7 ? "✓ Prêt à déclarer" : ""}</span>
                    </div>
                    <div className="h-2 bg-[#0d1f21] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C9A84C] rounded-full transition-all"
                        style={{ width: `${(checklist.filter(Boolean).length / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* ══ SECTION 2 — LIASSE FISCALE 2031-SD ══ */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Formulaire 2031-SD</h3>
                    <p className="text-sm text-zinc-400 mt-1">
                      À déposer avant le{" "}
                      <span className="text-[#C9A84C] font-semibold">18 septembre {declarationAnnee + 1}</span>
                      {" "}— impots.gouv.fr → Espace Professionnel
                    </p>
                  </div>

                  {/* Cadre A — Identification */}
                  <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <h4 className="font-bold text-white">Cadre A — Identification</h4>
                      <button
                        onClick={() => {
                          const txt = [
                            "Nom/Prénom : CHENOT Frederick Franck",
                            "SIRET : 833 889 918 00029",
                            "Adresse : 44A rue d'Epinal - 88000 Jeuxey",
                            "Activité : Location meublée (68.20A)",
                            "Date début : 19/05/2025",
                            "Régime : Réel simplifié BIC",
                            `Clôture : 31/12/${declarationAnnee}`,
                          ].join("\n");
                          navigator.clipboard.writeText(txt).then(() => {
                            setCopyConfirmA(true);
                            setTimeout(() => setCopyConfirmA(false), 2000);
                          });
                        }}
                        className="bg-[#C9A84C] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors"
                      >
                        {copyConfirmA ? "Copié !" : "Copier tout"}
                      </button>
                    </div>
                    <div className="bg-[#0d1f21] rounded-xl divide-y divide-[#2a4a4d]">
                      {[
                        ["Nom / Prénom", "CHENOT Frederick Franck"],
                        ["SIRET", "833 889 918 00029"],
                        ["Adresse", "44A rue d'Epinal — 88000 Jeuxey"],
                        ["Activité", "Location meublée (68.20A)"],
                        ["Date début", "19/05/2025"],
                        ["Régime", "Réel simplifié BIC"],
                        ["Clôture exercice", `31/12/${declarationAnnee}`],
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between items-center px-4 py-3">
                          <span className="text-zinc-400 text-sm">{label}</span>
                          <span className="font-mono text-sm text-white">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cadre B — Compte de résultat */}
                  <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <h4 className="font-bold text-white">Cadre B — Compte de résultat</h4>
                      {declarationData && (
                        <button
                          onClick={() => {
                            const d = declarationData;
                            const cfe_v = parseFloat(charges?.cfe || 0);
                            const dh_v = d.cases2031.case10 - cfe_v;
                            const txt = [
                              `Case DA — Recettes brutes : ${d.cases2031.DA.toFixed(2)} €`,
                              `Case DB — Achats : 0,00 €`,
                              `Case DC — Variation stocks : 0,00 €`,
                              `Case DH — Charges externes : ${dh_v.toFixed(2)} €`,
                              `Case DI — Impôts et taxes (CFE) : ${cfe_v.toFixed(2)} €`,
                              `Case DJ — Charges personnel : 0,00 €`,
                              `Case DL — Dotations amortissements : ${d.cases2031.case14.toFixed(2)} €`,
                              `Case DN — Autres charges : 0,00 €`,
                              d.cases2031.isDeficit
                                ? `Case GG — Déficit fiscal : ${d.cases2031.caseGG.toFixed(2)} €`
                                : `Case GP — Bénéfice fiscal : ${d.cases2031.caseGG.toFixed(2)} €`,
                              `Amortissements différés (2033-C) : ${d.cases2031.amortDifferes.toFixed(2)} €`,
                            ].join("\n");
                            navigator.clipboard.writeText(txt).then(() => {
                              setCopyConfirm(true);
                              setTimeout(() => setCopyConfirm(false), 2000);
                            });
                          }}
                          className="bg-[#C9A84C] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors"
                        >
                          {copyConfirm ? "Copié !" : "Copier les valeurs 2031"}
                        </button>
                      )}
                    </div>

                    {declarationLoading && <p className="text-zinc-400 text-sm">Chargement...</p>}

                    {declarationData && (() => {
                      const d = declarationData;
                      const cfe_v = parseFloat(charges?.cfe || 0);
                      const dh_v = d.cases2031.case10 - cfe_v;
                      return (
                        <div className="bg-[#0d1f21] rounded-xl divide-y divide-[#2a4a4d]">
                          {[
                            ["Case DA — Recettes brutes", d.cases2031.DA, "text-white"],
                            ["Case DB — Achats", 0, "text-zinc-500"],
                            ["Case DC — Variation stocks", 0, "text-zinc-500"],
                            ["Case DH — Charges externes", dh_v, "text-emerald-400"],
                            ["Case DI — Impôts et taxes (CFE)", cfe_v, "text-emerald-400"],
                            ["Case DJ — Charges personnel", 0, "text-zinc-500"],
                            ["Case DL — Dotations amortissements", d.cases2031.case14, "text-orange-400"],
                            ["Case DN — Autres charges", 0, "text-zinc-500"],
                          ].map(([label, val, cls]) => (
                            <div key={label} className="flex justify-between items-center px-4 py-3">
                              <span className="text-zinc-400 text-sm">{label}</span>
                              <span className={`font-semibold text-sm ${cls}`}>{fmt(val)} €</span>
                            </div>
                          ))}
                          <div className="flex justify-between items-center px-4 py-4 bg-[#1a3335]">
                            <span className="text-sm font-bold text-white">
                              {d.cases2031.isDeficit ? "Case GG — Déficit fiscal" : "Case GP — Bénéfice fiscal"}
                            </span>
                            <span className={`font-bold text-base ${d.cases2031.isDeficit ? "text-emerald-400" : "text-amber-400"}`}>
                              {fmt(d.cases2031.caseGG)} €
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {(declarationData?.cases2031.isDeficit || declarationData?.cases2031.amortDifferes > 0) && (
                      <div className="bg-amber-500/10 ring-1 ring-amber-500/30 rounded-xl p-3 space-y-1">
                        <p className="text-xs font-semibold text-amber-400">⚠️ Note fiscale (art. 39C CGI)</p>
                        {declarationData.cases2031.isDeficit && (
                          <p className="text-xs text-zinc-400">
                            Case GG = déficit de charges uniquement :{" "}
                            <span className="text-emerald-400 font-semibold">{fmt(declarationData.cases2031.deficitCharges)} €</span>
                          </p>
                        )}
                        {declarationData.cases2031.amortDifferes > 0 && (
                          <p className="text-xs text-zinc-400">
                            Les amortissements ({" "}
                            <span className="text-orange-400 font-semibold">{fmt(declarationData.cases2031.amortDifferes)} €</span>
                            {" "}) ne créent pas de déficit — différés et reportés sur bénéfices LMNP futurs.
                          </p>
                        )}
                      </div>
                    )}

                    {declarationData?.cases2031.amortDifferes > 0 && (
                      <div className="bg-[#0d1f21] ring-1 ring-zinc-700 rounded-xl p-4">
                        <p className="text-sm font-semibold text-zinc-300 mb-1">Amortissements différés (hors case 2031)</p>
                        <p className="text-xs text-zinc-500 mb-2">Ces amortissements ne figurent pas en case GG mais doivent être déclarés sur le 2033-C</p>
                        <p className="text-2xl font-bold text-orange-400">{fmt(declarationData.cases2031.amortDifferes)} €</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ══ SECTION 3 — ANNEXES 2033 ══ */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Annexes 2033</h3>

                  {/* 2033-A — Bilan simplifié */}
                  {declarationData && (() => {
                    const factAmortHT = declarationData.tableau2033C
                      .filter(r => !r.isBien)
                      .reduce((s, r) => s + r.valeur, 0);
                    const totalImmob = valeurVenale + factAmortHT;
                    const resultat = declarationData.cases2033B.resultatNet;
                    return (
                      <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-4">
                        <h4 className="font-bold text-white">2033-A — Bilan simplifié</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">ACTIF</p>
                            <div className="bg-[#0d1f21] rounded-xl divide-y divide-[#2a4a4d]">
                              <div className="flex justify-between items-center px-4 py-3">
                                <span className="text-zinc-400 text-sm">Bien immobilier (brut)</span>
                                <span className="font-semibold text-sm text-white">{fmt(valeurVenale)} €</span>
                              </div>
                              <div className="flex justify-between items-center px-4 py-3">
                                <span className="text-zinc-400 text-sm">Factures amortissables (brut)</span>
                                <span className="font-semibold text-sm text-white">{fmt(factAmortHT)} €</span>
                              </div>
                              <div className="flex justify-between items-center px-4 py-3 bg-[#1a3335]">
                                <span className="font-bold text-white text-sm">Total immobilisations</span>
                                <span className="font-bold text-[#C9A84C] text-sm">{fmt(totalImmob)} €</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">PASSIF</p>
                            <div className="bg-[#0d1f21] rounded-xl divide-y divide-[#2a4a4d]">
                              <div className="flex justify-between items-center px-4 py-3">
                                <span className="text-zinc-400 text-sm">Capital apporté</span>
                                <span className="font-semibold text-sm text-white">{fmt(totalImmob)} €</span>
                              </div>
                              <div className="flex justify-between items-center px-4 py-3">
                                <span className="text-zinc-400 text-sm">Résultat de l&apos;exercice</span>
                                <span className={`font-semibold text-sm ${resultat < 0 ? "text-emerald-400" : "text-amber-400"}`}>
                                  {resultat < 0 ? "−" : ""}{fmt(Math.abs(resultat))} €
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 2033-B — Compte de résultat simplifié */}
                  {declarationData && (
                    <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-4">
                      <h4 className="font-bold text-white">2033-B — Compte de résultat simplifié</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">PRODUITS</p>
                          <div className="bg-[#0d1f21] rounded-xl divide-y divide-[#2a4a4d]">
                            <div className="flex justify-between items-center px-4 py-3">
                              <span className="text-zinc-400 text-sm">Chiffre d&apos;affaires (loyers)</span>
                              <span className="font-semibold text-sm text-white">{fmt(declarationData.cases2033B.produits)} €</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">CHARGES</p>
                          <div className="bg-[#0d1f21] rounded-xl divide-y divide-[#2a4a4d]">
                            <div className="flex justify-between items-center px-4 py-3">
                              <span className="text-zinc-400 text-sm">Charges factures déductibles</span>
                              <span className="font-semibold text-sm text-emerald-400">{fmt(declarationData.detail.deductibleHt)} €</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3">
                              <span className="text-zinc-400 text-sm">Charges récurrentes</span>
                              <span className="font-semibold text-sm text-emerald-400">{fmt(declarationData.detail.totalChargesRec)} €</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3">
                              <span className="text-zinc-400 text-sm">Amortissements déduits</span>
                              <span className="font-semibold text-sm text-orange-400">{fmt(declarationData.cases2031.case14)} €</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3">
                              <span className="text-zinc-400 text-sm">Amortissements différés</span>
                              <span className="font-semibold text-sm text-zinc-500">{fmt(declarationData.cases2031.amortDifferes)} €</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 bg-[#1a3335]">
                              <span className="font-bold text-white text-sm">Résultat net</span>
                              <span className={`font-bold text-sm ${declarationData.cases2033B.resultatNet < 0 ? "text-emerald-400" : "text-amber-400"}`}>
                                {declarationData.cases2033B.resultatNet < 0 ? "−" : ""}{fmt(Math.abs(declarationData.cases2033B.resultatNet))} €
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2033-C — Tableau des amortissements */}
                  {declarationData && (
                    <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <h4 className="font-bold text-white">2033-C — Tableau des amortissements</h4>
                        <button
                          onClick={export2033C}
                          className="bg-[#C9A84C] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors"
                        >
                          Exporter 2033-C en CSV
                        </button>
                      </div>
                      {declarationData.tableau2033C.length === 0 ? (
                        <p className="text-zinc-400 text-sm">Aucun élément amortissable pour {declarationAnnee}</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-[#2a4a4d]">
                                {["Désignation", "Valeur €", "Durée", "Amort/an", "Cumul", "VNC"].map(h => (
                                  <th key={h} className="text-left px-3 py-2 text-xs text-zinc-400 font-medium">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {declarationData.tableau2033C.map((r, i) => (
                                <tr key={i} className="border-b border-[#2a4a4d] last:border-0 hover:bg-[#0d1f21]">
                                  <td className="px-3 py-2.5 text-zinc-300 max-w-[180px] truncate">{r.designation}</td>
                                  <td className="px-3 py-2.5 text-white font-medium">{fmt(r.valeur)} €</td>
                                  <td className="px-3 py-2.5 text-zinc-400">{r.duree} ans</td>
                                  <td className="px-3 py-2.5 text-orange-400">{fmt(r.amortAn)} €</td>
                                  <td className="px-3 py-2.5 text-orange-400">{fmt(r.cumul)} €</td>
                                  <td className="px-3 py-2.5 text-zinc-300">{fmt(r.vnc)} €</td>
                                </tr>
                              ))}
                              <tr className="border-t-2 border-[#C9A84C]/30 bg-[#0d1f21]">
                                <td className="px-3 py-2.5 font-bold text-white" colSpan={3}>TOTAL</td>
                                <td className="px-3 py-2.5 font-bold text-orange-400">{fmt(declarationData.totalAmort)} €</td>
                                <td className="px-3 py-2.5 font-bold text-orange-400">{fmt(declarationData.totalAmort)} €</td>
                                <td />
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2033-D — Relevé des provisions */}
                  <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-700/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-zinc-400 text-lg font-bold">—</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white">2033-D — Relevé des provisions</h4>
                      <p className="text-sm text-zinc-400 mt-0.5">Aucune provision constituée — <span className="font-semibold text-zinc-300">néant</span></p>
                    </div>
                  </div>
                </div>

                {/* ══ SECTION 4 — DÉCLARATION REVENUS ══ */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Formulaire 2042-C-PRO + 2042</h3>
                    <p className="text-sm text-zinc-400 mt-1">
                      À déposer en{" "}
                      <span className="text-[#C9A84C] font-semibold">mai {declarationAnnee + 1}</span>
                      {" "}— impots.gouv.fr → Espace Particulier
                    </p>
                  </div>

                  {/* 2042-C-PRO */}
                  <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-4">
                    <h4 className="font-bold text-white">2042-C-PRO — Cases LMNP</h4>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">
                      Rubrique : Locations meublées non professionnelles — Régime réel
                    </p>
                    {declarationData ? (
                      <div className="bg-[#0d1f21] rounded-xl divide-y divide-[#2a4a4d]">
                        {declarationData.cases2031.isDeficit ? (
                          <div className="flex justify-between items-center px-4 py-4">
                            <div>
                              <p className="text-zinc-300 text-sm font-semibold">Case 5KE — Déficit LMNP</p>
                              <p className="text-xs text-zinc-500 mt-0.5">Déclarant principal (Fred) ou 5KF (conjoint)</p>
                            </div>
                            <span className="font-bold text-emerald-400 text-xl ml-4">{fmt(declarationData.cases2031.caseGG)} €</span>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center px-4 py-4">
                            <div>
                              <p className="text-zinc-300 text-sm font-semibold">Case 5KP — Bénéfice LMNP</p>
                              <p className="text-xs text-zinc-500 mt-0.5">Déclarant principal (Fred) ou 5KR (conjoint)</p>
                            </div>
                            <span className="font-bold text-amber-400 text-xl ml-4">{fmt(declarationData.cases2031.caseGG)} €</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-zinc-400 text-sm">Chargement...</p>
                    )}
                    <div className="bg-amber-500/10 ring-1 ring-amber-500/30 rounded-xl p-3 space-y-1">
                      <p className="text-xs font-semibold text-amber-400">⚠️ Important</p>
                      <p className="text-xs text-zinc-400">
                        Ce déficit <strong className="text-zinc-300">NE S&apos;IMPUTE PAS</strong> sur le revenu global.
                        Il est reportable sur futurs bénéfices LMNP (10 ans max).
                      </p>
                    </div>
                  </div>

                  {/* 2044 — Location nue */}
                  <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-3">
                    <h4 className="font-bold text-white">2044 — Location nue (pour mémoire)</h4>
                    <div className="bg-[#0d1f21] rounded-xl p-4 space-y-2">
                      <p className="text-sm text-zinc-300">
                        Votre déclaration 2044 habituelle reste{" "}
                        <span className="font-semibold text-white">inchangée</span>{" "}
                        pour la maison louée nue.
                      </p>
                      <p className="text-xs text-zinc-500">44 rue d&apos;Epinal (hors appartement LMNP)</p>
                      <div className="mt-3">
                        <span className="inline-block bg-emerald-500/10 ring-1 ring-emerald-500/30 rounded-lg px-3 py-1.5">
                          <span className="text-xs font-semibold text-emerald-400">Les deux déclarations sont INDÉPENDANTES</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ══ SECTION 5 — GUIDE PAS À PAS ══ */}
                <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Guide pas à pas — Comment déclarer</h3>
                  <div className="space-y-3">
                    {[
                      {
                        icon: "🏢",
                        title: "Créer l'espace professionnel",
                        body: `impots.gouv.fr → Votre espace professionnel → Créer mon espace → SIRET : 833 889 918 00029 → Valider avec votre numéro fiscal`,
                      },
                      {
                        icon: "📋",
                        title: "Accéder à la liasse 2031",
                        body: `Espace pro → Déclarations → Déclaration de résultats → Régime réel simplifié BIC (2031) → Exercice du ${declarationAnnee === 2025 ? "19/05/2025" : "01/01/" + declarationAnnee} au 31/12/${declarationAnnee}`,
                      },
                      {
                        icon: "✍️",
                        title: "Remplir le 2031-SD",
                        body: `Utilisez les valeurs du Cadre B ci-dessus. Joindre obligatoirement les annexes 2033.`,
                      },
                      {
                        icon: "📎",
                        title: "Joindre les annexes",
                        body: `2033-A : bilan → valeurs ci-dessus\n2033-B : compte de résultat → valeurs ci-dessus\n2033-C : tableau amortissements → exporter CSV et recopier\n2033-D : provisions → néant`,
                      },
                      {
                        icon: "✅",
                        title: "Valider et télétransmettre",
                        body: `Date limite : 18 septembre ${declarationAnnee + 1}\nConserver l'accusé de réception`,
                      },
                      {
                        icon: "📝",
                        title: "Compléter la 2042-C-PRO",
                        body: `Mai ${declarationAnnee + 1} → Déclaration revenus habituelle → Ajouter case 5KE : ${declarationData ? fmt(declarationData.cases2031.caseGG) + " €" : "…"}\n→ Votre femme conserve ses cases BNC habituelles`,
                      },
                      {
                        icon: "⚠️",
                        title: `CFE à prévoir en ${declarationAnnee + 1}`,
                        body: `Vous recevrez un avis CFE (200–500 €)\nExonéré en ${declarationAnnee} (première année)\nDéductible en charges LMNP ${declarationAnnee + 1}`,
                      },
                      {
                        icon: "💡",
                        title: "Conseil",
                        body: `Pour votre première déclaration 2031, jedeclaremonmeuble.com (~150 € après déduction fiscale) peut vous accompagner`,
                      },
                    ].map((step, i) => (
                      <div key={i} className={`bg-[#0d1f21] rounded-xl p-4 flex gap-4 ${i === 7 ? "ring-1 ring-[#C9A84C]/30" : ""}`}>
                        <span className="text-2xl flex-shrink-0">{step.icon}</span>
                        <div>
                          <p className="font-semibold text-white text-sm mb-1">
                            {i < 7 && <span className="text-zinc-500 mr-2">{i + 1}.</span>}{step.title}
                          </p>
                          <p className="text-zinc-400 text-sm whitespace-pre-line">{step.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ══ SECTION 6 — EXPORT DOSSIER COMPTABLE ══ */}
                {declarationData && (
                  <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-lg font-bold text-white">Export dossier comptable complet</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Récapitulatif 2031 · Tableau 2033-C · Détail factures · Charges récurrentes · Prêt à envoyer à un expert-comptable
                      </p>
                    </div>
                    <button
                      onClick={exportDossierComplet}
                      className="bg-[#C9A84C] text-black font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors"
                    >
                      📥 Exporter dossier comptable complet
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
      </div>

      {/* ── Modale modification facture ── */}
      {editingFacture && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setEditingFacture(null)}
        >
          <div
            className="w-full max-w-md bg-[#0d1f21] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Modifier la facture</h3>
            <p className="text-xs text-zinc-500 truncate">{editingFacture.filename}</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Fournisseur</label>
                <input
                  type="text"
                  value={editForm.fournisseur}
                  onChange={e => setEditForm(f => ({ ...f, fournisseur: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Date facture</label>
                <input
                  type="text"
                  placeholder="JJ/MM/AAAA"
                  value={editForm.date_facture}
                  onChange={e => setEditForm(f => ({ ...f, date_facture: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Montant HT (€)</label>
                  <input
                    type="number" step="0.01"
                    value={editForm.montant_ht}
                    onChange={e => {
                      const ht = e.target.value;
                      const tvaVal = parseFloat(editForm.tva) || 0;
                      setEditForm(f => ({
                        ...f,
                        montant_ht: ht,
                        montant_ttc: ht !== "" ? (parseFloat(ht) + tvaVal).toFixed(2) : f.montant_ttc,
                      }));
                    }}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">TVA (€)</label>
                  <input
                    type="number" step="0.01"
                    value={editForm.tva}
                    onChange={e => {
                      const tvaVal = e.target.value;
                      const ht = parseFloat(editForm.montant_ht) || 0;
                      setEditForm(f => ({
                        ...f,
                        tva: tvaVal,
                        montant_ttc: tvaVal !== "" ? (ht + parseFloat(tvaVal)).toFixed(2) : f.montant_ttc,
                      }));
                    }}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Montant TTC (€)</label>
                  <input
                    type="number" step="0.01"
                    value={editForm.montant_ttc}
                    onChange={e => setEditForm(f => ({ ...f, montant_ttc: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="h-px bg-[#2a4a4d]" />

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
                    type="number" min="1"
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
              Simulation fiscale LMNP réel — {annee}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Loyer annuel (€)</label>
                <input
                  type="number" placeholder="0" value={loyerAnnuel}
                  onChange={e => setLoyerAnnuel(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">TMI (%)</label>
                <select value={tmi} onChange={e => setTmi(e.target.value)} className={inputClass}>
                  {["0", "11", "30", "41", "45"].map(t => (
                    <option key={t} value={t}>{t} %</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-zinc-400 mb-1 block">Déficit reporté N-1 (€)</label>
                <input
                  type="number" placeholder="0" value={deficitReporte}
                  onChange={e => setDeficitReporte(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="bg-[#0d1f21] rounded-xl p-4 space-y-2.5 text-sm">

              {/* Loyers */}
              <div className="flex justify-between">
                <span className="text-zinc-400">Loyer annuel</span>
                <span className="font-semibold text-white">{fmt(loyer)} €</span>
              </div>

              <div className="h-px bg-[#2a4a4d]" />

              {/* Charges */}
              <div className="flex justify-between">
                <span className="text-zinc-400">Charges déductibles factures</span>
                <span className="font-semibold text-emerald-400">−{fmt(deductibleHt)} €</span>
              </div>
              {totalChargesRec > 0 && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Charges récurrentes</span>
                  <span className="font-semibold text-emerald-400">−{fmt(totalChargesRec)} €</span>
                </div>
              )}

              <div className="h-px bg-[#2a4a4d]" />

              {/* Résultat avant amortissements */}
              <div className="flex justify-between font-semibold">
                <span className="text-zinc-300">Résultat avant amortissements</span>
                <span className={resultatAvantAmort >= 0 ? "text-amber-400" : "text-emerald-400"}>
                  {resultatAvantAmort < 0 ? "−" : ""}{fmt(Math.abs(resultatAvantAmort))} €
                </span>
              </div>

              <div className="h-px bg-[#2a4a4d]" />

              {/* Amortissements — règle 39C */}
              <div className="flex justify-between">
                <div>
                  <span className="text-zinc-400">Amortissements déduits</span>
                  <p className="text-xs text-zinc-600">plafonnés au résultat positif (art. 39C CGI)</p>
                </div>
                <span className="font-semibold text-orange-400">−{fmt(amortDeductibles)} €</span>
              </div>

              {amortDeductibles > 0 && (
                <div className="ml-3 space-y-1">
                  {amortDetails.map((d, i) => (
                    <div key={i} className="flex justify-between text-xs text-zinc-500">
                      <span className="truncate mr-2">{d.label}</span>
                      <span className="flex-shrink-0">{fmt(d.annuite)} €/an</span>
                    </div>
                  ))}
                  {amortBienEffectif > 0 && (
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span className="truncate mr-2">Bien immobilier</span>
                      <span className="flex-shrink-0">{fmt(amortBienEffectif)} €/an</span>
                    </div>
                  )}
                </div>
              )}

              {amortDifferes > 0 && (
                <div className="flex justify-between">
                  <div>
                    <span className="text-zinc-400">Amortissements différés</span>
                    <p className="text-xs text-zinc-600">reportés sur bénéfices LMNP futurs</p>
                  </div>
                  <span className="font-semibold text-zinc-500">{fmt(amortDifferes)} €</span>
                </div>
              )}

              <div className="h-px bg-[#2a4a4d]" />

              {/* Résultat fiscal */}
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">Résultat fiscal</span>
                <span className={`text-xl font-bold ${resultatFiscal >= 0 ? "text-[#C9A84C]" : "text-emerald-400"}`}>
                  {resultatFiscal < 0 ? "−" : ""}{fmt(Math.abs(resultatFiscal))} €
                </span>
              </div>

              {resultatFiscal < 0 && (
                <div className="bg-emerald-500/10 ring-1 ring-emerald-500/20 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Déficit fiscal (charges)</span>
                    <span className="text-emerald-400">{fmt(Math.abs(resultatFiscal))} €</span>
                  </div>
                  {amortDifferes > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">Amortissements en réserve</span>
                      <span className="text-orange-400">{fmt(amortDifferes)} €</span>
                    </div>
                  )}
                  <p className="text-xs text-zinc-500 italic">
                    ⚠️ Déficits reportables uniquement sur bénéfices LMNP futurs, dans la limite de 10 ans (art. 156 I-2° CGI). Ne s&apos;impute pas sur le revenu global.
                  </p>
                </div>
              )}

              {resultatFiscal >= 0 && (
                <>
                  {deficitN1 > 0 && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Déficit reporté N-1</span>
                      <span className="font-semibold text-emerald-400">−{fmt(deficitN1)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Résultat imposable net</span>
                    <span className="text-xl font-bold text-[#C9A84C]">{fmt(Math.max(0, resultatFiscalNet))} €</span>
                  </div>
                  {Math.max(0, resultatFiscalNet) === 0 && deficitN1 > 0 && (
                    <p className="text-xs text-emerald-400">Déficit N-1 absorbe le bénéfice</p>
                  )}
                  {tmiPct > 0 && imposable > 0 && (
                    <>
                      <div className="h-px bg-[#2a4a4d]" />
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Impôt TMI ({tmiPct}%)</span>
                        <span className="text-[#C9A84C]">{fmt(impotTMI)} €</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Prélèvements sociaux (17,2%)</span>
                        <span className="text-[#C9A84C]">{fmt(prelevement)} €</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span className="text-white">Total impôt estimé</span>
                        <span className="text-[#C9A84C]">{fmt(totalImpot)} €</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <p className="text-xs text-zinc-500 italic">
              Simulation indicative — consultez un expert-comptable
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

      {/* ── Modale expiration session ── */}
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Session sur le point d&apos;expirer</h3>
            <p className="text-sm text-zinc-400">Vous serez déconnecté dans 60 secondes pour inactivité.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 bg-[#C9A84C] text-black font-bold py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors"
              >
                Rester connecté
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/crypto/login" })}
                className="flex-1 border border-[#2a4a4d] text-zinc-400 py-2 rounded-lg text-sm hover:border-zinc-500 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
