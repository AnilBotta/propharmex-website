/**
 * Exit draft mode. Disables Next draft mode and redirects the user back.
 *
 * Query:
 *   - `path` (optional) — same-origin pathname to return to. Defaults to `/`.
 *
 * Security: validates the return path exactly like `/api/draft` so a
 * crafted link can't bounce the editor off-site.
 */
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

import { log } from "@propharmex/lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isSafePathname(pathname: string): boolean {
  if (typeof pathname !== "string" || pathname.length === 0) return false;
  if (!pathname.startsWith("/")) return false;
  if (pathname.startsWith("//") || pathname.startsWith("/\\")) return false;
  if (pathname.includes("..")) return false;
  if (/[\s\x00-\x1f]/.test(pathname)) return false;
  return true;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawPath = searchParams.get("path") ?? "/";
  const target = isSafePathname(rawPath) ? rawPath : "/";

  const dm = await draftMode();
  dm.disable();
  log.info("draft.disabled", { pathname: target });

  if (!isSafePathname(rawPath)) {
    log.warn("draft.exit_unsafe_pathname", { pathname: rawPath });
    return NextResponse.redirect(new URL("/", req.url));
  }

  redirect(target);
}
