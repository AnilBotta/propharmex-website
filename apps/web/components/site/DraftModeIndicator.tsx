"use client";

/**
 * Fixed top banner shown when Next draft mode is enabled.
 *
 * Rendered from `app/layout.tsx` — the RSC layout reads `draftMode()` and
 * only passes `enabled={true}` when preview mode is active. This component
 * renders nothing otherwise so the production bundle stays unchanged.
 *
 * The copy is stable and operator-facing (not a marketing surface), so it
 * lives in-component rather than Sanity. See CLAUDE.md §4.3 for the general
 * copy policy.
 */
import Link from "next/link";

interface DraftModeIndicatorProps {
  enabled: boolean;
  /** Return path after exiting — usually the current pathname. Defaults to `/`. */
  returnPath?: string;
}

export function DraftModeIndicator({
  enabled,
  returnPath = "/",
}: DraftModeIndicatorProps) {
  if (!enabled) return null;

  const exitHref = `/api/exit-draft?path=${encodeURIComponent(returnPath)}`;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-3 border-b border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 shadow-sm"
      data-testid="draft-mode-indicator"
    >
      <span
        aria-hidden
        className="inline-block h-2 w-2 rounded-full bg-amber-500"
      />
      <span className="font-medium">Preview mode active</span>
      <span className="opacity-60">·</span>
      <Link
        href={exitHref}
        prefetch={false}
        className="underline decoration-amber-400 underline-offset-4 hover:decoration-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50"
      >
        Exit
      </Link>
    </div>
  );
}

export default DraftModeIndicator;
