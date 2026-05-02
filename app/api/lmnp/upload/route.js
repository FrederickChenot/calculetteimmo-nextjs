import { put } from "@vercel/blob";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!file) return Response.json({ error: "Fichier manquant" }, { status: 400 });

  const blob = await put(file.name, file, { access: "public" });
  return Response.json({ url: blob.url, filename: file.name });
}
