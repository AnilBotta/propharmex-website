import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

import { Badge, Button } from "@propharmex/ui";

import type { MatcherSection } from "../../content/home";
import { ScientificPathwayVisual } from "../visuals/ScientificPathwayVisual";

interface Props {
  content: MatcherSection;
}

export function MatcherTeaser({ content }: Props) {
  return (
    <section
      aria-labelledby="home-matcher-heading"
      className="bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-surface)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
            <div className="flex flex-col gap-0">
              <div className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-primary-200)] bg-[var(--color-surface)] px-3 py-1">
                <Sparkles
                  size={13}
                  aria-hidden="true"
                  className="text-[var(--color-primary-700)]"
                />
                <span className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
                  {content.eyebrow}
                </span>
              </div>

              <h2
                id="home-matcher-heading"
                className="mt-5 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
              >
                {content.heading}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)]">
                {content.body}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {content.chips.map((chip) => (
                  <li key={chip.id}>
                    <Badge
                      variant="outline"
                      className="border-[var(--color-primary-200)] bg-[var(--color-surface)] text-[var(--color-primary-900)]"
                    >
                      {chip.label}
                    </Badge>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild variant="primary" size="lg">
                  <Link href={content.ctaHref}>
                    {content.ctaLabel}
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </Button>
                <p className="text-xs text-[var(--color-muted)] sm:ml-2 sm:max-w-md">
                  {content.disclaimer}
                </p>
              </div>
            </div>

            <div className="lg:translate-y-2">
              <ScientificPathwayVisual
                eyebrow={content.visual.eyebrow}
                heading={content.visual.heading}
                nodes={content.visual.nodes}
                summaryLabel={content.visual.summaryLabel}
                summary={content.visual.summary}
                tone="ai"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
