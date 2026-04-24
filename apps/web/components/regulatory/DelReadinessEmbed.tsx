/**
 * DelReadinessEmbed — DEL leaf placeholder for the DEL Readiness Assessment
 * AI tool that ships in Prompt 20.
 *
 * Rendered as a static card with a "Live with Prompt 20" pill and a preview
 * CTA that routes to /contact so inbound interest is captured before the
 * interactive tool ships.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { DelReadinessEmbedPlaceholder } from "../../content/regulatory-services";

import { SectionReveal } from "./SectionReveal";

type Props = { content: DelReadinessEmbedPlaceholder };

export const DelReadinessEmbed: FC<Props> = ({ content }) => {
  return (
    <section
      id="del-readiness"
      aria-labelledby="rs-leaf-readiness-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-primary-600)] bg-[var(--color-surface)] p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
                {content.eyebrow}
              </p>
              <span className="inline-flex items-center gap-1 rounded-[var(--radius-full)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
                <Sparkles aria-hidden="true" size={11} />
                AI tool preview
              </span>
            </div>
            <h2
              id="rs-leaf-readiness-heading"
              className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl"
            >
              {content.heading}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-slate-800)]">
              {content.body}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--color-muted)]">
              {content.shippingCopy}
            </p>
            <div className="mt-6">
              <Button asChild variant={content.previewCta.variant} size="lg">
                <Link href={content.previewCta.href}>
                  {content.previewCta.label}
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
