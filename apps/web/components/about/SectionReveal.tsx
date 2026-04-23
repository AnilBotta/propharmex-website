"use client";

/**
 * SectionReveal — small client island used by every /about section to wrap
 * staggered content in a fade/rise. Mirrors ChapterReveal (Prompt 6) so the
 * motion language is identical across narrative and structured pages.
 */
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

type Props = {
  children: ReactNode;
  className?: string;
};

export function SectionReveal({ children, className }: Props) {
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
