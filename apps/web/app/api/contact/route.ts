/**
 * Contact mini-form handler.
 *
 * Stub scope for Prompt 5: Zod validation + optional Turnstile verification +
 * optional Resend notification. Prompt 17 hardens this (Upstash rate limit,
 * CRM handoff, structured lead record in Supabase, Sentry breadcrumbs).
 *
 * PII rules (CLAUDE.md §4.9 + privacy notice):
 *  - never log the message body
 *  - never log the raw email (log domain + partial local-part only)
 *  - never log the Turnstile token
 */
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { env, log } from "@propharmex/lib";

export const runtime = "nodejs";

const BodySchema = z.object({
  email: z.string().email().max(254),
  company: z.string().min(1).max(200),
  dosageForm: z.string().min(1).max(80),
  message: z.string().max(2000).optional(),
  turnstileToken: z.string().max(4096).optional(),
});

async function verifyTurnstile(token: string, ip: string | null) {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  const form = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
  });
  if (ip) form.set("remoteip", ip);
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: form },
  );
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return !!data.success;
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form fields and try again." },
      { status: 400 },
    );
  }
  const { email, company, dosageForm, message, turnstileToken } = parsed.data;

  if (env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && turnstileToken) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const ok = await verifyTurnstile(turnstileToken, ip);
    if (!ok) {
      return NextResponse.json(
        { error: "Bot verification failed. Please retry." },
        { status: 403 },
      );
    }
  }

  const hasMessage = typeof message === "string" && message.length > 0;

  if (!env.RESEND_API_KEY || !env.RESEND_CONTACT_TO_EMAIL || !env.RESEND_FROM_EMAIL) {
    log.info("contact.submitted_unconfigured", {
      emailDomain: emailDomain(email),
      dosageForm,
      companyLength: company.length,
      hasMessage,
    });
    return NextResponse.json({ ok: true, queued: false }, { status: 202 });
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: env.RESEND_CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Propharmex inquiry — ${dosageForm}`,
      text: renderPlainTextEmail({ email, company, dosageForm, message }),
    });

    log.info("contact.submitted", {
      emailDomain: emailDomain(email),
      dosageForm,
      hasMessage,
    });
    return NextResponse.json({ ok: true, queued: true }, { status: 202 });
  } catch (err) {
    log.error("contact.send_error", {
      emailDomain: emailDomain(email),
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "We couldn't send that right now. Please retry." },
      { status: 502 },
    );
  }
}

function emailDomain(value: string) {
  const at = value.lastIndexOf("@");
  return at >= 0 ? value.slice(at + 1) : "unknown";
}

function renderPlainTextEmail(p: {
  email: string;
  company: string;
  dosageForm: string;
  message?: string;
}) {
  return [
    "New inquiry via /contact mini-form:",
    "",
    `Email: ${p.email}`,
    `Company: ${p.company}`,
    `Dosage form: ${p.dosageForm}`,
    "",
    p.message ? `Message:\n${p.message}` : "No message provided.",
  ].join("\n");
}
