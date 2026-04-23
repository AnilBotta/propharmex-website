/**
 * Hero — /quality-compliance, RSC.
 *
 * LCP-safe: headline / lede / DEL anchor render server-side. CTAs link to
 * /contact with a source tag so inbound attribution is preserved.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { QualityHero } from "../../content/quality";

type Props = { content: QualityHero };

export const Hero: FC<Props> = ({ content }) => {
  const { anchor } = content;
  return (
    <section
      aria-labelledby="quality-hero-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <header className="lg:col-span-7">
            <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              {content.eyebrow}
            </p>
            <h1
              id="quality-hero-heading"
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
          </header>

          <aside
            aria-label="Primary regulatory anchor"
            className="lg:col-span-5"
          >
            <div className="flex h-full flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-xs)] sm:p-7">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                >
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)]">
                    {anchor.value}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {anchor.label}
                  </p>
                </div>
              </div>
              {anchor.source.kind === "primary" ? (
                <a
                  href={anchor.source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary-700)] underline underline-offset-2"
                >
                  {anchor.source.label}
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              ) : (
                <p className="mt-6 text-xs text-[var(--color-muted)]">
                  {anchor.source.label}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
