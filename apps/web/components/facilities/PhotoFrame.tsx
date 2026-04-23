/**
 * PhotoFrame — reserved-shape placeholder for Propharmex facility photography.
 *
 * We do not yet have approved photography (safe-defaults posture on Prompt 9).
 * Rather than ship fake stock images, this component reserves the final frame
 * dimensions with a branded gradient and the eventual caption. The frame
 * contract (`caption`, `aspect`, `tone`) does not change when photography
 * arrives — at that point, replace the body of this component with a
 * `next/image` that consumes a Sanity-backed `PhotoStub.src` and `blurDataURL`.
 */
import type { FC } from "react";
import { ImageOff } from "lucide-react";

import type { PhotoStub } from "../../content/facilities";

type Props = {
  photo: PhotoStub;
  /** Shows the caption overlaid on the frame; default true. */
  showCaption?: boolean;
  className?: string;
};

const TONE_CLASS: Record<PhotoStub["tone"], string> = {
  brand:
    "from-[var(--color-primary-100)] via-[var(--color-primary-50)] to-[var(--color-slate-50)]",
  neutral:
    "from-[var(--color-slate-100)] via-[var(--color-slate-50)] to-[var(--color-surface)]",
  warm:
    "from-[var(--color-slate-50)] via-[var(--color-primary-50)] to-[var(--color-primary-100)]",
};

const ASPECT_CLASS: Record<PhotoStub["aspect"], string> = {
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-[16/9]",
  "1/1": "aspect-square",
};

export const PhotoFrame: FC<Props> = ({
  photo,
  showCaption = true,
  className = "",
}) => {
  return (
    <figure
      className={`group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] ${className}`}
    >
      <div
        role="img"
        aria-label={photo.caption}
        className={`flex ${ASPECT_CLASS[photo.aspect]} w-full items-center justify-center bg-gradient-to-br ${TONE_CLASS[photo.tone]}`}
      >
        <div className="flex flex-col items-center gap-2 px-6 text-center text-[var(--color-muted)]">
          <ImageOff aria-hidden="true" size={20} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
            Photography reserved
          </span>
        </div>
      </div>
      {showCaption ? (
        <figcaption className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-xs leading-relaxed text-[var(--color-slate-800)]">
          {photo.caption}
        </figcaption>
      ) : null}
    </figure>
  );
};
