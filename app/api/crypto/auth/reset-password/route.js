import { sqlCrypto } from "@/app/lib/cryptoDb";
import crypto from "crypto";
import { rateLimit } from "@/app/lib/rateLimit";

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { allowed, remaining, resetAt } = rateLimit(ip, 3, 60 * 60 * 1000);

  if (!allowed) {
    const minutes = Math.ceil((resetAt - Date.now()) / 60000);
    return Response.json(
      { error: `Trop de tentatives. Réessayez dans ${minutes} minutes.` },
      { status: 429 }
    );
  }

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
      from: "onboarding@resend.dev",
      to: email,
      subject: "Réinitialisation de votre mot de passe — CalculetteImmo",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #C9A84C;">Réinitialisation de mot de passe</h2>
          <p>Bonjour,</p>
          <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
          <a href="${process.env.NEXTAUTH_URL}/crypto/reset-password?token=${token}"
             style="display: inline-block; background: #C9A84C; color: black; padding: 12px 24px;
                    text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">
            Réinitialiser mon mot de passe
          </a>
          <p style="color: #666; font-size: 12px;">Ce lien expire dans 1 heure.</p>
          <p style="color: #666; font-size: 12px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        </div>
      `,
    });
  }

  return Response.json({ ok: true });
}
