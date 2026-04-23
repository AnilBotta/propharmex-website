"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

import { Badge, Button, fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

import type { MatcherSection } from "../../content/home";

type Props = { content: MatcherSection };

export function MatcherTeaser({ content }: Props) {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="home-matcher-heading"
      className="bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={staggerContainer}
          className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-surface)] p-8 sm:p-12"
        >
          <motion.div
            variants={fadeRise}
            className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-primary-200)] bg-[var(--color-surface)] px-3 py-1"
          >
            <Sparkles size={13} aria-hidden="true" className="text-[var(--color-primary-700)]" />
            <span className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              {content.eyebrow}
            </span>
          </motion.div>

          <motion.h2
            id="home-matcher-heading"
            variants={fadeRise}
            className="mt-5 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </motion.h2>

          <motion.p
            variants={fadeRise}
            className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)]"
          >
            {content.body}
          </motion.p>

          <motion.ul
            variants={staggerContainer}
            className="mt-6 flex flex-wrap gap-2"
          >
            {content.chips.map((chip) => (
              <motion.li key={chip.id} variants={fadeRise}>
                <Badge variant="outline" className="border-[var(--color-primary-200)] bg-[var(--color-surface)] text-[var(--color-primary-900)]">
                  {chip.label}
                </Badge>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={fadeRise} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild variant="primary" size="lg">
              <Link href={content.ctaHref}>
                {content.ctaLabel}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-[var(--color-muted)] sm:ml-2 sm:max-w-md">
              {content.disclaimer}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
