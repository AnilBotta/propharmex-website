/**
 * Chapter support callouts — RSC.
 *
 * - QuoteCallout renders a <blockquote> with attribution.
 * - DataPointCallout renders a <figure> / <figcaption> with a sourced link.
 *
 * Both live in one file to keep the import surface for ChapterSection tight
 * while preserving discriminated-union typing on the source side.
 */
import type { FC } from "react";
import { Quote, Link2 } from "lucide-react";

import type { ChapterQuote, ChapterDataPoint } from "../../content/why";

export const QuoteCallout: FC<{ quote: ChapterQuote }> = ({ quote }) => {
  return (
    <figure className="relative rounded-[var(--radius-lg)] border-l-4 border-[var(--color-primary-600)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
      <Quote
        aria-hidden="true"
        size={20}
        className="absolute right-5 top-5 text-[var(--color-primary-600)] opacity-40"
      />
      <blockquote className="font-[family-name:var(--font-display)] text-lg leading-relaxed text-[var(--color-fg)]">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <figcaption className="mt-4 text-xs uppercase tracking-[0.08em] text-[var(--color-muted)]">
        {quote.attribution}
      </figcaption>
    </figure>
  );
};

export const DataPointCallout: FC<{ dataPoint: ChapterDataPoint }> = ({
  dataPoint,
}) => {
  const external = /^https?:\/\//.test(dataPoint.source.href);
  return (
    <figure className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-slate-50)] p-6">
      <div className="flex items-start gap-3">
        <Link2
          aria-hidden="true"
          size={18}
          className="mt-1 shrink-0 text-[var(--color-primary-700)]"
        />
        <p className="text-base leading-relaxed text-[var(--color-fg)]">
          {dataPoint.headline}
        </p>
      </div>
      <figcaption className="mt-4 pl-[30px] text-xs leading-snug text-[var(--color-muted)]">
        Source:{" "}
        <a
          href={dataPoint.source.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="underline underline-offset-2 hover:text-[var(--color-primary-700)]"
        >
          {dataPoint.source.label}
        </a>
      </figcaption>
    </figure>
  );
};
