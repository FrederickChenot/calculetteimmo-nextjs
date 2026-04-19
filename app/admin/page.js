"use client";
import { useState } from "react";

const LABELS = {
  "home": "🏠 Page d'accueil",
  "blog": "📝 Blog (index)",
  "comment-calculer-mensualite-pret-immobilier": "📄 Article — Mensualité",
  "capacite-emprunt-immobilier": "📄 Article — Capacité emprunt",
  "frais-de-notaire-achat-immobilier": "📄 Article — Frais notaire",
  "lmnp-regime-reel-simplifie": "📄 Article — LMNP",
  "bitcoin-halving-impact-prix": "📄 Article — Bitcoin halving",
  "crypto-fiscalite-france-2026": "📄 Article — Fiscalité crypto",
  "calc-mensualite": "🧮 Calculette — Mensualité",
  "calc-capacite": "🧮 Calculette — Capacité emprunt",
  "calc-notaire": "🧮 Calculette — Frais notaire",
  "calc-interets": "🧮 Calculette — Intérêts composés",
  "calc-rentabilite": "🧮 Calculette — Rentabilité locative",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchStats() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/stats?password=${password}`);
    const data = await res.json();
    if (data.error) {
      setError("Mot de passe incorrect");
    } else {
      setStats(data.stats);
    }
    setLoading(false);
  }

  const articles = stats?.filter(r => !r.slug.startsWith("calc-") && r.slug !== "home" && r.slug !== "blog");
  const calculettes = stats?.filter(r => r.slug.startsWith("calc-"));
  const pages = stats?.filter(r => r.slug === "home" || r.slug === "blog");

  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-8">
          Tableau de bord <span className="text-[#C9A84C]">Admin</span>
        </h1>

        {!stats && (
          <div className="flex gap-3 mb-8">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchStats()}
              className="flex-1 rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none"
            />
            <button
              onClick={fetchStats}
              disabled={loading}
              className="bg-[#C9A84C] text-black font-bold px-6 py-2 rounded-lg hover:bg-[#d4b86a] transition-colors"
            >
              {loading ? "..." : "Accéder"}
            </button>
          </div>
        )}

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {stats && (
          <div className="space-y-8">
            {[
              { title: "Pages", data: pages },
              { title: "Articles blog", data: articles },
              { title: "Calculettes utilisées", data: calculettes },
            ].map(({ title, data }) => (
              <div key={title}>
                <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
                <div className="bg-[#0d1f21] border border-[#C9A84C]/20 rounded-xl overflow-hidden">
                  {data?.length === 0 && (
                    <p className="px-4 py-3 text-zinc-500 text-sm">Aucune donnée</p>
                  )}
                  {data?.map((row, i) => {
                    const max = data[0]?.count || 1;
                    const pct = Math.round((row.count / max) * 100);
                    return (
                      <div key={row.slug} className={`px-4 py-3 ${i < data.length - 1 ? "border-b border-[#2a4a4d]" : ""}`}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-zinc-300">{LABELS[row.slug] || row.slug}</span>
                          <span className="text-sm font-bold text-[#C9A84C]">{row.count.toLocaleString("fr-FR")}</span>
                        </div>
                        <div className="w-full bg-[#12282A] rounded-full h-1.5">
                          <div className="bg-[#C9A84C] h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={() => setStats(null)}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
