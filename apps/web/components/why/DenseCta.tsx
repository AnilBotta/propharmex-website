/**
 * DenseCta — final CTA block at the bottom of /why-propharmex.
 *
 * Three side-by-side cards on desktop (grid-cols-3), stack on mobile. Primary
 * action uses Button variant="primary", the others use "secondary" and "ghost"
 * per spec. The visible `<h2>` is the `aria-labelledby` target for the section.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, type LucideIcon } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { WhyCtaAction, WhyCtaBlock } from "../../content/why";

type Props = { content: WhyCtaBlock };

const ICONS: Record<WhyCtaAction["icon"], LucideIcon> = {
  calendar: Calendar,
  "book-open": BookOpen,
  "arrow-right": ArrowRight,
};

export const DenseCta: FC<Props> = ({ content }) => {
  return (
    <section
      aria-labelledby="why-cta-heading"
      className="border-t border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="why-cta-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.intro}
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {content.actions.map((action) => (
            <li key={action.id} className="list-none">
              <ActionCard action={action} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const ActionCard: FC<{ action: WhyCtaAction }> = ({ action }) => {
  const Icon = ICONS[action.icon];
  const primary = action.variant === "primary";

  return (
    <article
      className={[
        "flex h-full flex-col gap-5 rounded-[var(--radius-lg)] p-6",
        primary
          ? "bg-[var(--color-fg)] text-[var(--color-bg)]"
          : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)]",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "grid size-10 place-items-center rounded-[var(--radius-full)]",
          primary
            ? "bg-[var(--color-primary-600)] text-[var(--color-primary-fg)]"
            : "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]",
        ].join(" ")}
      >
        <Icon size={18} />
      </div>

      <div className="flex flex-col gap-2">
        <h3
          className={[
            "font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight",
            primary ? "text-[var(--color-bg)]" : "text-[var(--color-fg)]",
          ].join(" ")}
        >
          {action.label}
        </h3>
        <p
          className={[
            "text-sm leading-relaxed",
            primary
              ? "text-[var(--color-bg)]/80"
              : "text-[var(--color-slate-800)]",
          ].join(" ")}
        >
          {action.supporting}
        </p>
      </div>

      <div className="mt-auto pt-2">
        <Button
          asChild
          variant={action.variant}
          size="lg"
          className="min-h-11 w-full sm:w-auto"
        >
          <Link href={action.href}>
            {action.label}
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </Button>
      </div>
    </article>
  );
};
