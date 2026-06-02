# Manual AT Test Results - YYYY-MM-DD

Use this template for each VoiceOver/NVDA assistive-technology session. Save
the completed copy as `docs/accessibility-at-results-YYYY-MM-DD.md`.

Do not mark the manual AT launch item complete until both minimum stacks below
are covered and all Sev 1 and Sev 2 findings are fixed, waived with rationale,
or explicitly accepted by the accessibility owner.

## Session Metadata

| Field                               | Value      |
| ----------------------------------- | ---------- |
| Tester                              |            |
| Session date                        | YYYY-MM-DD |
| Environment URL                     |            |
| macOS / Safari / VoiceOver versions |            |
| Windows / Firefox / NVDA versions   |            |
| Optional mobile AT stack            |            |
| Time spent                          |            |

## Coverage Summary

| Metric                      | Result |
| --------------------------- | ------ |
| URLs covered                | 0/9    |
| VoiceOver pass complete     | No     |
| NVDA pass complete          | No     |
| Browser zoom 200% complete  | No     |
| Browser zoom 400% complete  | No     |
| Forced-colors pass complete | No     |
| Sev 1 findings open         |        |
| Sev 2 findings open         |        |
| Sev 3 findings open         |        |

## URL Coverage

| URL                                                      | VoiceOver | NVDA    | Keyboard only | Zoom/reflow | Forced colors | Notes |
| -------------------------------------------------------- | --------- | ------- | ------------- | ----------- | ------------- | ----- |
| `/`                                                      | Not run   | Not run | Not run       | Not run     | Not run       |       |
| `/why-propharmex`                                        | Not run   | Not run | Not run       | Not run     | Not run       |       |
| `/quality-compliance`                                    | Not run   | Not run | Not run       | Not run     | Not run       |       |
| `/services/pharmaceutical-development/solid-oral-dosage` | Not run   | Not run | Not run       | Not run     | Not run       |       |
| `/insights/ich-q2-r2-method-validation-2024`             | Not run   | Not run | Not run       | Not run     | Not run       |       |
| `/case-studies`                                          | Not run   | Not run | Not run       | Not run     | Not run       |       |
| `/contact`                                               | Not run   | Not run | Not run       | Not run     | Not run       |       |
| `/ai/del-readiness`                                      | Not run   | Not run | Not run       | Not run     | Not run       |       |
| `/accessibility`                                         | Not run   | Not run | Not run       | Not run     | Not run       |       |

Whitepaper-gate coverage remains blocked while `INSIGHTS.whitepapers` is empty.
Add the first live `/insights/whitepapers/[slug]` URL here when editorial
publishes an approved whitepaper.

## Findings

Severity guide:

- Sev 1: blocks task completion, creates a keyboard trap, hides required
  information from assistive technology, or prevents form/tool completion.
- Sev 2: materially impairs use but has a practical workaround.
- Sev 3: polish, clarity, or cosmetic degradation that does not block use.

| ID             | URL | Stack | Severity | WCAG SC | Description | Recommended fix | Owner | Status |
| -------------- | --- | ----- | -------- | ------- | ----------- | --------------- | ----- | ------ |
| AT-YYYYMMDD-01 |     |       |          |         |             |                 |       | Open   |

## Confirmed Existing Items

Use this table to confirm whether previously tracked accessibility risks are
still reproducible.

| Item                                                 | Status                     | Evidence / notes |
| ---------------------------------------------------- | -------------------------- | ---------------- |
| Manual VoiceOver + NVDA pass                         | Pending                    |                  |
| Whitepaper-gate scan blocked while registry is empty | Confirmed / Not applicable |                  |
| Forced-colors visual degradation does not block use  | Pending                    |                  |

## Lighthouse Promotion Decision

| Assertion                  | Current setting  | Recommended setting | Decision basis                                                                  |
| -------------------------- | ---------------- | ------------------- | ------------------------------------------------------------------------------- |
| `categories:accessibility` | `warn` at `0.95` | `error` at `1.0`    | Leave pending until both VoiceOver and NVDA pass with no open Sev 1/2 findings. |

## Sign-Off

| Role                | Name | Date | Decision |
| ------------------- | ---- | ---- | -------- |
| Accessibility owner |      |      | Pending  |
| Engineering owner   |      |      | Pending  |

## Follow-Up Actions

| Action | Owner | Due date | Status |
| ------ | ----- | -------- | ------ |
|        |       |          | Open   |
