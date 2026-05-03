import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file) return Response.json({ error: "Fichier manquant" }, { status: 400 });

  const uniqueName = `lmnp/${randomUUID()}-${file.name}`;
  const blob = await put(uniqueName, file, { access: "public", allowOverwrite: true });
  return Response.json({ url: blob.url, filename: file.name });
}
