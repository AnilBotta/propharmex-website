"use client";

/**
 * SectionReveal — client island for /facilities sections.
 *
 * Mirrors the about and quality versions. A shared primitive will move to
 * packages/ui once we have three+ copies; for now keep it local so each
 * section can evolve its reveal timing without a cross-cutting change.
 */
import type { ReactNode } from "react";

import { motion } from "framer-motion";

import { fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

type Props = { children: ReactNode; className?: string };

export function SectionReveal({ children, className }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : "initial"}
      whileInView="animate"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={staggerContainer}
      className={className}
    >
      <motion.div variants={fadeRise}>{children}</motion.div>
    </motion.div>
  );
}
