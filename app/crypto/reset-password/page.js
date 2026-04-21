"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const inputClass = "rounded-lg border border-[#2a4a4d] bg-[#0d1f21] px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:border-[#C9A84C] focus:outline-none text-sm w-full";

  async function handleRequest() {
    setLoading(true);
    setError(null);
    await fetch("/api/crypto/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setMessage("Si cet email existe, un lien de réinitialisation vous a été envoyé.");
    setLoading(false);
  }

  async function handleReset() {
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas"); return; }
    if (password.length < 8) { setError("Mot de passe trop court"); return; }
    setLoading(true);
    const res = await fetch("/api/crypto/auth/new-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); setLoading(false); return; }
    setMessage("Mot de passe modifié ! Vous pouvez vous connecter.");
    setTimeout(() => router.push("/crypto/login"), 2000);
    setLoading(false);
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 min-h-[70vh] bg-[#12282A]">
      <div className="w-full max-w-sm bg-[#0d1f21] ring-1 ring-[#C9A84C]/20 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          {token ? "Nouveau mot de passe" : "Mot de passe oublié"}
        </h1>
        <p className="text-sm text-zinc-400 mb-6">
          {token ? "Choisissez votre nouveau mot de passe" : "Entrez votre email pour recevoir un lien"}
        </p>

        {message ? (
          <p className="text-emerald-400 text-sm">{message}</p>
        ) : token ? (
          <div className="flex flex-col gap-3">
            <input type="password" placeholder="Nouveau mot de passe" value={password}
              onChange={e => setPassword(e.target.value)} className={inputClass}/>
            <input type="password" placeholder="Confirmer le mot de passe" value={confirm}
              onChange={e => setConfirm(e.target.value)} className={inputClass}/>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button onClick={handleReset} disabled={loading}
              className="bg-[#C9A84C] text-black font-bold py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors">
              {loading ? "..." : "Modifier le mot de passe"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input type="email" placeholder="Votre email" value={email}
              onChange={e => setEmail(e.target.value)} className={inputClass}/>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button onClick={handleRequest} disabled={loading}
              className="bg-[#C9A84C] text-black font-bold py-2 rounded-lg text-sm hover:bg-[#d4b86a] transition-colors">
              {loading ? "..." : "Envoyer le lien"}
            </button>
          </div>
        )}

        <button onClick={() => router.push("/crypto/login")}
          className="mt-4 text-sm text-zinc-400 hover:text-[#C9A84C] transition-colors block">
          ← Retour à la connexion
        </button>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
