/**
 * RegulatoryPosture — regulatory-services hub claim-status card row, RSC.
 *
 * Renders the three-tier convention from docs/regulatory-lexicon.md §26–39
 * (confirmed / under-confirmation / alignment) as three cards side-by-side.
 * Each card exposes either a primary-source link or a "Documentation on
 * request" affordance so a reviewer can tell, at a glance, what level of
 * evidence stands behind each claim.
 */
import type { FC } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

import type {
  RegulatoryClaimStatus,
  RegulatoryPosture as PostureContent,
  RegulatoryPostureCard,
} from "../../content/regulatory-services";

import { SectionReveal } from "./SectionReveal";

type Props = { content: PostureContent };

const STATUS_META: Record<
  RegulatoryClaimStatus,
  { icon: typeof CheckCircle2; tone: string; ring: string }
> = {
  confirmed: {
    icon: CheckCircle2,
    tone: "border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]",
    ring: "border-[var(--color-primary-600)]",
  },
  "under-confirmation": {
    icon: CircleDashed,
    tone: "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-slate-800)]",
    ring: "border-[var(--color-border)]",
  },
  alignment: {
    icon: ShieldCheck,
    tone: "border-[var(--color-border)] bg-[var(--color-slate-50)] text-[var(--color-slate-800)]",
    ring: "border-[var(--color-border)]",
  },
};

export const RegulatoryPosture: FC<Props> = ({ content }) => {
  return (
    <section
      id="posture"
      aria-labelledby="rs-hub-posture-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="rs-hub-posture-heading"
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
            aria-label="Claim-status tiers"
          >
            {content.cards.map((card) => (
              <li key={card.id} className="list-none">
                <PostureTierCard card={card} />
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};

function PostureTierCard({ card }: { card: RegulatoryPostureCard }) {
  const meta = STATUS_META[card.status];
  const Icon = meta.icon;
  return (
    <article
      className={`flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border ${meta.ring} bg-[var(--color-surface)] p-5`}
    >
      <span
        className={`inline-flex items-center gap-1.5 self-start rounded-[var(--radius-full)] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${meta.tone}`}
      >
        <Icon aria-hidden="true" size={11} />
        {card.status.replace("-", " ")}
      </span>
      <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
        {card.label}
      </h3>
      <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
        {card.description}
      </p>
      {card.source ? (
        <p className="mt-auto text-xs leading-relaxed text-[var(--color-muted)]">
          {card.source.kind === "primary" ? (
            <a
              href={card.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--color-primary-700)] underline underline-offset-2"
            >
              {card.source.label}
              <ExternalLink size={11} aria-hidden="true" />
            </a>
          ) : (
            <span>{card.source.label}</span>
          )}
        </p>
      ) : null}
      {card.affordanceLabel && card.affordanceHref ? (
        <Link
          href={card.affordanceHref}
          className="mt-auto inline-flex items-center gap-1 self-start rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-slate-800)] transition hover:border-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
        >
          {card.affordanceLabel}
        </Link>
      ) : null}
    </article>
  );
}
