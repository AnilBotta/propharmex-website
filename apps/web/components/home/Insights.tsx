"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Badge, Button, fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

import type { InsightsSection } from "../../content/home";

type Props = { content: InsightsSection };

export function Insights({ content }: Props) {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="home-insights-heading"
      className="bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              {content.eyebrow}
            </p>
            <h2
              id="home-insights-heading"
              className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
            >
              {content.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
              {content.subhead}
            </p>
          </div>
          <Button asChild variant="secondary" size="md" className="self-start">
            <Link href={content.ctaHref}>
              {content.ctaLabel}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <motion.ul
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={staggerContainer}
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {content.cards.map((card) => (
            <motion.li key={card.id} variants={fadeRise} className="h-full">
              <Link
                href={card.href}
                className="group flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--color-primary-600)] hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2"
              >
                <Badge variant="primary" className="self-start">
                  {card.category}
                </Badge>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                  {card.blurb}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary-700)]">
                  Read
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
