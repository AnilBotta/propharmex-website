# Analytics Taxonomy

Bounded event taxonomy for the Propharmex marketing site (Prompt 24).
Plausible covers privacy-respecting page analytics; PostHog covers product
analytics, funnels, and feature flags. Autocapture is **disabled** in
PostHog — every event below is fired explicitly from the app code.

> Source of truth: this file. If a new surface wants to fire telemetry, it
> must register the event here first. PRs that add `posthog.capture(...)`
> without updating this doc will be rejected in review.

---

## 1. Stack and configuration

| Layer | Tool | Where |
|---|---|---|
| Page analytics | Plausible | `<Script src="https://plausible.io/js/script.js" data-domain=…>` mounted in `apps/web/components/site/Analytics.tsx`. No code in our app — Plausible auto-records page-views via History API. |
| Product analytics | PostHog | Lazy `posthog.init(...)` inside the same component. `capture_pageview: true`, `autocapture: false`, `session_recording: disabled`, `person_profiles: identified_only`. |
| Super-properties | PostHog `register()` | Set on `loaded()` callback inside `posthog.init` — every subsequent `capture` carries them automatically. See §3. |
| Helper module | `apps/web/lib/analytics/` | Generic `track()` + typed wrappers for the surfaces added in Prompt 24. |
| Per-surface telemetry | `apps/web/components/{concierge,scoping,del-readiness,dosage-matcher,site}/telemetry.ts` | The four AI tools and the region middleware retain their existing namespaced helpers from Prompts 18–22. |

Both vendors are **no-ops** when their env vars are unset (`NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_POSTHOG_KEY`) so dev / preview / CI builds never fire fake telemetry.

---

## 2. Privacy & PII redaction policy

The marketing site is the public face of a regulated pharma services
business. Lead-generation telemetry is acceptable; surveillance is not.
The hard rules:

1. **Never send raw user input text** — chat messages, form free-text,
   AI-tool descriptions are bucketed (length bucket, count, category)
   before they reach PostHog. Helpers in the per-surface telemetry files
   enforce this.
2. **Never send raw email addresses, names, phone numbers, or company
   names** as event properties. The contact-form `contact_submit` event
   carries `service` and `region` only — the lead body lives in Resend +
   the structured logger.
3. **Never persist `document.referrer` verbatim.** The
   [`classifyReferrer`](../apps/web/lib/analytics/referrer.ts) helper
   reduces it to a coarse 6-bucket group before it enters PostHog.
4. **First-touch UTM only** — later visits never overwrite the
   first-touch record. Implementation in
   [`utm.ts`](../apps/web/lib/analytics/utm.ts).
5. **Session recording is disabled** at the SDK level
   (`disable_session_recording: true`).
6. **Person profiles only on identification** (`person_profiles: "identified_only"`)
   — anonymous visitors never get a PostHog `Person` row, only events.

If a future feature needs to escape any of these rules, it must come
through `consolidate-memory` + `legal-compliance` review, not a quiet
PR.

---

## 3. Super-properties

Registered once on `posthog.init().loaded()` (and re-registered on
subsequent mounts so values stay fresh after a region change or new UTM
visit). Implementation:
[`super-properties.ts`](../apps/web/lib/analytics/super-properties.ts).

| Property | Type | Source | Purpose |
|---|---|---|---|
| `region` | `"CA" \| "US" \| "IN" \| "GLOBAL" \| "unknown"` | `px-region` cookie set by Prompt 22 middleware | Region-breakdown dashboard; segmentation across every event |
| `referrer_group` | `"direct" \| "search" \| "ai" \| "social" \| "internal" \| "external"` | [`classifyReferrer`](../apps/web/lib/analytics/referrer.ts) on `document.referrer` | Channel attribution; AI-citation tracking |
| `device_class` | `"mobile" \| "tablet" \| "desktop"` | [`classifyDevice`](../apps/web/lib/analytics/device.ts) on `navigator.userAgent` (+ touch points fallback for iPad) | Mobile/desktop segmentation in funnels |
| `first_touch_utm` | `{ utm_source?, utm_medium?, utm_campaign?, utm_term?, utm_content?, captured_at? }` | [`resolveFirstTouchUtm`](../apps/web/lib/analytics/utm.ts) — pinned in `localStorage` on first visit | Marketing attribution; campaign ROI |

---

## 4. Event registry

### 4.1 Page-level

| Event | Owner | Payload | Notes |
|---|---|---|---|
| `$pageview` | PostHog SDK (auto) | `{ $current_url, $referrer, …super-properties }` | Auto-fired by `capture_pageview: true`. We do not add a manual `page_view` — Plausible covers privacy-friendly page counts; PostHog `$pageview` fuels funnels. |

Plausible records its own `pageview` event server-side via the script
tag — no app code involved. Custom Plausible goals are **not used** —
we standardize on PostHog for funnel work.

### 4.2 Marketing-surface clicks

