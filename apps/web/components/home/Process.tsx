"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

import type { ProcessSection } from "../../content/home";

type Props = { content: ProcessSection };

export function Process({ content }: Props) {
  const reduce = useReducedMotion();
  const pinRef = useRef<HTMLDivElement | null>(null);

  // Desktop pinned horizontal scroll. Outer container is 200vh tall —
  // gives ~1 viewport of vertical scroll budget to the horizontal animation.
  // Inner sticks to the top of the viewport while the strip translates left.
  // scrollYProgress runs 0 → 1 as the user scrolls through the outer.
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  // 7 cards × 320px + 6 gaps × 20px ≈ 2360px strip width.
  // max-w-7xl container with lg:px-8 ≈ 1216px on desktop.
  // Need ≈ -48% to expose the last card; -52% gives a small right-edge buffer.
  // The animation completes by 0.9 of scroll progress and holds, so the user
  // sees the last card before the pin releases.
  const x = useTransform(scrollYProgress, [0, 0.9, 1], ["0%", "-52%", "-52%"]);

  return (
    <section
      aria-labelledby="home-process-heading"
      className="bg-[var(--color-bg)] pt-20 pb-20 sm:pt-24 sm:pb-24 lg:pb-0"
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

        <motion.div
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={fadeRise}
          className="relative mt-12 aspect-[21/9] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-md)]"
        >
          <Image
            src="/seven-step-roadmap.png"
            alt="Seven step pharmaceutical development journey roadmap"
            fill
            sizes="(min-width: 1024px) 1280px, 100vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Mobile: vertical stack */}
        <motion.ol
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={staggerContainer}
          className="mt-10 flex flex-col gap-4 lg:hidden"
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
      </div>

      {/* Desktop: pinned horizontal scroll-linked strip */}
      <div
        ref={pinRef}
        className="hidden lg:relative lg:block lg:h-[200vh]"
        aria-hidden={reduce ? "true" : undefined}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-[var(--color-bg)]">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
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
      </div>

      {/* Reduced-motion fallback: render the cards inline once so the steps
          are still readable for users who disable animation. */}
      {reduce ? (
        <div className="mx-auto hidden max-w-7xl gap-5 overflow-x-auto px-4 sm:px-6 lg:flex lg:px-8 lg:pb-20">
          <ol className="flex gap-5">
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
          </ol>
        </div>
      ) : null}
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
