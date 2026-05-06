/**
 * /api/dashboard/projects — list + create projects (PR-N7).
 *
 * GET  → { projects: ProjectRow[] }
 * POST → { project: ProjectRow }   body: { title, company?, stage?, leadId?, ownerEmails?, dueDate?, flagged?, notes? }
 *
 * Auth-gated like every other /api/dashboard/* route.
 */
import { NextResponse } from "next/server";
import { z } from "zod";

import { log, supabase } from "@propharmex/lib";

import { getDashboardUserEmail } from "../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

const STAGES = [
  "discovery",
  "scoping_nda",
  "execution",
  "qa_review",
  "delivered",
] as const;

const CreateSchema = z.object({
  title: z.string().trim().min(2).max(160),
  company: z.string().trim().max(160).optional(),
  stage: z.enum(STAGES).optional(),
  leadId: z.string().uuid().optional(),
  ownerEmails: z.array(z.string().email().max(254)).max(10).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  flagged: z.boolean().optional(),
  notes: z.string().max(2000).optional(),
});

export async function GET() {
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

  const { data, error } = await sb
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ projects: data ?? [] });
}

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
  const parsed = CreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Title (2–160 chars) is required.",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Generate a display code. UUID prefix is sufficient — collisions across
  // the unique index are vanishingly rare; on the off chance one happens,
  // we retry once with a different slice.
  const candidate = (id: string) => `PX-${id.replace(/-/g, "").slice(0, 4).toUpperCase()}`;

  let attempt = 0;
  while (attempt < 3) {
    attempt += 1;
    const newId = crypto.randomUUID();
    const code = candidate(newId);

    const { data: row, error } = await sb
      .from("projects")
      .insert({
        id: newId,
        code,
        title: data.title,
        company: data.company ?? null,
        stage: data.stage ?? "discovery",
        owner_emails: data.ownerEmails ?? [sessionEmail],
        due_date: data.dueDate ?? null,
        flagged: data.flagged ?? false,
        notes: data.notes ?? null,
        lead_id: data.leadId ?? null,
      })
      .select("*")
      .single();

    if (error) {
      // 23505 = unique_violation on projects_code_unique_idx — retry.
      if (error.code === "23505" && attempt < 3) continue;
      log.error("projects.create.error", {
        message: error.message,
        code: error.code ?? null,
        by: sessionEmail.split("@")[1] ?? "unknown",
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    log.info("projects.create.ok", {
      projectId: newId,
      stage: data.stage ?? "discovery",
      hasLead: Boolean(data.leadId),
      by: sessionEmail.split("@")[1] ?? "unknown",
    });
    return NextResponse.json({ project: row }, { status: 201 });
  }

  return NextResponse.json(
    { error: "Couldn't allocate a unique project code. Please retry." },
    { status: 500 },
  );
}
