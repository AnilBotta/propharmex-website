import Link from "next/link";
import { ArrowUpRight, UserRound } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { LeadershipSection } from "../../content/home";

interface Props { content: LeadershipSection }

export function Leadership({ content }: Props) {
  return (
    <section
      aria-labelledby="home-leadership-heading"
      className="bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              {content.eyebrow}
            </p>
            <h2
              id="home-leadership-heading"
              className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
            >
              {content.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
              {content.subhead}
            </p>
          </div>
          <Button asChild variant="secondary" size="md" className="self-start">
            <Link href={content.ctaHref}>
              {content.ctaLabel}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {content.leaders.map((l) => (
            <li
              key={l.id}
              className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <div
                aria-hidden="true"
                className="grid size-14 place-items-center rounded-[var(--radius-full)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
              >
                <UserRound size={22} />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
                  {l.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-primary-700)]">{l.role}</p>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                {l.credential}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
