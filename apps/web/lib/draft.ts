/**
 * Draft-mode helpers.
 *
 * Next 15's `draftMode()` is async and only callable in a request scope.
 * During static rendering (e.g. at build time, generateMetadata on a static
 * route) it throws. We wrap it so callers can treat draft mode as "off"
 * when the request context isn't available.
 *
 * See CLAUDE.md §4 — Sanity visual editing wiring lives in Phase 3 (Prompt 4).
 */
import { draftMode } from "next/headers";

export interface DraftState {
  isEnabled: boolean;
}

/**
 * Returns the current draft-mode state, safely. Never throws.
 *
 * In a static rendering context (no request), returns `{ isEnabled: false }`.
 */
export async function isDraftMode(): Promise<DraftState> {
  try {
    const dm = await draftMode();
    return { isEnabled: dm.isEnabled };
  } catch {
    return { isEnabled: false };
  }
}
