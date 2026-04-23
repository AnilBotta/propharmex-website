/**
 * RegulatoryBodies — /quality-compliance, RSC.
 *
 * Grid of regulator cards with scope, jurisdiction, and a primary-source link.
 * The `scope` discriminator drives the chip colour so readers can scan the
 * grid for what Propharmex is actually accountable to (primary-regulator)
 * vs. where we operate on an engagement basis.
 */
import type { FC } from "react";
import { ExternalLink } from "lucide-react";

import type {
  QualityRegulator,
  QualityRegulators,
  RegulatorScope,
} from "../../content/quality";

import { SectionReveal } from "./SectionReveal";

type Props = { content: QualityRegulators };

const SCOPE_LABEL: Record<RegulatorScope, string> = {
  "primary-regulator": "Primary regulator",
  "inspection-scope": "Inspection scope",
  "filing-scope": "Filing scope",
  "engagement-scope": "Engagement scope",
};

export const RegulatoryBodies: FC<Props> = ({ content }) => {
  return (
    <section
      id="regulatory-bodies"
      aria-labelledby="quality-regulators-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="quality-regulators-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <ul
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            aria-label="Regulatory bodies Propharmex engages with"
          >
            {content.items.map((reg) => (
              <li key={reg.id} className="list-none">
                <RegulatorCard regulator={reg} />
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};

function RegulatorCard({ regulator }: { regulator: QualityRegulator }) {
  const primary = regulator.scope === "primary-regulator";
  return (
    <article
      className={`flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border p-6 ${
        primary
          ? "border-[var(--color-primary-600)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
            {regulator.label}
          </h3>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            {regulator.jurisdiction}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-[var(--radius-full)] border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
            primary
              ? "border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
              : "border-[var(--color-border)] bg-[var(--color-slate-50)] text-[var(--color-muted)]"
          }`}
        >
          {SCOPE_LABEL[regulator.scope]}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
        {regulator.body}
      </p>
      {regulator.reference.kind === "primary" ? (
        <a
          href={regulator.reference.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1 text-xs text-[var(--color-primary-700)] underline underline-offset-2"
        >
          {regulator.reference.label}
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      ) : (
        <p className="mt-auto text-xs text-[var(--color-muted)]">
          {regulator.reference.label}
        </p>
      )}
    </article>
  );
}
