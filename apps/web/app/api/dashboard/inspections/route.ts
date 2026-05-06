/**
 * /api/dashboard/inspections — list + create inspection events (PR-N11).
 *
 * GET  ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 *   → { events: InspectionEventRow[] }
 *   Returns events with event_date in [startDate, endDate]. Both sides
 *   inclusive. If neither is provided, defaults to the current ISO week
 *   (Monday–Sunday).
 *
 * POST → { event: InspectionEventRow }
 *   body: { track, title, eventDate, subtitle?, status?, notes?, relatedProjectId? }
 */
import { NextResponse } from "next/server";
import { z } from "zod";

import { log, supabase } from "@propharmex/lib";

import { getDashboardUserEmail } from "../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

const TRACKS = [
  "health_canada",
  "usfda",
  "tga_who_pq",
  "internal_qa",
  "stability",
] as const;

const STATUSES = ["scheduled", "in_progress", "done", "cancelled"] as const;

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const CreateSchema = z.object({
  track: z.enum(TRACKS),
  title: z.string().trim().min(2).max(160),
  subtitle: z.string().trim().max(160).optional(),
  eventDate: dateOnly,
  status: z.enum(STATUSES).optional(),
  notes: z.string().trim().max(2000).optional(),
  relatedProjectId: z.string().uuid().nullable().optional(),
});

export async function GET(req: Request) {
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

  const url = new URL(req.url);
  const startParam = url.searchParams.get("startDate");
  const endParam = url.searchParams.get("endDate");

  const { startDate, endDate } = resolveRange(startParam, endParam);

  const { data, error } = await sb
    .from("inspection_events")
    .select("*")
    .gte("event_date", startDate)
    .lte("event_date", endDate)
    .order("event_date", { ascending: true })
    .order("track", { ascending: true })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data ?? [], startDate, endDate });
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
        error: "track, title (2–160 chars), and eventDate are required.",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const { data: row, error } = await sb
    .from("inspection_events")
    .insert({
      track: data.track,
      title: data.title,
      subtitle: data.subtitle ?? null,
      event_date: data.eventDate,
      status: data.status ?? "scheduled",
      notes: data.notes ?? null,
      related_project_id: data.relatedProjectId ?? null,
    })
    .select("*")
    .single();

  if (error || !row) {
    log.error("inspections.create.error", {
      message: error?.message ?? "no_row",
      by: sessionEmail.split("@")[1] ?? "unknown",
    });
    return NextResponse.json(
      { error: error?.message ?? "Failed to create event" },
      { status: 500 },
    );
  }

  log.info("inspections.create.ok", {
    eventId: row.id,
    track: data.track,
    by: sessionEmail.split("@")[1] ?? "unknown",
  });
  return NextResponse.json({ event: row }, { status: 201 });
}

/**
 * Default range: current ISO week (Monday → Sunday, UTC). Lets the
 * client omit the params entirely on first load.
 */
function resolveRange(
  start: string | null,
  end: string | null,
): { startDate: string; endDate: string } {
  if (start && /^\d{4}-\d{2}-\d{2}$/.test(start) && end && /^\d{4}-\d{2}-\d{2}$/.test(end)) {
    return { startDate: start, endDate: end };
  }
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sun, 1 = Mon, … 6 = Sat
  const offsetToMonday = (day + 6) % 7; // 0 if Mon, 6 if Sun
  const monday = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - offsetToMonday,
    ),
  );
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return {
    startDate: monday.toISOString().slice(0, 10),
    endDate: sunday.toISOString().slice(0, 10),
  };
}