| Event | Where fired | Payload | Owner doc |
|---|---|---|---|
| `hero_cta_click` | `apps/web/components/home/Hero.tsx` (and any future hero with CTAs) | `{ page: string, variant: "primary"\|"secondary"\|"ghost", href: string, label: string }` | Lead-funnel dashboard top-of-funnel |
| `service_card_click` | `apps/web/components/home/WhatWeDo.tsx` | `{ surface: "home-what-we-do", serviceId: string, href: string }` | Content-performance dashboard |

### 4.3 Forms

Every form fires both a generic `form_submit` and a surface-specific
event so the funnel can pivot either way.

| Event | Where fired | Payload |
|---|---|---|
| `form_submit` | All | `{ form: string, category?: string, queued?: boolean }` |
| `contact_submit` | `apps/web/components/contact/InquiryForm.tsx` | `{ service: string, region: string, queued?: boolean }` |
| `whitepaper_download` | `apps/web/components/insights/WhitepaperGateForm.tsx` | `{ slug: string, queued: boolean }` |

`queued` reflects whether the server-side delivery (Resend, etc.)
actually queued an email. `false` means the env wasn't configured —
expected in dev / preview, a regression in prod.

### 4.4 Region middleware (Prompt 22 PR-A — already shipped)

Implementation: [`apps/web/components/site/region-telemetry.ts`](../apps/web/components/site/region-telemetry.ts).

| Event | Payload |
|---|---|
| `region.detected` | `{ region: Region }` |
| `region.changed` | `{ region: Region, source: "switcher" \| "banner" }` |
| `region.banner_dismissed` | `{ region: Region }` |

### 4.5 CDMO Concierge (Prompt 18 — already shipped)

Implementation: [`apps/web/components/concierge/telemetry.ts`](../apps/web/components/concierge/telemetry.ts).

| Event | Payload |
|---|---|
| `concierge.opened` | `{ source?: "bubble" \| "keyboard" }` |
| `concierge.closed` | `{ reason?: "x-button" \| "escape" \| "toggle" }` |
| `concierge.message_sent` | `{ source: "composer" \| "suggestion-chip", lengthBucket }` |
| `concierge.message_received` | `{ citationCount: number }` |
| `concierge.feedback` | `{ vote: "up" \| "down" }` |
| `concierge.escape_clicked` | — |

### 4.6 Project Scoping Assistant (Prompt 19 — already shipped)

Implementation: [`apps/web/components/scoping/telemetry.ts`](../apps/web/components/scoping/telemetry.ts).

| Event | Payload |
|---|---|
| `scoping.opened` | — |
| `scoping.message_sent` | `{ source, lengthBucket }` |
| `scoping.sample_loaded` | — |
| `scoping.scope_generated` | `{ serviceCount, phaseCount, riskCount }` |
| `scoping.scope_edited` | `{ section }` |
| `scoping.submitted` | `{ queued, serviceCount, phaseCount }` |
| `scoping.pdf_downloaded` | `{ bytes, serviceCount, phaseCount }` |
| `scoping.escape_clicked` | — |

### 4.7 DEL Readiness Assessment (Prompt 20 — already shipped)

Implementation: [`apps/web/components/del-readiness/telemetry.ts`](../apps/web/components/del-readiness/telemetry.ts).

| Event | Payload |
|---|---|
| `del_readiness.opened` | — |
| `del_readiness.question_answered` | `{ category, stepIndex }` |
| `del_readiness.submitted` | `{ answeredCount }` |
| `del_readiness.scored` | `{ score, trafficLight, gapCount, remediationCount }` |
| `del_readiness.consultation_clicked` | `{ hasCalLink }` |
| `del_readiness.pdf_downloaded` | `{ bytes, score, trafficLight }` |
| `del_readiness.retake` | — |

### 4.8 Dosage Form Capability Matcher (Prompt 21 — already shipped)

Implementation: [`apps/web/components/dosage-matcher/telemetry.ts`](../apps/web/components/dosage-matcher/telemetry.ts).

| Event | Payload |
|---|---|
| `dosage_matcher.opened` | — |
| `dosage_matcher.sample_loaded` | — |
| `dosage_matcher.submitted` | `{ hasDescription, filterCount }` |
| `dosage_matcher.matched` | `{ matchCount, topFitTier, topCoveragePct }` |
| `dosage_matcher.consultation_clicked` | — |
| `dosage_matcher.pdf_downloaded` | `{ bytes, matchCount }` |
| `dosage_matcher.restart` | — |

---

## 5. Mapping — Prompt 24 spec → implementation

The Prompt 24 brief lists short, generic event names. We use richer
namespaced names in the actual implementation; the table below maps
between them so a reader of the original spec can find the real event.

