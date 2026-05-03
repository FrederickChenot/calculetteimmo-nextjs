import { getDownloadUrl } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) return Response.json({ error: "Paramètre url manquant" }, { status: 400 });

  console.log("[blob-url] generating signed URL for:", url);
  const signedUrl = await getDownloadUrl(url);
  console.log("[blob-url] signed URL generated:", signedUrl);
  return Response.json({ signedUrl });
}
