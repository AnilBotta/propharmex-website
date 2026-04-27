/**
 * Contact form handler.
 *
 * Prompt 17 surface: extended schema for the full /contact inquiry form
 * (name, company, role, email, region, service, dosageForm, stage,
 * message). The original Prompt 5 mini-form schema (email + company +
 * dosageForm + message) is preserved as a strict subset — same field
 * names, same validations — so the homepage brief widget continues to
 * post here unchanged.
 *
 * Still deferred (named in plan):
 *  - Upstash rate limit → Prompt 25 hardening
 *  - Supabase lead persistence → Prompt 22
 *  - AI classifier + per-region alias routing → Prompt 18+
 *  - PostHog + Plausible custom events → Prompt 24
 *
 * PII rules (CLAUDE.md §4.9 + privacy notice):
 *  - never log the message body
 *  - never log the raw email (log domain only)
 *  - never log the name, company, or role
 *  - never log the Turnstile token
 */
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { env, log } from "@propharmex/lib";

import {
  DOSAGE_FORMS,
  REGIONS,
  SERVICES,
  STAGES,
} from "../../../content/contact";

export const runtime = "nodejs";

const REGION_IDS = REGIONS.map((r) => r.id) as [string, ...string[]];
const SERVICE_IDS = SERVICES.map((s) => s.id) as [string, ...string[]];
const DOSAGE_FORM_IDS = DOSAGE_FORMS.map((d) => d.id) as [string, ...string[]];
const STAGE_IDS = STAGES.map((s) => s.id) as [string, ...string[]];

const BodySchema = z.object({
  // Mini-form-compatible core (Prompt 5 → preserved as a subset).
  email: z.string().email().max(254),
  company: z.string().min(1).max(200),
  message: z.string().max(2000).optional(),
  turnstileToken: z.string().max(4096).optional(),
  // Prompt 17 additions.
  name: z.string().min(1).max(200).optional(),
  role: z.string().max(80).optional(),
  region: z.enum(REGION_IDS).optional(),
  service: z.enum(SERVICE_IDS).optional(),
  // dosageForm is now optional — only required when service is dev work.
  // Accept the canonical IDs from the contact dictionary, but keep the
  // legacy free-text path open for the existing mini-form (max 80 chars
  // matches the original schema). The union accepts either shape.
  dosageForm: z
    .union([z.enum(DOSAGE_FORM_IDS), z.string().min(1).max(80)])
    .optional(),
  stage: z.enum(STAGE_IDS).optional(),
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
  const {
    email,
    company,
    message,
    turnstileToken,
    name,
    role,
    region,
    service,
    dosageForm,
    stage,
  } = parsed.data;

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

  // Structured log fields — enums and booleans only. Never PII strings.
  const logFields = {
    emailDomain: emailDomain(email),
    region: region ?? "unspecified",
    service: service ?? "unspecified",
    stage: stage ?? "unspecified",
    dosageForm: typeof dosageForm === "string" ? dosageForm : "unspecified",
    hasName: typeof name === "string" && name.length > 0,
    hasRole: typeof role === "string" && role.length > 0,
    hasMessage,
    companyLength: company.length,
  } as const;

  if (!env.RESEND_API_KEY || !env.RESEND_CONTACT_TO_EMAIL || !env.RESEND_FROM_EMAIL) {
    log.info("contact.submitted_unconfigured", logFields);
    return NextResponse.json({ ok: true, queued: false }, { status: 202 });
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: env.RESEND_CONTACT_TO_EMAIL,
      replyTo: email,
      subject: renderSubject({ service, dosageForm }),
      text: renderPlainTextEmail({
        email,
        company,
        message,
        name,
        role,
        region,
        service,
        dosageForm,
        stage,
      }),
    });

    log.info("contact.submitted", logFields);
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

function renderSubject(p: {
  service?: string;
  dosageForm?: string | undefined;
}) {
  const parts: string[] = ["Propharmex inquiry"];
  if (p.service) parts.push(p.service);
  if (typeof p.dosageForm === "string" && p.dosageForm.length > 0) {
    parts.push(p.dosageForm);
  }
  return parts.join(" — ");
}

function renderPlainTextEmail(p: {
  email: string;
  company: string;
  message?: string;
  name?: string;
  role?: string;
  region?: string;
  service?: string;
  dosageForm?: string;
  stage?: string;
}) {
  const lines: string[] = ["New inquiry via /contact:", ""];
  if (p.name) lines.push(`Name: ${p.name}`);
  lines.push(`Email: ${p.email}`);
  lines.push(`Company: ${p.company}`);
  if (p.role) lines.push(`Role: ${p.role}`);
  if (p.region) lines.push(`Region: ${p.region}`);
  if (p.service) lines.push(`Service: ${p.service}`);
  if (p.dosageForm) lines.push(`Dosage form: ${p.dosageForm}`);
  if (p.stage) lines.push(`Stage: ${p.stage}`);
  lines.push("");
  lines.push(p.message ? `Message:\n${p.message}` : "No message provided.");
  return lines.join("\n");
}
