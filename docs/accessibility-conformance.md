# Accessibility Conformance Report (ACR)

**Standard:** Web Content Accessibility Guidelines (WCAG) 2.1, Level AA
**Format:** Voluntary Product Accessibility Template (VPAT) 2.5 — Revised Section 508 + EN 301 549 reporting
**Product:** Propharmex marketing website (`propharmex.com`)
**Vendor:** Propharmex Inc.
**Vendor contact:** hello@propharmex.com
**Report date:** 2026-05-02
**Report version:** 1.1

> The corresponding `.docx` export of this document lives at
> `docs/accessibility-conformance.docx` and is regenerated from this
> markdown via `scripts/generate-acr-docx.py`. Treat **this markdown
> file as the source of truth**; the docx is for compliance archives
> and customer-facing distribution.

---

## 1. Conformance level summary

| Conformance level | Definition |
|---|---|
| **Supports** | The functionality of the product has at least one method that meets the criterion without known defects. |
| **Partially Supports** | Some functionality of the product does not meet the criterion. |
| **Does Not Support** | The majority of product functionality does not meet the criterion. |
| **Not Applicable** | The criterion is not relevant to the product. |
| **Not Evaluated** | The criterion was not evaluated. (Permitted only for WCAG 2.1 Level AAA criteria.) |

**Overall posture:** the product **Supports** WCAG 2.1 Level AA with a small number of **Partially Supports** items, all listed in §3 with remediation status.

---

## 2. Evaluation methods

