/**
 * FacilityMap — /facilities, RSC.
 *
 * An abstract two-hub schematic rather than a real map tile. Real
 * geography would be misleading at this zoom, and we do not publish street
 * coordinates on the marketing site until client confirmation of visit
 * protocols. The arc between the two city nodes is decorative.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import type { FacilitiesMap } from "../../content/facilities";

import { SectionReveal } from "./SectionReveal";

type Props = { content: FacilitiesMap };

export const FacilityMap: FC<Props> = ({ content }) => {
  return (
    <section
      id="map"
      aria-labelledby="facilities-map-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="facilities-map-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-10">
            <svg
              aria-hidden="true"
              viewBox="0 0 900 220"
              className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient
                  id="hub-arc"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                  gradientUnits="objectBoundingBox"
                >
                  <stop offset="0%" stopColor="var(--color-primary-300)" />
                  <stop offset="100%" stopColor="var(--color-primary-700)" />
                </linearGradient>
              </defs>
              <path
                d="M 150 150 Q 450 10 750 150"
                fill="none"
                stroke="url(#hub-arc)"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
              <circle cx="150" cy="150" r="7" fill="var(--color-primary-700)" />
              <circle cx="750" cy="150" r="7" fill="var(--color-primary-700)" />
            </svg>

            <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
              {content.hubs.map((hub) => (
                <article
                  key={hub.code}
                  className="relative rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-xs)]"
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                    >
                      <MapPin size={20} />
                    </span>
                    <div>
                      <p className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-fg)]">
                        {hub.label}
                        <span className="ml-2 text-sm font-medium text-[var(--color-muted)]">
                          {hub.country}
                        </span>
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--color-slate-800)]">
                        {hub.role}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
                      {hub.coordinates.lat.toFixed(2)}°{" "}
                      {hub.coordinates.lat >= 0 ? "N" : "S"} ·{" "}
                      {Math.abs(hub.coordinates.lng).toFixed(2)}°{" "}
                      {hub.coordinates.lng >= 0 ? "E" : "W"}
                    </span>
                    <Link
                      href={`/facilities/${hub.code === "mississauga" ? "mississauga-canada" : "hyderabad-india"}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-primary-700)] underline underline-offset-2"
                    >
                      Site detail
                      <ArrowRight size={12} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <p className="relative mt-6 text-xs leading-relaxed text-[var(--color-muted)]">
              {content.caveat}
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
