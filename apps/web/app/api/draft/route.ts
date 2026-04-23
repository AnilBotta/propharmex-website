/**
 * Draft mode entrypoint for Sanity preview links.
 *
 * The Sanity Presentation tool / preview URL redirects the editor to this
 * route with:
 *   - `secret`                     — shared secret that must match env.SANITY_PREVIEW_SECRET
 *   - `sanity-preview-pathname`    — the in-app path to redirect to after enabling draft mode
 *
 * Contract:
 *   - Hard-fails (401) on missing/invalid secret.
 *   - Rejects open-redirect attempts: the pathname MUST start with `/`,
 *     MUST NOT contain `//` (protocol-relative), `..`, or a leading backslash.
 *   - Enables Next draft mode and issues a 307 redirect to the safe pathname.
 *
 * CLAUDE.md §4.5 + §10 — never log the secret. Log the target pathname only.
 */
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

import { env, log } from "@propharmex/lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Allow only same-origin, non-traversing paths. */
function isSafePathname(pathname: string): boolean {
  if (typeof pathname !== "string" || pathname.length === 0) return false;
  if (!pathname.startsWith("/")) return false;
  // Reject protocol-relative (`//evil.com`) and backslash-prefixed tricks.
  if (pathname.startsWith("//") || pathname.startsWith("/\\")) return false;
  if (pathname.includes("..")) return false;
  // Reject control characters and whitespace in the path.
  if (/[\s\x00-\x1f]/.test(pathname)) return false;
  return true;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const rawPathname = searchParams.get("sanity-preview-pathname") ?? "/";

  const expected = env.SANITY_PREVIEW_SECRET;

  if (!expected) {
    log.warn("draft.preview_secret_not_configured");
    return NextResponse.json(
      { error: "Draft mode is not configured in this environment." },
      { status: 501 },
    );
  }

  if (!secret || secret !== expected) {
    log.warn("draft.invalid_secret", { pathname: rawPathname });
    return NextResponse.json(
      { error: "Invalid preview secret." },
      { status: 401 },
    );
  }

  if (!isSafePathname(rawPathname)) {
    log.warn("draft.unsafe_pathname", { pathname: rawPathname });
    return NextResponse.json(
      { error: "Invalid redirect target." },
      { status: 400 },
    );
  }

  const dm = await draftMode();
  dm.enable();
  log.info("draft.enabled", { pathname: rawPathname });

  // `redirect()` throws a NEXT_REDIRECT — must not be wrapped in try/catch above.
  redirect(rawPathname);
}
