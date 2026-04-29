"use client";

/**
 * InquiryForm — /contact page primary inquiry form (Prompt 17, commit 3).
 *
 * Client island. useState pattern (no react-hook-form) per the decisions
 * locked at the start of Prompt 17. Posts JSON to /api/contact, which
 * accepts the extended Prompt-17 schema (name + role + region + service +
 * dosageForm + stage + message) on top of the Prompt-5 mini-form subset
 * (email + company + dosageForm + message).
 *
 * Eight fields:
 *   name, company, role, email, region, service, dosageForm, stage, message
 *   (dosageForm is conditional — visible only when service === "pharmaceutical-development";
 *    stays optional on the server schema so other paths submit cleanly).
 *
 * Success state hides the form and renders a confirmation panel with a
 * link that scrolls to the Cal.com booking section below.
 *
 * Prompt 24 added PostHog instrumentation (`form_submit` + `contact_submit`)
 * in the submit handler. Prompt 25 PR-A added the Cloudflare Turnstile
 * client widget — server-side verification was already wired in Prompt 17.
 *
 * Deferred (per Prompt 17 plan):
 *   - Per-region alias routing + AI classifier (Prompt 18+)
 */
import { useCallback, useId, useState, type FormEvent } from "react";

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@propharmex/ui";

import { trackContactSubmit, trackFormSubmit } from "../../lib/analytics";
import { TurnstileWidget } from "../site/TurnstileWidget";
import {
  DOSAGE_FORMS,
  REGIONS,
  ROLES,
  SERVICES,
  STAGES,
  type ContactContent,
} from "../../content/contact";

import { SectionReveal } from "./SectionReveal";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Props = { content: ContactContent["form"] };

type Status = "idle" | "submitting" | "success" | "error";

const SCROLL_TO_BOOKING_HASH = "#booking";

