"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** How many sibling pages to show on each side of current (default 1). */
  siblingCount?: number;
}

function getRange(current: number, total: number, siblings: number): (number | "ellipsis")[] {
  const totalPageNumbersToShow = siblings * 2 + 5; // first, last, current, 2*siblings, 2*ellipses slots
  if (total <= totalPageNumbersToShow) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  const pages: (number | "ellipsis")[] = [1];
  if (showLeftEllipsis) pages.push("ellipsis");
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== total) pages.push(i);
  }
  if (showRightEllipsis) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

/**
 * Accessible pagination. Uses <nav aria-label="Pagination"> and marks the
 * current page with aria-current="page". Keyboard: Tab to traverse, Enter/Space
 * to activate.
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    { className, currentPage, totalPages, onPageChange, siblingCount = 1, ...props },
    ref
  ) => {
    const pages = React.useMemo(
      () => getRange(currentPage, totalPages, siblingCount),
      [currentPage, totalPages, siblingCount]
    );

    const baseBtn =
      "inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--radius-sm)] px-3 text-sm font-medium border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors duration-[var(--duration-exit)] hover:border-[var(--color-primary-600)] hover:text-[var(--color-primary-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:pointer-events-none";

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn("flex items-center gap-1.5", className)}
        {...props}
      >
        <button
          type="button"
          className={baseBtn}
          aria-label="Previous page"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`e-${i}`}
              aria-hidden="true"
              className="inline-flex h-9 min-w-9 items-center justify-center text-[var(--color-muted)]"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? "page" : undefined}
              onClick={() => onPageChange(p)}
              className={cn(
                baseBtn,
                p === currentPage &&
                  "bg-[var(--color-primary-600)] text-[var(--color-primary-fg)] border-[var(--color-primary-600)] hover:text-[var(--color-primary-fg)]"
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          className={baseBtn}
          aria-label="Next page"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    );
  }
);
Pagination.displayName = "Pagination";
