"use client";

/**
 * Newsletter signup form.
 *
 * POST /api/newsletter — the server handler runs Turnstile verification and
 * Resend double-opt-in (Phase 7 wires it to Resend Audiences).
 *
 * Double-opt-in is non-negotiable per PIPEDA (Canada), GDPR (EU/UK), and
 * DLD/DPDP (India). The UI never claims subscription — it says "check your
 * inbox" and lets the confirmation link flip the state.
 */
import { useState } from "react";
import type { FormEvent } from "react";
import {
  Button,
  Callout,
  Input,
  cn,
} from "@propharmex/ui";

import { NEWSLETTER } from "../../content/site-nav";

type State =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

export function NewsletterForm({ className }: { className?: string }) {
  const [state, setState] = useState<State>({ status: "idle" });
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  const submitting = state.status === "submitting";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      setState({
        status: "error",
        message: "Please confirm consent to receive briefings.",
      });
      return;
    }
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          typeof body?.error === "string" ? body.error : NEWSLETTER.errorGeneric,
        );
      }
      setState({ status: "success" });
      setEmail("");
      setConsent(false);
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : NEWSLETTER.errorGeneric,
      });
    }
  }

  if (state.status === "success") {
    return (
      <Callout tone="success" title="Subscription pending confirmation">
        {NEWSLETTER.successLabel}
      </Callout>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-3", className)}
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[var(--color-fg)]">
          {NEWSLETTER.emailLabel}
        </span>
        <Input
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={NEWSLETTER.emailPlaceholder}
          aria-invalid={state.status === "error" ? true : undefined}
        />
      </label>

      <label className="flex items-start gap-2 text-xs leading-relaxed text-[var(--color-muted)]">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 rounded-[var(--radius-xs)] border border-[var(--color-border)] accent-[var(--color-primary-600)]"
        />
        <span>{NEWSLETTER.consentLabel}</span>
      </label>

      {state.status === "error" && (
        <p className="text-xs text-[var(--color-danger)]" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" variant="primary" size="md" disabled={submitting}>
        {submitting ? NEWSLETTER.submittingLabel : NEWSLETTER.submitLabel}
      </Button>
    </form>
  );
}
