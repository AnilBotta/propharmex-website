/**
 * /api/dashboard/leads/create — manually create a lead from the dashboard.
 *
 * Used by the "+ Add lead" button on the lead intake table when BD captures
 * a contact from a phone call, email, conference, or any out-of-band path.
 *
 * Differs from the marketing-site /api/contact in two ways:
 *   1. Auth-gated (only allowlisted dashboard users can call this).
 *   2. No Resend email send. The lead just lands in the inbox — no
 *      auto-reply sequence. (BD will reply manually anyway.)
 *
 * The created lead defaults to source='contact' so it surfaces in the
 * existing source pills + filter tabs. A `created_via=manual` flag on the
 * payload jsonb distinguishes it for future analytics queries; the lead
 * audit-trail also gets a `note` row stamped with the operator's email.
 */
import { NextResponse } from "next/server";
import { z } from "zod";

import { log, supabase } from "@propharmex/lib";

import { getDashboardUserEmail } from "../../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

const BodySchema = z.object({
  email: z.string().email().max(254),
  contactName: z.string().trim().min(1).max(200).optional(),
  company: z.string().trim().max(200).optional(),
  role: z.string().trim().max(80).optional(),
  region: z.string().trim().max(40).optional(),
  service: z.string().trim().max(80).optional(),
  dosageForm: z.string().trim().max(80).optional(),
  stage: z.string().trim().max(80).optional(),
  message: z.string().trim().max(8000).optional(),
});

export async function POST(req: Request) {
  const sessionEmail = await getDashboardUserEmail();
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = supabase.getServerSupabase();
  if (!sb) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Email is required; other fields are optional.",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }
  const data = parsed.data;
  const email = data.email.trim().toLowerCase();
  const emailDomain = email.split("@")[1] ?? "unknown";

  const { data: row, error } = await sb
    .from("leads")
    .insert({
      source: "contact",
      email,
      email_domain: emailDomain,
      contact_name: data.contactName ?? null,
      company: data.company ?? null,
      role: data.role ?? null,
      region: data.region ?? null,
      service: data.service ?? null,
      dosage_form: data.dosageForm ?? null,
      stage: data.stage ?? null,
      message: data.message ?? null,
      payload: {
        created_via: "manual",
        created_by: sessionEmail,
      },
    })
    .select("*")
    .single();

  if (error || !row) {
    log.error("dashboard.lead.create.error", {
      message: error?.message ?? "no_row",
      by: sessionEmail.split("@")[1] ?? "unknown",
    });
    return NextResponse.json(
      { error: error?.message ?? "Failed to create lead" },
      { status: 500 },
    );
  }

  // Audit-trail note so it's visible in the drawer that this lead was
  // hand-entered, not from a form. Best-effort — failures here log but
  // do not 5xx the request.
  await sb.from("lead_notes").insert({
    lead_id: row.id,
    author_email: sessionEmail,
    kind: "note",
    body: `Lead manually created by ${sessionEmail}.`,
  });

  log.info("dashboard.lead.create.ok", {
    leadId: row.id,
    emailDomain,
    by: sessionEmail.split("@")[1] ?? "unknown",
  });

  return NextResponse.json({ lead: row }, { status: 201 });
}
