import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return Response.json({ error: "slug requis" }, { status: 400 });

  const rows = await sql`SELECT count FROM page_views WHERE slug = ${slug}`;
  return Response.json({ count: rows[0]?.count ?? 0 });
}

export async function POST(request) {
  const { slug } = await request.json();
  if (!slug) return Response.json({ error: "slug requis" }, { status: 400 });

  const rows = await sql`
    INSERT INTO page_views (slug, count)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE SET count = page_views.count + 1
    RETURNING count
  `;
  return Response.json({ count: rows[0].count });
}
