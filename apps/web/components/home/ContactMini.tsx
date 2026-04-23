"use client";

import { useId, useState, type FormEvent } from "react";
import { motion } from "framer-motion";

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  fadeRise,
  staggerContainer,
  useReducedMotion,
} from "@propharmex/ui";

import { DOSAGE_CHIPS, type ContactFormCopy } from "../../content/home";

type Props = { content: ContactFormCopy };

type Status = "idle" | "submitting" | "success" | "error";

export function ContactMini({ content }: Props) {
  const reduce = useReducedMotion();
  const formId = useId();

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [dosageForm, setDosageForm] = useState<string>("");
  const [message, setMessage] = useState("");

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
          email,
          company,
          dosageForm,
          message: message || undefined,
        }),
      });

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(content.errorGeneric);
        return;
      }

      setStatus("success");
      setEmail("");
      setCompany("");
      setDosageForm("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage(content.errorGeneric);
    }
  }

  const dosageOptions = [...DOSAGE_CHIPS, { id: "other", label: content.fields.dosageForm.other }];

  return (
    <section
      aria-labelledby="home-contact-heading"
      className="bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-sm)] sm:p-12 lg:grid-cols-[1fr_1.2fr]">
        <motion.div
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeRise}
            className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]"
          >
            {content.eyebrow}
          </motion.p>
          <motion.h2
            id="home-contact-heading"
            variants={fadeRise}
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </motion.h2>
          <motion.p
            variants={fadeRise}
            className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]"
          >
            {content.subhead}
          </motion.p>
          <motion.p
            variants={fadeRise}
            className="mt-6 text-xs leading-relaxed text-[var(--color-muted)]"
          >
            {content.privacyNote}
          </motion.p>
        </motion.div>

        {status === "success" ? (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-col justify-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-primary-50)] p-6"
          >
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-primary-900)]">
              {content.successHeading}
            </h3>
            <p className="text-sm leading-relaxed text-[var(--color-primary-900)]">
              {content.successBody}
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${formId}-email`}
                className="text-sm font-medium text-[var(--color-fg)]"
              >
                {content.fields.email.label}
              </label>
              <Input
                id={`${formId}-email`}
                type="email"
                required
                autoComplete="email"
                placeholder={content.fields.email.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${formId}-company`}
                className="text-sm font-medium text-[var(--color-fg)]"
              >
                {content.fields.company.label}
              </label>
              <Input
                id={`${formId}-company`}
                type="text"
                required
                autoComplete="organization"
                placeholder={content.fields.company.placeholder}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${formId}-dosage`}
                className="text-sm font-medium text-[var(--color-fg)]"
              >
                {content.fields.dosageForm.label}
              </label>
              <Select value={dosageForm} onValueChange={setDosageForm}>
                <SelectTrigger id={`${formId}-dosage`} aria-label={content.fields.dosageForm.label}>
                  <SelectValue placeholder={content.fields.dosageForm.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {dosageOptions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${formId}-message`}
                className="text-sm font-medium text-[var(--color-fg)]"
              >
                {content.fields.message.label}
              </label>
              <Textarea
                id={`${formId}-message`}
                placeholder={content.fields.message.placeholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <p className="text-xs text-[var(--color-muted)]">
                {content.fields.message.hint}
              </p>
            </div>

            {status === "error" && errorMessage ? (
              <p
                role="alert"
                className="rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[color-mix(in_oklab,var(--color-danger)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-danger)]"
              >
                {errorMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={status === "submitting"}
              className="mt-2 self-start"
            >
              {status === "submitting" ? content.submittingLabel : content.submitLabel}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
