"use client";

/**
 * SectionReveal — shared client island for hub primitives.
 *
 * Moved from components/pharmdev/ in PR-H' (hub primitives extraction) so
 * the canonical version sits alongside the shared HubHero / HubClosing /
 * CapabilityMatrix components in site/hub/. Other namespace-local
 * SectionReveal copies (about/, quality/, facilities/, analytical/,
 * regulatory/, industries/, case-studies/, insights/, process/, contact/)
 * remain untouched in this PR — that broader consolidation is a separate
 * future refactor.
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
