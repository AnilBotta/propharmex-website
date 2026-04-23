/**
 * PhotoGallery — /facilities/[site] detail, RSC.
 *
 * Grid of PhotoFrame placeholders with captions. When real photos arrive,
 * update PhotoFrame's body — this component does not need to change.
 */
import type { FC } from "react";

import type { FacilityPhotoGallery } from "../../content/facilities";

import { PhotoFrame } from "./PhotoFrame";
import { SectionReveal } from "./SectionReveal";

type Props = { content: FacilityPhotoGallery };

export const PhotoGallery: FC<Props> = ({ content }) => {
  return (
    <section
      id="gallery"
      aria-labelledby="facility-gallery-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="facility-gallery-heading"
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
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Facility photography gallery"
          >
            {content.photos.map((photo) => (
              <li key={photo.id} className="list-none">
                <PhotoFrame photo={photo} />
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};
