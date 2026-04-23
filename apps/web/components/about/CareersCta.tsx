/**
 * CareersCta — RSC.
 *
 * Two-action block at the bottom of /about. Primary action routes to /contact
 * with the `about-careers` source tag so the contact route can attribute the
 * inbound.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { AboutCareersCta as Content } from "../../content/about";

type Props = { content: Content };

export const CareersCta: FC<Props> = ({ content }) => {
  return (
    <section
      id="careers"
      aria-labelledby="about-careers-heading"
      className="border-t border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-7">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="about-careers-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.body}
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end lg:justify-end">
          {content.actions.map((action) => (
            <Button
              key={action.href}
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
          ))}
        </div>
      </div>
    </section>
  );
};
