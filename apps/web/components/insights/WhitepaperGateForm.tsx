"use client";

/**
 * WhitepaperGateForm — gated download form, client island.
 *
 * Posts to POST /api/whitepaper-download. The route validates the payload,
 * sends the download link via Resend (when configured) or returns a queued
 * flag so the UX still works in environments without Resend wired up.
 *
 * MVP scope (Prompt 15, plan §B):
 *  - Validate name + email + company + role + country + use case
 *  - On success, show a confirmation panel with the direct download link
 *    so the user can save the asset immediately even before email arrives
 *  - Email-based double-opt-in and a 3-step nurture sequence are deferred
 *    to Prompt 17 (contact router) where the classifier and nurture
 *    infrastructure live together
 *
 * No Turnstile yet — the spec wires Turnstile in Prompt 25 hardening.
 */
import { useState } from "react";
import type { FormEvent } from "react";

import { Button, Callout, Input, Textarea, cn } from "@propharmex/ui";

import { trackFormSubmit, trackWhitepaperDownload } from "../../lib/analytics";
import type { WhitepaperContent } from "../../content/insights";

type State =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

type FormValues = {
  fullName: string;
  email: string;
  company: string;
  role: string;
  country: string;
  useCase: string;
};

const COUNTRIES = [
  "Canada",
  "United States",
  "United Kingdom",
  "European Union",
  "India",
  "Australia",
  "Other",
];

const ROLES = [
  "Regulatory affairs",
  "CMC / quality",
  "Manufacturing",
  "Procurement",
  "Business development",
  "Executive / founder",
  "Other",
];

type Props = {
  content: WhitepaperContent;
  className?: string;
};

export function WhitepaperGateForm({ content, className }: Props) {
  const [state, setState] = useState<State>({ status: "idle" });
  const [values, setValues] = useState<FormValues>({
    fullName: "",
    email: "",
    company: "",
    role: "",
    country: "",
    useCase: "",
  });

  const submitting = state.status === "submitting";

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/whitepaper-download", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug: content.slug,
          ...values,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(
          typeof body?.error === "string"
            ? body.error
            : "We could not process that request. Please try again.",
        );
      }

      let queued = false;
      try {
        const body = (await res.clone().json()) as { queued?: unknown };
        queued = body?.queued === true;
      } catch {
        // ignore — telemetry is fire-and-forget
      }
      trackFormSubmit({ form: "whitepaper", category: content.slug, queued });
      trackWhitepaperDownload({ slug: content.slug, queued });

      setState({ status: "success" });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error
            ? err.message
            : "We could not process that request. Please try again.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div className={cn("space-y-4", className)}>
        <Callout tone="success" title="Download is ready">
          We have emailed you a copy. The direct link below is also valid for
          this session.
        </Callout>
        <a
          href={content.pdfPath}
          download
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-primary-600)] bg-[var(--color-primary-700)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)] transition hover:bg-[var(--color-primary-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
        >
          Download {content.title} (PDF)
        </a>
        <p className="text-xs text-[var(--color-muted)]">
          {content.formDisclaimer}
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6",
        className,
      )}
      aria-labelledby="ins-wp-form-heading"
    >
      <div className="mb-5">
        <h2
          id="ins-wp-form-heading"
          className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]"
        >
          Get the whitepaper
        </h2>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Verified business contacts only. We will email the download and one
          short follow-up.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Full name" htmlFor="wp-fullname" required>
          <Input
            id="wp-fullname"
            required
            autoComplete="name"
            value={values.fullName}
            onChange={(e) => update("fullName", e.target.value)}
          />
        </Field>
        <Field label="Work email" htmlFor="wp-email" required>
          <Input
            id="wp-email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>
        <Field label="Company" htmlFor="wp-company" required>
          <Input
            id="wp-company"
            required
            autoComplete="organization"
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </Field>
        <Field label="Role" htmlFor="wp-role" required>
          <NativeSelect
            id="wp-role"
            required
            value={values.role}
            onChange={(e) => update("role", e.target.value)}
          >
            <option value="" disabled>
              Select a role
            </option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Country" htmlFor="wp-country" required>
          <NativeSelect
            id="wp-country"
            required
            value={values.country}
            onChange={(e) => update("country", e.target.value)}
          >
            <option value="" disabled>
              Select a country
            </option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field
          label="Use case"
          htmlFor="wp-usecase"
          helper="One sentence — helps us tailor any follow-up."
          className="sm:col-span-2"
        >
          <Textarea
            id="wp-usecase"
            rows={3}
            value={values.useCase}
            onChange={(e) => update("useCase", e.target.value)}
            placeholder="e.g. Evaluating a CDMO for a Canadian + US filing on a sterile injectable."
          />
        </Field>
      </div>

      {state.status === "error" ? (
        <p className="mt-4 text-xs text-[var(--color-danger)]" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" variant="primary" size="md" disabled={submitting}>
          {submitting ? "Sending…" : "Email me the download"}
        </Button>
        <p className="text-[11px] leading-relaxed text-[var(--color-muted)] sm:max-w-xs sm:text-right">
          {content.formDisclaimer}
        </p>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Field shell                                                               */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  htmlFor,
  required,
  helper,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  helper?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium text-[var(--color-fg)]">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-[var(--color-danger)]">
            *
          </span>
        ) : null}
      </span>
      {children}
      {helper ? (
        <span className="text-[11px] leading-relaxed text-[var(--color-muted)]">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*  Native select — matches the Input visual treatment                        */
/* -------------------------------------------------------------------------- */

function NativeSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-base text-[var(--color-fg)] transition hover:border-[var(--color-slate-400)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
        className,
      )}
    >
      {children}
    </select>
  );
}
