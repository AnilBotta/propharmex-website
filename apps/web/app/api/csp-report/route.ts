/**
 * Content-Security-Policy violation report sink (Prompt 25 PR-A).
 *
 * Browsers POST a CSP violation report here whenever a directive blocks
 * a resource. We log the violation through the structured logger so
 * Axiom (or whatever transport `@propharmex/lib/log` is wired to) gets
 * the event, then return 204 No Content.
 *
 * We accept both legacy `application/csp-report` (level-2 spec) and
 * modern `application/reports+json` (Reporting API). Browsers in the
 * wild still emit either format, so the route is permissive about both.
 *
 * Edge runtime: this endpoint must be cheap. We do not write to the
 * database; we do not call Sentry. The structured logger short-circuits
 * when its env transport is unset, so dev / preview is a complete no-op.
 *
 * Privacy: a CSP report contains the source URL, blocked URI, and
 * violated directive. It does NOT carry user identifiers. We do not
 * enrich the payload with request metadata beyond IP-stripped UA.
 */
import { NextResponse } from "next/server";

import { log } from "@propharmex/lib";

export const runtime = "edge";

type LegacyCspReport = {
  "csp-report"?: {
    "document-uri"?: string;
    "violated-directive"?: string;
    "effective-directive"?: string;
    "blocked-uri"?: string;
    "source-file"?: string;
    "line-number"?: number;
    "column-number"?: number;
    referrer?: string;
    disposition?: string;
  };
};

type ReportingApiEntry = {
  type?: string;
  url?: string;
  body?: {
    documentURL?: string;
    blockedURL?: string;
    effectiveDirective?: string;
    violatedDirective?: string;
    sourceFile?: string;
    lineNumber?: number;
    columnNumber?: number;
    referrer?: string;
    disposition?: string;
  };
};

/**
 * Best-effort field extraction across both CSP report shapes.
 * Returns a flat record suitable for structured logging.
 */
function flatten(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object") return {};

  // Reporting API: an array of report entries.
  if (Array.isArray(payload)) {
    const first = (payload as ReportingApiEntry[])[0];
    if (!first) return {};
    return {
      schema: "reporting-api",
      type: first.type,
      url: first.url,
      ...first.body,
    };
  }

  // Legacy: { "csp-report": { ... } }
  const legacy = (payload as LegacyCspReport)["csp-report"];
  if (legacy && typeof legacy === "object") {
    return { schema: "legacy", ...legacy };
  }

  // Fallback — log whatever we got so we don't drop the signal.
  return { schema: "unknown", payload: payload as Record<string, unknown> };
}

export async function POST(req: Request) {
  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    // Some browsers POST CSP reports as text/plain; fall back to a body
    // read + parse rather than crashing.
    try {
      body = JSON.parse(await req.text());
    } catch {
      body = null;
    }
  }

  const flat = flatten(body);
  const userAgent = req.headers.get("user-agent") ?? "";

  log.warn("csp.violation", {
    ...flat,
    userAgent: userAgent.slice(0, 200),
  });

  return new NextResponse(null, { status: 204 });
}

/**
 * GET is rejected. CSP reports are always POSTed; a GET here is either
 * a misconfigured browser or a probe — return 405.
 */
export function GET() {
  return new NextResponse(null, {
    status: 405,
    headers: { Allow: "POST" },
  });
}
