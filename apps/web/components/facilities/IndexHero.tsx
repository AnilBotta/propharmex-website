/**
 * IndexHero — /facilities, RSC.
 *
 * Single-column hero for the index page. LCP-safe; CTAs route to /contact
 * with index-level source tags.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { FacilitiesIndexHero } from "../../content/facilities";

type Props = { content: FacilitiesIndexHero };

export const IndexHero: FC<Props> = ({ content }) => {
  return (
    <section
      aria-labelledby="facilities-index-hero-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h1
            id="facilities-index-hero-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl lg:text-[clamp(2rem,3.4vw,3rem)] lg:leading-[1.05]"
          >
            {content.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)] sm:text-lg">
            {content.lede}
          </p>
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
      </div>
    </section>
  );
};
