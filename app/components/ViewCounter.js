"use client";
import { useEffect, useState } from "react";

export default function ViewCounter({ slug }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const key = `viewed_${slug}`;
    const alreadySeen = sessionStorage.getItem(key);

    if (alreadySeen) {
      // Juste lire le compteur sans incrémenter
      fetch(`/api/views?slug=${slug}`)
        .then(r => r.json())
        .then(d => setCount(d.count));
    } else {
      // Incrémenter et marquer comme vu
      sessionStorage.setItem(key, "1");
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
        .then(r => r.json())
        .then(d => setCount(d.count));
    }
  }, [slug]);

  if (count === null) return null;

  return (
    <span className="text-xs text-zinc-500">
      👁 {count.toLocaleString("fr-FR")} vue{count > 1 ? "s" : ""}
    </span>
  );
}
