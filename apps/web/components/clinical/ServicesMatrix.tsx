/**
 * ServicesMatrix — Clinical & BE Insight hub matrix, RSC.
 *
 * Four service cards. `live` cards link to the leaf detail page; cards
 * whose leaf is `shipping-next` render a muted disabled state — same
 * pattern as components/pharmdev/CapabilityMatrix.tsx but typed against
 * ClinicalServiceSummary instead of DosageFormSummary.
 *
 * The 4 cards render in a 2-up grid on lg+ (2x2) rather than 3-up — four
 * cards in a 3-column grid leaves one orphan in row 2.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import type { ClinicalServicesMatrix } from "../../content/clinical-be-insight";

import { SectionReveal } from "../pharmdev/SectionReveal";

type Props = { content: ClinicalServicesMatrix };

export const ServicesMatrix: FC<Props> = ({ content }) => {
  return (
    <section
      id="services"
      aria-labelledby="cli-hub-services-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="cli-hub-services-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <ul
            className="grid grid-cols-1 gap-5 lg:grid-cols-2"
            aria-label="Clinical and BE insight services"
          >
            {content.services.map((service) => {
              const isLive = service.leafStatus === "live";
              const href = `/services/clinical-be-insight/${service.slug}`;
              const cardClasses = `flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border p-5 ${
                isLive
                  ? "border-[var(--color-primary-600)] bg-[var(--color-surface)]"
                  : "border-[var(--color-border)] bg-[var(--color-slate-50)]"
              }`;

              const body = (
                <article className={cardClasses}>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-[var(--radius-full)] border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                        isLive
                          ? "border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"
                      }`}
                    >
                      {isLive ? (
                        <>
                          <ArrowRight aria-hidden="true" size={11} />
                          {content.liveCopy}
                        </>
                      ) : (
                        <>
                          <Clock aria-hidden="true" size={11} />
                          {content.shippingNextCopy}
                        </>
                      )}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
                    {service.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {service.blurb}
                  </p>
                  <ul
                    className="mt-auto flex flex-wrap gap-1.5 pt-2"
                    aria-label="Highlights"
                  >
                    {service.highlights.map((chip) => (
                      <li
                        key={chip}
                        className="inline-flex items-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-slate-800)]"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
                </article>
              );

              return (
                <li key={service.slug} className="list-none">
                  {isLive ? (
                    <Link
                      href={href}
                      className="block rounded-[var(--radius-lg)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] motion-reduce:hover:translate-y-0 motion-reduce:transition-none"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div aria-disabled="true">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};
