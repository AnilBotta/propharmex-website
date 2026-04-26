/**
 * WhitepaperHero — /insights/whitepapers/[slug] hero, RSC.
 *
 * Breadcrumb crumb + eyebrow + title + summary + author/page-count meta.
 * The download form lives in a separate column (or stacked on mobile) so
 * the hero reads as the asset description.
 */
import type { FC } from "react";
import Link from "next/link";
import { FileDown } from "lucide-react";

import type { WhitepaperContent } from "../../content/insights";

type Props = { content: WhitepaperContent };

export const WhitepaperHero: FC<Props> = ({ content }) => {
  return (
    <section
      aria-labelledby="ins-wp-hero-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-14 sm:py-20"
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
              Whitepapers
            </li>
          </ol>
        </nav>

        <p className="mt-6 inline-flex items-center gap-1 rounded-[var(--radius-full)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
          <FileDown aria-hidden="true" size={11} />
          {content.hero.eyebrow}
        </p>
        <h1
          id="ins-wp-hero-heading"
          className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl lg:text-[clamp(1.85rem,3vw,2.6rem)] lg:leading-[1.1]"
        >
          {content.title}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)] sm:text-lg">
          {content.hero.lede}
        </p>

        <dl className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Author</dt>
            <dd className="font-semibold text-[var(--color-fg)]">
              {content.author.name}
            </dd>
            <span aria-hidden="true" className="text-[var(--color-border)]">
              ·
            </span>
            <span className="text-[var(--color-muted)]">
              {content.author.role}
            </span>
          </div>
          <div className="text-[var(--color-muted)]">
            <dt className="sr-only">Pages</dt>
            <dd>
              {content.pages} {content.pages === 1 ? "page" : "pages"}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};
