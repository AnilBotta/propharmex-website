/**
 * HubClosing — /services/analytical-services final CTA card, RSC.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { AnalyticalHubClosing as HubClosingContent } from "../../content/analytical-services";

import { SectionReveal } from "./SectionReveal";

type Props = { content: HubClosingContent };

export const HubClosing: FC<Props> = ({ content }) => {
  return (
    <section
      id="hub-closing"
      aria-labelledby="as-hub-closing-heading"
      className="scroll-mt-24 bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-xs)] sm:p-10">
            <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              {content.eyebrow}
            </p>
            <h2
              id="as-hub-closing-heading"
              className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
            >
              {content.heading}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--color-slate-800)]">
              {content.body}
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
        </SectionReveal>
      </div>
    </section>
  );
};
