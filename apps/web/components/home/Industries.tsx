"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

import type { IndustriesSection } from "../../content/home";

type Props = { content: IndustriesSection };

export function Industries({ content }: Props) {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="home-industries-heading"
      className="bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="home-industries-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.subhead}
          </p>
        </div>

        <motion.ul
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={staggerContainer}
          className="mt-12 grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {content.tiles.map((tile) => (
            <motion.li
              key={tile.id}
              variants={fadeRise}
              className={
                tile.size === "lg"
                  ? "sm:col-span-2 lg:col-span-2"
                  : "sm:col-span-1"
              }
            >
              <Link
                href={tile.href}
                className="group flex h-full flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--color-primary-600)] hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-fg)]">
                    {tile.title}
                  </h3>
                  <ArrowUpRight
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-[var(--color-muted)] transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-primary-700)]"
                  />
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                  {tile.description}
                </p>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
