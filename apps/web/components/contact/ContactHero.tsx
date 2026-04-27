/**
 * ContactHero — /contact page hero, RSC.
 *
 * Plain eyebrow + headline + lede. No CTAs — the inquiry form is the
 * primary action and lives directly below.
 */
import type { FC } from "react";

import type { ContactContent } from "../../content/contact";

import { SectionReveal } from "./SectionReveal";

type Props = { content: ContactContent["hero"] };

export const ContactHero: FC<Props> = ({ content }) => {
  return (
    <section
      aria-labelledby="contact-hero-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h1
            id="contact-hero-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl lg:text-[clamp(2rem,3.4vw,3rem)] lg:leading-[1.05]"
          >
            {content.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
};
