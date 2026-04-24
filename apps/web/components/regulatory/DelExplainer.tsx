/**
 * DelExplainer — DEL leaf "what the DEL actually is" block, RSC.
 *
 * Three-topic card row anchored on GUI-0002 / Division 1A / DEL Register.
 * Each card surfaces its own primary-source link so a reviewer can check the
 * regulatory wording directly.
 */
import type { FC } from "react";
import { ExternalLink } from "lucide-react";

import type { DelExplainer as DelExplainerContent } from "../../content/regulatory-services";

import { SectionReveal } from "./SectionReveal";

type Props = { content: DelExplainerContent };

export const DelExplainer: FC<Props> = ({ content }) => {
  return (
    <section
      id="del-explainer"
      aria-labelledby="rs-leaf-explainer-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="rs-leaf-explainer-heading"
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
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
            aria-label="DEL explainer topics"
          >
            {content.topics.map((topic) => (
              <li key={topic.id} className="list-none">
                <article className="flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                    {topic.heading}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {topic.body}
                  </p>
                  {topic.source ? (
                    <p className="mt-auto text-xs leading-relaxed text-[var(--color-muted)]">
                      {topic.source.kind === "primary" ? (
                        <a
                          href={topic.source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[var(--color-primary-700)] underline underline-offset-2"
                        >
                          {topic.source.label}
                          <ExternalLink size={11} aria-hidden="true" />
                        </a>
                      ) : (
                        <span>{topic.source.label}</span>
                      )}
                    </p>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};
