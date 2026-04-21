import { neon } from "@neondatabase/serverless";
export const sqlCrypto = neon(process.env.CRYPTO_DATABASE_URL);
