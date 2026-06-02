# Manual Assistive-Technology Test Plan

Companion document to [`docs/accessibility-conformance.md`](accessibility-conformance.md). The code-level WCAG 2.1 AA audit by the Accessibility Auditor agent verified semantic correctness. This plan is the human-in-the-loop confirmation of the same surfaces under real assistive technology.

> **Status:** Pending. Copy
> [`docs/accessibility-at-results-template.md`](accessibility-at-results-template.md)
> to `docs/accessibility-at-results-YYYY-MM-DD.md` for each session. Findings
> are merged back into §3 of the ACR after the accessibility owner signs off.

---

## 1. Tools

| Stack         | OS          | Browser        | Screen reader |
| ------------- | ----------- | -------------- | ------------- |
| **Primary**   | macOS 14+   | Safari latest  | VoiceOver     |
| **Secondary** | Windows 11  | Firefox latest | NVDA latest   |
| **Optional**  | iOS 17+     | Safari         | VoiceOver iOS |
| **Optional**  | Android 14+ | Chrome         | TalkBack      |

The primary + secondary pair is the minimum to claim coverage. The two AT engines treat the same ARIA semantics differently in practice; testing on both surfaces real bugs that pass either engine alone.

Browser zoom test: Chromium, 200% then 400%, on a 1280×800 viewport.

Forced-colors test: Windows High Contrast Mode (Settings → Accessibility → Contrast themes → Aquatic).

---

## 2. URLs to cover

Same set as Lighthouse CI + a11y axe-core CI, mapped to the audit's six representative templates.

| URL                                                      | Template                  |
| -------------------------------------------------------- | ------------------------- |
| `/`                                                      | Home                      |
| `/why-propharmex`                                        | Long-form narrative       |
| `/quality-compliance`                                    | Trust page                |
| `/services/pharmaceutical-development/solid-oral-dosage` | Services leaf             |
| `/insights/ich-q2-r2-method-validation-2024`             | Insight article           |
| `/insights/whitepapers/analytical-method-validation-readiness-ich-q2-r2` | Whitepaper gate           |
| `/case-studies`                                          | Case studies hub          |
| `/contact`                                               | Form + Cal.com embed      |
| `/ai/del-readiness`                                      | AI tool — multi-step form |
| `/accessibility`                                         | Conformance statement     |

Whitepaper-gate coverage is active for the live ICH Q2(R2) analytical-method readiness briefing. Record the manual form-validation and success-state observations in the results doc after staging is available.

---

## 3. Test scripts (per URL)

For each URL, run all six checklists below. Record findings in the results doc.

### 3.1 Page entry & landmarks

- [ ] `Cmd+Option+U` (VoiceOver Rotor) / `Insert+F7` (NVDA Elements list) — confirm landmarks: `banner`, `main`, `contentinfo` exist and are uniquely named.
- [ ] First Tab key press lands on **Skip to content**. Pressing Enter jumps focus to `<main>`.
- [ ] Heading levels announce in order — no h1 → h3 jumps, no missing h1.

### 3.2 Keyboard-only navigation

- [ ] Tab through every interactive element in DOM order.
- [ ] Visible focus indicator on every focusable element (no transparent rings, no `outline: none` without a visible replacement).
- [ ] Esc closes the Header mega-menu, the mobile Sheet, and the Concierge panel.
- [ ] Cal.com embed (on `/contact`) is reachable; iframe is not a focus trap.

### 3.3 Screen reader semantics

- [ ] All icon-only buttons announce a meaningful label (`aria-label` or visible `sr-only` text).
- [ ] Required form fields announce "required" before the user attempts to submit.
- [ ] Form-field hint text is read after the label when the input gets focus (verifies the `aria-describedby` plumbing from PR #42 S1-2).
- [ ] Form errors are announced when they appear (live region or focus management).
- [ ] Form success states are announced (verifies S2-6 fix — Newsletter and Whitepaper success Callouts wrapped in `role="status"`).

### 3.4 AI tool flows (deep-dive)

For `/ai/del-readiness`:

- [ ] The fieldset legend reads "Step 3 of 8, [question prompt]" as the group label (verifies S3-8 fix).
- [ ] Radio options announce as a group; arrow keys move between options.
- [ ] Submit button announces correctly. After submit, the assessment result region is announced (live region).
- [ ] PDF download link announces and downloads cleanly.
- [ ] "Re-take" returns focus to the first question.

For Concierge (open via the bubble on any page):

- [ ] Bubble announces "Open chat" / "Close chat" depending on state. **No icon-swap announcement when toggling** (verifies S2-4 fix).
- [ ] When the panel opens, focus lands on the message composer.
- [ ] User-typed messages echo into the visible message list and are NOT read out as they're typed.
- [ ] Assistant streaming responses announce naturally via the `aria-live` region scoped to the message list.
- [ ] Closing the panel returns focus to the launcher button.

### 3.5 Color & contrast

- [ ] In DevTools → Inspector → Accessibility → Contrast: spot-check the warn pill on `/ai/del-readiness` (TrafficLight). Should now compute ≥ 4.5:1 (verifies S1-1).
- [ ] Spot-check muted text (`/insights` card metadata, `/about` body copy). ≥ 4.5:1.
- [ ] Visit `/contact` and run an automated check via the **axe DevTools** extension; expect zero contrast violations.

### 3.6 Reflow & forced-colors

- [ ] At 200% browser zoom, every page renders without horizontal scroll on a 1280-wide viewport.
- [ ] At 400% browser zoom, content reflows; the Header mega-menu collapses to the mobile Sheet at the appropriate breakpoint.
- [ ] In Windows High Contrast Mode, every interactive element retains a visible outline. **Document any visual degradation** — function MUST work; aesthetic separation is allowed to degrade per the documented limitation.

---

## 4. Recording findings

Copy [`docs/accessibility-at-results-template.md`](accessibility-at-results-template.md)
to `docs/accessibility-at-results-YYYY-MM-DD.md`, then complete every table in
the copied file. The required summary fields are:

- Session metadata, including exact screen reader, browser, and OS versions.
- URL coverage across VoiceOver, NVDA, keyboard-only, zoom/reflow, and
  forced-colors checks.
- Open Sev 1, Sev 2, and Sev 3 findings.
- A Lighthouse `categories:accessibility` promotion decision.
- Accessibility-owner and engineering-owner sign-off.

Append the results-doc filename to §2 of the ACR's evaluation methods table,
update §4 if limitations change, and update §7 (revision history).

---

## 5. Cadence

- **Initial pass:** before declaring WCAG 2.1 AA conformance for v1.0.0 launch.
- **Quarterly re-pass:** every three months thereafter, or after any material change to interactive surfaces (forms, AI tools, navigation).
- **Triggered re-pass:** any incident where a customer reports an accessibility barrier.

---

## 6. Limitations of automated testing

This plan exists because Lighthouse + axe-core catch only ~30–40% of WCAG 2.1 AA failures. Automated tools can verify markup but not:

- Whether form errors are announced _meaningfully_
- Whether keyboard focus order is _logical_ (vs. just present)
- Whether ARIA labels match user mental models
- Whether reading order is _coherent_
- Whether the experience is _usable_ — distinct from compliant

Manual AT is not optional for an AA conformance claim.
