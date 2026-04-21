"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.role !== "admin"))
      router.push("/admin/login");
  }, [status, session, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/admin/stats")
        .then(r => r.json())
        .then(d => setStats(d.stats));
    }
  }, [session]);

  if (status === "loading" || !session) return null;

  const articles = stats?.filter(r => !r.slug.startsWith("calc-") && r.slug !== "home" && r.slug !== "blog");
  const calculettes = stats?.filter(r => r.slug.startsWith("calc-"));
  const pages = stats?.filter(r => r.slug === "home" || r.slug === "blog");

  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">
            Tableau de bord <span className="text-[#C9A84C]">Admin</span>
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors"
          >
            Se déconnecter
          </button>
        </div>

        {!stats && <p className="text-zinc-400">Chargement...</p>}

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
          </div>
        )}
      </div>
    </main>
  );
}
