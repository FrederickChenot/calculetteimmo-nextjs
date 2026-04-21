"use client";
import { useState, useEffect } from "react";
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
function SimulateurPlusValue({ transactions = [], prices = {} }) {
  const cryptosDisponibles = [...new Set(
    transactions.filter(t => t.type === "achat").map(t => t.crypto)
  )];

  const [crypto, setCrypto] = useState("");
  const [prixCession, setPrixCession] = useState("");
  const [quantiteCedee, setQuantiteCedee] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
      }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
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

      <div className="grid grid-cols-3 gap-3 mb-4">
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
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g, ""));

    const transactions = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim().replace(/"/g, ""));
      if (values.length < 4) continue;

      const tx = {};
      headers.forEach((h, idx) => { tx[h] = values[idx]; });

      transactions.push({
        type: (tx.type || tx.side || "achat").toLowerCase(),
        crypto: (tx.crypto || tx.symbol || tx.asset || "BTC").toUpperCase(),
        quantite: parseFloat(tx.quantite || tx.quantity || tx.amount || 0),
        prix_unitaire: parseFloat(tx.prix_unitaire || tx.price || tx.prix || 0),
        date_transaction: tx.date || tx.date_transaction || tx.time || new Date().toISOString(),
        plateforme: tx.plateforme || tx.platform || tx.exchange || "",
        notes: tx.notes || tx.note || "",
      });
    }

    const res = await fetch("/api/crypto/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactions }),
    });
    const data = await res.json();
    setMessage(`${data.imported} transactions importées !`);
    onImport();
    setLoading(false);
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

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Calcul selon la methode PMP - Article 150 VH bis du CGI", 14, finalY);
    doc.text("Flat tax 30% (12,8% IR + 17,2% prelevements sociaux)", 14, finalY + 5);
    doc.text("Ce document est fourni a titre indicatif et ne constitue pas un conseil fiscal.", 14, finalY + 10);

    doc.save(`crypto-declaration-${data.annee}.pdf`);
    setExporting(false);
  }

  const annees = [...new Set(plusvalues.map(p => p.annee))].sort((a, b) => b - a);

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
            {!annees.includes(new Date().getFullYear()) && (
              <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
            )}
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
        <button onClick={onLogout}
          className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors">
          Se déconnecter
        </button>
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
      <SimulateurPlusValue transactions={transactions} prices={prices} />

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
    </div>
  );
}

// ── Page principale ───────────────────────────────────────
export default function CryptoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.role !== "crypto"))
      router.push("/crypto/login");
  }, [status, session, router]);

  if (status === "loading") return null;
  if (!session) return null;

  return (
    <main className="flex-1 bg-[#12282A] min-h-screen">
      <Dashboard session={session} onLogout={() => signOut({ callbackUrl: "/crypto/login" })}/>
    </main>
  );
}
