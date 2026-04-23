/**
 * Framer Motion token bindings for the Propharmex design system.
 * Values mirror `packages/config/design-tokens.css` --duration-* + --ease-*.
 *
 * Consumers:
 *   import { MOTION } from "@propharmex/ui/motion/tokens";
 *   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={MOTION.enter} />
 */

export const MOTION = {
  /** 240ms ease-out — standard entering transition. */
  enter: {
    duration: 0.24,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
  /** 180ms ease-in — faster exits (reduce visual noise). */
  exit: {
    duration: 0.18,
    ease: [0.7, 0, 0.84, 0] as [number, number, number, number],
  },
  /** 40ms stagger between siblings in a container. */
  stagger: 0.04,
  /** Default viewport trigger for scroll-linked animations. */
  viewport: { once: true, margin: "0px 0px -15% 0px" },
  /** Spring preset for interactive affordances (buttons, toggles). */
  spring: { type: "spring" as const, stiffness: 340, damping: 28, mass: 0.9 },
} as const;

export type MotionToken = typeof MOTION;

/**
 * Variant helper: fade + 8px rise, commonly used for cards and hero copy.
 * Respects reduced-motion automatically when wrapped by `useReducedMotion`.
 */
export const fadeRise = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: MOTION.enter,
} as const;

/** Staggered children container. Pair with `fadeRise` item variants. */
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: MOTION.stagger,
      delayChildren: 0.05,
    },
  },
} as const;