export function InquiryForm({ content }: Props) {
  const formId = useId();

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [dosageForm, setDosageForm] = useState<string>("");
  const [stage, setStage] = useState<string>("");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const showDosageForm = service === "pharmaceutical-development";

  // useCallback so the Turnstile widget's effect doesn't re-render the
  // widget on every keystroke (the callbacks are part of its dep array).
  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);
  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  function reset() {
    setName("");
    setCompany("");
    setRole("");
    setEmail("");
    setRegion("");
    setService("");
    setDosageForm("");
    setStage("");
    setMessage("");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          role: role || undefined,
          email,
          region: region || undefined,
          service: service || undefined,
          dosageForm: showDosageForm && dosageForm ? dosageForm : undefined,
          stage: stage || undefined,
          message: message || undefined,
          turnstileToken: turnstileToken || undefined,
        }),
      });

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(content.errorFallback);
        return;
      }

      // Best-effort parse — the server returns 202 with { ok, queued }.
      let queued: boolean | undefined;
      try {
        const body = (await res.clone().json()) as { queued?: unknown };
        if (typeof body?.queued === "boolean") queued = body.queued;
      } catch {
        // ignore — telemetry is fire-and-forget
      }

      const serviceTag = service || "unspecified";
      const regionTag = region || "unspecified";
      trackFormSubmit({ form: "contact", category: serviceTag, queued });
      trackContactSubmit({ service: serviceTag, region: regionTag, queued });

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      setErrorMessage(content.errorFallback);
    }
  }

  return (
    <section
      id="inquiry"
      aria-labelledby="contact-form-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="contact-form-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </SectionReveal>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionReveal>
            <p className="text-xs leading-relaxed text-[var(--color-muted)]">
              {content.disclaimer}
            </p>
          </SectionReveal>

          {status === "success" ? (
            <SectionReveal>
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] p-6"
              >
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-primary-900)]">
                  {content.successHeading}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-primary-900)]">
                  {content.successBody}
                </p>
                <Button asChild variant="primary" size="md" className="self-start">
                  <a href={SCROLL_TO_BOOKING_HASH}>{content.successCtaLabel}</a>
                </Button>
              </div>
            </SectionReveal>
          ) : (
            <SectionReveal>
              <form
                onSubmit={onSubmit}
                className="flex flex-col gap-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
                noValidate
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    id={`${formId}-name`}
                    label={content.fields.name.label}
                    helper={content.fields.name.helper}
                    required
                  >
                    {({ describedBy }) => (
                      <Input
                        id={`${formId}-name`}
                        type="text"
                        required
                        autoComplete="name"
                        aria-describedby={describedBy}
                        placeholder={content.fields.name.placeholder}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    )}
                  </Field>

                  <Field
                    id={`${formId}-company`}
                    label={content.fields.company.label}
                    helper={content.fields.company.helper}
                    required
                  >
                    {({ describedBy }) => (
                      <Input
                        id={`${formId}-company`}
                        type="text"
                        required
                        autoComplete="organization"
                        aria-describedby={describedBy}
                        placeholder={content.fields.company.placeholder}
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    )}
                  </Field>

                  <Field
                    id={`${formId}-role`}
                    label={content.fields.role.label}
                    helper={content.fields.role.helper}
                  >
                    {({ describedBy }) => (
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger
                          id={`${formId}-role`}
                          aria-label={content.fields.role.label}
                          aria-describedby={describedBy}
                        >
                          <SelectValue
                            placeholder={content.fields.role.selectPlaceholder}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>

                  <Field
                    id={`${formId}-email`}
                    label={content.fields.email.label}
                    helper={content.fields.email.helper}
                    required
                  >
                    {({ describedBy }) => (
                      <Input
                        id={`${formId}-email`}
                        type="email"
                        required
                        autoComplete="email"
                        aria-describedby={describedBy}
                        placeholder={content.fields.email.placeholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    )}
                  </Field>

                  <Field
                    id={`${formId}-region`}
                    label={content.fields.region.label}
                    helper={content.fields.region.helper}
                  >
                    {({ describedBy }) => (
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger
                          id={`${formId}-region`}
                          aria-label={content.fields.region.label}
                          aria-describedby={describedBy}
                        >
                          <SelectValue
                            placeholder={content.fields.region.selectPlaceholder}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {REGIONS.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>

                  <Field
                    id={`${formId}-service`}
                    label={content.fields.service.label}
                    helper={content.fields.service.helper}
                  >
                    {({ describedBy }) => (
                      <Select
                        value={service}
                        onValueChange={(v) => {
                          setService(v);
                          if (v !== "pharmaceutical-development") {
                            setDosageForm("");
                          }
                        }}
                      >
                        <SelectTrigger
                          id={`${formId}-service`}
                          aria-label={content.fields.service.label}
                          aria-describedby={describedBy}
                        >
                          <SelectValue
                            placeholder={content.fields.service.selectPlaceholder}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICES.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>

                  {showDosageForm ? (
                    <Field
                      id={`${formId}-dosage`}
                      label={content.fields.dosageForm.label}
                      helper={content.fields.dosageForm.helper}
                    >
                      {({ describedBy }) => (
                        <Select value={dosageForm} onValueChange={setDosageForm}>
                          <SelectTrigger
                            id={`${formId}-dosage`}
                            aria-label={content.fields.dosageForm.label}
                            aria-describedby={describedBy}
                          >
                            <SelectValue
                              placeholder={content.fields.dosageForm.selectPlaceholder}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {DOSAGE_FORMS.map((d) => (
                              <SelectItem key={d.id} value={d.id}>
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                  ) : null}

                  <Field
                    id={`${formId}-stage`}
                    label={content.fields.stage.label}
                    helper={content.fields.stage.helper}
                  >
                    {({ describedBy }) => (
                      <Select value={stage} onValueChange={setStage}>
                        <SelectTrigger
                          id={`${formId}-stage`}
                          aria-label={content.fields.stage.label}
                          aria-describedby={describedBy}
                        >
                          <SelectValue
                            placeholder={content.fields.stage.selectPlaceholder}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {STAGES.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                </div>

                <Field
                  id={`${formId}-message`}
                  label={content.fields.message.label}
                  helper={content.fields.message.helper}
                >
                  {({ describedBy }) => (
                    <Textarea
                      id={`${formId}-message`}
                      rows={5}
                      aria-describedby={describedBy}
                      placeholder={content.fields.message.placeholder}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  )}
                </Field>

                {status === "error" && errorMessage ? (
                  <p
                    role="alert"
                    className="rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[color-mix(in_oklab,var(--color-danger)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-danger)]"
                  >
                    {errorMessage}
                  </p>
                ) : null}

                <TurnstileWidget
                  siteKey={TURNSTILE_SITE_KEY}
                  action="contact-inquiry"
                  onVerify={handleTurnstileVerify}
                  onExpire={handleTurnstileExpire}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={status === "submitting"}
                  className="self-start"
                >
                  {status === "submitting"
                    ? content.submittingLabel
                    : content.submitLabel}
                </Button>
              </form>
            </SectionReveal>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Field shell with WCAG 2.1 AA-compliant label/hint/error association
 * (Prompt 26 a11y audit S1-2 + S1-3).
 *
 * The render-prop child receives a `describedBy` string (or `undefined`)
 * that the caller MUST pass to the interactive element via
 * `aria-describedby`. This wires the hint and any error message into
 * the field's accessible description so screen readers announce them
 * when focus lands on the input.
 *
 * `required` adds a screen-reader-only "(required)" suffix to the
 * label. Visible `*` markers should be wrapped in `aria-hidden="true"`
 * by the caller — they are decoration, not data.
 */
type FieldRenderProps = {
  describedBy: string | undefined;
};

function Field({
  id,
  label,
  helper,
  required,
  children,
}: {
  id: string;
  label: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode | ((rp: FieldRenderProps) => React.ReactNode);
}) {
  const hintId = helper ? `${id}-hint` : undefined;
  const describedBy = hintId;

  const rendered =
    typeof children === "function" ? children({ describedBy }) : children;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--color-fg)]">
        {label}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>
      {rendered}
      {helper ? (
        <p id={hintId} className="text-xs text-[var(--color-muted)]">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
