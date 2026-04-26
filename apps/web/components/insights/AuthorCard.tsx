/**
 * AuthorCard — /insights/[slug] author bio block at end of article, RSC.
 *
 * Editorial-group bylines render with a small monogram derived from initials
 * rather than a person photo. When named-individual bylines are confirmed,
 * the photo slot replaces the monogram without touching the surrounding
 * layout.
 */
import type { FC } from "react";

import type { ArticleAuthor } from "../../content/insights";

type Props = { author: ArticleAuthor };

export const AuthorCard: FC<Props> = ({ author }) => {
  const initials = computeInitials(author.name);

  return (
    <aside
      aria-label="About the author"
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-slate-50)] p-5 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-[var(--radius-full)] bg-[var(--color-primary-700)] font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-bg)]"
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
            About the author
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-fg)]">
            {author.name}
          </p>
          <p className="text-xs text-[var(--color-muted)]">{author.role}</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-slate-800)]">
            {author.bio}
          </p>
        </div>
      </div>
    </aside>
  );
};

function computeInitials(name: string): string {
  // Editorial groups: take the first letters of the second + third tokens
  // ("Propharmex Regulatory Practice" → "RP"). Falls back to first two
  // letters if the name is single-word.
  const tokens = name.split(/\s+/).filter(Boolean);
  if (tokens.length >= 3) {
    return `${tokens[1]![0]}${tokens[2]![0]}`.toUpperCase();
  }
  if (tokens.length === 2) {
    return `${tokens[0]![0]}${tokens[1]![0]}`.toUpperCase();
  }
  return tokens[0]?.slice(0, 2).toUpperCase() ?? "PX";
}
