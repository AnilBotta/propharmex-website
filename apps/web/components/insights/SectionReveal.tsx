"use client";

/**
 * SectionReveal — client island for /insights.
 *
 * Seventh use of this pattern (after facilities/quality, pharmdev, analytical,
 * regulatory, industries, case-studies). The hoist into packages/ui remains
 * a tracked follow-up; keeping the duplicate here to preserve PR cadence on
 * Prompt 15.
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
