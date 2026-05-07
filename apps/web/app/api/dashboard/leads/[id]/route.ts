/**
 * /api/dashboard/leads/[id] — fetch + update + delete a single lead.
 *
 * GET    → returns { lead, notes, intelligence? }
 * PATCH  → updates status / owner_email; auto-writes a status_change note.
 * DELETE → removes the lead. Cascades to lead_intelligence + lead_notes;
 *          projects.lead_id becomes NULL (project survives, audit intact).
 */
import { NextResponse } from "next/server";
import { z } from "zod";

import { leads as leadsLib, log, supabase } from "@propharmex/lib";

import { getDashboardUserEmail } from "../../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

const PatchSchema = z.object({
  status: z.enum(leadsLib.LEAD_STATUSES).optional(),
  owner_email: z.string().email().max(254).nullable().optional(),
});

export async function GET(
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

  const [{ data: lead, error: leadErr }, { data: notes }, { data: intel }] =
    await Promise.all([
      sb.from("leads").select("*").eq("id", id).maybeSingle(),
      sb
        .from("lead_notes")
        .select("*")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
      sb
        .from("lead_intelligence")
        .select("*")
        .eq("lead_id", id)
        .maybeSingle(),
    ]);

  if (leadErr) {
    return NextResponse.json({ error: leadErr.message }, { status: 500 });
  }
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({
    lead,
    notes: notes ?? [],
    intelligence: intel ?? null,
  });
}

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
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const { data: existing, error: readErr } = await sb
    .from("leads")
    .select("status, owner_email")
    .eq("id", id)
    .maybeSingle();
  if (readErr) {
    return NextResponse.json({ error: readErr.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) {
    updates.status = parsed.data.status;
    if (parsed.data.status === "contacted") {
      updates.contacted_at = new Date().toISOString();
    } else if (parsed.data.status === "won" || parsed.data.status === "lost") {
      updates.closed_at = new Date().toISOString();
    }
  }
  if (parsed.data.owner_email !== undefined) {
    updates.owner_email = parsed.data.owner_email;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: true, changed: false });
  }

  const { error: updateErr } = await sb
    .from("leads")
    .update(updates)
    .eq("id", id);
  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  if (
    parsed.data.status !== undefined &&
    parsed.data.status !== existing.status
  ) {
    await sb.from("lead_notes").insert({
      lead_id: id,
      author_email: sessionEmail,
      kind: "status_change",
      body: `${existing.status} → ${parsed.data.status}`,
    });
  }

  log.info("dashboard.lead.patched", {
    leadId: id,
    by: sessionEmail.split("@")[1] ?? "unknown",
    fields: Object.keys(updates),
  });

  return NextResponse.json({ ok: true, changed: true });
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

  const { data: existing, error: readErr } = await sb
    .from("leads")
    .select("id, email, source")
    .eq("id", id)
    .maybeSingle();
  if (readErr) {
    return NextResponse.json({ error: readErr.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const { error: delErr } = await sb.from("leads").delete().eq("id", id);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  log.info("dashboard.lead.deleted", {
    leadId: id,
    source: existing.source,
    by: sessionEmail.split("@")[1] ?? "unknown",
  });

  return NextResponse.json({ ok: true });
}
