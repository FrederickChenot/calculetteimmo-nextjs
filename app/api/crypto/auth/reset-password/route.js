import { sqlCrypto } from "@/app/lib/cryptoDb";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { email } = await request.json();
  const user = await sqlCrypto`SELECT id FROM crypto_users WHERE email = ${email}`;
  if (user.length === 0) return Response.json({ ok: true }); // Sécurité : ne pas révéler si l'email existe

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600000); // 1 heure

  await sqlCrypto`
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES (${user[0].id}, ${token}, ${expires})
  `;

  await resend.emails.send({
    from: "noreply@calculetteimmo.com",
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <p>Bonjour,</p>
      <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${process.env.NEXTAUTH_URL}/crypto/reset-password?token=${token}">
        Réinitialiser mon mot de passe
      </a>
      <p>Ce lien expire dans 1 heure.</p>
    `,
  });

  return Response.json({ ok: true });
}
