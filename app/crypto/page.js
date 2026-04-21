"use client";
import { useState, useEffect } from "react";

// ── Helpers ──────────────────────────────────────────────
function getToken() { return localStorage.getItem("crypto_token"); }
function getEmail() { return localStorage.getItem("crypto_email"); }

function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` };
}

// ── Composant Login/Register ──────────────────────────────
function AuthForm({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    const url = mode === "login" ? "/api/crypto/auth/login" : "/api/crypto/auth/register";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
    } else if (mode === "login") {
      localStorage.setItem("crypto_token", data.token);
      localStorage.setItem("crypto_email", data.email);
      onLogin();
    } else {
      setMode("login");
      setError(null);
      alert("Compte créé ! Connectez-vous.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-1">
          Tracker <span className="text-[#C9A84C]">Crypto</span>
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          {mode === "login" ? "Connectez-vous à votre compte" : "Créer un compte gratuit"}
        </p>
        <div className="flex flex-col gap-4">
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            className="rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none text-sm"
          />
          <input type="password" placeholder="Mot de passe (8 car. min)" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            className="rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none text-sm"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button onClick={handleSubmit} disabled={loading}
            className="bg-[#C9A84C] text-black font-bold py-2 rounded-lg hover:bg-[#d4b86a] transition-colors text-sm">
            {loading ? "..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
            className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors">
            {mode === "login" ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}

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
      headers: authHeaders(),
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

// ── Simulateur plus-value ─────────────────────────────────
function SimulateurPlusValue() {
  const [prixCession, setPrixCession] = useState("");
  const [quantiteCedee, setQuantiteCedee] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function calculer() {
    if (!prixCession || !quantiteCedee) return;
    setLoading(true);
    const res = await fetch("/api/crypto/plusvalue", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ prixCessionUnitaire: parseFloat(prixCession), quantiteCedee: parseFloat(quantiteCedee) }),
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
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Prix de cession unitaire (€)</label>
          <input type="number" step="any" placeholder="50000" value={prixCession} onChange={e => setPrixCession(e.target.value)} className={inputClass}/>
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Quantité à céder</label>
          <input type="number" step="any" placeholder="0.1" value={quantiteCedee} onChange={e => setQuantiteCedee(e.target.value)} className={inputClass}/>
        </div>
      </div>
      <button onClick={calculer} disabled={loading}
        className="w-full bg-[#C9A84C] text-black font-bold py-2 rounded-lg hover:bg-[#d4b86a] transition-colors text-sm mb-4">
        {loading ? "Calcul..." : "Calculer la plus-value"}
      </button>

      {result && !result.error && (
        <div className="bg-[#0d1f21] rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Prix de cession total", `${result.prixCessionTotal.toLocaleString("fr-FR")} €`, "text-white"],
              ["Prix de revient (PMP)", `${result.prixRevientCession.toLocaleString("fr-FR")} €`, "text-white"],
              ["Valeur globale portefeuille", `${result.valeurGlobalePortefeuille.toLocaleString("fr-FR")} €`, "text-zinc-400"],
              ["Quantité totale détenue", `${result.quantiteTotale}`, "text-zinc-400"],
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

// ── Dashboard principal ───────────────────────────────────
function Dashboard({ onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTransactions(); }, []);

  async function fetchTransactions() {
    const res = await fetch("/api/crypto/transactions", { headers: authHeaders() });
    const data = await res.json();
    if (Array.isArray(data)) setTransactions(data);
    setLoading(false);
  }

  async function deleteTransaction(id) {
    if (!confirm("Supprimer cette transaction ?")) return;
    await fetch("/api/crypto/transactions", {
      method: "DELETE", headers: authHeaders(),
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
          <p className="text-sm text-zinc-400 mt-1">{getEmail()}</p>
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

      {/* Simulateur */}
      <SimulateurPlusValue />

      {/* Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Mes transactions</h2>
          <button onClick={() => setShowForm(true)}
            className="bg-[#C9A84C] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors">
            + Ajouter
          </button>
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
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if (getToken()) setLogged(true);
  }, []);

  function handleLogout() {
    localStorage.removeItem("crypto_token");
    localStorage.removeItem("crypto_email");
    setLogged(false);
  }

  return (
    <main className="flex-1 bg-[#12282A] min-h-screen">
      {logged ? <Dashboard onLogout={handleLogout}/> : <AuthForm onLogin={() => setLogged(true)}/>}
    </main>
  );
}
