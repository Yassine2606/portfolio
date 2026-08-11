import { Resend } from "resend";
import { z } from "zod";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short.").max(80, "Name is too long."),
  email: z.email("That email doesn't look right.").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Your message is a bit short — tell me a little more.")
    .max(4000, "Your message is too long (4000 characters max)."),
});

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY || !resend) {
    return Response.json({ error: "Contact email is not configured yet." }, { status: 503 });
  }

  const parsed = ContactSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid message.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { name, email, message } = parsed.data;

  // No verified domain yet, so Resend only allows `onboarding@resend.dev` as
  // the sender and only delivers to the account owner's address (your own
  // email). Set `replyTo` to the visitor so a plain Reply lands in their
  // inbox. Once a domain is verified, swap the From and the comment.
  const { data, error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: [process.env.CONTACT_EMAIL ?? "yassine.ben.romdhanee@gmail.com"],
    replyTo: [email],
    subject: `New message from ${name} — portfolio`,
    html: [
      `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>`,
      `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    ].join(""),
  });

  if (error) {
    console.error("[contact] Resend rejected the message:", error);
    return Response.json({ error: "Could not send the message." }, { status: 500 });
  }

  return Response.json({ id: data?.id });
}