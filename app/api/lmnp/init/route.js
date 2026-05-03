import { sqlLmnp } from "@/app/lib/lmnpDb";

export async function GET() {
  await sqlLmnp`
    CREATE TABLE IF NOT EXISTS lmnp_factures (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      annee INTEGER NOT NULL,
      url_pdf TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sqlLmnp`
    ALTER TABLE lmnp_factures ADD COLUMN IF NOT EXISTS url_pdf TEXT
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
  await sqlLmnp`
    CREATE TABLE IF NOT EXISTS lmnp_bien (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      valeur_venale NUMERIC(10,2),
      quote_part_terrain NUMERIC(5,2) DEFAULT 15,
      duree_amort INTEGER DEFAULT 30,
      date_debut DATE,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sqlLmnp`
    CREATE TABLE IF NOT EXISTS lmnp_charges_recurrentes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      annee INTEGER NOT NULL,
      taxe_fonciere NUMERIC(10,2) DEFAULT 0,
      assurance_pno NUMERIC(10,2) DEFAULT 0,
      cfe NUMERIC(10,2) DEFAULT 0,
      frais_comptabilite NUMERIC(10,2) DEFAULT 0,
      interets_emprunt NUMERIC(10,2) DEFAULT 0,
      autres NUMERIC(10,2) DEFAULT 0,
      autres_libelle TEXT,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  return Response.json({ ok: true });
}
