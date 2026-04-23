/**
 * Hero — /facilities/[site] detail, RSC.
 *
 * LCP-safe: headline / lede / stats render server-side. The 360° viewer slot
 * is a reserved placeholder per Prompt 9 spec — captured photography streams
 * in later. CTAs link to /contact with a source tag for inbound attribution.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, Orbit } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { FacilityHero } from "../../content/facilities";

type Props = { content: FacilityHero };

export const Hero: FC<Props> = ({ content }) => {
  return (
    <section
      aria-labelledby="facility-hero-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <header className="lg:col-span-7">
            <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              {content.eyebrow}
            </p>
            <h1
              id="facility-hero-heading"
              className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl lg:text-[clamp(2rem,3.4vw,3rem)] lg:leading-[1.05]"
            >
              {content.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)] sm:text-lg">
              {content.lede}
            </p>

            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          </header>

          <aside aria-label="Site walkthrough placeholder" className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-xs)] sm:p-7">
              <div
                aria-hidden="true"
                className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-primary-100)] via-[var(--color-primary-50)] to-[var(--color-slate-50)]"
              >
                <div className="flex flex-col items-center gap-2 text-[var(--color-primary-700)]">
                  <Orbit size={22} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                    360° walkthrough reserved
                  </span>
                </div>
              </div>
              <div className="mt-5">
                <p className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-[var(--color-fg)]">
                  {content.viewerPlaceholder.caption}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">
                  {content.viewerPlaceholder.note}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
