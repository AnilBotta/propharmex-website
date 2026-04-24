/**
 * LeafHero — /industries/[slug], RSC.
 *
 * Hero with distinct value-prop slot in addition to the lede. LCP-safe.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { IndustryLeafHero as LeafHeroContent } from "../../content/industries";

type Props = { content: LeafHeroContent };

export const LeafHero: FC<Props> = ({ content }) => {
  return (
    <section
      aria-labelledby="ind-leaf-hero-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h1
            id="ind-leaf-hero-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl lg:text-[clamp(2rem,3.4vw,3rem)] lg:leading-[1.05]"
          >
            {content.headline}
          </h1>
          <p className="mt-5 text-lg font-semibold leading-relaxed text-[var(--color-primary-700)]">
            {content.valueProp}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </div>

        <dl className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:max-w-3xl">
          {content.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
            >
              <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                {stat.label}
              </dt>
              <dd className="mt-1 font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-fg)]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild variant={content.primaryCta.variant} size="lg">
            <Link href={content.primaryCta.href}>
              {content.primaryCta.label}
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </Button>
          <Button asChild variant={content.secondaryCta.variant} size="lg">
            <Link href={content.secondaryCta.href}>
              {content.secondaryCta.label}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
