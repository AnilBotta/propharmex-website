"use client";

/**
 * ProcessHorizontalStepper — /our-process desktop horizontal stepper, client island.
 *
 * Spec calls for a horizontal scroll-pinned stepper on desktop. Mechanic:
 * a tall outer section pins its inner child to the viewport (`sticky
 * top-0 h-screen`), and as the user scrolls vertically through the
 * outer section, the inner card track translates horizontally via
 * Framer Motion's `useScroll` + `useTransform`.
 *
 * Visibility:
 *   - Hidden below lg (the ProcessTimeline component is the universal
 *     vertical layout for mobile and tablet).
 *   - On lg+, renders this stepper.
 *   - With prefers-reduced-motion, falls back to a horizontally-scrollable
 *     list of the same cards. Pinning + scroll-driven translation are
 *     skipped, but every phase is reachable via the native scrollbar.
 *
 * Width math: each card is a fixed 460px so the layout is stable across
 * desktop widths. Total track width is computed from phase count + gaps;
 * actual viewport width is measured at scroll time so the translation
 * fits any 1280–2560px display without overshoot.
 *
 * Progress indicator: a thin top bar shows the current scroll progress
 * across the stepper, with phase markers at the canonical step points
 * so the user can see how many phases remain.
 */
import { useRef } from "react";
import type { FC } from "react";
import Link from "next/link";
import { Clock, ChevronRight, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

import { useReducedMotion } from "@propharmex/ui";

import type { ProcessPhase } from "../../content/process";

const CARD_WIDTH_PX = 460;
const CARD_GAP_PX = 28;
const SIDE_PADDING_PX = 64;

type Props = {
  phases: ProcessPhase[];
  className?: string;
};

export const ProcessHorizontalStepper: FC<Props> = ({ phases, className }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Track width = side padding + cards + gaps + side padding
  const trackWidth =
    SIDE_PADDING_PX * 2 +
    phases.length * CARD_WIDTH_PX +
    Math.max(0, phases.length - 1) * CARD_GAP_PX;

  const x = useTransform(scrollYProgress, (progress) => {
    if (reduce) return 0;
    const vw = stickyRef.current?.clientWidth ?? 1440;
    const travel = Math.max(0, trackWidth - vw);
    return -travel * progress;
  });

  /* ---------------------------------------------------------------------- */
  /*  Reduced-motion fallback: native horizontal scroll                     */
  /* ---------------------------------------------------------------------- */

  if (reduce) {
    return (
      <section
        aria-labelledby="proc-stepper-heading"
        className={`scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 ${className ?? ""}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StepperHeader />
        </div>
        <ol
          className="mt-10 flex gap-7 overflow-x-auto px-16 pb-6"
          aria-label="Engagement phases"
        >
          {phases.map((phase, idx) => (
            <li
              key={phase.id}
              id={`phase-${phase.id}`}
              className="shrink-0 scroll-mt-24"
              style={{ width: `${CARD_WIDTH_PX}px` }}
            >
              <PhaseCard phase={phase} index={idx} total={phases.length} />
            </li>
          ))}
        </ol>
      </section>
    );
  }

  /* ---------------------------------------------------------------------- */
  /*  Pinned + scroll-driven horizontal translation                         */
  /* ---------------------------------------------------------------------- */

  // Section height = 100vh per phase + 100vh of trailing scroll for the
  // last card to settle. Tuned through iteration; below 80vh-per-phase
  // the cards fly past too fast on a typical scroll wheel.
  const sectionHeightVh = phases.length * 100;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="proc-stepper-heading"
      className={`relative ${className ?? ""}`}
      style={{ height: `${sectionHeightVh}vh` }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-screen flex-col overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-slate-50)]"
      >
        <div className="mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
          <StepperHeader />
          <ProgressBar
            scrollYProgress={scrollYProgress}
            phases={phases}
          />
        </div>

        <motion.ol
          style={{ x }}
          className="mt-8 flex shrink-0 items-stretch"
          aria-label="Engagement phases"
        >
          <li aria-hidden="true" style={{ width: `${SIDE_PADDING_PX}px` }} />
          {phases.map((phase, idx) => (
            <li
              key={phase.id}
              id={`phase-${phase.id}`}
              className="shrink-0"
              style={{
                width: `${CARD_WIDTH_PX}px`,
                marginRight:
                  idx === phases.length - 1 ? 0 : `${CARD_GAP_PX}px`,
              }}
            >
              <PhaseCard phase={phase} index={idx} total={phases.length} />
            </li>
          ))}
          <li aria-hidden="true" style={{ width: `${SIDE_PADDING_PX}px` }} />
        </motion.ol>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/*  Header                                                                    */
/* -------------------------------------------------------------------------- */

function StepperHeader() {
  return (
    <header className="max-w-3xl">
      <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
        The journey
      </p>
      <h2
        id="proc-stepper-heading"
        className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
      >
        Six phases, defined inputs and outputs
      </h2>
      <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
        Scroll vertically — the engagement journey moves horizontally.
        Each phase is bounded: defined input, defined output, typical
        elapsed time.
      </p>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Progress bar — top-of-stepper indicator                                   */
/* -------------------------------------------------------------------------- */

function ProgressBar({
  scrollYProgress,
  phases,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  phases: ProcessPhase[];
}) {
  const widthPct = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="mt-6">
      <div className="relative h-1 w-full rounded-[var(--radius-full)] bg-[var(--color-border)]">
        <motion.div
          style={{ width: widthPct }}
          className="absolute inset-y-0 left-0 rounded-[var(--radius-full)] bg-[var(--color-primary-700)]"
        />
        {phases.map((phase, idx) => {
          const offsetPct =
            phases.length === 1 ? 0 : (idx / (phases.length - 1)) * 100;
          return (
            <span
              key={phase.id}
              aria-hidden="true"
              className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-bg)]"
              style={{ left: `${offsetPct}%` }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-[var(--color-muted)]">
        {phases.map((phase) => (
          <span key={phase.id} className="truncate">
            {phase.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Phase card — horizontal layout                                            */
/* -------------------------------------------------------------------------- */

function PhaseCard({
  phase,
  index,
  total,
}: {
  phase: ProcessPhase;
  index: number;
  total: number;
}) {
  return (
    <article className="flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-xs)]">
      <header className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="grid size-10 place-items-center rounded-[var(--radius-full)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] font-[family-name:var(--font-display)] text-xs font-semibold text-[var(--color-primary-700)]"
        >
          {phase.number}
        </span>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          {phase.label} · {String(index + 1).padStart(2, "0")} of{" "}
          {String(total).padStart(2, "0")}
        </p>
      </header>

      <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-fg)]">
        {phase.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
        {phase.summary}
      </p>

      <div className="mt-5 space-y-4 text-sm leading-relaxed text-[var(--color-slate-800)]">
        <CardSection title="What happens">
          <p>{phase.whatHappens}</p>
        </CardSection>
        <CardSection title="What we need from you">
          <ul className="space-y-1.5">
            {phase.whatWeNeed.map((item, i) => (
              <li key={i} className="flex gap-2">
                <ChevronRight
                  aria-hidden="true"
                  size={13}
                  className="mt-1 shrink-0 text-[var(--color-primary-600)]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardSection>
        <CardSection title="What you receive">
          <ul className="space-y-1.5">
            {phase.whatYouReceive.map((item, i) => (
              <li key={i} className="flex gap-2">
                <ArrowRight
                  aria-hidden="true"
                  size={13}
                  className="mt-1 shrink-0 text-[var(--color-fg)]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardSection>
      </div>

      <p className="mt-auto inline-flex items-center gap-2 self-start rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-3 py-1 text-xs font-medium text-[var(--color-slate-800)]">
        <Clock aria-hidden="true" size={12} />
        <span className="font-semibold uppercase tracking-[0.06em] text-[var(--color-muted)]">
          Typical:
        </span>
        {phase.typicalTimeline}
      </p>

      {/* Skip-to-detail anchor for keyboard users — links to the same id
          rendered by the vertical timeline below the lg breakpoint. */}
      <Link
        href={`#phase-${phase.id}`}
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:rounded focus-visible:bg-[var(--color-primary-700)] focus-visible:px-2 focus-visible:py-1 focus-visible:text-xs focus-visible:text-[var(--color-bg)]"
      >
        Skip to phase detail
      </Link>
    </article>
  );
}

function CardSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
        {title}
      </p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
