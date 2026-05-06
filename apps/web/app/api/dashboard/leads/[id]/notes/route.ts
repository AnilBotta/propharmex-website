/**
 * /api/dashboard/leads/[id]/notes — POST a free-text note onto a lead.
 */
import { NextResponse } from "next/server";
import { z } from "zod";

import { log, supabase } from "@propharmex/lib";

import { getDashboardUserEmail } from "../../../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

const BodySchema = z.object({
  body: z.string().trim().min(1).max(2000),
});

export async function POST(
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
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Note must be 1–2000 chars" },
      { status: 400 },
    );
  }

  const { id: leadId } = await params;

  const { data, error } = await sb
    .from("lead_notes")
    .insert({
      lead_id: leadId,
      author_email: sessionEmail,
      body: parsed.data.body,
      kind: "note",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  log.info("dashboard.note.created", {
    leadId,
    by: sessionEmail.split("@")[1] ?? "unknown",
  });

  return NextResponse.json({ ok: true, note: data }, { status: 201 });
}
