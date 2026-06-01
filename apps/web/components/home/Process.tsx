import Image from "next/image";

import type { ProcessSection } from "../../content/home";

interface Props { content: ProcessSection }

export function Process({ content }: Props) {
  return (
    <section aria-labelledby="home-process-heading" className="bg-[var(--color-bg)] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="home-process-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.subhead}
          </p>
        </div>

        <div className="relative mt-12 aspect-[21/9] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-md)]">
          <Image
            src="/seven-step-roadmap.png"
            alt="Seven step pharmaceutical development journey roadmap"
            fill
            sizes="(min-width: 1024px) 1280px, 100vw"
            className="object-cover object-center"
          />
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {content.steps.map((s, i) => (
            <li
              key={s.step}
              className="flex min-h-[190px] flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex items-center gap-3">
                <StepNumber n={s.step} />
                <div aria-hidden="true" className="h-px flex-1 bg-[var(--color-border)]" />
                {i === content.steps.length - 1 ? null : (
                  <span className="text-xs uppercase tracking-[0.08em] text-[var(--color-muted)]">
                    next
                  </span>
                )}
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-fg)]">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                {s.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-full)] bg-[var(--color-primary-50)] font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--color-primary-700)]"
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}
