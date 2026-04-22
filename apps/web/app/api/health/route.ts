import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Liveness probe. Used by:
 *  - Prompt 1 smoke test (curl localhost:3000/api/health → {status:"ok"})
 *  - Vercel deployment verification
 *  - Future scheduled-tasks MCP uptime check
 */
export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "propharmex-web",
    ts: new Date().toISOString(),
  });
}
