import * as React from "react";
import { cn } from "../utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Renders in an error state with aria-invalid applied. */
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", invalid, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        "flex h-11 w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-3 py-2 text-base",
        "font-[family-name:var(--font-body)] text-[var(--color-fg)] placeholder:text-[var(--color-muted)]",
        "transition-[border-color,box-shadow] duration-[var(--duration-exit)] ease-[var(--ease-out)]",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
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
Input.displayName = "Input";
