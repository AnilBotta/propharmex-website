import * as React from "react";
import { cn } from "../utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        "flex min-h-[88px] w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-3 py-2",
        "font-[family-name:var(--font-body)] text-base text-[var(--color-fg)] placeholder:text-[var(--color-muted)]",
        "transition-[border-color,box-shadow] duration-[var(--duration-exit)] ease-[var(--ease-out)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid
          ? "border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]"
          : "border-[var(--color-border)] hover:border-[var(--color-slate-400)]",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
