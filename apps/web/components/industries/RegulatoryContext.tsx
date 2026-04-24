/**
 * RegulatoryContext — industry leaf frameworks block, RSC.
 *
 * One card per regulatory framework. Each card carries a claim-status pill
 * (`confirmed` / `under-confirmation` / `alignment`) and, when the status
 * references a primary source, an outbound link to that source.
 */
import type { FC } from "react";
import { BadgeCheck, CircleDashed, ExternalLink, Scale } from "lucide-react";

import type {
  IndustryClaimStatus,
  IndustryRegulatoryContext as ContextContent,
  IndustryRegulatoryTopic,
  IndustrySource,
} from "../../content/industries";

import { SectionReveal } from "./SectionReveal";

type Props = { content: ContextContent };

export const RegulatoryContext: FC<Props> = ({ content }) => {
  return (
    <section
      id="regulatory"
      aria-labelledby="ind-leaf-reg-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="ind-leaf-reg-heading"
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
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            aria-label="Regulatory frameworks"
          >
            {content.topics.map((topic) => (
              <li key={topic.id} className="list-none">
                <TopicCard topic={topic} />
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};

function TopicCard({ topic }: { topic: IndustryRegulatoryTopic }) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <StatusPill status={topic.status} />
      <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
        {topic.heading}
      </h3>
      <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
        {topic.body}
      </p>
      {topic.source ? <SourceLine source={topic.source} /> : null}
    </article>
  );
}

function StatusPill({ status }: { status: IndustryClaimStatus }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex items-center gap-1 self-start rounded-[var(--radius-full)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
        <BadgeCheck aria-hidden="true" size={11} />
        Confirmed · held and verifiable
      </span>
    );
  }
  if (status === "under-confirmation") {
    return (
      <span className="inline-flex items-center gap-1 self-start rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
        <CircleDashed aria-hidden="true" size={11} />
        Under confirmation
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 self-start rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
      <Scale aria-hidden="true" size={11} />
      Alignment · operating against framework
    </span>
  );
}

function SourceLine({ source }: { source: IndustrySource }) {
  if (source.kind === "primary") {
    return (
      <p className="mt-auto text-xs leading-relaxed text-[var(--color-muted)]">
        <a
          href={source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[var(--color-primary-700)] underline underline-offset-2"
        >
          {source.label}
          <ExternalLink size={11} aria-hidden="true" />
        </a>
      </p>
    );
  }
  return (
    <p className="mt-auto text-xs leading-relaxed text-[var(--color-muted)]">
      {source.label}
    </p>
  );
}
