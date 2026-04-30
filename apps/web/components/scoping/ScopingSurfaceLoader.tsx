"use client";

/**
 * ScopingSurfaceLoader — client wrapper that defers the heavy ScopingSurface
 * chunk (including ai/react + tool-call plumbing) until after hydration.
 *
 * The RSC page imports this loader so it can keep its hero + JSON-LD
 * server-rendered while the interactive surface code-splits into its own
 * client chunk. Drops First-Load JS on /ai/project-scoping-assistant by
 * removing ai/react from the route's primary bundle.
 *
 * `ssr: false` is intentional — the surface owns local UI state from frame
 * one (preview card, submit dialog), there's nothing meaningful for the
 * server to pre-render inside it. The skeleton matches the surface's grid
 * shape so first paint doesn't shift when the chunk arrives.
 */
import dynamic from "next/dynamic";

import { ScopingSkeleton } from "./ScopingSkeleton";

const ScopingSurface = dynamic(
  () =>
    import("./ScopingSurface").then((m) => ({ default: m.ScopingSurface })),
  { ssr: false, loading: () => <ScopingSkeleton /> },
);

export function ScopingSurfaceLoader() {
  return <ScopingSurface />;
}