| Prompt 24 spec name | Actual event(s) | Notes |
|---|---|---|
| `page_view` | `$pageview` (PostHog auto) | Plausible records it server-side too. |
| `hero_cta_click` (with variant) | `hero_cta_click` | New in Prompt 24. |
| `service_card_click` | `service_card_click` | New in Prompt 24. |
| `ai_tool_open` (tool name) | `concierge.opened`, `scoping.opened`, `del_readiness.opened`, `dosage_matcher.opened` | Tool name is the namespace. |
| `ai_tool_step_advance` | `del_readiness.question_answered`, `scoping.message_sent`, `dosage_matcher.submitted` | Per-tool semantics. |
| `ai_tool_complete` | `concierge.message_received`, `scoping.scope_generated`, `del_readiness.scored`, `dosage_matcher.matched` | Per-tool completion event. |
| `whitepaper_download` | `whitepaper_download` | New in Prompt 24. |
| `form_submit` (form name) | `form_submit` (with `form: string`) | New in Prompt 24. |
| `region_switch` | `region.changed` | Already shipped Prompt 22. |
| `chat_open` | `concierge.opened` | Already shipped Prompt 18. |
| `chat_message` | `concierge.message_sent` | Already shipped Prompt 18. |
| `contact_submit` | `contact_submit` + `form_submit` | New in Prompt 24. |
| `scope_assistant_send` | `scoping.message_sent` | Already shipped Prompt 19. |
| `del_assessment_complete` | `del_readiness.scored` | Already shipped Prompt 20. |

---

## 6. Dashboards

PostHog dashboards are configured in the PostHog UI, not in code. The
spec below is what the team builds and maintains in PostHog after this
PR ships.

### 6.1 Lead funnel

Tracks the high-intent path: visit → primary CTA → form submit.

| Step | Event | Filter |
|---|---|---|
| 1 | `$pageview` | any URL |
| 2 | `hero_cta_click` | `variant = primary` |
| 3 | `form_submit` | `form ∈ {contact, whitepaper}` |
| 4 | `form_submit` | `queued = true` |

Breakdowns: `region`, `referrer_group`, `device_class`, `first_touch_utm.utm_source`.

### 6.2 AI tool conversion

Tracks engagement across the four AI tools.

| Step | Event | Filter |
|---|---|---|
| 1 | `$pageview` | URL contains `/ai/` |
| 2 | `*.opened` | OR across `concierge / scoping / del_readiness / dosage_matcher` |
| 3 | `*.message_sent` OR `*.submitted` OR `*.question_answered` | first user input |
| 4 | `concierge.message_received` OR `scoping.scope_generated` OR `del_readiness.scored` OR `dosage_matcher.matched` | tool completion |
| 5 | `*.consultation_clicked` OR `*.pdf_downloaded` OR `*.escape_clicked` | conversion to BD |

Breakdowns: tool (event namespace), `region`, `device_class`.

### 6.3 Content performance

Tracks insight + case-study + service navigation.

- **Top events:** `$pageview` grouped by `$pathname` (top 20 routes).
- **Side-by-side:** `service_card_click` by `serviceId` and `surface`.
- **Trend:** `whitepaper_download` by `slug` over 30 days.
- **Retention:** weekly returning visitors (PostHog Retention insight on `$pageview`).

### 6.4 Region breakdown

Single tile per metric, broken down by the `region` super-property:

- `region.detected` count by `region` (initial detection accuracy proxy).
- `region.changed` count by `region` (override rate).
- `form_submit` count by `region` (lead distribution).
- `$pageview` count by `region` (traffic distribution).
- `*.opened` (AI tools) count by `region` (tool engagement by region).

A high `region.changed`-to-`region.detected` ratio indicates the
detection layer is misclassifying users — a signal to revisit the
country-to-region map in [`packages/lib/region/country-map.ts`](../packages/lib/region/country-map.ts).

---

## 7. Operational notes

- **Adding a new event** — add a typed wrapper in
  [`apps/web/lib/analytics/track.ts`](../apps/web/lib/analytics/track.ts)
  (or the appropriate per-surface telemetry file), then update §4 of this
  doc. Name your event in the existing convention: `surface.action`
  (snake_case) for namespaced events, or a short `verb_noun` for
  generic top-level events.
- **Renaming an event** — don't. Add the new name and dual-fire for one
  PostHog retention window (PostHog only retains 1y for free-tier
  events), then deprecate. Renames break dashboards.
- **Debugging telemetry locally** — set `NEXT_PUBLIC_POSTHOG_KEY` to
  any non-empty string and open the PostHog DevTools panel
  (`localStorage['ph_debug'] = 'true'`). Events appear in the console
  before they're sent.
- **CI / preview** — env vars are unset → both vendors no-op → tests
  pass cleanly without any `vi.mock(...)` boilerplate. The
  `isLoaded()` guard in every helper short-circuits when
  `posthog.__loaded` is false.

---

## 8. References

- [`apps/web/components/site/Analytics.tsx`](../apps/web/components/site/Analytics.tsx) — SDK init.
- [`apps/web/lib/analytics/`](../apps/web/lib/analytics/) — shared helpers.
- [`apps/web/components/{surface}/telemetry.ts`](../apps/web/components/) — per-surface helpers.
- Prompt 22 PR-A: region middleware — [`project_prompt22_region.md`](../%7E/.claude/projects/.../memory/project_prompt22_region.md) memory note.
- Prompt 18–21: AI-tool telemetry — same memory namespace.
- PostHog docs: <https://posthog.com/docs/product-analytics/capture-events>
- Plausible docs: <https://plausible.io/docs>
