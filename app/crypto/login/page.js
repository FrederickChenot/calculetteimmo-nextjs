"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CryptoLogin() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleEmail() {
    setError(null);
    if (mode === "register" && password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 8) {
      setError("Mot de passe trop court (8 caractères minimum)");
      return;
    }
    setLoading(true);

    if (mode === "register") {
      const res = await fetch("/api/crypto/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      setMode("login");
      setError(null);
      setLoading(false);
      return;
    }

    const res = await signIn("crypto-credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Email ou mot de passe incorrect");
    } else {
      router.push("/crypto");
    }
    setLoading(false);
  }

  const inputClass = "rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none text-sm w-full";

  return (
    <main className="flex-1 flex items-center justify-center px-4 min-h-[70vh] bg-[#12282A]">
      <div className="w-full max-w-sm bg-[#0d1f21] ring-1 ring-[#C9A84C]/20 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Tracker <span className="text-[#C9A84C]">Crypto</span>
        </h1>
        <p className="text-sm text-zinc-400 mb-6">
          {mode === "login" ? "Connectez-vous" : "Créer un compte"}
        </p>

        {/* Google */}
        <button onClick={() => signIn("google", { callbackUrl: "/crypto" })}
          className="w-full flex items-center justify-center gap-3 border border-[#2a4a4d] text-zinc-200 py-2 rounded-lg hover:border-zinc-500 transition-colors text-sm mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#2a4a4d]"/>
          <span className="text-xs text-zinc-500">ou</span>
          <div className="flex-1 h-px bg-[#2a4a4d]"/>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-3">
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} className={inputClass}/>
          <input type="password" placeholder="Mot de passe (8 car. min)" value={password}
            onChange={e => setPassword(e.target.value)} className={inputClass}/>
          {mode === "register" && (
            <input type="password" placeholder="Confirmer le mot de passe" value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEmail()}
              className={inputClass}/>
          )}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button onClick={handleEmail} disabled={loading}
            className="bg-[#C9A84C] text-black font-bold py-2 rounded-lg hover:bg-[#d4b86a] transition-colors text-sm">
            {loading ? "..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
            className="text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors">
            {mode === "login" ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
          {mode === "login" && (
            <button onClick={() => router.push("/crypto/reset-password")}
              className="text-xs text-zinc-500 hover:text-[#C9A84C] transition-colors">
              Mot de passe oublié ?
            </button>
          )}
        </div>
        <p className="text-xs text-zinc-600 text-center mt-4 leading-relaxed">
          En créant un compte, vous acceptez nos{" "}
          <a href="/politique-confidentialite" className="text-zinc-500 underline hover:text-[#C9A84C]">CGU</a>
          {" "}et reconnaissez que cet outil est fourni à titre indicatif uniquement.
        </p>
      </div>
    </main>
  );
}
