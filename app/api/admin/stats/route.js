import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth";

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }
  const rows = await sql`SELECT slug, count FROM page_views ORDER BY count DESC`;
  return Response.json({ stats: rows });
}
