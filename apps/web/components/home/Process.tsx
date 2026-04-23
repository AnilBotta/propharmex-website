"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

import type { ProcessSection } from "../../content/home";

type Props = { content: ProcessSection };

export function Process({ content }: Props) {
  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });

  // Desktop horizontal-translate parallax. Mobile renders a vertical stack.
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-18%"]);

  return (
    <section
      aria-labelledby="home-process-heading"
      className="bg-[var(--color-bg)] py-20 sm:py-24"
      ref={scrollRef}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="home-process-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.subhead}
          </p>
        </div>

        {/* Mobile: vertical stack */}
        <motion.ol
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={staggerContainer}
          className="mt-12 flex flex-col gap-4 lg:hidden"
        >
          {content.steps.map((s) => (
            <motion.li
              key={s.step}
              variants={fadeRise}
              className="flex gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <StepNumber n={s.step} />
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-fg)]">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-slate-800)]">
                  {s.description}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        {/* Desktop: horizontal scroll-linked strip */}
        <div className="relative mt-12 hidden overflow-hidden lg:block">
          <motion.ol
            style={reduce ? undefined : { x }}
            className="flex gap-5"
          >
            {content.steps.map((s, i) => (
              <li
                key={s.step}
                className="flex w-[320px] shrink-0 flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              >
                <div className="flex items-center gap-3">
                  <StepNumber n={s.step} />
                  <div
                    aria-hidden="true"
                    className="h-px flex-1 bg-[var(--color-border)]"
                  />
                  {i === content.steps.length - 1 ? null : (
                    <span className="text-xs uppercase tracking-[0.08em] text-[var(--color-muted)]">
                      next
                    </span>
                  )}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-fg)]">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                  {s.description}
                </p>
              </li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-full)] bg-[var(--color-primary-50)] font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--color-primary-700)]"
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}
