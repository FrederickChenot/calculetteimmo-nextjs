export async function POST(request) {
  return Response.json({ error: "Inscriptions fermées" }, { status: 403 });
}
