import Image from "next/image";

import type { WhatWeDoSection } from "../../content/home";

import { WhatWeDoCard } from "./WhatWeDoCard";

interface Props {
  content: WhatWeDoSection;
}

export function WhatWeDo({ content }: Props) {
  return (
    <section
      aria-labelledby="home-whatwedo-heading"
      className="bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-md)]">
          <Image
            src="/capabilities.png"
            alt="Four pharmaceutical capability areas and one development pathway"
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="mt-10 flex max-w-3xl flex-col gap-3">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="home-whatwedo-heading"
            className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.cards.map((card) => (
            <li key={card.id} className="h-full">
              <WhatWeDoCard card={card} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
