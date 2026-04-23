"use client";

import { motion } from "framer-motion";
import { Check, MapPin } from "lucide-react";

import { MOTION, fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

import type { CanadaIndiaSection, HubColumn } from "../../content/home";

type Props = { content: CanadaIndiaSection };

export function CanadaIndiaAdvantage({ content }: Props) {
  const reduce = useReducedMotion();
  const [canada, india] = content.columns;

  return (
    <section
      aria-labelledby="home-bridge-heading"
      className="bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="home-bridge-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.subhead}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
          <HubCard column={canada} align="left" reduce={reduce} />
          <div className="relative hidden lg:flex lg:h-full lg:items-center lg:justify-center">
            <WorldArcSvg reduce={reduce} />
          </div>
          <HubCard column={india} align="right" reduce={reduce} />
        </div>
      </div>
    </section>
  );
}

function HubCard({
  column,
  align,
  reduce,
}: {
  column: HubColumn;
  align: "left" | "right";
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : "initial"}
      whileInView="animate"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={staggerContainer}
      className={align === "right" ? "lg:text-left" : "lg:text-left"}
    >
      <motion.div
        variants={fadeRise}
        className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs text-[var(--color-muted)]"
      >
        <MapPin size={13} aria-hidden="true" />
        <span>
          {column.city}, {column.country}
        </span>
      </motion.div>

      <motion.h3
        variants={fadeRise}
        className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)]"
      >
        {column.city}
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

/* -------------------------------------------------------------------------- */
/*  Simplified 2-continent arc — far under 5KB.                               */
/* -------------------------------------------------------------------------- */

function WorldArcSvg({ reduce }: { reduce: boolean }) {
  return (
    <svg
      viewBox="0 0 200 280"
      role="img"
      aria-label="Route indicator — Mississauga to Hyderabad."
      className="h-full max-h-[320px] w-[120px]"
    >
      <line
        x1="100"
        y1="20"
        x2="100"
        y2="260"
        stroke="var(--color-border)"
        strokeWidth={1}
        strokeDasharray="3 4"
      />
      <motion.path
        d="M 100 36 C 30 100, 30 180, 100 244"
        fill="none"
        stroke="var(--color-primary-600)"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 1.2, ease: MOTION.enter.ease }}
      />
      <circle cx="100" cy="36" r="6" fill="var(--color-primary-700)" />
      <circle cx="100" cy="36" r="10" fill="var(--color-primary-600)" fillOpacity={0.18} />
      <circle cx="100" cy="244" r="6" fill="var(--color-primary-700)" />
      <circle cx="100" cy="244" r="10" fill="var(--color-primary-600)" fillOpacity={0.18} />
      <text
        x="100"
        y="18"
        textAnchor="middle"
        className="fill-[var(--color-muted)]"
        style={{ fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase" }}
      >
        CA
      </text>
      <text
        x="100"
        y="275"
        textAnchor="middle"
        className="fill-[var(--color-muted)]"
        style={{ fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase" }}
      >
        IN
      </text>
    </svg>
  );
}
