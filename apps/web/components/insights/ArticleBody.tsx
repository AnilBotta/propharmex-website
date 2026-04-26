/**
 * ArticleBody — /insights/[slug] body block renderer, RSC.
 *
 * Dispatches over the `ArticleBlock` discriminated union. Each block type has
 * a small named renderer below; the dispatcher is exhaustive and a type-level
 * `never` check guards future block additions.
 *
 * Empty-body case: when commits 4–6 have not yet authored an article body,
 * the dispatcher renders a small "Body forthcoming" stub. This keeps the
 * route from rendering blank while preserving SEO meta + JSON-LD on the
 * detail page.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Info, ShieldAlert, Quote } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { ArticleBlock, ArticleContent } from "../../content/insights";

type Props = { content: ArticleContent };

export const ArticleBody: FC<Props> = ({ content }) => {
  if (content.body.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-slate-50)] p-8 text-sm text-[var(--color-slate-800)]">
        <p className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-fg)]">
          Body forthcoming
        </p>
        <p className="mt-2">
          This article&rsquo;s body lands in a separate commit gated on a
          brand-voice-guardian PASS. The detail layout, metadata, and
          JSON-LD are live; the prose follows.
        </p>
      </div>
    );
  }

  return (
    <article
      className="prose prose-slate max-w-none prose-headings:font-[family-name:var(--font-display)] prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--color-fg)] prose-p:text-[var(--color-slate-800)] prose-p:leading-relaxed prose-strong:text-[var(--color-fg)] prose-a:text-[var(--color-primary-700)] prose-a:underline-offset-2 prose-li:text-[var(--color-slate-800)]"
      aria-labelledby="ins-article-hero-heading"
    >
      {content.body.map((block, idx) => (
        <BlockRenderer key={`b-${idx}`} block={block} />
      ))}
    </article>
  );
};

/* -------------------------------------------------------------------------- */
/*  Dispatcher                                                                */
/* -------------------------------------------------------------------------- */

function BlockRenderer({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "h2":
      return <h2 id={block.id}>{block.text}</h2>;
    case "h3":
      return <h3 id={block.id}>{block.text}</h3>;
    case "ul":
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    case "blockquote":
      return (
        <blockquote className="not-prose my-6 rounded-[var(--radius-md)] border-l-4 border-[var(--color-primary-600)] bg-[var(--color-slate-50)] px-5 py-4 text-base italic leading-relaxed text-[var(--color-slate-800)]">
          {block.text}
          {block.cite ? (
            <footer className="mt-2 not-italic text-xs text-[var(--color-muted)]">
              — {block.cite}
            </footer>
          ) : null}
        </blockquote>
      );
    case "callout":
      return <CalloutBlock block={block} />;
    case "figure":
      return <FigureBlock block={block} />;
    case "pullquote":
      return <PullquoteBlock block={block} />;
    case "inline-cta":
      return <InlineCtaBlock block={block} />;
    default: {
      // Exhaustiveness guard — adding a new block type without updating this
      // switch is a compile error, not a runtime null.
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  Callout                                                                   */
/* -------------------------------------------------------------------------- */

function CalloutBlock({
  block,
}: {
  block: Extract<ArticleBlock, { type: "callout" }>;
}) {
  const tone = block.tone;
  const Icon = tone === "regulatory" ? ShieldAlert : tone === "caveat" ? Info : Info;
  const accent =
    tone === "regulatory"
      ? "border-[var(--color-primary-600)] bg-[var(--color-primary-50)]"
      : tone === "caveat"
        ? "border-[var(--color-border)] bg-[var(--color-slate-50)]"
        : "border-[var(--color-border)] bg-[var(--color-surface)]";
  const iconColor =
    tone === "regulatory"
      ? "text-[var(--color-primary-700)]"
      : "text-[var(--color-muted)]";

  return (
    <aside
      className={`not-prose my-6 flex gap-3 rounded-[var(--radius-md)] border ${accent} p-4`}
      aria-label={
        tone === "regulatory"
          ? "Regulatory callout"
          : tone === "caveat"
            ? "Caveat"
            : "Note"
      }
    >
      <Icon
        aria-hidden="true"
        size={18}
        className={`mt-0.5 shrink-0 ${iconColor}`}
      />
      <div className="text-sm leading-relaxed text-[var(--color-slate-800)]">
        {block.heading ? (
          <p className="font-semibold text-[var(--color-fg)]">
            {block.heading}
          </p>
        ) : null}
        <p className={block.heading ? "mt-1" : ""}>{block.body}</p>
        {block.source ? (
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Source:{" "}
            {block.source.kind === "primary" ? (
              <a
                href={block.source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary-700)] underline underline-offset-2"
              >
                {block.source.label}
              </a>
            ) : (
              <span>{block.source.label}</span>
            )}
          </p>
        ) : null}
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*  Figure                                                                    */
/* -------------------------------------------------------------------------- */

function FigureBlock({
  block,
}: {
  block: Extract<ArticleBlock, { type: "figure" }>;
}) {
  // Until image assets are uploaded to Sanity, figures render as a labelled
  // placeholder frame keyed by `svgId`. The id is referenced by future SVG
  // sprite components; today the placeholder is a captioned card so the
  // article reads cleanly without raster art.
  return (
    <figure className="not-prose my-8">
      <div
        role="img"
        aria-label={block.alt}
        className="grid aspect-[16/9] w-full place-items-center rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-slate-50)]"
      >
        <div className="flex flex-col items-center gap-1 text-[var(--color-muted)]">
          <FileText aria-hidden="true" size={18} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">
            Figure · {block.svgId}
          </span>
        </div>
      </div>
      {block.caption ? (
        <figcaption className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">
          {block.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pullquote                                                                 */
/* -------------------------------------------------------------------------- */

function PullquoteBlock({
  block,
}: {
  block: Extract<ArticleBlock, { type: "pullquote" }>;
}) {
  return (
    <aside
      className="not-prose my-8 border-l-4 border-[var(--color-primary-600)] pl-5"
      aria-label="Pull quote"
    >
      <Quote
        aria-hidden="true"
        size={18}
        className="text-[var(--color-primary-600)]"
      />
      <p className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold leading-snug tracking-tight text-[var(--color-fg)]">
        {block.text}
      </p>
      {block.attribution ? (
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          — {block.attribution}
        </p>
      ) : null}
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inline CTA                                                                */
/* -------------------------------------------------------------------------- */

function InlineCtaBlock({
  block,
}: {
  block: Extract<ArticleBlock, { type: "inline-cta" }>;
}) {
  return (
    <aside
      className="not-prose my-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-slate-50)] p-5 sm:p-6"
      aria-label="Inline call to action"
    >
      <p className="font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
        {block.eyebrow}
      </p>
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
        {block.heading}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
        {block.body}
      </p>
      <div className="mt-4">
        <Button asChild variant={block.cta.variant} size="md">
          <Link href={block.cta.href}>
            {block.cta.label}
            <ArrowRight aria-hidden="true" size={14} />
          </Link>
        </Button>
      </div>
    </aside>
  );
}
