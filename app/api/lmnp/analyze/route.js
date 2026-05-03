import { sqlLmnp } from "@/app/lib/lmnpDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { rateLimit } from "@/app/lib/rateLimit";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const rawIp = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const { allowed, resetAt } = rateLimit(`lmnp_analyze_${rawIp}`, 10, 60 * 60 * 1000);
  if (!allowed) {
    const minutes = Math.ceil((resetAt - Date.now()) / 60000);
    return Response.json(
      { error: `Trop de requêtes. Réessayez dans ${minutes} minutes.` },
      { status: 429 }
    );
  }

  const { pdf_base64, filename, annee, save, url_pdf } = await request.json();

  const pdfSizeBytes = Buffer.byteLength(pdf_base64, "base64");
  if (pdfSizeBytes > 10 * 1024 * 1024) {
    return Response.json({ error: "PDF trop volumineux (max 10 Mo)" }, { status: 400 });
  }

  const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "pdfs-2024-09-25",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: `Tu es expert-comptable LMNP réel simplifié. Analyse cette facture et réponds UNIQUEMENT en JSON valide sans markdown ni backticks.
Format exact : { "fournisseur": string, "date_facture": "JJ/MM/AAAA", "montant_ht": number, "tva": number, "montant_ttc": number, "categorie": "travaux|mobilier|equipement|charges|honoraires|divers", "traitement": "amortissable|deductible", "duree_amort": number|null, "description": string, "note": string }
Règles BOFIP : travaux structurels amortissable 25-40 ans, mobilier/équipements 5-10 ans, charges courantes déductible, honoraires déductible.`,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: pdf_base64 },
            },
            { type: "text", text: "Analyse cette facture pour mon LMNP réel simplifié." },
          ],
        },
      ],
    }),
  });

  if (!aiRes.ok) {
    const err = await aiRes.text();
    return Response.json({ error: `Erreur API Claude: ${err}` }, { status: 500 });
  }

  const aiData = await aiRes.json();
  const rawText = aiData.content?.[0]?.text || "";

  let analyse;
  try {
    const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    analyse = JSON.parse(cleaned);
  } catch {
    return Response.json({ error: "Impossible de parser la réponse IA", raw: rawText }, { status: 500 });
  }

  // Année depuis date_facture (JJ/MM/AAAA), fallback sur annee du body
  let anneeEffective = annee;
  if (analyse.date_facture) {
    const parts = analyse.date_facture.split("/");
    if (parts.length === 3) {
      const y = parseInt(parts[2]);
      if (y >= 2000 && y <= 2100) anneeEffective = y;
    }
  }

  let saved = false;
  let facture_id = null;

  if (save && session.userId) {
    const [facture] = await sqlLmnp`
      INSERT INTO lmnp_factures (user_id, filename, annee, url_pdf)
      VALUES (${session.userId}, ${filename}, ${anneeEffective}, ${url_pdf || null})
      RETURNING id
    `;
    facture_id = facture.id;

    await sqlLmnp`
      INSERT INTO lmnp_analyses
        (facture_id, user_id, fournisseur, date_facture, montant_ht, tva, montant_ttc,
         categorie, traitement, duree_amort, description, note)
      VALUES
        (${facture_id}, ${session.userId}, ${analyse.fournisseur}, ${analyse.date_facture},
         ${analyse.montant_ht}, ${analyse.tva}, ${analyse.montant_ttc},
         ${analyse.categorie}, ${analyse.traitement}, ${analyse.duree_amort || null},
         ${analyse.description}, ${analyse.note})
    `;
    saved = true;
  }

  return Response.json({ analyse, saved, facture_id, annee: anneeEffective });
}
