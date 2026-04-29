"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FlaskConical, Microscope, FileCheck2, Truck, ArrowUpRight } from "lucide-react";
import type { ComponentType } from "react";

import { fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

import { trackServiceCardClick } from "../../lib/analytics";
import type { CapabilityCard, WhatWeDoSection } from "../../content/home";

type Props = { content: WhatWeDoSection };

const ICON: Record<CapabilityCard["icon"], ComponentType<{ size?: number; className?: string }>> = {
  flask: FlaskConical,
  microscope: Microscope,
  "file-check": FileCheck2,
  truck: Truck,
};

export function WhatWeDo({ content }: Props) {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="home-whatwedo-heading"
      className="bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="home-whatwedo-heading"
            className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
        </div>

        <motion.ul
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={staggerContainer}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {content.cards.map((card) => {
            const Icon = ICON[card.icon];
            return (
              <motion.li key={card.id} variants={fadeRise} className="h-full">
                <Link
                  href={card.href}
                  onClick={() =>
                    trackServiceCardClick({
                      surface: "home-what-we-do",
                      serviceId: card.id,
                      href: card.href,
                    })
                  }
                  className="group flex h-full min-h-[220px] flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--color-primary-600)] hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                  >
                    <Icon size={20} />
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {card.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary-700)]">
                    {card.linkLabel}
                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                      className="transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
