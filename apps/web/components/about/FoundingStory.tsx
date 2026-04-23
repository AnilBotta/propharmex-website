/**
 * FoundingStory — RSC.
 *
 * Page hero for /about. Renders the eyebrow + headline + lede in the initial
 * HTML (LCP candidate), then an anchor stat card tied to a primary Health
 * Canada source. Body paragraphs are wrapped in SectionReveal for stagger.
 */
import type { FC } from "react";

import type { AboutFounding } from "../../content/about";

import { SectionReveal } from "./SectionReveal";

type Props = { content: AboutFounding };

export const FoundingStory: FC<Props> = ({ content }) => {
  const anchorSource = content.anchor.source;

  return (
    <section
      aria-labelledby="about-founding-heading"
      className="relative scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <header className="lg:col-span-8">
            <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              {content.eyebrow}
            </p>
            <h1
              id="about-founding-heading"
              className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl lg:text-[clamp(2rem,3.4vw,3rem)] lg:leading-[1.08]"
            >
              {content.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)] sm:text-lg">
              {content.lede}
            </p>
          </header>
        </div>

        <SectionReveal className="mt-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-5 lg:col-span-7">
              {content.body.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-[var(--color-slate-800)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <aside className="lg:col-span-5">
              <figure className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <div className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-none tracking-tight text-[var(--color-primary-700)] tabular-nums sm:text-5xl">
                  {content.anchor.value}
                </div>
                <figcaption className="text-sm leading-snug text-[var(--color-slate-800)]">
                  {content.anchor.label}
                </figcaption>
                {anchorSource.kind === "primary" ? (
                  <p className="text-xs leading-snug text-[var(--color-muted)]">
                    Source:{" "}
                    <a
                      href={anchorSource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-[var(--color-primary-700)]"
                    >
                      {anchorSource.label}
                    </a>
                  </p>
                ) : (
                  <p className="text-xs leading-snug text-[var(--color-muted)]">
                    {anchorSource.label}
                  </p>
                )}
              </figure>
            </aside>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
