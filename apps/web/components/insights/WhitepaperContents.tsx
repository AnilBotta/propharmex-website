/**
 * WhitepaperContents — /insights/whitepapers/[slug] "what's inside" + ToC, RSC.
 *
 * Renders side-by-side with the gate form on desktop. The summary is set
 * once on the hero; this section deepens the description so a verified
 * business contact knows what they are filling the form for.
 */
import type { FC } from "react";

import type { WhitepaperContent } from "../../content/insights";

type Props = { content: WhitepaperContent };

export const WhitepaperContents: FC<Props> = ({ content }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2
          id="ins-wp-inside-heading"
          className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-fg)]"
        >
          What you will find inside
        </h2>
        <ul
          className="mt-4 space-y-3"
          aria-labelledby="ins-wp-inside-heading"
        >
          {content.insideBullets.map((bullet, idx) => (
            <li
              key={idx}
              className="flex gap-3 text-sm leading-relaxed text-[var(--color-slate-800)]"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-primary-600)]"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2
          id="ins-wp-toc-heading"
          className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-fg)]"
        >
          Table of contents
        </h2>
        <ol
          className="mt-4 divide-y divide-[var(--color-border)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]"
          aria-labelledby="ins-wp-toc-heading"
        >
          {content.contents.map((entry, idx) => (
            <li
              key={entry.id}
              className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm"
            >
              <span className="flex items-baseline gap-3">
                <span className="font-[family-name:var(--font-display)] text-xs font-semibold tabular-nums text-[var(--color-muted)]">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-[var(--color-fg)]">{entry.label}</span>
              </span>
              <span className="shrink-0 text-[11px] text-[var(--color-muted)]">
                {entry.pages} {entry.pages === "1" ? "page" : "pages"}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
