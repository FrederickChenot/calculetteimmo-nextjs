import { sqlCrypto } from "@/app/lib/cryptoDb";
import crypto from "crypto";

export async function POST(request) {
  const { email } = await request.json();
  const user = await sqlCrypto`SELECT id FROM crypto_users WHERE email = ${email}`;
  if (user.length === 0) return Response.json({ ok: true });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600000);

  await sqlCrypto`
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES (${user[0].id}, ${token}, ${expires})
  `;

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "noreply@calculetteimmo.com",
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `<p>Cliquez ici pour réinitialiser votre mot de passe :</p>
             <a href="${process.env.NEXTAUTH_URL}/crypto/reset-password?token=${token}">
               Réinitialiser mon mot de passe
             </a>
             <p>Ce lien expire dans 1 heure.</p>`,
    });
  }

  return Response.json({ ok: true });
}
