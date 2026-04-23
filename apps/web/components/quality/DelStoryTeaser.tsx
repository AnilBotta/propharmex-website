/**
 * DelStoryTeaser — /quality-compliance, RSC.
 *
 * Previews the /regulatory-services/del-licensing deep-dive (built in
 * Prompt 12). For now the CTA links to /contact with a source tag so inbound
 * attribution is preserved until the deep-dive page ships.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { QualityDelTeaser } from "../../content/quality";

import { SectionReveal } from "./SectionReveal";

type Props = { content: QualityDelTeaser };

export const DelStoryTeaser: FC<Props> = ({ content }) => {
  return (
    <section
      id="del-story"
      aria-labelledby="quality-del-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <header className="lg:col-span-6">
              <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
                {content.eyebrow}
              </p>
              <h2
                id="quality-del-heading"
                className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
              >
                {content.heading}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
                {content.body}
              </p>
              {content.anchor.source.kind === "primary" ? (
                <a
                  href={content.anchor.source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs text-[var(--color-primary-700)] underline underline-offset-2"
                >
                  {content.anchor.label} — {content.anchor.source.label}
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              ) : null}
              <div className="mt-8">
                <Button asChild variant={content.cta.variant} size="lg">
                  <Link href={content.cta.href}>
                    {content.cta.label}
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </Button>
              </div>
            </header>

            <div className="lg:col-span-6">
              <ul
                className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7"
                aria-label="DEL scope highlights"
              >
                {content.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 text-sm leading-relaxed text-[var(--color-slate-800)]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-primary-600)]"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
