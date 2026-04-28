"use client";

/**
 * Lightweight contact form rendered as a modal-style overlay when the user
 * clicks "Send to Propharmex" on the preview card.
 *
 * Collects the minimum needed to route the inquiry:
 *   - Email (required) — replyTo on the BD email
 *   - Company (required) — pre-pended to the subject line
 *   - Name (optional)
 *   - Note (optional, free text)
 *
 * Validation is client-side soft (HTML5 + length checks); the route does
 * the authoritative Zod parse. We don't gate on Turnstile here — the route
 * is rate-limited and the conversation already produced a structured scope,
 * so abuse risk is low.
 *
 * Closes on success, on Escape, or on backdrop click.
 */
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  submitting: boolean;
  /** Set when the route returned 4xx/5xx — surfaces inline. */
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (contact: {
    email: string;
    company: string;
    name?: string;
    message?: string;
  }) => void;
}

export function SubmitDialog({
  open,
  submitting,
  errorMessage,
  onClose,
  onSubmit,
}: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Focus first field when the dialog opens.
  useEffect(() => {
    if (open) {
      firstFieldRef.current?.focus();
    }
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, submitting, onClose]);

  if (!open) return null;

  const canSubmit =
    email.trim().length > 0 && company.trim().length > 0 && !submitting;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-dialog-heading"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[color-mix(in_oklab,var(--color-fg)_55%,transparent)] px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_48px_-12px_rgba(15,32,80,0.35)]">
        <header className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
          <div>
            <h2
              id="submit-dialog-heading"
              className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]"
            >
              Send this scope to Propharmex
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--color-slate-800)]">
              Our business-development team replies within one Canadian
              business day.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="rounded-[var(--radius-xs)] p-1 text-[var(--color-muted)] hover:bg-[var(--color-slate-100)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X aria-hidden="true" size={16} />
          </button>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            onSubmit({
              email: email.trim(),
              company: company.trim(),
              name: name.trim() || undefined,
              message: message.trim() || undefined,
            });
          }}
          className="flex flex-col gap-3 px-5 py-4"
        >
          <Field label="Work email" required>
            <input
              ref={firstFieldRef}
              type="email"
              required
              autoComplete="email"
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg)] focus-visible:border-[var(--color-primary-700)] focus-visible:outline-none disabled:opacity-60"
            />
          </Field>
          <Field label="Company" required>
            <input
              type="text"
              required
              autoComplete="organization"
              maxLength={200}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={submitting}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg)] focus-visible:border-[var(--color-primary-700)] focus-visible:outline-none disabled:opacity-60"
            />
          </Field>
          <Field label="Name (optional)">
            <input
              type="text"
              autoComplete="name"
              maxLength={200}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg)] focus-visible:border-[var(--color-primary-700)] focus-visible:outline-none disabled:opacity-60"
            />
          </Field>
          <Field label="Anything else our team should know? (optional)">
            <textarea
              rows={3}
              maxLength={2000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={submitting}
              className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm leading-snug text-[var(--color-fg)] focus-visible:border-[var(--color-primary-700)] focus-visible:outline-none disabled:opacity-60"
            />
          </Field>

          {errorMessage ? (
            <p
              role="alert"
              className="rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[color-mix(in_oklab,var(--color-danger)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-danger)]"
            >
              {errorMessage}
            </p>
          ) : null}

          <p className="text-[11px] leading-snug text-[var(--color-muted)]">
            We use your email only to reply to this inquiry. We don&apos;t
            subscribe you to anything.
          </p>

          <div className="mt-1 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-fg)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-800)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send to Propharmex"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
        {label}
        {required ? (
          <span className="ml-1 text-[var(--color-primary-700)]">*</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}
