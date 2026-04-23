"use client";

/**
 * ChapterRail — sticky right-side progress rail for the Why page.
 *
 * Behavior:
 *  - Hidden on <lg. On lg+ it is `position: fixed` on the right edge, centered
 *    vertically. It is intentionally NOT inside the scroll container so it
 *    never causes layout shift as the page grows.
 *  - Uses ONE IntersectionObserver with all six chapters as targets. The most
 *    visible chapter (highest intersection ratio, with a deterministic tie-break
 *    on DOM order) becomes active. Updates go through a single rAF tick to
 *    avoid thrashing when multiple entries fire in the same callback.
 *  - Click / Enter on a node smooth-scrolls to that chapter by id.
 *    Reduced-motion users get `behavior: "auto"` (no smooth scroll).
 *  - 44px minimum hit target on every rail button. Ring focus styles preserved
 *    for keyboard users. `aria-current="step"` flags the active node.
 *
 * Performance note: we never attach scroll/resize listeners. The observer does
 * the work. The only React state is the active chapter id.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useReducedMotion } from "@propharmex/ui";

import type { WhyChapter } from "../../content/why";

type Props = {
  chapters: WhyChapter[];
  ariaLabel: string;
};

export function ChapterRail({ chapters, ariaLabel }: Props) {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? "");
  const reduce = useReducedMotion();
  const frameRef = useRef<number | null>(null);

  const chapterIds = useMemo(() => chapters.map((c) => c.id), [chapters]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;

    const order = new Map<string, number>(
      chapterIds.map((id, i) => [id, i]),
    );
    const ratios = new Map<string, number>();

    const flush = () => {
      frameRef.current = null;
      let bestId = "";
      let bestRatio = -1;
      let bestOrder = Number.POSITIVE_INFINITY;
      ratios.forEach((ratio, id) => {
        if (ratio <= 0) return;
        const ord = order.get(id) ?? Number.POSITIVE_INFINITY;
        if (
          ratio > bestRatio ||
          (ratio === bestRatio && ord < bestOrder)
        ) {
          bestRatio = ratio;
          bestOrder = ord;
          bestId = id;
        }
      });
      if (bestId) {
        setActiveId((prev) => (prev === bestId ? prev : bestId));
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.chapterId;
          if (!id) continue;
          ratios.set(id, entry.intersectionRatio);
        }
        if (frameRef.current === null) {
          frameRef.current = window.requestAnimationFrame(flush);
        }
      },
      {
        // Trim header + footer zones; the "active" chapter is whichever occupies
        // the middle band of the viewport.
        rootMargin: "-30% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    const targets: Element[] = [];
    for (const id of chapterIds) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        targets.push(el);
      }
    }

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      for (const el of targets) observer.unobserve(el);
      observer.disconnect();
    };
  }, [chapterIds]);

  const scrollToChapter = useCallback(
    (id: string) => {
      if (typeof window === "undefined") return;
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
      // Keyboard users expect focus to move with the scroll.
      el.setAttribute("tabindex", "-1");
      (el as HTMLElement).focus({ preventScroll: true });
    },
    [reduce],
  );

  return (
    <nav
      aria-label={ariaLabel}
      className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <ol className="pointer-events-auto flex flex-col gap-1 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)]/90 px-2 py-3 shadow-[var(--shadow-sm)] backdrop-blur">
        {chapters.map((chapter, i) => {
          const active = chapter.id === activeId;
          return (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() => scrollToChapter(chapter.id)}
                aria-current={active ? "step" : undefined}
                aria-label={`Chapter ${i + 1} — ${chapter.railLabel}`}
                className="group flex min-h-11 min-w-11 items-center justify-center gap-3 rounded-[var(--radius-full)] px-2 py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
              >
                <span
                  aria-hidden="true"
                  className={[
                    "inline-block rounded-full transition-[background-color,transform,border-color] duration-[var(--duration-exit)] ease-[var(--ease-out)]",
                    active
                      ? "size-3 bg-[var(--color-primary-600)] scale-110"
                      : "size-2.5 border border-[var(--color-border)] bg-transparent group-hover:border-[var(--color-primary-600)]",
                  ].join(" ")}
                />
                <span
                  className={[
                    "font-[family-name:var(--font-display)] text-xs tracking-tight transition-colors duration-[var(--duration-exit)] ease-[var(--ease-out)]",
                    active
                      ? "text-[var(--color-primary-700)]"
                      : "text-[var(--color-muted)] group-hover:text-[var(--color-fg)]",
                  ].join(" ")}
                >
                  {chapter.railLabel}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
