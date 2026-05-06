/**
 * /api/ai/lead-intelligence — Generate (or read cached) AI brief, intent
 * score, draft reply, and rationale for a single lead. Internal-only,
 * gated by the dashboard session cookie.
 *
 * POST { leadId } → { summary, intentScore, intentBand, draftReply, rationale }
 *
 * Behavior:
 *   - If a row exists in lead_intelligence and isn't invalidated, return it.
 *   - Otherwise: fetch the lead, run Claude with the structured-output
 *     schema, persist, return.
 *   - Never streams — output is short and the persistence step needs the
 *     full response.
 *
 * Cost control:
 *   - Auth-gated (only allowlisted dashboard users can call this).
 *   - Per-IP rate-limited 5/min so a runaway click-loop can't burn $$.
 *   - Cached forever per lead unless `invalidated_at` is set.
 *
 * Runtime: Node — uses the Anthropic SDK + Supabase service-role client.
 */
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  env,
  getRateLimiter,
  log,
  sanity,
  supabase,
} from "@propharmex/lib";

import { notifyHotLead } from "../../../../lib/hot-lead-alerts";
import { getDashboardUserEmail } from "../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

const BodySchema = z.object({
  leadId: z.string().uuid(),
});

const intelRateLimiter = getRateLimiter("lead-intel:ip", {
  tokens: 5,
  window: "1 m",
});

const IntelligenceObjectSchema = z.object({
  summary: z.string().min(20).max(600),
  intentScore: z.number().int().min(0).max(100),
  intentBand: z.enum(["hot", "warm", "cold"]),
  draftReply: z.string().min(40).max(4000),
  rationale: z.string().min(10).max(400),
});

export async function POST(req: Request) {
  // 1) Auth: Supabase dashboard session required.
  const sessionEmail = await getDashboardUserEmail();
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Rate limit per IP.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const rl = await intelRateLimiter.limit(ip);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Rate limited. Please wait a moment and retry." },
      { status: 429 },
    );
  }

  // 3) Validate body.
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "leadId required (uuid)" },
      { status: 400 },
    );
  }
  const { leadId } = parsed.data;

  const sb = supabase.getServerSupabase();
  if (!sb) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  // 4) Cache check.
  {
    const { data: cached } = await sb
      .from("lead_intelligence")
      .select("*")
      .eq("lead_id", leadId)
      .maybeSingle();
    if (cached && !cached.invalidated_at) {
      return NextResponse.json({ intelligence: cached, cached: true });
    }
  }

  // 5) Fetch the lead + any matching detail row.
  const { data: lead, error: leadErr } = await sb
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .maybeSingle();
  if (leadErr || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  if (!env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI not configured (missing ANTHROPIC_API_KEY)" },
      { status: 503 },
    );
  }

  // 6) Build the user-facing prompt with all the lead context.
  const config = await sanity.fetchLeadIntelligencePromptConfig();
  const userPrompt = renderLeadContext(lead);

  const anthropic = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY });

  let result;
  try {
    result = await generateObject({
      model: anthropic(config.model),
      system: config.systemPrompt,
      prompt: userPrompt,
      schema: IntelligenceObjectSchema,
      temperature: config.temperature,
      maxTokens: 1200,
    });
  } catch (err) {
    log.error("lead-intel.generate.error", {
      leadId,
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "AI generation failed. Please retry." },
      { status: 502 },
    );
  }

  const out = result.object;

  // 7) Persist (upsert in case of stale-then-regenerate flow).
  const insertRow = {
    lead_id: leadId,
    summary: out.summary,
    intent_score: out.intentScore,
    intent_band: out.intentBand,
    draft_reply: out.draftReply,
    rationale: out.rationale,
    model: config.model,
    generated_at: new Date().toISOString(),
    invalidated_at: null,
  };

  const { error: upsertErr } = await sb
    .from("lead_intelligence")
    .upsert(insertRow, { onConflict: "lead_id" });
  if (upsertErr) {
    log.warn("lead-intel.persist.error", {
      leadId,
      message: upsertErr.message,
    });
    // Still return the generated data even if persistence failed; the user
    // gets value, the cache just won't kick in next time.
  }

  log.info("lead-intel.generated", {
    leadId,
    intentBand: out.intentBand,
    intentScore: out.intentScore,
    by: sessionEmail.split("@")[1] ?? "unknown",
  });

  // Fan out to Slack/email if this brief came back "hot". Fire-and-forget;
  // failures inside notifyHotLead are logged, never thrown.
  if (!upsertErr && out.intentBand === "hot") {
    void notifyHotLead({
      lead: {
        id: leadId,
        email: lead.email,
        contact_name: lead.contact_name,
        company: lead.company,
        source: lead.source,
        service: lead.service,
        dosage_form: lead.dosage_form,
      },
      intelligence: {
        intent_score: out.intentScore,
        summary: out.summary,
        rationale: out.rationale,
      },
    });
  }

  return NextResponse.json({ intelligence: insertRow, cached: false });
}

function renderLeadContext(lead: {
  source: string;
  email: string;
  contact_name: string | null;
  company: string | null;
  role: string | null;
  region: string | null;
  service: string | null;
  dosage_form: string | null;
  stage: string | null;
  message: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
  ip_country: string | null;
}): string {
  const lines: string[] = [
    "Inbound lead context:",
    "",
    `- Source: ${lead.source}`,
    `- Submitted at: ${lead.created_at}`,
    `- Email: ${lead.email}`,
  ];
  if (lead.contact_name) lines.push(`- Name: ${lead.contact_name}`);
  if (lead.role) lines.push(`- Role: ${lead.role}`);
  if (lead.company) lines.push(`- Company: ${lead.company}`);
  if (lead.region) lines.push(`- Region (self-declared): ${lead.region}`);
  if (lead.ip_country) lines.push(`- IP country: ${lead.ip_country}`);
  if (lead.service) lines.push(`- Service interest: ${lead.service}`);
  if (lead.dosage_form) lines.push(`- Dosage form interest: ${lead.dosage_form}`);
  if (lead.stage) lines.push(`- Development stage: ${lead.stage}`);

  if (lead.message) {
    lines.push("", "Message body:", "```", lead.message.slice(0, 4000), "```");
  } else {
    lines.push("", "(No free-text message provided.)");
  }

  if (lead.payload && Object.keys(lead.payload).length > 0) {
    lines.push(
      "",
      "Source-specific structured payload (use to enrich the brief):",
      "```json",
      JSON.stringify(lead.payload, null, 2).slice(0, 4000),
      "```",
    );
  }

  return lines.join("\n");
}
