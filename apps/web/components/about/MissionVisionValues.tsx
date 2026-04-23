"use client";

/**
 * MissionVisionValues — animated SVG trio for Mission / Vision / Values.
 *
 * Client island because it uses Framer Motion + lucide icons as the "animated
 * SVG trio" referenced in Prompt 7. Each value renders with a staggered
 * fade/rise, and the four value cards sit below a two-column M/V row.
 *
 * A reduced-motion user sees the server-rendered layout with no transitions.
 */
import { motion } from "framer-motion";
import {
  Gauge,
  Microscope,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

import {
  fadeRise,
  staggerContainer,
  useReducedMotion,
} from "@propharmex/ui";

import type { AboutMVV, AboutValue } from "../../content/about";

type Props = { content: AboutMVV };

const ICONS: Record<AboutValue["icon"], LucideIcon> = {
  "shield-check": ShieldCheck,
  microscope: Microscope,
  "user-check": UserCheck,
  gauge: Gauge,
};

export function MissionVisionValues({ content }: Props) {
  const reduce = useReducedMotion();

  return (
    <section
      id="mission-vision-values"
      aria-labelledby="about-mvv-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="about-mvv-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.intro}
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article
            aria-labelledby="about-mission-label"
            className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7"
          >
            <p
              id="about-mission-label"
              className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]"
            >
              {content.mission.label}
            </p>
            <p className="font-[family-name:var(--font-display)] text-lg leading-relaxed text-[var(--color-fg)]">
              {content.mission.body}
            </p>
          </article>

          <article
            aria-labelledby="about-vision-label"
            className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7"
          >
            <p
              id="about-vision-label"
              className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]"
            >
              {content.vision.label}
            </p>
            <p className="font-[family-name:var(--font-display)] text-lg leading-relaxed text-[var(--color-fg)]">
              {content.vision.body}
            </p>
          </article>
        </div>

        <motion.ul
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={staggerContainer}
          className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Values"
        >
          {content.values.map((value) => {
            const Icon = ICONS[value.icon];
            return (
              <motion.li
                key={value.id}
                variants={fadeRise}
                className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              >
                <div
                  aria-hidden="true"
                  className="grid size-12 place-items-center rounded-[var(--radius-full)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {value.body}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
