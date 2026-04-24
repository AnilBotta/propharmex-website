"use client";

/**
 * FaqAccordion — leaf FAQ, client island.
 *
 * Wraps the Radix-backed Accordion from @propharmex/ui. FAQPage JSON-LD is
 * emitted by the route-level page so the accordion itself stays presentation
 * only.
 */
import type { FC } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@propharmex/ui";

import type { DosageFormFaq } from "../../content/pharmaceutical-development";

type Props = { content: DosageFormFaq };

export const FaqAccordion: FC<Props> = ({ content }) => {
  return (
    <section
      id="faq"
      aria-labelledby="pd-leaf-faq-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="pd-leaf-faq-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <div className="mt-10 max-w-3xl">
          <Accordion type="single" collapsible>
            {content.items.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
