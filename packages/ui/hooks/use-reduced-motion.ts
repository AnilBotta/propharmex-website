"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Server-safe wrapper around Framer Motion's `useReducedMotion`.
 * Returns `true` when the user has requested reduced motion at the OS level.
 *
 * SSR: Framer returns `null` on the server; we normalize to `false` so the
 * first paint matches the non-reduced branch. The client-side rehydration
 * flip is imperceptible because `prefers-reduced-motion` CSS already
 * cancels transitions globally (see design-tokens.css @layer base).
 */
export function useReducedMotion(): boolean {
  const shouldReduce = useFramerReducedMotion();
  return shouldReduce ?? false;
}
