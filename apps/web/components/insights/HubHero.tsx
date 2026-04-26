/**
 * HubHero — /insights hub hero, RSC.
 *
 * Plain hero — eyebrow, headline, lede. No CTAs (those live in the closing
 * block) and no stats grid (the editorial calendar is the proof, not a
 * "47 articles published" counter).
 */
import type { FC } from "react";

import type { InsightsHubContent } from "../../content/insights";

type Props = { content: InsightsHubContent["hero"] };

export const HubHero: FC<Props> = ({ content }) => {
  return (
    <section
      aria-labelledby="ins-hub-hero-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h1
            id="ins-hub-hero-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl lg:text-[clamp(2rem,3.4vw,3rem)] lg:leading-[1.05]"
          >
            {content.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </div>
      </div>
    </section>
  );
};
