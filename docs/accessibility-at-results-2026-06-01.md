# Manual AT Test Results - 2026-06-01

This file records the Windows browser automation support pass run from the
local Propharmex workspace. It is **not** a completed Manual VoiceOver + NVDA
pass because NVDA was not installed/running on this Windows machine, and
VoiceOver is macOS-only.

## Session Metadata

| Field                               | Value                                            |
| ----------------------------------- | ------------------------------------------------ |
| Tester                              | Codex browser automation                         |
| Session date                        | 2026-06-01                                       |
| Environment URL                     | `http://127.0.0.1:3000`                          |
| macOS / Safari / VoiceOver versions | Not run - requires macOS with VoiceOver          |
| Windows / Firefox / NVDA versions   | Not run - NVDA command/process not found locally |
| Optional mobile AT stack            | Not run                                          |
| Time spent                          | Automated support pass                           |

## Coverage Summary

| Metric                      | Result                                              |
| --------------------------- | --------------------------------------------------- |
| URLs covered                | 9/9 for keyboard/landmark smoke; 11/11 for axe scan |
| VoiceOver pass complete     | No                                                  |
| NVDA pass complete          | No                                                  |
| Browser zoom 200% complete  | No                                                  |
| Browser zoom 400% complete  | No                                                  |
| Forced-colors pass complete | No                                                  |
| Sev 1 findings open         | Not evaluated by manual AT                          |
| Sev 2 findings open         | Not evaluated by manual AT                          |
| Sev 3 findings open         | Not evaluated by manual AT                          |

## URL Coverage

| URL                                                      | VoiceOver | NVDA    | Keyboard only        | Zoom/reflow | Forced colors | Notes                                                                                                 |
| -------------------------------------------------------- | --------- | ------- | -------------------- | ----------- | ------------- | ----------------------------------------------------------------------------------------------------- |
| `/`                                                      | Not run   | Not run | Automated smoke pass | Not run     | Not run       | Loaded 200; skip link first; banner/main/contentinfo present; axe clean                               |
| `/why-propharmex`                                        | Not run   | Not run | Automated smoke pass | Not run     | Not run       | Loaded 200; skip link first; main/contentinfo present; axe clean                                      |
| `/quality-compliance`                                    | Not run   | Not run | Automated smoke pass | Not run     | Not run       | Loaded 200; skip link first; main/contentinfo present; axe clean                                      |
| `/services/pharmaceutical-development/solid-oral-dosage` | Not run   | Not run | Automated smoke pass | Not run     | Not run       | Loaded 200; skip link first; main/contentinfo present; axe clean                                      |
| `/insights/ich-q2-r2-method-validation-2024`             | Not run   | Not run | Automated smoke pass | Not run     | Not run       | Loaded 200; skip link first; main present; axe clean                                                  |
| `/case-studies`                                          | Not run   | Not run | Automated smoke pass | Not run     | Not run       | Loaded 200; skip link first; main/contentinfo present; axe clean                                      |
| `/contact`                                               | Not run   | Not run | Automated smoke pass | Not run     | Not run       | Loaded 200; skip link first; main/contentinfo present; axe clean                                      |
| `/ai/del-readiness`                                      | Not run   | Not run | Automated smoke pass | Not run     | Not run       | Loaded 200; skip link first; main/contentinfo present; first radio + Next button reachable; axe clean |
| `/accessibility`                                         | Not run   | Not run | Automated smoke pass | Not run     | Not run       | Loaded 200; skip link first; main/contentinfo present; axe clean                                      |

Whitepaper-gate coverage remains blocked while `INSIGHTS.whitepapers` is empty.

## Findings

| ID                               | URL              | Stack                          | Severity | WCAG SC | Description                                                                                      | Recommended fix                                                                                  | Owner               | Status |
| -------------------------------- | ---------------- | ------------------------------ | -------- | ------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------- | ------ |
| None from automated support pass | All covered URLs | Playwright Chromium + axe-core | N/A      | N/A     | No serious or critical axe findings were found. Manual screen-reader behavior was not evaluated. | Complete real VoiceOver and NVDA pass before promoting Lighthouse accessibility to strict error. | Accessibility owner | Open   |

## Confirmed Existing Items

| Item                                                 | Status    | Evidence / notes                                                                   |
| ---------------------------------------------------- | --------- | ---------------------------------------------------------------------------------- |
| Manual VoiceOver + NVDA pass                         | Pending   | Not completed; no NVDA installation/process detected, and VoiceOver requires macOS |
| Whitepaper-gate scan blocked while registry is empty | Confirmed | `INSIGHTS.whitepapers` remains empty                                               |
| Forced-colors visual degradation does not block use  | Pending   | Not tested in Windows High Contrast Mode                                           |

## Lighthouse Promotion Decision

| Assertion                  | Current setting  | Recommended setting | Decision basis                                                                        |
| -------------------------- | ---------------- | ------------------- | ------------------------------------------------------------------------------------- |
| `categories:accessibility` | `warn` at `0.95` | Keep as `warn`      | Automated support pass was clean, but VoiceOver and NVDA are still not countersigned. |

## Sign-Off

| Role                | Name | Date | Decision |
| ------------------- | ---- | ---- | -------- |
| Accessibility owner |      |      | Pending  |
| Engineering owner   |      |      | Pending  |

## Follow-Up Actions

| Action                                                           | Owner               | Due date | Status |
| ---------------------------------------------------------------- | ------------------- | -------- | ------ |
| Run VoiceOver on macOS Safari against the 9 listed URLs          | Accessibility owner |          | Open   |
| Run NVDA on Windows Firefox against the 9 listed URLs            | Accessibility owner |          | Open   |
| Run browser zoom 200%/400% and Windows High Contrast Mode checks | Accessibility owner |          | Open   |
