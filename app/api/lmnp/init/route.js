import { sqlLmnp } from "@/app/lib/lmnpDb";

export async function GET() {
  await sqlLmnp`
    CREATE TABLE IF NOT EXISTS lmnp_factures (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      annee INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sqlLmnp`
    CREATE TABLE IF NOT EXISTS lmnp_analyses (
      id SERIAL PRIMARY KEY,
      facture_id INTEGER REFERENCES lmnp_factures(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL,
      fournisseur TEXT,
      date_facture TEXT,
      montant_ht NUMERIC(10,2),
      tva NUMERIC(10,2),
      montant_ttc NUMERIC(10,2),
      categorie TEXT,
      traitement TEXT,
      duree_amort INTEGER,
      description TEXT,
      note TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  return Response.json({ ok: true });
}
