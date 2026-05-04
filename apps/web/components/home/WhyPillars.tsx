"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Beaker, Link2, Compass, Globe2 } from "lucide-react";
import type { ComponentType } from "react";

import { Card, CardContent, fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

import type { WhyPillarsSection, WhyPillar } from "../../content/home";

type Props = { content: WhyPillarsSection };

const ICON_BY_ID: Record<WhyPillar["id"], ComponentType<{ size?: number; className?: string }>> = {
  "complex-focus": Beaker,
  "integrated-thinking": Link2,
  "tailored-programs": Compass,
  "canada-platform": Globe2,
};

export function WhyPillars({ content }: Props) {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="home-why-heading"
      className="bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-14"
        >
          <motion.div variants={fadeRise} className="max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              {content.eyebrow}
            </p>
            <h2
              id="home-why-heading"
              className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
            >
              {content.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
              {content.subhead}
            </p>
          </motion.div>

          <motion.div variants={fadeRise} className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-md)]">
            <Image
              src="/why-partners-choose.png"
              alt="Strategic pharmaceutical development platform illustration"
              fill
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </motion.div>

        <motion.ul
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={staggerContainer}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {content.pillars.map((p) => {
            const Icon = ICON_BY_ID[p.id];
            return (
              <motion.li key={p.id} variants={fadeRise} className="h-full">
                <Card elevation="flat" className="h-full">
                  <CardContent className="flex flex-col gap-4 p-6 pt-6">
                    <span
                      aria-hidden="true"
                      className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                    >
                      <Icon size={20} />
                    </span>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                      {p.body}
                    </p>
                  </CardContent>
                </Card>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
