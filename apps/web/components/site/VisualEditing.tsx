"use client";

/**
 * Client-only wrapper around `next-sanity`'s `VisualEditing`.
 *
 * Loaded lazily so the package (and its transitive deps) only land in the
 * bundle on draft-mode routes. The RSC layout renders this component
 * conditionally — we never emit the overlay in production previews seen by
 * end users.
 *
 * `next-sanity` is an optional peer at this stage of the build (Prompt 4) —
 * if it isn't installed yet, the dynamic import fails silently and the
 * indicator alone communicates draft state.
 */
import dynamic from "next/dynamic";

const LazyVisualEditing = dynamic(
  () =>
    import("next-sanity")
      .then((mod) => {
        const VE = (mod as unknown as { VisualEditing?: React.ComponentType })
          .VisualEditing;
        if (!VE) {
          return { default: () => null };
        }
        return { default: VE };
      })
      .catch(() => ({ default: () => null })),
  { ssr: false },
);

interface VisualEditingProps {
  enabled: boolean;
}

export function VisualEditing({ enabled }: VisualEditingProps) {
  if (!enabled) return null;
  return <LazyVisualEditing />;
}

export default VisualEditing;
