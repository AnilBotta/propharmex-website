/**
 * /api/dashboard/inspections/[id] — patch / delete a single event.
 */
import { NextResponse } from "next/server";
import { z } from "zod";

import { log, supabase } from "@propharmex/lib";

import { getDashboardUserEmail } from "../../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

const TRACKS = [
  "health_canada",
  "usfda",
  "tga_who_pq",
  "internal_qa",
  "stability",
] as const;

const STATUSES = ["scheduled", "in_progress", "done", "cancelled"] as const;

const PatchSchema = z.object({
  track: z.enum(TRACKS).optional(),
  title: z.string().trim().min(2).max(160).optional(),
  subtitle: z.string().trim().max(160).nullable().optional(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(STATUSES).optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
  relatedProjectId: z.string().uuid().nullable().optional(),
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
    if (value === undefined) continue;
    // Map camelCase API fields → snake_case columns.
    if (key === "eventDate") updates.event_date = value;
    else if (key === "relatedProjectId") updates.related_project_id = value;
    else updates[key] = value;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: true, changed: false });
  }

  const { id } = await params;
  const { data, error } = await sb
    .from("inspection_events")
    .update(updates)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  log.info("inspections.patch.ok", {
    eventId: id,
    fields: Object.keys(updates),
    by: sessionEmail.split("@")[1] ?? "unknown",
  });
  return NextResponse.json({ event: data });
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
  const { error } = await sb.from("inspection_events").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  log.info("inspections.delete.ok", {
    eventId: id,
    by: sessionEmail.split("@")[1] ?? "unknown",
  });
  return NextResponse.json({ ok: true });
}
