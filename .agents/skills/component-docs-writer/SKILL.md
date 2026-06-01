---
name: component-docs-writer
description: For every shadcn/Framer component in packages/ui/components/, generates a docs/design-system.mdx entry covering anatomy, states, a11y notes, token usage, props table, example code, and Storybook/Ladle link.
when_to_use: Prompt 2 (design system build) for the initial pass, then whenever a new component is added to packages/ui/ or an existing component's API changes. Also invoked by design:design-system when it extends the system.
---

# Component Docs Writer

Creates a single canonical entry per UI component so designers, developers, and AI agents all have the same contract to follow.

## Output location

`docs/design-system/components/<ComponentName>.mdx` — one file per component, aggregated into `docs/design-system.mdx` (TOC + overview).

## Entry template

Each .mdx file follows this structure (sections in this order):

1. **Frontmatter** — name, category (primitive | composite | layout | motion), tags, status (stable | beta | deprecated)
2. **Purpose** — one paragraph, written for a non-designer engineer
3. **Anatomy** — SVG or ASCII diagram of parts + labeled slots
4. **Props** — table with column per prop: name, type, default, required, description
5. **States** — visual table: default, hover, focus-visible, active, disabled, loading, error, empty. Each state with a code snippet and a screenshot slot `![state](../screenshots/<component>/<state>.png)`
6. **Design tokens used** — explicit list linking to `packages/config/design-tokens.css` (colors, spacing, radii, shadows, motion)
7. **Accessibility** — keyboard map, ARIA roles/attrs, screen-reader announcements, reduced-motion behavior, touch target size, color-contrast pairings verified
8. **Motion** — if animated, the `animation-choreographer` storyboard snippet; reduced-motion fallback; perf notes
9. **Responsive** — breakpoints where layout changes; min/max touch targets; mobile-specific variants
10. **Examples** — 3 examples: minimal, common real use, edge case
11. **Do / Don't** — 3 pairs with short explanations
12. **Related** — links to related components (Button ↔ IconButton ↔ LinkButton, Dialog ↔ Sheet ↔ Tooltip)
13. **Changelog** — semver-aligned breaking/additive changes
14. **Storybook/Ladle link** — `<StorybookLink id="components-<name>" />`

## Auto-derivation rules

- Props table: parsed from the component's TS interface via `react-docgen-typescript`
- Tokens used: grep the component for `var(--*)` and `className="[token]"` patterns
- States: inspect for `data-state` attrs, `:hover/:focus-visible` class modifiers
- Motion: pull from `packages/ui/motion/<component>.ts` if present
- Screenshots: run Playwright against Storybook, snapshot each state, write to the screenshots dir (used by Evidence Collector)

## Quality gate

A component is only "done" when its .mdx file:
- Passes `mdx-lint`
- Has ≥ 1 screenshot per documented state
- Has an a11y section with explicit keyboard map
- Has been viewed in the running Storybook by the user and acknowledged

## Glue code

- Auto-imported into the Ladle/Storybook `.story.tsx` so the docs render next to the component
- Indexed in `docs/design-system.mdx` TOC, ordered by category
- Cross-linked from the Sanity visual-editing panel where a matching section/block references the component

## When to skip

- Internal helpers that aren't exported from `packages/ui` — these don't need public docs, only JSDoc comments
- Headless hooks — documented in `docs/design-system/hooks.mdx` instead, same template minus the "Anatomy" section

## Hand-offs

- Chains into `design:design-handoff` — the docs produced here are the authoritative handoff input
- Chains into `design:accessibility-review` — a11y section is the spec the review verifies against
