/**
 * Root-segment loading state.
 *
 * Shown during server rendering of nested segments. The pattern is a
 * full-height skeleton that mirrors the page scaffolding — header stays
 * because loading.tsx renders inside the root layout.
 */
import { Skeleton } from "@propharmex/ui";

export default function RootLoading() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8"
    >
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="h-4 w-full max-w-lg" />
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </section>
  );
}
