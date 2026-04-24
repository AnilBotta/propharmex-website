"use client";

/**
 * SectionReveal — client island for /services/regulatory-services.
 *
 * Fourth use of this pattern (after facilities/quality, pharmdev, and
 * analytical). The hoist into packages/ui is tracked as a follow-up task;
 * keeping the duplicate here to preserve PR cadence on Prompt 12.
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
