/**
 * /api/ai/scoping/submit — Send a finalized scope to Propharmex BD.
 *
 * Prompt 19 PR-B. Node runtime (Resend SDK + Supabase server client both
 * prefer Node over Edge for stability). Accepts:
 *
 *   {
 *     scope: ScopeSummary,                     // validated by Zod
 *     contact: { email, company, name?, message? },
 *     transcript?: ChatMessage[],              // already redacted
 *     region?: string,
 *     referrer?: string,
 *   }
 *
 * Flow:
 *   1. Validate body (Zod). 400 on shape failure.
 *   2. Per-IP rate limit (5 req / 5 min — these are real submissions, low
 *      volume). 429 on overflow.
 *   3. Send the BD email via Resend with a structured plain-text body that
 *      mirrors /api/contact's renderPlainTextEmail style. Reply-to set to
 *      the submitter so a BD response goes back direct.
 *   4. Insert one row into scoping_sessions with status='submitted'.
 *      Failure to persist does NOT fail the request — the BD email is the
 *      load-bearing side effect; the row is for analytics. We log
 *      asymmetrically and still return 202.
 *   5. Return { ok, queued } in the same shape as /api/contact.
 *
 * PII rules (CLAUDE.md §4.9):
 *   - Never log raw email; log domain only.
 *   - Never log message body, name, or company.
 *   - Persist email DOMAIN only — never the raw email.
 */
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import {
  env,
  getRateLimiter,
  log,
  scoping,
  supabase,
} from "@propharmex/lib";

export const runtime = "nodejs";

/* -------------------------------------------------------------------------- */
/*  Schema                                                                     */
/* -------------------------------------------------------------------------- */

const ContactSchema = z.object({
  email: z.string().email().max(254),
  company: z.string().min(1).max(200),
  name: z.string().min(1).max(200).optional(),
  message: z.string().max(2000).optional(),
});

const TranscriptMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().max(8000),
});

const BodySchema = z.object({
  scope: scoping.ScopeSummarySchema,
  contact: ContactSchema,
  transcript: z.array(TranscriptMessageSchema).max(40).optional(),
  region: z.string().max(40).optional(),
  referrer: z.string().max(500).optional(),
});

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const RATE_LIMIT_TOKENS = 5;
const RATE_LIMIT_WINDOW = "5 m" as const;

const submitRateLimiter = getRateLimiter("scoping:submit:ip", {
  tokens: RATE_LIMIT_TOKENS,
  window: RATE_LIMIT_WINDOW,
});

/* -------------------------------------------------------------------------- */
/*  Handler                                                                    */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  // 1) Rate limit per IP. Submissions are real and low-volume; 5 / 5 min.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const rl = await submitRateLimiter.limit(ip);
  if (!rl.success) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((rl.reset - Date.now()) / 1000),
    );
    log.warn("scoping.submit.rate_limited", { ip, retryAfterSeconds });
    return NextResponse.json(
      { error: "Too many submissions. Please wait a minute and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  // 2) Parse + validate.
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form fields and try again." },
      { status: 400 },
    );
  }
  const { scope, contact, transcript, region, referrer } = parsed.data;

  const domain = emailDomain(contact.email);

  // 3) BD email via Resend. When env keys are missing we still 202 and
  // record the attempt — useful in dev / preview without secrets.
  let queued = false;
  if (
    env.RESEND_API_KEY &&
    env.RESEND_CONTACT_TO_EMAIL &&
    env.RESEND_FROM_EMAIL
  ) {
    try {
      const resend = new Resend(env.RESEND_API_KEY);
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: env.RESEND_CONTACT_TO_EMAIL,
        replyTo: contact.email,
        subject: renderSubject(scope),
        text: renderPlainText({ scope, contact, region }),
      });
      queued = true;
    } catch (err) {
      log.error("scoping.submit.send_error", {
        emailDomain: domain,
        message: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        { error: "We couldn't send that right now. Please retry." },
        { status: 502 },
      );
    }
  }

  // 4) Persist to scoping_sessions. Best-effort — failure logs but doesn't
  // 5xx the request, since the BD email is the load-bearing side effect.
  const sb = supabase.getServerSupabase();
  if (sb) {
    const { error } = await sb.from("scoping_sessions").insert({
      status: "submitted",
      scope_summary: scope,
      transcript: transcript ?? [],
      submitter_email_domain: domain,
      region: region ?? null,
      referrer: referrer ?? null,
    });
    if (error) {
      log.warn("scoping.submit.persist_error", {
        emailDomain: domain,
        message: error.message,
      });
    }
  }

  log.info("scoping.submit.ok", {
    emailDomain: domain,
    region: region ?? "unspecified",
    queued,
    serviceCount: scope.recommendedServices.length,
    phaseCount: scope.phases.length,
  });

  return NextResponse.json({ ok: true, queued }, { status: 202 });
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function emailDomain(value: string): string {
  const at = value.lastIndexOf("@");
  return at >= 0 ? value.slice(at + 1) : "unknown";
}

function renderSubject(scope: scoping.ScopeSummary): string {
  const stage = scope.developmentStage;
  const dosage = scope.dosageForms[0] ?? "scoping inquiry";
  return `Propharmex scoping — ${dosage} — ${stage}`;
}

function renderPlainText(p: {
  scope: scoping.ScopeSummary;
  contact: z.infer<typeof ContactSchema>;
  region?: string;
}): string {
  const { scope, contact, region } = p;
  const lines: string[] = [
    "New project scope submitted via /ai/project-scoping-assistant:",
    "",
    "── Submitter ─────────────────────────────",
  ];
  if (contact.name) lines.push(`Name: ${contact.name}`);
  lines.push(`Email: ${contact.email}`);
  lines.push(`Company: ${contact.company}`);
  if (region) lines.push(`Region: ${region}`);
  if (contact.message) lines.push("", `Note from submitter:`, contact.message);

  lines.push("", "── Scope ─────────────────────────────────");
  lines.push("Objectives:");
  lines.push(scope.objectives);
  lines.push("");
  lines.push(`Dosage forms: ${scope.dosageForms.join(", ")}`);
  lines.push(`Stage: ${scope.developmentStage}`);
  lines.push(
    `Ballpark timeline: ${scope.ballparkTimelineWeeks.min}–${scope.ballparkTimelineWeeks.max} weeks`,
  );
  lines.push(
    `Recommended services: ${scope.recommendedServices.join(", ")}`,
  );

  lines.push("", "Deliverables:");
  for (const d of scope.deliverables) lines.push(`  • ${d}`);

  if (scope.assumptions.length > 0) {
    lines.push("", "Assumptions:");
    for (const a of scope.assumptions) lines.push(`  • ${a}`);
  }

  if (scope.risks.length > 0) {
    lines.push("", "Risks:");
    for (const r of scope.risks) {
      lines.push(`  • [${r.severity.toUpperCase()}] ${r.description}`);
    }
  }

  lines.push("", "Phases:");
  scope.phases.forEach((ph, i) => {
    lines.push(
      `  ${i + 1}. ${ph.name} (${ph.durationWeeks} ${ph.durationWeeks === 1 ? "wk" : "wks"})`,
    );
    for (const m of ph.milestones) lines.push(`       - ${m}`);
  });

  lines.push("", "── Note ─────────────────────────────────");
  lines.push(
    "AI-assisted draft. Confirm scope, schedule a discovery call, then quote.",
  );

  return lines.join("\n");
}
