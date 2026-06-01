import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { DelBannerSection } from "../../content/home";

interface Props { content: DelBannerSection }

export function DelBanner({ content }: Props) {
  return (
    <section aria-labelledby="home-del-heading" className="bg-[var(--color-bg)] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[var(--radius-xl)] border border-[var(--color-primary-200)] bg-[var(--color-primary-900)] p-8 text-[var(--color-primary-fg)] sm:p-12 lg:flex-row lg:items-center lg:gap-10">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[color-mix(in_oklab,var(--color-primary-fg)_15%,transparent)]"
          >
            <ShieldCheck size={22} />
          </span>
          <div className="flex-1">
            <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] opacity-80">
              {content.eyebrow}
            </p>
            <h2
              id="home-del-heading"
              className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              {content.heading}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-90 sm:text-base">
              {content.body}
            </p>
            <p className="mt-4 max-w-2xl text-xs leading-relaxed opacity-70">
              {content.disclaimer}
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="bg-[var(--color-primary-fg)] text-[var(--color-primary-900)] hover:bg-[color-mix(in_oklab,var(--color-primary-fg)_88%,white)] hover:text-[var(--color-primary-900)]"
          >
            <Link href={content.ctaHref}>
              {content.ctaLabel}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
