import { neon } from "@neondatabase/serverless";
export const sqlLmnp = neon(process.env.CRYPTO_DATABASE_URL);
