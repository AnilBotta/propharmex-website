"use client";

import { motion } from "framer-motion";

import { MOTION, staggerContainer, useReducedMotion } from "@propharmex/ui";

export interface PathwayNode {
  label: string;
  detail: string;
}

interface Props {
  eyebrow: string;
  heading: string;
  nodes: PathwayNode[];
  summaryLabel: string;
  summary: string;
  tone?: "services" | "ai";
}

const pathMotion = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.1, ease: MOTION.enter.ease, delay: 0.12 },
  },
};

const pulseMotion = {
  animate: {
    scale: [1, 1.16, 1],
    opacity: [0.72, 1, 0.72],
    transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
  },
};

const softRise = {
  initial: { opacity: 0.88, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: MOTION.enter,
} as const;

export function ScientificPathwayVisual({
  eyebrow,
  heading,
  nodes,
  summaryLabel,
  summary,
  tone = "services",
}: Props) {
  const reduce = useReducedMotion();
  const accent = tone === "ai" ? "var(--color-green-600)" : "var(--color-primary-700)";

  return (
    <motion.div
      initial={reduce ? false : "initial"}
      whileInView="animate"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={staggerContainer}
      className="relative min-h-[390px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-slate-50))] p-5 shadow-[var(--shadow-lg)] sm:p-6"
    >
      <div
        className="absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
        aria-hidden="true"
      />

      <motion.div variants={softRise} className="relative z-10 max-w-sm">
        <p className="font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
          {eyebrow}
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold leading-tight text-[var(--color-fg)]">
          {heading}
        </p>
      </motion.div>

      <svg
        aria-hidden="true"
        viewBox="0 0 640 310"
        className="absolute inset-x-0 top-20 h-[300px] w-full"
      >
        <defs>
          <linearGradient id={`pathway-${tone}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--color-primary-300)" />
            <stop offset="52%" stopColor={accent} />
            <stop offset="100%" stopColor="var(--color-green-500)" />
          </linearGradient>
        </defs>
        <motion.path
          d="M55 172 C150 72 235 244 325 146 C412 52 486 196 585 96"
          fill="none"
          stroke={`url(#pathway-${tone})`}
          strokeLinecap="round"
          strokeWidth="3"
          variants={reduce ? undefined : pathMotion}
          initial={reduce ? undefined : "initial"}
          animate={reduce ? undefined : "animate"}
        />
        {[55, 205, 355, 505].map((x, index) => (
          <motion.g
            key={x}
            animate={reduce ? undefined : pulseMotion.animate}
            transition={
              reduce ? undefined : { ...pulseMotion.animate.transition, delay: index * 0.18 }
            }
          >
            <circle
              cx={x}
              cy={index % 2 === 0 ? 172 : 116}
              r="17"
              fill="var(--color-surface)"
              stroke={accent}
              strokeWidth="2"
            />
            <circle cx={x} cy={index % 2 === 0 ? 172 : 116} r="4" fill={accent} />
          </motion.g>
        ))}
      </svg>

      <motion.div
        variants={staggerContainer}
        className="relative z-10 mt-28 grid gap-3 sm:mt-36 sm:grid-cols-2"
      >
        {nodes.slice(0, 4).map((node, index) => (
          <motion.div
            key={`${node.label}-${index}`}
            variants={softRise}
            className="bg-white/88 min-h-[104px] rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 shadow-[var(--shadow-sm)] backdrop-blur"
          >
            <p className="font-[family-name:var(--font-mono)] text-[11px] font-semibold text-[var(--color-primary-700)]">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--color-fg)]">{node.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--color-slate-800)]">
              {node.detail}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={softRise}
        className="relative z-10 mt-4 rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-primary-900)] p-5 text-white shadow-[var(--shadow-md)]"
      >
        <p className="font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.1em] text-white/60">
          {summaryLabel}
        </p>
        <p className="text-white/82 mt-2 text-sm leading-relaxed">{summary}</p>
      </motion.div>
    </motion.div>
  );
}
