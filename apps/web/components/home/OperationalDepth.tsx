import Image from "next/image";
import { Check } from "lucide-react";

import type { OperatingColumn, OperationalDepthSection } from "../../content/home";

interface Props { content: OperationalDepthSection }

/**
 * OperationalDepth — homepage section, two-column "anchor + depth" frame.
 *
 * Per the specialty-CDMO repositioning, this section describes the operating
 * model: Canada-headquartered, globally connected. The first column is the
 * Canadian headquarters; the second column is the development depth. A
 * banner image above the 2-column grid reinforces the human, globally-
 * collaborative read of the section.
 */
export function OperationalDepth({ content }: Props) {
  const [anchor, depth] = content.columns;

  return (
    <section
      aria-labelledby="home-operational-depth-heading"
      className="bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="home-operational-depth-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.subhead}
          </p>
        </div>

        <div className="relative mt-12 aspect-[21/9] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-md)]">
          <Image
            src="/team-global-collaboration.png"
            alt="Canada-headquartered global pharmaceutical collaboration illustration"
            fill
            sizes="(min-width: 1024px) 1280px, 100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <OperatingCard column={anchor} />
          <OperatingCard column={depth} />
        </div>
      </div>
    </section>
  );
}

function OperatingCard({ column }: { column: OperatingColumn }) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs text-[var(--color-muted)]">
        <span>{column.sublabel}</span>
      </div>

      <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)]">
        {column.label}
      </h3>

      <p className="mt-1 text-sm text-[var(--color-primary-700)]">{column.role}</p>

      <ul className="mt-5 flex flex-col gap-3">
        {column.capabilities.map((c) => (
          <li key={c} className="flex gap-3 text-sm leading-relaxed text-[var(--color-slate-800)]">
            <Check
              size={16}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-[var(--color-primary-700)]"
            />
            <span>{c}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-slate-50)] p-3 text-xs leading-relaxed text-[var(--color-muted)]">
        {column.certificationNote}
      </p>
    </div>
  );
}
