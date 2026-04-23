/**
 * /quality → /quality-compliance (308 permanent redirect).
 *
 * The canonical route is `/quality-compliance` (matches the nav + site-nav.ts
 * entries shipped in Prompt 3). This file existed as a Prompt-0 placeholder
 * at the old path; kept here as a permanent redirect so any external inbound
 * link or stale bookmark lands on the current page.
 *
 * When we take the site indexable in Prompt 27, this file can move into
 * `next.config.mjs` under `redirects()` for an edge-level 308 instead of an
 * RSC-level redirect. For now the RSC-level redirect is sufficient and avoids
 * touching the shared config.
 */
import { permanentRedirect } from "next/navigation";

export default function QualityRedirect(): never {
  permanentRedirect("/quality-compliance");
}
