---
name: animation-choreographer
description: Proposes Framer Motion timelines for a given section — enter/exit curves, stagger, scroll-trigger, viewport-once, useReducedMotion fallbacks — emits ready-to-paste component snippets tied to the design-system motion tokens.
when_to_use: Any time a new section, page, or component is being built (Prompts 2, 5, 6, 7, 8, 10, 11, 12, 14, 15, 16). Invoked immediately after the copy + layout are agreed and before the implementation is handed to the Frontend Developer agent.
---

# Animation Choreographer

## Motion tokens (from master plan — do not override)

- Enter: `240ms ease-out` (`cubicBezier(0.16, 1, 0.3, 1)` — "smooth out")
- Exit: `180ms ease-in` (`cubicBezier(0.7, 0, 0.84, 0)`)
- Stagger: `40ms` between children
- Scroll threshold: 15% of element visible
- Honor `prefers-reduced-motion: reduce` — fall back to fade-only or no motion

Exported as constants in `packages/ui/motion/tokens.ts`:

```ts
export const MOTION = {
  enter: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
  exit: { duration: 0.18, ease: [0.7, 0, 0.84, 0] },
  stagger: 0.04,
  viewport: { once: true, margin: '0px 0px -15% 0px' },
} as const;
```

## What this skill produces

For a given section brief, returns:

1. **Narrative** (1 paragraph) — what the eye should do: where it lands first, where it goes next, what's incidental
2. **Storyboard** — beat-by-beat list, each with timing, element, transform, and reason
3. **Component snippets** — Framer Motion JSX using `MOTION` tokens + `useReducedMotion` hook
4. **Performance notes** — what needs `will-change`, what needs to run on compositor-only props (transform/opacity), what's too heavy for mobile
5. **A11y notes** — reduced-motion fallback, focus behavior during entrance, announce hint (if dynamic content)

## Patterns by section type

| Section | Pattern |
|---|---|
| Hero | Headline fade+rise, subhead stagger, CTA stagger, background art parallax (`useScroll` + `useTransform`), limited to 1 transform layer on mobile |
| Pillars / card grid | `staggerChildren: 0.04` with `AnimatePresence` and `layout` off |
| Scroll-pinned stepper (Process) | `motion.div` with `sticky` + scroll-driven `useScroll({ container })` mapping to horizontal X; on mobile degrade to vertical timeline with per-step `whileInView` |
| Stats strip | Number count-up with `useMotionValue` + spring; stop when tab is hidden (page visibility API) |
| Logo wall / marquee | CSS animation only (cheaper, no JS); pause on hover via `animation-play-state` |
| Case study carousel | `useDragControls` with snap points; keyboard arrows + focus trap; reduced-motion → no drag, cross-fade |
| Molecule / world-map connector | Lottie preferred over WebGL for the two-hub (Mississauga ↔ Hyderabad) connector (smaller, a11y-friendlier, loads faster); WebGL only if the master plan's "animated molecule/lab scene" needs >60fps complexity |
| FAQ accordion | Height animation with `layout` + `AnimatePresence` on the answer; chevron rotate ease-out |

## Reduced-motion fallbacks (mandatory)

Every variant includes both. Pattern:

```tsx
const prefersReduced = useReducedMotion();
const enter = prefersReduced
  ? { opacity: [0, 1] }
  : { opacity: [0, 1], y: [16, 0] };
```

For scroll-driven transforms, the reduced-motion version pins the element in its final state on mount and skips the scroll listener entirely.

## Guardrails

- Never animate `top/left/width/height/box-shadow/filter` when `transform/opacity` will do
- Never run a heavy transform on >50 elements simultaneously — delegate to CSS or virtualize
- Always `viewport={{ once: true }}` on non-critical entrance animations — don't retrigger on scroll-back
- Never autoplay a Lottie that's >300KB on mobile without `IntersectionObserver` gating
- Never block interactivity with `pointer-events: none` longer than 180ms after enter
- Match INP budget: keep JS-driven animations under ~16ms per frame on mid-tier Android

## Output shape

```md
### Storyboard
1. [0ms–240ms] Headline fades + rises 16px
2. [40ms–280ms] Subhead follows
...

### Snippets
```tsx
/* packages/ui/motion/HeroEntrance.tsx */
...
```

### Perf + a11y
- LCP risk: headline is below-the-fold art-loaded first, consider...
- Reduced-motion: ...
```

## Hand-offs

- Chains into `component-docs-writer` so motion anatomy is captured in the design-system docs
- Chains into `lighthouse-budget-guard` if estimated JS delta > 5KB
