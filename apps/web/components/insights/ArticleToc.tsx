"use client";

/**
 * ArticleToc — sticky right-side ToC for /insights/[slug], client island.
 *
 * Renders only on xl+ viewports (hidden on mobile/tablet to preserve reading
 * width). Active heading is tracked via a single IntersectionObserver across
 * all h2/h3 ids in the article body. Updates are coalesced through
 * requestAnimationFrame to avoid layout thrash on rapid scroll.
 *
 * Accessibility:
 *  - The ToC is wrapped in <nav aria-label="Table of contents">.
 *  - Each link is a real anchor; clicking smooth-scrolls (or, under
 *    reduced-motion, jumps) to the target heading.
 *  - The active item gets aria-current="location".
 *
 * Empty-headings case (during the body-authoring period): the component
 * null-renders if the input list is empty so the layout never shows an
 * empty rail.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { FC } from "react";

import { useReducedMotion } from "@propharmex/ui";

import type { ArticleBlock } from "../../content/insights";

type TocEntry = { id: string; label: string; level: 2 | 3 };

type Props = { blocks: ArticleBlock[] };

export const ArticleToc: FC<Props> = ({ blocks }) => {
  const entries = useMemo<TocEntry[]>(
    () =>
      blocks
        .filter(
          (b): b is Extract<ArticleBlock, { type: "h2" | "h3" }> =>
            b.type === "h2" || b.type === "h3",
        )
        .map((b) => ({
          id: b.id,
          label: b.text,
          level: b.type === "h2" ? 2 : 3,
        })),
    [blocks],
  );

  const [activeId, setActiveId] = useState<string | null>(
    entries[0]?.id ?? null,
  );
  const reduce = useReducedMotion();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (entries.length === 0) return;

    const elements = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (intersections) => {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
        }
        rafRef.current = requestAnimationFrame(() => {
          // Pick the topmost intersecting heading; fall back to the closest
          // above the viewport when nothing is intersecting (rare during
          // momentum scroll past the last heading).
          const intersecting = intersections
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) =>
                a.boundingClientRect.top - b.boundingClientRect.top,
            );
          if (intersecting[0]) {
            setActiveId(intersecting[0].target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 1],
      },
    );

    for (const el of elements) observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [entries]);

  if (entries.length === 0) return null;

  function onLinkClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    setActiveId(id);
    target.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
    // Update the URL hash without triggering another scroll.
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
  }

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto pr-4 xl:block"
    >
      <p className="font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
        On this page
      </p>
      <ul className="mt-3 space-y-1.5 border-l border-[var(--color-border)] pl-3 text-sm">
        {entries.map((entry) => {
          const isActive = entry.id === activeId;
          return (
            <li
              key={entry.id}
              className={entry.level === 3 ? "pl-3" : undefined}
            >
              <a
                href={`#${entry.id}`}
                onClick={(e) => onLinkClick(e, entry.id)}
                aria-current={isActive ? "location" : undefined}
                className={`block leading-snug transition ${
                  isActive
                    ? "font-semibold text-[var(--color-primary-700)]"
                    : "text-[var(--color-slate-800)] hover:text-[var(--color-primary-700)]"
                }`}
              >
                {entry.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
