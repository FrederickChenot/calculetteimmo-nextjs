"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Email ou mot de passe incorrect");
    } else {
      router.push("/admin");
    }
    setLoading(false);
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="bg-[#12282A] ring-1 ring-[#C9A84C]/20 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Accès <span className="text-[#C9A84C]">Admin</span>
          </h1>
          <p className="text-sm text-zinc-400 mb-6">Tableau de bord CalculetteImmo</p>

          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              className="rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#C9A84C] text-black font-bold px-6 py-2 rounded-lg hover:bg-[#d4b86a] transition-colors"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
