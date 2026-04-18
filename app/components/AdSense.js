"use client";

import { useEffect, useState } from "react";

export default function AdSense({ slot }) {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(localStorage.getItem("cookie-consent") === "accepted");
  }, []);

  useEffect(() => {
    if (!consented) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle not ready
    }
  }, [consented]);

  if (!consented) return null;

  return (
    <div className="w-full my-2 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
