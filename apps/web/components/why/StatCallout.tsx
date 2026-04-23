/**
 * StatCallout — RSC.
 *
 * Renders one chapter stat: big tabular-numeric value, concise label, and a
 * citation line. Primary-source citations link out; internal benchmarks are
 * rendered as plain text with an explicit "internal" framing.
 */
import type { FC } from "react";

import type { ChapterStat } from "../../content/why";

type Props = { stat: ChapterStat };

export const StatCallout: FC<Props> = ({ stat }) => {
  return (
    <figure className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div
        className="font-[family-name:var(--font-display)] text-3xl font-semibold leading-none tracking-tight text-[var(--color-primary-700)] tabular-nums sm:text-4xl"
        aria-hidden={false}
      >
        {stat.value}
      </div>
      <figcaption className="text-sm leading-snug text-[var(--color-slate-800)]">
        {stat.label}
      </figcaption>
      {stat.source ? <StatSource source={stat.source} /> : null}
    </figure>
  );
};

const StatSource: FC<{ source: NonNullable<ChapterStat["source"]> }> = ({
  source,
}) => {
  if (source.kind === "primary") {
    return (
      <p className="text-xs leading-snug text-[var(--color-muted)]">
        Source:{" "}
        <a
          href={source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[var(--color-primary-700)]"
        >
          {source.label}
        </a>
      </p>
    );
  }
  return (
    <p className="text-xs leading-snug text-[var(--color-muted)]">
      {source.label}
    </p>
  );
};
