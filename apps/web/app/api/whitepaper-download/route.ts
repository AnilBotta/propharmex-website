/**
 * Whitepaper download — gated email capture.
 *
 * Pipeline:
 *  1. Zod-validate the payload (slug + 6 form fields).
 *  2. Resolve the slug to the whitepaper record from the content dictionary
 *     so the URL the user receives is server-authoritative, not user-provided.
 *  3. If Resend is configured, send the user a download email with the link.
 *     If not configured (dev / preview without RESEND_API_KEY), return 202
 *     with a `queued: false` flag so the UX still works for QA.
 *  4. Always log the capture to the structured logger so the analytics
 *     pipeline (Plausible / PostHog wrappers, Prompt 24) can pick it up.
 *
 * Out of scope for this MVP (deferred to Prompt 17 / Prompt 23):
 *  - Double-opt-in confirmation token flow
 *  - 3-step nurture sequence
 *  - Sanity content sync (the whitepaper record is in TS today; will move
 *    when the dataset migration ships at Prompt 22)
 *
 * Runtime: Node — Resend SDK needs it.
 */
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { env, log } from "@propharmex/lib";

import { INSIGHTS, WHITEPAPER_SLUGS } from "../../../content/insights";

export const runtime = "nodejs";

const BodySchema = z.object({
  slug: z.enum(WHITEPAPER_SLUGS),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  company: z.string().trim().min(2).max(160),
  role: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  useCase: z.string().trim().max(600).optional().default(""),
  turnstileToken: z.string().max(4096).optional(),
});

/**
 * Mirror of the verifier in /api/contact/route.ts. Short-circuits to
 * `true` (allow) when `TURNSTILE_SECRET_KEY` is unset so dev / preview
 * environments without the secret stay unblocked. The widget on the
 * client also no-ops when the public site key is unset, which keeps
 * the two sides in sync.
 */
async function verifyTurnstile(
  token: string | undefined,
  ip: string | null,
): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;
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
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          "Please complete every required field with a valid value.",
      },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Bot protection — only enforced when the secret is configured.
  if (env.TURNSTILE_SECRET_KEY) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const ok = await verifyTurnstile(data.turnstileToken, ip);
    if (!ok) {
      return NextResponse.json(
        { error: "Bot verification failed. Please retry." },
        { status: 403 },
      );
    }
  }

  const whitepaper = INSIGHTS.whitepapers.find((wp) => wp.slug === data.slug);
  if (!whitepaper) {
    return NextResponse.json(
      { error: "Unknown whitepaper." },
      { status: 404 },
    );
  }

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const downloadUrl = `${siteUrl}${whitepaper.pdfPath}`;

  // Always log the capture — analytics + content team need visibility on
  // demand whether Resend is wired up or not.
  log.info("whitepaper.download_requested", {
    slug: data.slug,
    email: redact(data.email),
    company: data.company,
    role: data.role,
    country: data.country,
  });

  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    log.warn("whitepaper.resend_not_configured", { slug: data.slug });
    // Preserve the UX so QA is unblocked; the success state on the client
    // shows the direct download link regardless.
    return NextResponse.json(
      { ok: true, queued: false, downloadUrl },
      { status: 202 },
    );
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: [data.email],
      subject: `Your Propharmex whitepaper — ${whitepaper.title}`,
      text: composeEmail({
        recipientName: data.fullName,
        title: whitepaper.title,
        downloadUrl,
        siteUrl,
      }),
    });

    log.info("whitepaper.email_sent", {
      slug: data.slug,
      email: redact(data.email),
    });

    return NextResponse.json(
      { ok: true, queued: true, downloadUrl },
      { status: 202 },
    );
  } catch (err) {
    log.error("whitepaper.email_error", {
      slug: data.slug,
      email: redact(data.email),
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "We could not send the email. Please try again." },
      { status: 502 },
    );
  }
}

function composeEmail({
  recipientName,
  title,
  downloadUrl,
  siteUrl,
}: {
  recipientName: string;
  title: string;
  downloadUrl: string;
  siteUrl: string;
}): string {
  return [
    `Hi ${recipientName.split(/\s+/)[0] ?? ""},`,
    "",
    `Thanks for requesting "${title}". Your download link is below:`,
    "",
    downloadUrl,
    "",
    "If you would like to talk through the operating model with our team, you can reply to this email or schedule directly:",
    `${siteUrl}/contact?source=whitepaper-followup`,
    "",
    "— Propharmex Editorial",
  ].join("\n");
}

/** Redact the local part of an email for log output. */
function redact(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "***";
  const visible = user?.slice(0, 2) ?? "";
  return `${visible}***@${domain}`;
}
