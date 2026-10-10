import "server-only";
import { Resend } from "resend";

/** Sends via Resend when configured; otherwise logs (dev). */
export async function sendEmail(opts: { to: string; subject: string; text: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[email:dev]", opts.subject, "→", opts.to);
    return;
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Sports <hello@example.com>",
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}
