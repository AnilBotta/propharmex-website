/**
 * InsightCard — single render path for both article cards and whitepaper
 * cards on the /insights hub grid, RSC.
 *
 * The discriminator is the `kind` prop. Whitepaper cards carry a "Whitepaper
 * · Gated download" pill; article cards carry the pillar label. Both link
 * to the appropriate detail surface (/insights/[slug] for articles,
 * /insights/whitepapers/[slug] for whitepapers).
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, FileDown } from "lucide-react";

import {
  INSIGHT_PILLARS,
  type ArticleContent,
  type WhitepaperContent,
} from "../../content/insights";

const PILLAR_LABEL_BY_ID = Object.fromEntries(
  INSIGHT_PILLARS.map((p) => [p.id, p.label]),
);

type Props =
  | { kind: "article"; data: ArticleContent }
  | { kind: "whitepaper"; data: WhitepaperContent };

export const InsightCard: FC<Props> = (props) => {
  if (props.kind === "article") {
    const { data } = props;
    const href = `/insights/${data.slug}`;
    return (
      <Link
        href={href}
        className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-primary-600)] hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] motion-reduce:hover:translate-y-0 motion-reduce:transition-none"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
            {PILLAR_LABEL_BY_ID[data.pillar]}
          </p>
          <ArrowUpRight
            aria-hidden="true"
            size={16}
            className="mt-0.5 text-[var(--color-muted)] transition group-hover:text-[var(--color-primary-700)]"
          />
        </div>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
          {data.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
          {data.excerpt}
        </p>
        <ul
          className="mt-4 flex flex-wrap gap-1.5"
          aria-label="Article tags"
        >
          {data.tags.slice(0, 3).map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-slate-800)]"
            >
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-[11px] font-medium text-[var(--color-muted)]">
            {data.author.name}
          </p>
          <p className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-muted)]">
            <Clock size={11} aria-hidden="true" />
            {data.readingMinutes} min read
          </p>
        </div>
      </Link>
    );
  }

  const { data } = props;
  const href = `/insights/whitepapers/${data.slug}`;
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-primary-600)] bg-[var(--color-surface)] p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] motion-reduce:hover:translate-y-0 motion-reduce:transition-none"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="inline-flex items-center gap-1 rounded-[var(--radius-full)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
          <FileDown aria-hidden="true" size={11} />
          Whitepaper · Gated download
        </p>
        <ArrowUpRight
          aria-hidden="true"
          size={16}
          className="mt-0.5 text-[var(--color-muted)] transition group-hover:text-[var(--color-primary-700)]"
        />
      </div>
      <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
        {data.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
        {data.summary}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <p className="text-[11px] font-medium text-[var(--color-muted)]">
          {data.author.name}
        </p>
        <p className="text-[11px] font-medium text-[var(--color-muted)]">
          {data.pages} {data.pages === 1 ? "page" : "pages"}
        </p>
      </div>
    </Link>
  );
};
