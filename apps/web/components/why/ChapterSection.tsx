/**
 * ChapterSection — one full-viewport story chapter.
 *
 * Composition rules:
 *  - The eyebrow, headline, and lede render server-side so the LCP candidate
 *    (the chapter headline) is in the initial HTML and not gated on JS.
 *  - Body paragraphs, stats, and the support callout are wrapped in a client
 *    island (`ChapterReveal`) that uses fadeRise + staggerContainer + whileInView.
 *  - `min-h-[85vh]`, not `100vh` — avoids mobile URL-bar jumping and keeps the
 *    a11y tab order sane when the viewport is short.
 *  - Alternating left/right accent (index parity) for visual rhythm.
 */
import type { FC } from "react";

import type { WhyChapter } from "../../content/why";

import { ChapterReveal } from "./ChapterReveal";
import { StatCallout } from "./StatCallout";
import { QuoteCallout, DataPointCallout } from "./Callouts";

type Props = {
  chapter: WhyChapter;
  index: number;
  total: number;
};

export const ChapterSection: FC<Props> = ({ chapter, index, total }) => {
  const headingId = `why-chapter-${chapter.id}-heading`;
  const position = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const rightAccent = index % 2 === 1;

  return (
    <section
      id={chapter.id}
      aria-labelledby={headingId}
      data-chapter-id={chapter.id}
      className="relative scroll-mt-24 border-t border-[var(--color-border)] bg-[var(--color-bg)] py-20 first:border-t-0 sm:py-24 lg:min-h-[85vh]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left column — eyebrow + headline + lede (server-rendered). */}
          <header
            className={[
              "lg:col-span-7",
              rightAccent ? "lg:col-start-6" : "lg:col-start-1",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="font-[family-name:var(--font-mono)] text-xs font-medium tracking-[0.08em] text-[var(--color-primary-700)]"
              >
                {position}
              </span>
              <span
                aria-hidden="true"
                className="h-px w-8 bg-[var(--color-border)]"
              />
              <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                {chapter.eyebrow}
              </p>
            </div>

            <h2
              id={headingId}
              className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl lg:text-[clamp(2rem,3.2vw,2.75rem)] lg:leading-[1.1]"
            >
              {chapter.headline}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)] sm:text-lg">
              {chapter.lede}
            </p>
          </header>
        </div>

        {/* Animated region — body + stats + support. */}
        <ChapterReveal className="mt-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Body paragraphs */}
            <div className="flex flex-col gap-5 lg:col-span-7">
              {chapter.body.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-[var(--color-slate-800)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Support callout (quote or data point) */}
            <aside
              className={[
                "lg:col-span-5",
                rightAccent ? "lg:col-start-1 lg:row-start-1" : "",
              ].join(" ")}
            >
              {chapter.support.kind === "quote" ? (
                <QuoteCallout quote={chapter.support} />
              ) : (
                <DataPointCallout dataPoint={chapter.support} />
              )}
            </aside>
          </div>

          {chapter.stats.length > 0 ? (
            <ul
              className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              aria-label={`Key figures for ${chapter.railLabel}`}
            >
              {chapter.stats.map((stat, i) => (
                <li key={`${chapter.id}-stat-${i}`} className="list-none">
                  <StatCallout stat={stat} />
                </li>
              ))}
            </ul>
          ) : null}
        </ChapterReveal>
      </div>
    </section>
  );
};
