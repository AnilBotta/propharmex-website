/**
 * Footprint — RSC.
 *
 * Schematic (not navigable) map of the two Propharmex hubs. Renders as an
 * inline SVG using an equirectangular projection of the lat/long values in
 * content.nodes. The map is `aria-hidden` — the two node cards below are the
 * canonical, accessible representation of the same information.
 *
 * We deliberately avoid a tile-based map here (MapLibre / Mapbox) — the
 * marketing site needs the visual cue, not interactivity. Performance budget
 * stays under 2 KB for the SVG plus text.
 */
import type { FC } from "react";

import type { AboutFootprint, AboutFootprintNode } from "../../content/about";

import { SectionReveal } from "./SectionReveal";

type Props = { content: AboutFootprint };

/** Equirectangular projection: lat/long → SVG viewBox 0..1000 x 0..500. */
function project({ lat, lng }: { lat: number; lng: number }): {
  x: number;
  y: number;
} {
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return { x, y };
}

export const Footprint: FC<Props> = ({ content }) => {
  const [a, b] = content.nodes;
  const pA = project(a.coordinates);
  const pB = project(b.coordinates);

  return (
    <section
      id="global-footprint"
      aria-labelledby="about-footprint-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="about-footprint-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-10">
          <figure className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <svg
              viewBox="0 0 1000 500"
              role="img"
              aria-hidden="true"
              className="block h-auto w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <rect
                x="0"
                y="0"
                width="1000"
                height="500"
                fill="var(--color-slate-50)"
              />
              {/* Latitude grid — 30° increments. */}
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <line
                  key={`lat-${i}`}
                  x1="0"
                  x2="1000"
                  y1={(i * 500) / 6}
                  y2={(i * 500) / 6}
                  stroke="var(--color-border)"
                  strokeWidth="0.5"
                />
              ))}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <line
                  key={`lng-${i}`}
                  y1="0"
                  y2="500"
                  x1={(i * 1000) / 12}
                  x2={(i * 1000) / 12}
                  stroke="var(--color-border)"
                  strokeWidth="0.5"
                />
              ))}

              {/* Great-circle-ish arc between hubs. Quadratic Bezier with a
                  control point lifted north to suggest a polar route. */}
              <path
                d={`M ${pA.x} ${pA.y} Q ${(pA.x + pB.x) / 2} ${Math.min(pA.y, pB.y) - 120} ${pB.x} ${pB.y}`}
                fill="none"
                stroke="var(--color-primary-600)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.7"
              />

              {/* Hub markers. */}
              {[
                { p: pA, label: a.city },
                { p: pB, label: b.city },
              ].map(({ p, label }) => (
                <g key={label}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="10"
                    fill="var(--color-primary-600)"
                    opacity="0.15"
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="var(--color-primary-700)"
                  />
                </g>
              ))}
            </svg>
            <figcaption className="sr-only">
              Schematic world map highlighting the Mississauga, Canada and
              Hyderabad, India hubs. Detailed capabilities for each hub follow
              below.
            </figcaption>
          </figure>

          <ul className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {content.nodes.map((node) => (
              <li key={node.id} className="list-none">
                <FootprintCard node={node} />
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              {content.distribution.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
              {content.distribution.body}
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

const FootprintCard: FC<{ node: AboutFootprintNode }> = ({ node }) => {
  return (
    <article className="flex h-full flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="font-[family-name:var(--font-mono)] text-xs font-semibold tracking-[0.08em] text-[var(--color-primary-700)]"
        >
          {node.countryCode}
        </span>
        <span
          aria-hidden="true"
          className="h-px w-8 bg-[var(--color-border)]"
        />
        <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          {node.country}
        </p>
      </div>
      <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-fg)]">
        {node.city}
      </h3>
      <p className="text-sm leading-relaxed text-[var(--color-primary-700)]">
        {node.role}
      </p>
      <ul className="mt-1 flex flex-col gap-2">
        {node.highlights.map((h) => (
          <li
            key={h}
            className="flex items-start gap-2 text-sm leading-relaxed text-[var(--color-slate-800)]"
          >
            <span
              aria-hidden="true"
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-primary-600)]"
            />
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </article>
  );
};
