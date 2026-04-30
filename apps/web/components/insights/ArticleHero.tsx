/**
 * ArticleHero — /insights/[slug] hero, RSC.
 *
 * Breadcrumb crumb + pillar eyebrow + title + lede, with the
 * author/published-date/read-time meta line.
 */
import type { FC } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

import {
  INSIGHT_PILLARS,
  type ArticleContent,
} from "../../content/insights";

const PILLAR_LABEL_BY_ID = Object.fromEntries(
  INSIGHT_PILLARS.map((p) => [p.id, p.label]),
);

type Props = { content: ArticleContent };

export const ArticleHero: FC<Props> = ({ content }) => {
  const publishedLabel = formatPublishedDate(content.publishedAt);

  return (
    <section
      aria-labelledby="ins-article-hero-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-muted)]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link
                href="/insights"
                className="underline-offset-2 hover:text-[var(--color-primary-700)] hover:underline"
              >
                Insights
              </Link>
            </li>
            <li aria-hidden="true">·</li>
            <li className="font-medium text-[var(--color-slate-800)]">
              {PILLAR_LABEL_BY_ID[content.pillar]}
            </li>
          </ol>
        </nav>

        <p className="mt-6 font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
          {content.hero.eyebrow}
        </p>
        <h1
          id="ins-article-hero-heading"
          className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl lg:text-[clamp(1.85rem,3vw,2.6rem)] lg:leading-[1.1]"
        >
          {content.title}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)] sm:text-lg">
          {content.hero.lede}
        </p>

        {/*
         * The article meta line was previously a <dl> with <div>-wrapped
         * dt/dd pairs that interleaved decorative <span> separators. axe
         * (definition-list rule) flags that mixing as a serious
         * violation. Plain <div> + sr-only labels carry the same
         * accessible-name information without the dt/dd structural
         * constraint (Prompt 26 PR-B fixup).
         */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="sr-only">Author: </span>
            <span className="font-semibold text-[var(--color-fg)]">
              {content.author.name}
            </span>
            <span aria-hidden="true" className="text-[var(--color-border)]">
              ·
            </span>
            <span className="text-[var(--color-muted)]">
              {content.author.role}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-muted)]">
            <span className="sr-only">Published: </span>
            <time dateTime={content.publishedAt}>{publishedLabel}</time>
          </div>
          <div className="inline-flex items-center gap-1 text-[var(--color-muted)]">
            <Clock aria-hidden="true" size={13} />
            <span className="sr-only">Reading time: </span>
            <span>{content.readingMinutes} min read</span>
          </div>
        </div>
      </div>
    </section>
  );
};

function formatPublishedDate(iso: string): string {
  // Locale-stable formatter — UTC-anchored, English, day-month-year. Avoids
  // hydration drift between server and client.
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString("en-CA", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
