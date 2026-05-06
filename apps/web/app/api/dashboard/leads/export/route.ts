/**
 * /api/dashboard/leads/export — CSV export of the lead intake table.
 *
 * Auth-gated (Supabase session OR DASHBOARD_AUTH_DISABLED bypass).
 * Returns a plain text/csv response with `Content-Disposition: attachment`
 * so browsers trigger a download dialog.
 *
 * Optional query params (mirror /api/dashboard/leads):
 *   ?source=contact|whitepaper|...
 *   ?status=new|contacted|won|lost
 *
 * Cap: 5000 rows per export. Larger exports are paginated streaming, a
 * future PR-N4 candidate. For now 5k covers expected BD volume comfortably.
 */
import { NextResponse } from "next/server";

import { supabase } from "@propharmex/lib";

import { getDashboardUserEmail } from "../../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

const MAX_ROWS = 5000;

const COLUMNS = [
  "id",
  "created_at",
  "source",
  "status",
  "contact_name",
  "email",
  "company",
  "role",
  "region",
  "service",
  "dosage_form",
  "stage",
  "message",
  "owner_email",
  "ip_country",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "referrer",
  "contacted_at",
  "closed_at",
] as const;

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
  const source = url.searchParams.get("source");
  const status = url.searchParams.get("status");

  let query = sb
    .from("leads")
    .select(COLUMNS.join(","))
    .order("created_at", { ascending: false })
    .limit(MAX_ROWS);

  if (source) query = query.eq("source", source);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as Array<Record<string, unknown>>;
  const csv = toCsv(COLUMNS, rows);

  const filename = `propharmex-leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      // Strong no-cache so each download pulls live data.
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function toCsv(
  columns: readonly string[],
  rows: Array<Record<string, unknown>>,
): string {
  const lines: string[] = [];
  lines.push(columns.map(csvEscape).join(","));
  for (const row of rows) {
    lines.push(columns.map((c) => csvEscape(formatCell(row[c]))).join(","));
  }
  // Excel-friendly UTF-8 BOM so emoji / non-ASCII names render correctly.
  return "﻿" + lines.join("\r\n") + "\r\n";
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function csvEscape(value: string): string {
  // Quote and double-up internal quotes if the value contains comma,
  // quote, newline, or starts with formula-injection characters.
  const needsQuote =
    /[",\r\n]/.test(value) || /^[=+\-@]/.test(value);
  if (!needsQuote) return value;
  // Prefix dangerous starts with a single quote to defang formula injection
  // when opened in Excel/Google Sheets.
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}
