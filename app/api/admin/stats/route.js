import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");

  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const rows = await sql`SELECT slug, count FROM page_views ORDER BY count DESC`;
  return Response.json({ stats: rows });
}
