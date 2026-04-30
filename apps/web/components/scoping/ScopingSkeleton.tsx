/**
 * ScopingSkeleton — first-paint placeholder for ScopingSurface.
 *
 * Rendered while next/dynamic loads the AI-SDK-backed surface chunk on the
 * /ai/project-scoping-assistant route. Matches the surface's two-column
 * grid + chat header so the layout doesn't shift when the real component
 * mounts. aria-hidden via Skeleton; the live region inside ScopingSurface
 * takes over once it hydrates.
 */
import { Skeleton } from "@propharmex/ui";

export function ScopingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
      {/* Chat column shell */}
      <div className="flex h-[640px] max-h-[calc(100dvh-12rem)] flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_4px_12px_-4px_rgba(15,32,80,0.08)]">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-primary-50)] px-4 py-3">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-2.5 w-40" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 px-4 py-6">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex flex-col gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
          <Skeleton className="h-11 w-full" />
        </div>
      </div>

      {/* Preview column shell */}
      <div className="flex flex-col gap-3">
        <div className="flex h-[640px] flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_4px_12px_-4px_rgba(15,32,80,0.08)]">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="mt-4 h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
