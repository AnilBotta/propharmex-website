import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /** Custom link renderer (e.g. Next.js `<Link>`). Defaults to plain `<a>`. */
  linkAs?: React.ElementType;
  /** Separator between items. */
  separator?: React.ReactNode;
}

/**
 * WCAG 2.1 AA: wrapped in <nav aria-label="Breadcrumb"> per W3C ARIA authoring
 * practice. The current page uses aria-current="page" and is rendered as text.
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      className,
      items,
      linkAs: LinkComponent = "a",
      separator,
      ...props
    },
    ref
  ) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn("text-sm text-[var(--color-muted)]", className)}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "truncate",
                    isLast && "text-[var(--color-fg)] font-medium"
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <LinkComponent
                  href={item.href}
                  className="truncate hover:text-[var(--color-primary-600)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] rounded-sm"
                >
                  {item.label}
                </LinkComponent>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-[var(--color-slate-400)]">
                  {separator ?? <ChevronRight size={14} />}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  )
);
Breadcrumb.displayName = "Breadcrumb";
