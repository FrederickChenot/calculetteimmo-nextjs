"use client";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// ── Formulaire transaction ────────────────────────────────
function TransactionForm({ onAdd, onClose }) {
  const [form, setForm] = useState({
    type: "achat", crypto: "", quantite: "", prix_unitaire: "",
    date_transaction: new Date().toISOString().slice(0, 16),
    plateforme: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    if (!form.crypto || !form.quantite || !form.prix_unitaire) {
      setError("Crypto, quantité et prix sont obligatoires");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/crypto/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, crypto: form.crypto.toUpperCase() }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); setLoading(false); return; }
    onAdd(data);
    onClose();
    setLoading(false);
  }

  const inputClass = "rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none text-sm w-full";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-white mb-4">Ajouter une transaction</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs text-zinc-400 mb-1 block">Type</label>
            <div className="flex gap-3">
              {["achat", "vente"].map(t => (
                <button key={t} onClick={() => setForm({ ...form, type: t })}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${form.type === t ? (t === "achat" ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40" : "bg-red-500/20 text-red-400 ring-1 ring-red-500/40") : "bg-[#0d1f21] text-zinc-400"}`}>
                  {t === "achat" ? "Achat" : "Vente"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Crypto (ex: BTC)</label>
            <input placeholder="BTC" value={form.crypto} onChange={e => setForm({ ...form, crypto: e.target.value.toUpperCase() })} className={inputClass}/>
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Quantité</label>
            <input type="number" step="any" placeholder="0.5" value={form.quantite} onChange={e => setForm({ ...form, quantite: e.target.value })} className={inputClass}/>
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Prix unitaire (€)</label>
            <input type="number" step="any" placeholder="45000" value={form.prix_unitaire} onChange={e => setForm({ ...form, prix_unitaire: e.target.value })} className={inputClass}/>
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Date & heure</label>
            <input type="datetime-local" value={form.date_transaction} onChange={e => setForm({ ...form, date_transaction: e.target.value })} className={inputClass}/>
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Plateforme</label>
            <input placeholder="Binance, Coinbase..." value={form.plateforme} onChange={e => setForm({ ...form, plateforme: e.target.value })} className={inputClass}/>
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Notes</label>
            <input placeholder="Optionnel" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={inputClass}/>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        <div className="flex gap-3 mt-5">
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 bg-[#C9A84C] text-black font-bold py-2 rounded-lg hover:bg-[#d4b86a] transition-colors text-sm">
            {loading ? "..." : "Ajouter"}
          </button>
          <button onClick={onClose}
            className="px-4 py-2 border border-[#2a4a4d] text-zinc-400 rounded-lg text-sm hover:border-zinc-500 transition-colors">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Portefeuille ─────────────────────────────────────────
function Portefeuille({ transactions, prices }) {
  const portfolio = {};

  for (const tx of transactions) {
    const c = tx.crypto;
    if (!portfolio[c]) portfolio[c] = { quantite: 0, prixRevient: 0 };

    if (tx.type === "achat") {
      portfolio[c].prixRevient += Number(tx.quantite) * Number(tx.prix_unitaire);
      portfolio[c].quantite += Number(tx.quantite);
    } else if (tx.type === "vente") {
      const fraction = Number(tx.quantite) / portfolio[c].quantite;
      portfolio[c].prixRevient *= (1 - fraction);
      portfolio[c].quantite -= Number(tx.quantite);
    }
  }

  const lignes = Object.entries(portfolio).filter(([, v]) => v.quantite > 0.000001);
  if (lignes.length === 0) return null;

  const totalInvesti = lignes.reduce((s, [, v]) => s + v.prixRevient, 0);
  const totalActuel = lignes.reduce((s, [c, v]) => s + v.quantite * (prices[c] || 0), 0);
  const plusValueLatente = totalActuel - totalInvesti;

  return (
    <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-1">Mon portefeuille</h3>
      <p className="text-xs text-zinc-400 mb-4">Valorisation en temps réel — CoinGecko</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a4a4d]">
              {["Crypto", "Quantité", "Prix moyen", "Prix actuel", "Valeur", "P/V latente", "Perf."].map(h => (
                <th key={h} className="text-left px-3 py-2 text-xs text-zinc-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lignes.map(([c, v]) => {
              const prixMoyen = v.quantite > 0 ? v.prixRevient / v.quantite : 0;
              const prixActuel = prices[c] || 0;
              const valeur = v.quantite * prixActuel;
              const pvLatente = valeur - v.prixRevient;
              const perf = v.prixRevient > 0 ? ((valeur - v.prixRevient) / v.prixRevient) * 100 : 0;

              return (
                <tr key={c} className="border-b border-[#2a4a4d] last:border-0 hover:bg-[#0d1f21] transition-colors">
                  <td className="px-3 py-3 font-bold text-[#C9A84C]">{c}</td>
                  <td className="px-3 py-3 text-zinc-300">
                    {v.quantite.toLocaleString("fr-FR", { maximumFractionDigits: 8 })}
                  </td>
                  <td className="px-3 py-3 text-zinc-300">
                    {prixMoyen.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €
                  </td>
                  <td className="px-3 py-3 text-zinc-300">
                    {prixActuel > 0 ? `${prixActuel.toLocaleString("fr-FR")} €` : "—"}
                  </td>
                  <td className="px-3 py-3 text-white font-medium">
                    {prixActuel > 0 ? `${valeur.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €` : "—"}
                  </td>
                  <td className={`px-3 py-3 font-medium ${pvLatente >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {prixActuel > 0 ? `${pvLatente >= 0 ? "+" : ""}${pvLatente.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €` : "—"}
                  </td>
                  <td className={`px-3 py-3 font-medium ${perf >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {prixActuel > 0 ? `${perf >= 0 ? "+" : ""}${perf.toFixed(2)} %` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-[#2a4a4d] grid grid-cols-3 gap-4">
        <div className="bg-[#0d1f21] rounded-lg p-3">
          <p className="text-xs text-zinc-400 mb-1">Total investi</p>
          <p className="text-base font-bold text-white">
            {totalInvesti.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €
          </p>
        </div>
        <div className="bg-[#0d1f21] rounded-lg p-3">
          <p className="text-xs text-zinc-400 mb-1">Valeur actuelle</p>
          <p className="text-base font-bold text-white">
            {totalActuel.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €
          </p>
        </div>
        <div className="bg-[#0d1f21] rounded-lg p-3">
          <p className="text-xs text-zinc-400 mb-1">Plus-value latente</p>
          <p className={`text-base font-bold ${plusValueLatente >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {plusValueLatente >= 0 ? "+" : ""}{plusValueLatente.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Simulateur plus-value ─────────────────────────────────
function SimulateurPlusValue({ transactions = [], prices = {}, onVente }) {
  const cryptosDisponibles = [...new Set(
    transactions.filter(t => t.type === "achat").map(t => t.crypto)
  )];

  const [crypto, setCrypto] = useState("");
  const [prixCession, setPrixCession] = useState("");
  const [quantiteCedee, setQuantiteCedee] = useState("");
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingVente, setLoadingVente] = useState(false);

  useEffect(() => {
    if (crypto && prices[crypto]) {
      setPrixCession(prices[crypto].toString());
    }
  }, [crypto, prices]);

  async function calculer() {
    if (!prixCession || !quantiteCedee) return;
    setLoading(true);
    const res = await fetch("/api/crypto/plusvalue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prixCessionUnitaire: parseFloat(prixCession),
        quantiteCedee: parseFloat(quantiteCedee),
        crypto,
        annee,
      }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  async function enregistrerVente() {
    setLoadingVente(true);
    const res = await fetch("/api/crypto/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "vente",
        crypto: crypto,
        quantite: parseFloat(quantiteCedee),
        prix_unitaire: parseFloat(prixCession),
        date_transaction: new Date().toISOString(),
        plateforme: "",
        notes: `Vente simulée — Plus-value: ${result.plusValue} €`,
      }),
    });
    const data = await res.json();
    if (data.id) {
      alert(`Vente enregistrée ! Plus-value: ${result.plusValue.toLocaleString("fr-FR")} € — Impôt estimé: ${result.impot.toLocaleString("fr-FR")} €`);
      onVente();
    }
    setLoadingVente(false);
  }

  const inputClass = "rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none text-sm w-full";

  return (
    <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-1">Simulateur de plus-value</h3>
      <p className="text-xs text-zinc-400 mb-4">Méthode PMP — Article 150 VH bis CGI (Formulaire 2086)</p>

      {Object.keys(prices).length > 0 && (
        <div className="flex gap-3 flex-wrap mb-4">
          {Object.entries(prices).map(([c, p]) => p && (
            <div key={c} className="bg-[#0d1f21] rounded-lg px-3 py-2 text-xs">
              <span className="text-[#C9A84C] font-bold">{c}</span>
              <span className="text-zinc-300 ml-2">{p.toLocaleString("fr-FR")} €</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Année fiscale</label>
          <select value={annee} onChange={e => setAnnee(Number(e.target.value))}
            className={inputClass + " cursor-pointer"}>
            {[2025, 2026, 2027].map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Crypto à céder</label>
          <select value={crypto} onChange={e => {
            setCrypto(e.target.value);
            if (prices[e.target.value]) setPrixCession(prices[e.target.value].toString());
          }} className={inputClass + " cursor-pointer"}>
            <option value="">Sélectionner</option>
            {cryptosDisponibles.map(c => (
              <option key={c} value={c}>{c}{prices[c] ? ` — ${prices[c].toLocaleString("fr-FR")} €` : ""}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Prix de cession (€)</label>
          <input type="number" step="any" placeholder="50000" value={prixCession}
            onChange={e => setPrixCession(e.target.value)} className={inputClass}/>
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Quantité à céder</label>
          <input type="number" step="any" placeholder="0.1" value={quantiteCedee}
            onChange={e => setQuantiteCedee(e.target.value)} className={inputClass}/>
        </div>
      </div>

      <button onClick={calculer} disabled={loading}
        className="w-full bg-[#C9A84C] text-black font-bold py-2 rounded-lg hover:bg-[#d4b86a] transition-colors text-sm mb-4">
        {loading ? "Calcul en cours..." : "Calculer la plus-value"}
      </button>
      <p className="text-xs text-zinc-600 text-center mt-2">
        Simulation indicative — méthode PMP Article 150 VH bis CGI — non substitutif à un conseil fiscal
      </p>

      {result && !result.error && (
        <div className="bg-[#0d1f21] rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Prix de cession total", `${result.prixCessionTotal.toLocaleString("fr-FR")} €`, "text-white"],
              ["Prix de revient (PMP)", `${result.prixRevientCession.toLocaleString("fr-FR")} €`, "text-white"],
              ["Valeur globale portefeuille", `${result.valeurGlobalePortefeuille.toLocaleString("fr-FR")} €`, "text-zinc-400"],
              ["Prix de revient global", `${result.prixRevientGlobal.toLocaleString("fr-FR")} €`, "text-zinc-400"],
            ].map(([label, val, cls]) => (
              <div key={label} className="bg-[#12282A] rounded-lg p-3">
                <p className="text-xs text-zinc-500 mb-1">{label}</p>
                <p className={`font-semibold ${cls}`}>{val}</p>
              </div>
            ))}
          </div>
          <div className="h-px bg-[#2a4a4d]"/>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-zinc-400">Plus-value nette</p>
              <p className={`text-2xl font-bold ${result.plusValue >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {result.plusValue >= 0 ? "+" : ""}{result.plusValue.toLocaleString("fr-FR")} €
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-400">Impôt estimé (flat tax 30%)</p>
              <p className="text-2xl font-bold text-[#C9A84C]">
                {result.impot.toLocaleString("fr-FR")} €
              </p>
            </div>
          </div>
          {result.plusValue > 0 && (
            <p className="text-xs text-zinc-500 text-center">
              À déclarer sur le formulaire 2086 — revenus de cessions d&apos;actifs numériques
            </p>
          )}
          <button onClick={enregistrerVente} disabled={loadingVente}
            className="w-full border border-emerald-500/40 text-emerald-400 font-bold py-2 rounded-lg text-sm hover:bg-emerald-500/10 transition-colors mt-2">
            {loadingVente ? "Enregistrement..." : "✓ Enregistrer cette vente dans mes transactions"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Import CSV ───────────────────────────────────────────
function ImportCSV({ onImport }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setMessage(null);

    const text = await file.text();
    const lines = text.split("\n").filter(l => l.trim());

    function normalize(str) {
      return str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
    }

    const rawHeaders = lines[0].split(",").map(h => h.replace(/"/g, "").trim());
    const headers = rawHeaders.map(normalize);

    function getCol(row, name) {
      const idx = headers.indexOf(normalize(name));
      return idx >= 0 ? row[idx]?.replace(/"/g, "").trim() : "";
    }

    const transactions = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",").map(v => v.replace(/"/g, "").trim());
      if (row.length < 4) continue;

      const type = getCol(row, "Type");
      const monnaieRecue = getCol(row, "Monnaie ou jeton recu");

      if (!type.toLowerCase().includes("change")) continue;
      if (monnaieRecue !== "BTC") continue;

      const quantite = parseFloat(getCol(row, "Montant recu") || 0);
      const montantEur = parseFloat(getCol(row, "Montant envoye") || 0);
      const prixJeton = parseFloat(getCol(row, "Prix du jeton du montant recu") || 0);
      const date = getCol(row, "Date") || new Date().toISOString();
      const externalId = getCol(row, "ID Externe") || null;

      if (quantite <= 0 || montantEur <= 0) continue;

      const frais = parseFloat(getCol(row, "Frais") || 0);
      const coutTotal = montantEur + frais;
      const prixReel = coutTotal / quantite;

      transactions.push({
        type: "achat",
        crypto: "BTC",
        quantite,
        prix_unitaire: Math.round(prixReel * 100) / 100,
        date_transaction: date,
        plateforme: "Bitstack",
        notes: getCol(row, "Description") || "",
        external_id: externalId,
      });
    }

    console.log("Transactions trouvées:", transactions.length);

    if (transactions.length === 0) {
      setMessage("Aucune transaction trouvée. Vérifiez le format du fichier.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/crypto/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactions }),
    });
    const data = await res.json();
    setMessage(`✅ ${data.imported} transactions importées !`);
    onImport();
    setLoading(false);
    e.target.value = "";
  }

  return (
    <div>
      <label className="cursor-pointer inline-flex items-center gap-2 border border-[#2a4a4d] text-zinc-300 font-semibold px-4 py-2 rounded-lg text-sm hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
        {loading ? "Import..." : "📥 Importer CSV"}
        <input type="file" accept=".csv" onChange={handleFile} className="hidden" disabled={loading}/>
      </label>
      {message && <p className="text-emerald-400 text-xs mt-2">{message}</p>}
    </div>
  );
}

// ── Historique plus-values ───────────────────────────────
function HistoriquePlusValues() {
  const [plusvalues, setPlusvalues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anneeExport, setAnneeExport] = useState(new Date().getFullYear());
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch("/api/crypto/plusvalues")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPlusvalues(data); setLoading(false); });
  }, []);

  async function exportPDF() {
    setExporting(true);
    const res = await fetch("/api/crypto/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ annee: anneeExport }),
    });
    const data = await res.json();

    function formatEur(n) {
      return Number(n).toFixed(2).replace(".", ",") + " €";
    }
    function formatQte(n) {
      return Number(n).toFixed(8).replace(/\.?0+$/, "");
    }

    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(201, 168, 76);
    doc.text("Declaration Crypto - Formulaire 2086", 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Annee fiscale : ${data.annee}`, 14, 32);
    doc.text(`Contribuable : ${data.email}`, 14, 40);
    doc.text(`Genere le : ${new Date().toLocaleDateString("fr-FR")}`, 14, 48);

    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Document indicatif - A verifier avec un expert-comptable ou conseiller fiscal", 14, 56);

    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("Recapitulatif annuel", 14, 68);

    autoTable(doc, {
      startY: 72,
      head: [["", "Montant"]],
      body: [
        ["Total des cessions", formatEur(data.totaux.totalCessions)],
        ["Plus-value nette totale", formatEur(data.totaux.totalPlusValue)],
        ["Impot estime (flat tax 30%)", formatEur(data.totaux.totalImpot)],
      ],
      theme: "grid",
      headStyles: { fillColor: [201, 168, 76], textColor: [0, 0, 0] },
    });

    doc.setFontSize(13);
    doc.text("Detail des cessions", 14, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 19,
      head: [["Crypto", "Qte cedee", "Prix cession", "Prix revient", "Plus-value", "Impot estime"]],
      body: data.plusvalues.map(p => [
        p.crypto,
        formatQte(p.quantite_cedee),
        formatEur(p.prix_cession_total),
        formatEur(p.prix_revient_cession),
        `${Number(p.plus_value) >= 0 ? "+" : ""}${formatEur(p.plus_value)}`,
        formatEur(p.impot_estime),
      ]),
      theme: "striped",
      headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
    });

    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("Cases formulaire 2086", 14, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 19,
      head: [["Case 2086", "Libellé", "Montant"]],
      body: [
        ["Case 3AN", "Total des prix de cession", `${data.totaux.totalCessions.toFixed(2)} €`],
        ["Case 3BN", "Total des prix de revient", `${(data.totaux.totalCessions - data.totaux.totalPlusValue).toFixed(2)} €`],
        ["Case 3BN résultat", "Plus-value nette imposable", `${data.totaux.totalPlusValue > 0 ? data.totaux.totalPlusValue.toFixed(2) : "0.00"} €`],
        ["Case 3CA", "Impôt flat tax 12,8%", `${(data.totaux.totalPlusValue > 0 ? data.totaux.totalPlusValue * 0.128 : 0).toFixed(2)} €`],
        ["Prélèvements sociaux 17,2%", "", `${(data.totaux.totalPlusValue > 0 ? data.totaux.totalPlusValue * 0.172 : 0).toFixed(2)} €`],
      ],
      theme: "grid",
      headStyles: { fillColor: [201, 168, 76], textColor: [0, 0, 0] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setDrawColor(255, 165, 0);
    doc.setLineWidth(0.5);
    doc.rect(14, finalY, 182, 32);
    doc.setFontSize(8);
    doc.setTextColor(180, 120, 0);
    doc.text("AVERTISSEMENT LEGAL IMPORTANT", 16, finalY + 6);
    doc.setTextColor(100, 100, 100);
    doc.text("Ce document est fourni a titre INDICATIF UNIQUEMENT et ne constitue pas une declaration", 16, finalY + 11);
    doc.text("fiscale officielle. Les calculs peuvent comporter des erreurs ou omissions.", 16, finalY + 16);
    doc.text("L'utilisateur est SEUL RESPONSABLE de sa declaration fiscale aupres de l'administration.", 16, finalY + 21);
    doc.text("Consultez un expert-comptable agree avant toute declaration. CalculetteImmo decline", 16, finalY + 26);
    doc.text("toute responsabilite quant a l'utilisation de ce document.", 16, finalY + 31);

    doc.save(`crypto-declaration-${data.annee}.pdf`);
    setExporting(false);
  }

  const anneeActuelle = new Date().getFullYear();
  const annees = [...new Set([
    ...plusvalues.map(p => p.annee),
    anneeActuelle,
    anneeActuelle - 1,
  ])].sort((a, b) => b - a);

  if (loading || plusvalues.length === 0) return null;

  return (
    <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Plus-values réalisées</h3>
          <p className="text-xs text-zinc-400">Historique des cessions imposables</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={anneeExport} onChange={e => setAnneeExport(Number(e.target.value))}
            className="rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-3 py-1.5 text-zinc-100 text-sm focus:outline-none focus:border-[#C9A84C]">
            {annees.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button onClick={exportPDF} disabled={exporting}
            className="bg-[#C9A84C] text-black font-bold px-4 py-1.5 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors">
            {exporting ? "..." : "📄 Export PDF"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a4a4d]">
              {["Année", "Crypto", "Qté cédée", "Prix cession", "Prix revient", "Plus-value", "Impôt estimé"].map(h => (
                <th key={h} className="text-left px-3 py-2 text-xs text-zinc-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plusvalues.map(p => (
              <tr key={p.id} className="border-b border-[#2a4a4d] last:border-0 hover:bg-[#0d1f21] transition-colors">
                <td className="px-3 py-3 text-zinc-400">{p.annee}</td>
                <td className="px-3 py-3 font-bold text-[#C9A84C]">{p.crypto}</td>
                <td className="px-3 py-3 text-zinc-300">{Number(p.quantite_cedee).toLocaleString("fr-FR", { maximumFractionDigits: 8 })}</td>
                <td className="px-3 py-3 text-zinc-300">{Number(p.prix_cession_total).toLocaleString("fr-FR")} €</td>
                <td className="px-3 py-3 text-zinc-300">{Number(p.prix_revient_cession).toLocaleString("fr-FR")} €</td>
                <td className={`px-3 py-3 font-medium ${Number(p.plus_value) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {Number(p.plus_value) >= 0 ? "+" : ""}{Number(p.plus_value).toLocaleString("fr-FR")} €
                </td>
                <td className="px-3 py-3 text-[#C9A84C] font-medium">
                  {Number(p.impot_estime).toLocaleString("fr-FR")} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Dashboard principal ───────────────────────────────────
function Dashboard({ session, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePwdMsg, setChangePwdMsg] = useState(null);
  const [changePwdError, setChangePwdError] = useState(null);

  useEffect(() => { fetchTransactions(); }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      fetch("/api/crypto/prices")
        .then(r => r.json())
        .then(setPrices);
    }
  }, [transactions]);

  async function fetchTransactions() {
    const res = await fetch("/api/crypto/transactions");
    const data = await res.json();
    if (Array.isArray(data)) setTransactions(data);
    setLoading(false);
  }

  async function handleChangePassword() {
    setChangePwdError(null);
    if (newPassword !== confirmPassword) {
      setChangePwdError("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 8) {
      setChangePwdError("Mot de passe trop court (8 caractères minimum)");
      return;
    }
    const res = await fetch("/api/crypto/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    if (data.error) {
      setChangePwdError(data.error);
    } else {
      setChangePwdMsg("Mot de passe modifié avec succès !");
      setTimeout(() => {
        setShowChangePassword(false);
        setChangePwdMsg(null);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
    }
  }

  async function deleteTransaction(id) {
    if (!confirm("Supprimer cette transaction ?")) return;
    await fetch("/api/crypto/transactions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  const achats = transactions.filter(t => t.type === "achat");
  const ventes = transactions.filter(t => t.type === "vente");
  const totalInvesti = achats.reduce((s, t) => s + Number(t.quantite) * Number(t.prix_unitaire), 0);
  const totalVendu = ventes.reduce((s, t) => s + Number(t.quantite) * Number(t.prix_unitaire), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Tracker <span className="text-[#C9A84C]">Crypto</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">{session.user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowChangePassword(true)}
            className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors">
            Changer mot de passe
          </button>
          <button onClick={onLogout}
            className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors">
            Se déconnecter
          </button>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
        <p className="text-xs text-yellow-400 leading-relaxed">
          ⚠️ <strong>Outil indicatif uniquement</strong> — Les calculs sont basés sur la méthode PMP (Article 150 VH bis du CGI) mais ne constituent pas une déclaration fiscale officielle.
          Consultez un expert-comptable avant toute déclaration. CalculetteImmo décline toute responsabilité en cas d'erreur.{" "}
          <a href="/crypto/mentions" className="underline hover:text-yellow-300 transition-colors">En savoir plus →</a>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["Transactions", transactions.length, "text-white"],
          ["Total investi", `${totalInvesti.toLocaleString("fr-FR")} €`, "text-emerald-400"],
          ["Total vendu", `${totalVendu.toLocaleString("fr-FR")} €`, "text-red-400"],
          ["Cryptos", [...new Set(transactions.map(t => t.crypto))].length, "text-[#C9A84C]"],
        ].map(([label, val, cls]) => (
          <div key={label} className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-xl p-4">
            <p className="text-xs text-zinc-400 mb-1">{label}</p>
            <p className={`text-xl font-bold ${cls}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Portefeuille */}
      <Portefeuille transactions={transactions} prices={prices} />

      {/* Simulateur */}
      <SimulateurPlusValue transactions={transactions} prices={prices} onVente={fetchTransactions} />

      {/* Historique plus-values */}
      <HistoriquePlusValues />

      {/* Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Mes transactions</h2>
          <div className="flex items-center gap-3">
            <ImportCSV onImport={fetchTransactions} />
            <button onClick={() => setShowForm(true)}
              className="bg-[#C9A84C] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors">
              + Ajouter
            </button>
          </div>
        </div>

        <div className="mt-4 bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">Pas encore sur Bitstack ?</p>
            <p className="text-xs text-zinc-400 mt-1">
              Le moyen le plus simple d'épargner en Bitcoin. Recevez <span className="text-[#C9A84C] font-bold">5 € en Bitcoin</span> offerts — après un premier achat de 100 € minimum.
            </p>
          </div>
          <a href="https://bitstack-app.com/referral/CVXsenOtiMlY" target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 bg-[#C9A84C] text-black font-bold px-4 py-2 rounded-lg text-xs hover:bg-[#d4b86a] transition-colors whitespace-nowrap">
            Rejoindre Bitstack →
          </a>
        </div>

        {loading && <p className="text-zinc-400 text-sm">Chargement...</p>}

        {!loading && transactions.length === 0 && (
          <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-10 text-center">
            <p className="text-zinc-400 text-sm">Aucune transaction — commencez par en ajouter une !</p>
          </div>
        )}

        {transactions.length > 0 && (
          <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a4a4d]">
                    {["Type", "Crypto", "Quantité", "Prix unitaire", "Total", "Date", "Plateforme", ""].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-zinc-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} className="border-b border-[#2a4a4d] last:border-0 hover:bg-[#0d1f21] transition-colors">
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${t.type === "achat" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#C9A84C]">{t.crypto}</td>
                      <td className="px-4 py-3 text-zinc-300">{Number(t.quantite).toLocaleString("fr-FR", { maximumFractionDigits: 8 })}</td>
                      <td className="px-4 py-3 text-zinc-300">{Number(t.prix_unitaire).toLocaleString("fr-FR")} €</td>
                      <td className="px-4 py-3 text-zinc-300">{(Number(t.quantite) * Number(t.prix_unitaire)).toLocaleString("fr-FR")} €</td>
                      <td className="px-4 py-3 text-zinc-400">{new Date(t.date_transaction).toLocaleDateString("fr-FR")}</td>
                      <td className="px-4 py-3 text-zinc-400">{t.plateforme || "—"}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteTransaction(t.id)}
                          className="text-zinc-600 hover:text-red-400 transition-colors text-xs">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showForm && <TransactionForm onAdd={t => setTransactions(prev => [...prev, t])} onClose={() => setShowForm(false)}/>}

      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowChangePassword(false)}>
          <div className="w-full max-w-sm bg-[#0d1f21] ring-1 ring-[#C9A84C]/20 rounded-2xl p-8"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Changer mon mot de passe</h3>
            <div className="flex flex-col gap-3">
              <input type="password" placeholder="Mot de passe actuel" value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                className="rounded-lg border border-[#2a4a4d] bg-[#12282A] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none text-sm"/>
              <input type="password" placeholder="Nouveau mot de passe" value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="rounded-lg border border-[#2a4a4d] bg-[#12282A] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none text-sm"/>
              <input type="password" placeholder="Confirmer le nouveau mot de passe" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="rounded-lg border border-[#2a4a4d] bg-[#12282A] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none text-sm"/>
              {changePwdError && <p className="text-red-400 text-sm">{changePwdError}</p>}
              {changePwdMsg && <p className="text-emerald-400 text-sm">{changePwdMsg}</p>}
              <button onClick={handleChangePassword}
                className="bg-[#C9A84C] text-black font-bold py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors">
                Modifier
              </button>
              <button onClick={() => setShowChangePassword(false)}
                className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-[#2a4a4d] text-center">
        <a href="/crypto/mentions" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
          ⚠️ Mentions légales — Cet outil est fourni à titre indicatif uniquement. Non substitutif à un conseil fiscal professionnel.
        </a>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────
export default function CryptoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const timerRef = useRef(null);
  const warningRef = useRef(null);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.role !== "crypto"))
      router.push("/crypto/login");
  }, [status, session, router]);

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

  if (status === "loading") return null;
  if (!session) return null;

  return (
    <>
      <main className="flex-1 bg-[#12282A] min-h-screen">
        <Dashboard session={session} onLogout={() => signOut({ callbackUrl: "/crypto/login" })}/>
      </main>

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
    </>
  );
}
