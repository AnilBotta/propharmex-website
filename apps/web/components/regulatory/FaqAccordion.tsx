"use client";

/**
 * FaqAccordion — regulatory leaf FAQ, client island.
 *
 * FAQPage JSON-LD is emitted by the route page, not this component.
 */
import type { FC } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@propharmex/ui";

import type { RegulatoryFaq } from "../../content/regulatory-services";

type Props = { content: RegulatoryFaq };

export const FaqAccordion: FC<Props> = ({ content }) => {
  return (
    <section
      id="faq"
      aria-labelledby="rs-leaf-faq-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="rs-leaf-faq-heading"
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
