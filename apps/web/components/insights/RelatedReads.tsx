/**
 * RelatedReads — /insights/[slug] related-articles rail, RSC.
 *
 * Renders 2–3 article cards keyed off the current article's `related` slug
 * list. Reuses the InsightCard component so the visual treatment matches
 * the hub grid. Component null-renders on an empty input array.
 */
import type { FC } from "react";

import type { ArticleContent } from "../../content/insights";

import { InsightCard } from "./InsightCard";
import { SectionReveal } from "./SectionReveal";

type Props = {
  articles: ArticleContent[];
};

export const RelatedReads: FC<Props> = ({ articles }) => {
  if (articles.length === 0) return null;

  return (
    <section
      id="related-reads"
      aria-labelledby="ins-article-related-heading"
      className="scroll-mt-24 border-t border-[var(--color-border)] bg-[var(--color-slate-50)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            More from the editorial
          </p>
          <h2
            id="ins-article-related-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl"
          >
            Adjacent reading
          </h2>
        </header>
        <SectionReveal className="mt-8">
          <ul
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            aria-label="Related articles"
          >
            {articles.map((article) => (
              <li key={article.slug} className="list-none">
                <InsightCard kind="article" data={article} />
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};
