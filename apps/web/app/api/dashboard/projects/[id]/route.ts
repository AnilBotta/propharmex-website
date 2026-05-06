/**
 * /api/dashboard/projects/[id] — patch / delete a single project.
 *
 * PATCH  → updates stage, title, company, owner_emails, due_date, flagged, notes
 * DELETE → removes the project row
 */
import { NextResponse } from "next/server";
import { z } from "zod";

import { log, supabase } from "@propharmex/lib";

import { getDashboardUserEmail } from "../../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

const STAGES = [
  "discovery",
  "scoping_nda",
  "execution",
  "qa_review",
  "delivered",
] as const;

const PatchSchema = z.object({
  stage: z.enum(STAGES).optional(),
  title: z.string().trim().min(2).max(160).optional(),
  company: z.string().trim().max(160).nullable().optional(),
  owner_emails: z.array(z.string().email().max(254)).max(10).optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  flagged: z.boolean().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
  const parsed = PatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed.data)) {
    if (value !== undefined) updates[key] = value;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: true, changed: false });
  }

  const { id } = await params;
  const { data, error } = await sb
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  log.info("projects.patch.ok", {
    projectId: id,
    fields: Object.keys(updates),
    by: sessionEmail.split("@")[1] ?? "unknown",
  });
  return NextResponse.json({ project: data });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;
  const { error } = await sb.from("projects").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  log.info("projects.delete.ok", {
    projectId: id,
    by: sessionEmail.split("@")[1] ?? "unknown",
  });
  return NextResponse.json({ ok: true });
}
