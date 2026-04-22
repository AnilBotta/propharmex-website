---
name: lighthouse-budget-guard
description: Reads Lighthouse CI and Next.js bundle-analyzer output and fails the build if Core Web Vitals budgets or JS-per-route budgets are exceeded. Produces a ranked remediation list.
when_to_use: On every CI run (wired into .github/workflows/ci.yml), before every Vercel production deploy, and any time the user asks "why is the site slow?" or "is this page fast enough?". Also invoked by the Performance Benchmarker sub-agent.
---

# Lighthouse Budget Guard

## Budgets (from master plan, non-negotiable)

| Metric | Budget | Source |
|---|---|---|
| LCP (mobile, 4G) | ≤ 2.0s | Master plan |
| CLS | ≤ 0.05 | Master plan |
| INP | ≤ 200ms | Master plan |
| Lighthouse Performance | ≥ 95 (mobile) | DoD Appendix B |
| Lighthouse SEO | = 100 | DoD Appendix B |
| Lighthouse Best Practices | = 100 | DoD Appendix B |
| Lighthouse Accessibility | = 100 | DoD Appendix B |
| First-load JS per route (mobile) | ≤ 150KB gzip | Master plan |
| Total page weight (home) | ≤ 900KB uncompressed | CWV practical |
| Hero image LCP | ≤ 1.4s | Sub-target |

## Inputs

1. Lighthouse CI JSON report path (`.lighthouseci/lhr-*.json`)
2. `next build` output (for per-route First Load JS)
3. Optional: Chrome DevTools trace for INP drill-down

## Process

1. Parse every audit LH runs
2. Extract the metrics above per URL
3. Compare against budgets
4. For any failure, drill down:
   - LCP fail → surface the LCP element, its size, its discovery time, and preload suggestions
   - CLS fail → surface the layout-shift source nodes (fonts without `size-adjust`? images without `width/height`?)
   - INP fail → point at the slowest interaction and the long task that blocked it
   - JS budget fail → largest imports per route via `next/bundle-analyzer` treemap; suggest dynamic imports
   - A11y < 100 → list axe violations with severities
   - SEO < 100 → list failing audits (missing meta, canonical, hreflang…)
5. Produce a remediation list ranked by impact/effort:
   - `HIGH impact, LOW effort` → fix immediately
   - `HIGH impact, HIGH effort` → ticket for next sprint
   - `LOW impact, LOW effort` → batch weekly
6. Exit non-zero in CI if any budget fails (except explicitly waived ones via `.lhci-allowlist.json`)

## Standard remediations Claude should suggest

- Hero image: `priority`, `fetchPriority="high"`, AVIF, responsive `sizes`, blur placeholder
- Fonts: `next/font` with `display: swap` and `size-adjust` to reduce CLS
- Above-the-fold images always have explicit `width`/`height`
- Dynamic-import any component > 30KB gzip that's below-the-fold
- Replace Framer Motion imports with `motion/react` direct imports to reduce bundle
- Use `next/script strategy="afterInteractive"` for Plausible + PostHog
- Defer Sentry browser init until after LCP
- For Sanity Studio assets: use Sanity CDN `?w=...&auto=format` sizing
- For the Concierge chatbot bubble: lazy-load on first user interaction (click, scroll to near end), not on mount

## Output

- Markdown report with pass/fail per URL × metric
- A `docs/perf-report-YYYY-MM-DD.md` snapshot committed post-deploy
- A JSON artifact for the PR comment bot to consume

## Integration points

- GitHub Actions: `lhci autorun` with `budgets.json` + this skill as post-process
- Vercel Check: fails the deployment preview if budget miss on production branch
- Weekly schedule: `mcp__scheduled-tasks__create_scheduled_task` runs a real-device simulated audit every Monday 07:00 UTC, posts to `#perf-reports`