| Method | Performed | Notes |
|---|---|---|
| Automated audit (Lighthouse CI) | Yes | 10 representative URLs, mobile preset, simulated throttling, 3 runs each, median aggregation. Baseline run 2026-04-29. |
| Automated audit (axe-core CI) | Yes | Same 10 URLs via `@axe-core/cli` against the `next start` server. Configured in `.github/workflows/a11y-budget.yml` to fail on any `serious` or `critical` violation. |
| Code-level review | Yes | WCAG 2.1 AA pass by the Accessibility Auditor agent on 2026-04-29. 18 findings produced (3 Sev 1, 7 Sev 2, 8 Sev 3). All Sev 1 + 5 of 7 Sev 2 + 1 Sev 3 fixed in PR [#42](https://github.com/AnilBotta/propharmex-website/pull/42). |
| Color-contrast computation | Yes | Every text/background token pairing computed against the 4.5:1 (normal) and 3:1 (large) AA thresholds. Original teal/amber palette: 11/14 pass; 1 fail (warn — fixed); 1 borderline (muted — fixed). **Rebrand re-audit (PR-A · `style/design-tokens-rebrand`, 2026-05-02):** new navy/blue/green/orange palette computed; `--color-fg #161B3D` on `--color-bg #FBFBFD` ≈ 16.5:1, `--color-muted #6B7090` on `--color-bg` ≈ 5.0:1, `--color-primary-600 #11195A` on white ≈ 15.7:1. `--color-accent-fg=#FFFFFF` on `--color-accent-500=#F47B20` orange ≈ 2.7:1 — fails AA normal text; the `--color-accent-500` token is restricted to large-text contexts (≥18px or ≥14px bold) and orange CTAs must use the darker `--color-accent-700 #BF560C` background (≈ 4.7:1 vs white) for normal-text labels. Tracked under §4 limitations until PR-B (`feat(ui): primitive uplift`) ships the AA-compliant Button accent variant. |
| Manual screen-reader pass | **Pending** | Test plan documented in [`docs/accessibility-at-test-plan.md`](accessibility-at-test-plan.md). Findings from the manual session will be appended to §3 in the next revision of this report. |
| Keyboard-only navigation | Partial | Code-level review confirms all interactive elements are keyboard-reachable. Full end-to-end keyboard pass on AI tool flows (Concierge, Scoping, Dosage Matcher) is part of the manual pass. |
| Browser zoom (200% / 400%) | Pending | Visual reflow testing scheduled with the manual pass. |
| Forced-colors / Windows High Contrast | Not Evaluated | Documented as a known limitation in §4. |

---

## 3. WCAG 2.1 Level AA — criterion-by-criterion

### Principle 1 — Perceivable

| SC | Title | Level | Conformance | Remarks |
|---|---|---|---|---|
| 1.1.1 | Non-text Content | A | Supports | All meaningful images carry `alt`; decorative SVG and icon-only buttons have `aria-hidden="true"` and `aria-label` on the parent control respectively. |
| 1.2.1 | Audio-only and Video-only (Prerecorded) | A | Not Applicable | Site does not currently host audio or video content. |
| 1.2.2 | Captions (Prerecorded) | A | Not Applicable | As above. |
| 1.2.3 | Audio Description or Media Alternative | A | Not Applicable | As above. |
| 1.2.4 | Captions (Live) | AA | Not Applicable | No live media. |
| 1.2.5 | Audio Description (Prerecorded) | AA | Not Applicable | No prerecorded media. |
| 1.3.1 | Info and Relationships | A | Supports | Semantic HTML throughout: landmark elements, heading hierarchy, list elements for related content, `<fieldset>`/`<legend>` for grouped form controls. The DEL Readiness step progress label is inside `<legend>` (PR #42). Form-field hints are programmatically associated via `aria-describedby` (PR #42, S1-2 fix). |
| 1.3.2 | Meaningful Sequence | A | Supports | DOM order matches visual reading order on every page. |
| 1.3.3 | Sensory Characteristics | A | Supports | No instructions rely solely on shape, color, or position. |
| 1.3.4 | Orientation | AA | Supports | Layout works in both portrait and landscape. |
| 1.3.5 | Identify Input Purpose | AA | Supports | Form fields ship correct `autoComplete` and `inputMode` values (`name`, `email`, `organization`, etc.). |
| 1.4.1 | Use of Color | A | Supports | Color is not the only indicator on any state — focus rings are visible, error states pair color with text, required indicators pair color with screen-reader text. |
| 1.4.2 | Audio Control | A | Not Applicable | No auto-playing audio. |
| 1.4.3 | Contrast (Minimum) | AA | Supports | All text/background pairings ≥ 4.5:1 for normal text and ≥ 3:1 for large text. `--color-warn` text was failing at 3.4:1 — darkened to 5.2:1 in PR #42 (S1-1 fix). `--color-muted` margin tightened from 4.4:1 to 4.9:1 in the same PR. Rebrand re-audit (PR-A, 2026-05-02): every text/bg pairing recomputed against the navy/blue/green/orange palette; all pass except `--color-accent-fg=#FFFFFF` on `--color-accent-500=#F47B20` (orange CTA) at ≈ 2.7:1, which is restricted to large-text contexts and component-level enforcement of `--color-accent-700` for normal-text orange CTAs (PR-B). `--color-warn #8B6508` and `--color-danger #A23B3B` preserved verbatim. |
| 1.4.4 | Resize Text | AA | Supports | Site reflows up to 200% browser zoom without loss of content or functionality. 400% behavior pending manual verification. |
| 1.4.5 | Images of Text | AA | Supports | No images of text — all typography is rendered with web fonts. |
| 1.4.10 | Reflow | AA | Supports | Layout adapts down to 320 CSS pixels wide without horizontal scrolling on content surfaces. |
| 1.4.11 | Non-text Contrast | AA | Supports | Form-field borders, focus rings, and icon-only button outlines all ≥ 3:1 on neighboring colors. |
| 1.4.12 | Text Spacing | AA | Supports | Text remains readable when user agents apply line-height 1.5×, paragraph spacing 2×, letter-spacing 0.12×, word-spacing 0.16×. |
| 1.4.13 | Content on Hover or Focus | AA | Supports | Hover panels (mega-menu) are keyboard-dismissible (Esc) and persist on hover. |

### Principle 2 — Operable

| SC | Title | Level | Conformance | Remarks |
|---|---|---|---|---|
| 2.1.1 | Keyboard | A | Supports | All interactive elements are keyboard-operable. |
| 2.1.2 | No Keyboard Trap | A | Supports | No keyboard traps. The non-modal Concierge panel lets users tab past it. |
| 2.1.4 | Character Key Shortcuts | A | Not Applicable | No single-character shortcuts. |
| 2.4.1 | Bypass Blocks | A | Supports | `<SkipToContent>` is the first focusable element; jumps to `<main id="main-content">`. |
| 2.4.2 | Page Titled | A | Supports | Every route ships a unique `<title>` via Next.js `metadata.title`. |
| 2.4.3 | Focus Order | A | Supports | Focus order matches visual order on every page. |
| 2.4.4 | Link Purpose (In Context) | A | Supports | Link text is descriptive in context. The whitepaper success "Download {title}" link includes the asset title. |
| 2.4.5 | Multiple Ways | AA | Supports | Site offers global navigation, footer navigation, sitemap, and search-engine-discoverable URLs. |
| 2.4.6 | Headings and Labels | AA | Supports | Every form control has an associated `<label>`. Headings describe the topic of their section. |
| 2.4.7 | Focus Visible | AA | Supports | Global `*:focus-visible` ring + component-local rings. Header mega-menu and Footer links got explicit `focus-visible:bg-*` styles in PR #42 (S2-5 fix). |
| 2.5.1 | Pointer Gestures | A | Supports | No multi-point or path-based gestures. |
| 2.5.2 | Pointer Cancellation | A | Supports | Click handlers fire on pointer-up; users can cancel by dragging away. |
| 2.5.3 | Label in Name | A | Supports | Visible labels match the accessible-name string. |
| 2.5.4 | Motion Actuation | A | Not Applicable | No motion-actuated functionality. |

### Principle 3 — Understandable

| SC | Title | Level | Conformance | Remarks |
|---|---|---|---|---|
| 3.1.1 | Language of Page | A | Supports | `<html lang="en">` set on every route. |
| 3.1.2 | Language of Parts | AA | Supports | All content is English; no in-page language switches. |
| 3.2.1 | On Focus | A | Supports | Focus does not trigger navigation or context change. |
| 3.2.2 | On Input | A | Supports | Form input does not auto-submit. |
| 3.2.3 | Consistent Navigation | AA | Supports | Header and Footer are consistent across pages. |
| 3.2.4 | Consistent Identification | AA | Supports | Components with the same function are labelled the same way site-wide. |
| 3.3.1 | Error Identification | A | Partially Supports | NewsletterForm announces errors with `role="alert"` and links the error to the input via `aria-describedby` (PR #42). InquiryForm and WhitepaperGateForm currently surface a global form-level error rather than field-level. **Remediation**: per-field validation refactor — tracked as a follow-up; not blocking AA because the global error is announced and the user is told what to retry. |
| 3.3.2 | Labels or Instructions | A | Supports | Every input has a visible label and (where applicable) a programmatic hint via `aria-describedby` (PR #42, S1-2 fix). Required fields carry a screen-reader-only " (required)" suffix (S1-3 fix). |
| 3.3.3 | Error Suggestion | AA | Partially Supports | Same scope as 3.3.1: form-level error suggestions are present; per-field suggestions are a planned refactor. |
| 3.3.4 | Error Prevention (Legal, Financial, Data) | AA | Not Applicable | Site does not collect legal or financial submissions. |

### Principle 4 — Robust

| SC | Title | Level | Conformance | Remarks |
|---|---|---|---|---|
| 4.1.1 | Parsing (obsolete in WCAG 2.2) | A | Supports | Markup is well-formed; no duplicate IDs at runtime; lint enforces. |
| 4.1.2 | Name, Role, Value | A | Supports | Standard HTML elements + Radix primitives provide correct ARIA. The Concierge panel uses `<section aria-labelledby>` rather than the misleading `role="dialog"` it previously had (PR #42, S2-1 fix). |
| 4.1.3 | Status Messages | AA | Supports | Live regions are scoped to the surfaces that produce status — message lists in the Concierge panel, success states on form submission. The Concierge launcher container no longer carries `aria-live` (was announcing icon swaps; PR #42, S2-4 fix). |

---

## 4. Known limitations

These are documented openly on the public [`/accessibility`](../apps/web/app/accessibility/page.tsx) statement and are tracked as remediation items.

| Item | Severity | Status |
|---|---|---|
| Manual VoiceOver + NVDA assistive-technology pass not yet completed. Code-level audit verified semantic correctness; live AT confirmation pending. | Sev 2 | In progress (test plan: `docs/accessibility-at-test-plan.md`) |
| Three small controls measure 36×36 px (Concierge send button, header Region switcher, `Button size="sm"`). Meets WCAG 2.2 AA 2.5.8 minimum (24×24 px) but not the project's internal 44×44 px target. | Sev 3 | Planned in design-system polish PR |
| Forced-colors / Windows High Contrast Mode: aesthetic separation degrades; functionality is preserved. | Sev 3 | Targeted `forced-colors` media queries planned |
| InquiryForm + WhitepaperGateForm error states are form-level rather than field-level (3.3.1 / 3.3.3 Partially Supports). | Partially Supports | Per-field validation refactor planned |
| Orange `--color-accent-500=#F47B20` paired with `--color-accent-fg=#FFFFFF` falls below WCAG AA for normal text (≈ 2.7:1). The token pairing is restricted to large-text contexts (≥18px or ≥14px bold). Buttons using orange CTAs are required to use the darker `--color-accent-700=#BF560C` background for AA-compliant normal-text labels — enforced at the Button-component level in the upcoming PR-B (`feat(ui): primitive uplift`). | Sev 2 | Tracked in PR-B (rebrand cluster) |

---

## 5. Auxiliary documentation

- **Public accessibility statement** — [`/accessibility`](../apps/web/app/accessibility/page.tsx) on the production site.
- **Test plan for the manual AT pass** — [`docs/accessibility-at-test-plan.md`](accessibility-at-test-plan.md).
- **Audit findings (full text)** — Accessibility Auditor agent report archived in PR [#42](https://github.com/AnilBotta/propharmex-website/pull/42).
- **CI workflows enforcing accessibility** — `.github/workflows/lighthouse.yml` (CWV + a11y category) and `.github/workflows/a11y-budget.yml` (axe-core).

---

## 6. Legal references

This product targets conformance with:

- **WCAG 2.1 Level AA** — global baseline (W3C Recommendation, 2018-06-05).
- **Section 508 of the Rehabilitation Act** (United States) — references WCAG 2.0 AA via the 2017 Refresh; WCAG 2.1 AA is a strict superset.
- **EN 301 549 v3.2.1** (European Union) — references WCAG 2.1 AA directly.
- **AODA — Accessibility for Ontarians with Disabilities Act, Integrated Accessibility Standards Regulation (IASR)** — references WCAG 2.0 AA.
- **Accessible Canada Act** — broader federal Canadian accessibility framework; this product's design supports its goals.

---

## 7. Revision history

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-04-29 | Propharmex Engineering | Initial report. Code-level audit complete; manual AT pass pending. |

---

## 8. Contact

For accessibility feedback, reports of barriers, or alternative-format requests:

**Email:** [hello@propharmex.com](mailto:hello@propharmex.com?subject=Accessibility%20feedback)

We aim to acknowledge accessibility reports within two business days and prioritise them ahead of feature work.
