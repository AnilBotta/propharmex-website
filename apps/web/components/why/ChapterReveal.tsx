"use client";

/**
 * ChapterReveal — client island.
 *
 * Wraps a chapter's body + stats + support callout in a staggered fade/rise
 * timed to when the chapter scrolls into view. Honors `useReducedMotion` —
 * when reduced is preferred, children render with no initial offset and no
 * transition so the server render matches the client render.
 *
 * One wrapper per chapter. No scroll listeners — Framer's `whileInView` uses
 * IntersectionObserver internally.
 */
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

type Props = {
  children: ReactNode;
  className?: string;
};

export function ChapterReveal({ children, className }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : "initial"}
      whileInView="animate"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={staggerContainer}
    >
      <motion.div variants={fadeRise}>{children}</motion.div>
    </motion.div>
  );
}
