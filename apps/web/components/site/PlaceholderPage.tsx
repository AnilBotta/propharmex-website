import Link from "next/link";

type Props = {
  title: string;
  promptRef: string;
  body?: string;
};

/**
 * Shared stub scaffold for routes the homepage links to but which are built in
 * later prompts (AI tools in Prompts 20–21, content hubs in Prompts 10–15).
 *
 * Every placeholder exports `metadata: { robots: { index: false } }` so these
 * never enter the index. Replace wholesale when the real prompt lands.
 */
export function PlaceholderPage({ title, promptRef, body }: Props) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center gap-6 px-4 py-24 sm:px-6 lg:px-8">
      <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
        Under construction — {promptRef}
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
        {title}
      </h1>
      <p className="text-base leading-relaxed text-[var(--color-slate-800)]">
        {body ??
          "This page is scheduled for a later prompt in the rebuild. Content, schema, and accessibility checks land with that prompt."}
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-[var(--color-primary-700)] underline-offset-4 hover:underline"
      >
        Return to the homepage
      </Link>
    </main>
  );
}
