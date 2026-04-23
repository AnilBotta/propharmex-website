"use client";

/**
 * QmsArchitecture — /quality-compliance.
 *
 * Animated SVG flow showing the seven QMS stages. The SVG is `aria-hidden` —
 * the accessible representation is the ordered list of stage cards below.
 * Motion is suppressed under prefers-reduced-motion.
 */
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

import { fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

import type { QualityQms, QmsStage } from "../../content/quality";

type Props = { content: QualityQms };

export function QmsArchitecture({ content }: Props) {
  const reduce = useReducedMotion();
  const stages = [...content.stages].sort((a, b) => a.order - b.order);

  return (
    <section
      id="qms-architecture"
      aria-labelledby="quality-qms-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="quality-qms-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <div
          aria-hidden="true"
          className="mt-12 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
        >
          <QmsLoopSvg count={stages.length} reduced={reduce ?? false} />
        </div>

        <motion.ol
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={staggerContainer}
          className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          aria-label="QMS stages"
        >
          {stages.map((stage) => (
            <motion.li key={stage.id} variants={fadeRise} className="list-none">
              <StageCard stage={stage} />
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

function StageCard({ stage }: { stage: QmsStage }) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-full)] bg-[var(--color-primary-50)] font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-primary-700)]"
        >
          {stage.order}
        </span>
        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
          {stage.title}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
        {stage.body}
      </p>
      {stage.reference.kind === "primary" ? (
        <a
          href={stage.reference.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1 text-xs text-[var(--color-primary-700)] underline underline-offset-2"
        >
          {stage.reference.label}
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      ) : (
        <p className="mt-auto text-xs text-[var(--color-muted)]">
          {stage.reference.label}
        </p>
      )}
    </article>
  );
}

/**
 * Decorative loop diagram. Ring of nodes, animated draw under no-reduce.
 * Entirely aria-hidden — the StageCard grid below is the canonical view.
 */
function QmsLoopSvg({
  count,
  reduced,
}: {
  count: number;
  reduced: boolean;
}) {
  const cx = 500;
  const cy = 200;
  const rx = 380;
  const ry = 140;
  const nodes = Array.from({ length: count }, (_, i) => {
    const theta = (-Math.PI / 2) + (i / count) * Math.PI * 2;
    return {
      x: cx + rx * Math.cos(theta),
      y: cy + ry * Math.sin(theta),
    };
  });

  return (
    <svg
      viewBox="0 0 1000 400"
      role="img"
      aria-hidden="true"
      className="w-full"
    >
      <defs>
        <linearGradient id="qms-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-primary-600)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--color-primary-700)" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <motion.ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke="url(#qms-ring)"
        strokeWidth={1.5}
        strokeDasharray="6 6"
        initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
        whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      {nodes.map((n, i) => (
        <motion.g
          key={i}
          initial={reduced ? undefined : { scale: 0, opacity: 0 }}
          whileInView={
            reduced ? undefined : { scale: 1, opacity: 1 }
          }
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{
            delay: 0.1 + i * 0.08,
            duration: 0.35,
            ease: "easeOut",
          }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        >
          <circle
            cx={n.x}
            cy={n.y}
            r={22}
            fill="var(--color-surface)"
            stroke="var(--color-primary-600)"
            strokeWidth={1.5}
          />
          <text
            x={n.x}
            y={n.y + 5}
            textAnchor="middle"
            fontFamily="var(--font-display), ui-sans-serif"
            fontSize={15}
            fontWeight={600}
            fill="var(--color-primary-700)"
          >
            {i + 1}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
