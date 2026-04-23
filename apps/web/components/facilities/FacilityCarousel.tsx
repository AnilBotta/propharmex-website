/**
 * FacilityCarousel — /facilities index, RSC.
 *
 * Horizontal scroll-snap rail of photo frames (reserved placeholders for now).
 * Kept as an RSC — the scroll-snap behaviour is pure CSS. When real photos
 * land, the `PhotoFrame` body swaps to `next/image`; the rail itself does not
 * need to become a client component.
 */
import type { FC } from "react";

import type { FacilitiesCarousel as FacilitiesCarouselContent } from "../../content/facilities";

import { PhotoFrame } from "./PhotoFrame";
import { SectionReveal } from "./SectionReveal";

type Props = { content: FacilitiesCarouselContent };

export const FacilityCarousel: FC<Props> = ({ content }) => {
  return (
    <section
      id="inside"
      aria-labelledby="facilities-carousel-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="facilities-carousel-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-10">
          <div
            role="region"
            aria-label="Facility photography rail"
            className="overflow-x-auto pb-2"
          >
            <ul className="flex snap-x snap-mandatory gap-5">
              {content.photos.map((photo) => (
                <li
                  key={photo.id}
                  className="w-[78vw] shrink-0 snap-start sm:w-[54vw] md:w-[40vw] lg:w-[28vw]"
                >
                  <PhotoFrame photo={photo} />
                </li>
              ))}
            </ul>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
