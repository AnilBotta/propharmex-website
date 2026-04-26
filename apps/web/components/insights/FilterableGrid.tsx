"use client";

/**
 * FilterableGrid — /insights hub filterable card grid, client island.
 *
 * Single-axis filter pills (All / Articles / Whitepapers / Regulatory updates
 * / Case studies). Unlike /case-studies which uses 4 select dropdowns, the
 * insights surface filters by content type only — pillar grouping happens
 * implicitly via card density rather than as a user-driven filter.
 *
 * The "Case studies" pill is special: clicking it navigates to /case-studies
 * (the canonical surface for case studies) rather than filtering inline. We
 * do not duplicate case study content under /insights.
 *
 * Accessibility:
 *  - Pills are <button> elements (not <a>) for the inline filters and a
 *    <Link> for the case-studies cross-link, so keyboard semantics match
 *    the action.
 *  - The result list is wrapped in `aria-live="polite"` so screen readers
 *    announce the new count after a filter change.
 *  - The empty state lives inside the same live region.
 */
import { useMemo, useState } from "react";
import type { FC } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  INSIGHT_FILTERS,
  type ArticleContent,
  type InsightFilter,
  type InsightsHubContent,
  type WhitepaperContent,
} from "../../content/insights";

import { InsightCard } from "./InsightCard";

type Props = {
  articles: ArticleContent[];
  whitepapers: WhitepaperContent[];
  copy: InsightsHubContent["filterCopy"];
};

type DisplayItem =
  | { kind: "article"; data: ArticleContent }
  | { kind: "whitepaper"; data: WhitepaperContent };

export const FilterableGrid: FC<Props> = ({ articles, whitepapers, copy }) => {
  const [filter, setFilter] = useState<InsightFilter>("all");

  const allItems = useMemo<DisplayItem[]>(() => {
    const a: DisplayItem[] = articles.map((data) => ({
      kind: "article",
      data,
    }));
    const w: DisplayItem[] = whitepapers.map((data) => ({
      kind: "whitepaper",
      data,
    }));
    // Sort by publishedAt desc so newest reads first.
    return [...a, ...w].sort((x, y) =>
      y.data.publishedAt.localeCompare(x.data.publishedAt),
    );
  }, [articles, whitepapers]);

  const visibleItems = useMemo(() => {
    if (filter === "all") return allItems;
    if (filter === "case-study") return [];
    return allItems.filter((item) => {
      if (filter === "article") return item.kind === "article";
      if (filter === "whitepaper") return item.kind === "whitepaper";
      // regulatory-update — none in the seed; placeholder for future content.
      return false;
    });
  }, [allItems, filter]);

  const countSuffix =
    visibleItems.length === 1 ? copy.resultCountSingular : copy.resultCountPlural;

  return (
    <section
      id="filterable"
      aria-labelledby="ins-hub-filter-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {copy.eyebrow}
          </p>
          <h2
            id="ins-hub-filter-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {copy.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {copy.lede}
          </p>
        </header>

        <div
          className="mt-10 flex flex-wrap items-center gap-2"
          role="group"
          aria-labelledby="ins-hub-filter-heading"
        >
          {INSIGHT_FILTERS.map((option) => {
            if (option.id === "case-study") {
              return (
                <Link
                  key={option.id}
                  href="/case-studies"
                  className="inline-flex items-center gap-1 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-medium text-[var(--color-slate-800)] transition hover:border-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                >
                  {option.label}
                  <ArrowUpRight aria-hidden="true" size={12} />
                </Link>
              );
            }
            const isActive = filter === option.id;
            return (
              <button
                type="button"
                key={option.id}
                onClick={() => setFilter(option.id)}
                aria-pressed={isActive}
                className={`inline-flex items-center rounded-[var(--radius-full)] border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] ${
                  isActive
                    ? "border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-slate-800)] hover:border-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[var(--color-muted)]">
          {copy.caseStudiesNote}
        </p>

        <div className="mt-10" aria-live="polite">
          <p className="mb-6 text-sm text-[var(--color-slate-800)]">
            <span className="font-semibold text-[var(--color-fg)]">
              {visibleItems.length}
            </span>{" "}
            {countSuffix}
          </p>

          {visibleItems.length > 0 ? (
            <ul
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
              aria-label="Insights results"
            >
              {visibleItems.map((item) => (
                <li
                  key={`${item.kind}-${item.data.slug}`}
                  className="list-none"
                >
                  {item.kind === "article" ? (
                    <InsightCard kind="article" data={item.data} />
                  ) : (
                    <InsightCard kind="whitepaper" data={item.data} />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-fg)]">
                {copy.emptyStateTitle}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-slate-800)]">
                {copy.emptyStateBody}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
