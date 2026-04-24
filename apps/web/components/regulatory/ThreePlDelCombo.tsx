/**
 * ThreePlDelCombo — DEL leaf "DEL + 3PL — one posture" two-column block, RSC.
 */
import type { FC } from "react";
import { CheckCircle2 } from "lucide-react";

import type {
  ThreePlDelColumn,
  ThreePlDelCombo as ComboContent,
} from "../../content/regulatory-services";

import { SectionReveal } from "./SectionReveal";

type Props = { content: ComboContent };

export const ThreePlDelCombo: FC<Props> = ({ content }) => {
  return (
    <section
      id="del-3pl-combo"
      aria-labelledby="rs-leaf-combo-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="rs-leaf-combo-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ComboColumn column={content.leftColumn} tone="primary" />
            <ComboColumn column={content.rightColumn} tone="neutral" />
          </div>
          <p className="mt-8 max-w-3xl text-sm font-semibold leading-relaxed text-[var(--color-fg)]">
            {content.closingNote}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
};

function ComboColumn({
  column,
  tone,
}: {
  column: ThreePlDelColumn;
  tone: "primary" | "neutral";
}) {
  const border =
    tone === "primary"
      ? "border-[var(--color-primary-600)]"
      : "border-[var(--color-border)]";
  const bg =
    tone === "primary"
      ? "bg-[var(--color-primary-50)]"
      : "bg-[var(--color-surface)]";
  return (
    <article
      className={`flex h-full flex-col gap-4 rounded-[var(--radius-lg)] border ${border} ${bg} p-6`}
    >
      <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
        {column.heading}
      </h3>
      <ul className="flex flex-col gap-3" aria-label={column.heading}>
        {column.bullets.map((bullet, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <CheckCircle2
              aria-hidden="true"
              size={16}
              className="mt-0.5 shrink-0 text-[var(--color-primary-700)]"
            />
            <span className="text-sm leading-relaxed text-[var(--color-slate-800)]">
              {bullet}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
