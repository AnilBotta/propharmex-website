"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

import type { TrustStripSection } from "../../content/home";

type Props = { content: TrustStripSection };

export function TrustStrip({ content }: Props) {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label={content.heading}
      className="border-y border-[var(--color-border)] bg-[var(--color-slate-50)] py-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">{content.heading}</h2>
        <motion.ul
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {content.items.map((item) => (
            <motion.li key={item.id} variants={fadeRise}>
              <Link
                href={item.href}
                aria-label={`${item.label} — ${item.caption}`}
                className="group flex min-h-16 items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 transition-[border-color] duration-150 ease-out hover:border-[var(--color-primary-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2"
              >
                <CertGlyph id={item.id} />
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-[var(--color-fg)]">
                    {item.label}
                  </span>
                  <span className="text-xs text-[var(--color-muted)] line-clamp-2">
                    {item.caption}
                  </span>
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

const GLYPH_LABEL: Record<string, string> = {
  "hc-del": "DEL",
  "iso-9001": "ISO",
  "who-gmp": "WHO",
  usfda: "FDA",
  tga: "TGA",
};

function CertGlyph({ id }: { id: string }) {
  const label = GLYPH_LABEL[id] ?? id.slice(0, 3).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-primary-50)] font-[family-name:var(--font-display)] text-[0.68rem] font-bold tracking-tight text-[var(--color-primary-700)]"
    >
      {label}
    </span>
  );
}
