/**
 * Embedded Sanity Studio (PR-L′).
 *
 * Mounts the full Sanity v3 studio at /studio. The studio config lives at
 * apps/web/sanity.config.ts; schemas at apps/web/sanity/. Editors authenticate
 * with their Sanity account via Sanity's hosted SSO.
 *
 * `dynamic = "force-static"` is required by next-sanity/studio so the page
 * shell is statically rendered and the studio mounts entirely client-side.
 *
 * The actual <NextStudio> import is isolated in ./Studio (a "use client"
 * module) so the RSC layer never tries to evaluate sanity.config.ts.
 */
import Studio from "./Studio";

// Intentionally not `dynamic = "force-static"`. `force-static` on this page
// causes the parent RootLayout to render with an empty `headers()` (the
// request context is unavailable during prerender), which breaks the
// chrome-suppression check. The studio shell is tiny — there's no perf
// gain from prerendering — so we let the route stay request-scoped.

// next-sanity/studio re-exports correctly typed metadata + viewport for the
// studio shell — these override the marketing-site defaults from RootLayout.
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <Studio />;
}
