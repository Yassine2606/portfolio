import { Resend } from "resend";
import { z } from "zod";
import { getSite } from "@/lib/content";

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
  // Honeypot: the visible form never fills this (hidden input). Bots do.
  company: z.string().max(200).optional().default(""),
});

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// In-memory sliding-window limiter: 5 messages / 10 min / IP. Enough for a
// low-volume portfolio form on a single region, but it does not coordinate
// across serverless instances — reach for Redis/Upstash if spam ever
// justifies it.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Returns retry-after seconds when limited, 0 when allowed. */
function rateLimited(ip: string): number {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return Math.ceil((recent[0] + WINDOW_MS - now) / 1000);
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return 0;
}

export async function POST(request: Request) {
  const retryAfter = rateLimited(clientIp(request));
  if (retryAfter > 0) {
    return Response.json(
      { error: "Too many messages — please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid message." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid message.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  // Honeypot filled: pretend success without sending. Never reveal the trap.
  if (parsed.data.company.trim() !== "") {
    return Response.json({ id: "ok" });
  }

  if (!process.env.RESEND_API_KEY || !resend) {
    return Response.json({ error: "Contact email is not configured yet." }, { status: 503 });
  }

  const { name, email, message } = parsed.data;
  // Names ride in the email subject: strip line breaks so a crafted name
  // cannot inject headers (the schema already caps length at 80).
  const safeName = name.replace(/[\r\n]+/g, " ").trim();
  // Single source of truth for the inbox: env override, else the public
  // contact address from site content — no literal address in code.
  const to = process.env.CONTACT_EMAIL ?? getSite().contact.email;

  // No verified domain yet, so Resend only allows `onboarding@resend.dev` as
  // the sender and only delivers to the account owner's address (your own
  // email). Set `replyTo` to the visitor so a plain Reply lands in their
  // inbox. Once a domain is verified, swap the From and the comment.
  const { data, error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: [to],
    replyTo: [email],
    subject: `New message from ${safeName} — portfolio`,
    html: [
      `<p><strong>${escapeHtml(safeName)}</strong> &lt;${escapeHtml(email)}&gt;</p>`,
      `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    ].join(""),
  });

  if (error) {
    console.error("[contact] Resend rejected the message:", error);
    return Response.json({ error: "Could not send the message." }, { status: 500 });
  }

  return Response.json({ id: data?.id });
}