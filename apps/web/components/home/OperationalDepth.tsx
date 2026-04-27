"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

import type { OperatingColumn, OperationalDepthSection } from "../../content/home";

type Props = { content: OperationalDepthSection };

/**
 * OperationalDepth — homepage section, two-column "anchor + depth" frame.
 *
 * Replaces the prior CanadaIndiaAdvantage / two-hub framing per the
 * Canadian-anchored positioning lexicon (docs/positioning-canadian-anchor.md).
 * The first column is the regulatory anchor (Mississauga DEL site); the
 * second column is the development depth (no site named on this surface).
 * The earlier WorldArc visualization (Mississauga → Hyderabad) has been
 * retired — the geography is no longer the headline.
 */
export function OperationalDepth({ content }: Props) {
  const reduce = useReducedMotion();
  const [anchor, depth] = content.columns;

  return (
    <section
      aria-labelledby="home-operational-depth-heading"
      className="bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="home-operational-depth-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.subhead}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <OperatingCard column={anchor} reduce={reduce} />
          <OperatingCard column={depth} reduce={reduce} />
        </div>
      </div>
    </section>
  );
}

function OperatingCard({
  column,
  reduce,
}: {
  column: OperatingColumn;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : "initial"}
      whileInView="animate"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={staggerContainer}
    >
      <motion.div
        variants={fadeRise}
        className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs text-[var(--color-muted)]"
      >
        <span>{column.sublabel}</span>
      </motion.div>

      <motion.h3
        variants={fadeRise}
        className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)]"
      >
        {column.label}
      </motion.h3>

      <motion.p
        variants={fadeRise}
        className="mt-1 text-sm text-[var(--color-primary-700)]"
      >
        {column.role}
      </motion.p>

      <motion.ul variants={staggerContainer} className="mt-5 flex flex-col gap-3">
        {column.capabilities.map((c) => (
          <motion.li
            key={c}
            variants={fadeRise}
            className="flex gap-3 text-sm leading-relaxed text-[var(--color-slate-800)]"
          >
            <Check
              size={16}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-[var(--color-primary-700)]"
            />
            <span>{c}</span>
          </motion.li>
        ))}
      </motion.ul>

      <motion.p
        variants={fadeRise}
        className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-slate-50)] p-3 text-xs leading-relaxed text-[var(--color-muted)]"
      >
        {column.certificationNote}
      </motion.p>
    </motion.div>
  );
}
