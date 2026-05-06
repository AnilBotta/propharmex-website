"use client";

import { useEffect, useRef, useState } from "react";

import type { LeadRow } from "@propharmex/lib/leads/types";

interface AddLeadModalProps {
  onClose: () => void;
  onCreated: (lead: LeadRow) => void;
}

export function AddLeadModal({ onClose, onCreated }: AddLeadModalProps) {
  const [email, setEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [region, setRegion] = useState("");
  const [service, setService] = useState("");
  const [dosageForm, setDosageForm] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Esc; trap focus inside the dialog while open.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    // Move initial focus into the dialog.
    const first = dialogRef.current?.querySelector<HTMLElement>(
      "input, textarea, button",
    );
    first?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          contactName: contactName.trim() || undefined,
          company: company.trim() || undefined,
          role: role.trim() || undefined,
          region: region.trim() || undefined,
          service: service.trim() || undefined,
          dosageForm: dosageForm.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(j?.error ?? "Couldn't create the lead. Please retry.");
        setSubmitting(false);
        return;
      }
      const { lead } = (await res.json()) as { lead: LeadRow };
      onCreated(lead);
    } catch {
      setError("Network error. Please retry.");
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/40"
      />
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-lead-heading"
        className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-[color:var(--color-border)] bg-white p-6 shadow-xl"
      >
        <header className="mb-4 flex items-center justify-between">
          <h2
            id="add-lead-heading"
            className="text-[15px] font-semibold text-slate-800"
          >
            Add lead
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
          >
            <span aria-hidden className="text-lg leading-none">
              ×
            </span>
          </button>
        </header>

        <p className="mb-4 text-[12px] text-slate-500">
          Capture a lead that came in outside the marketing forms (phone call,
          email, conference, etc.). Audit-trail notes the operator who created
          it.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <Field label="Email" required>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              placeholder="contact@example.com"
              className={fieldClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact name">
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                disabled={submitting}
                placeholder="Jane Doe"
                className={fieldClass}
              />
            </Field>
            <Field label="Role">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={submitting}
                placeholder="VP Regulatory"
                className={fieldClass}
              />
            </Field>
          </div>

          <Field label="Company">
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={submitting}
              placeholder="Acme Generics"
              className={fieldClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Region">
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                disabled={submitting}
                placeholder="USA / EU / Canada"
                className={fieldClass}
              />
            </Field>
            <Field label="Service interest">
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                disabled={submitting}
                placeholder="USFDA ANDA"
                className={fieldClass}
              />
            </Field>
          </div>

          <Field label="Dosage form">
            <input
              type="text"
              value={dosageForm}
              onChange={(e) => setDosageForm(e.target.value)}
              disabled={submitting}
              placeholder="Oral solid, Injectable, …"
              className={fieldClass}
            />
          </Field>

          <Field label="Notes / message">
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={submitting}
              placeholder="Context from the call/email; anything BD should know."
              className={`${fieldClass} resize-y`}
            />
          </Field>

          {error ? (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-[color:var(--color-danger)]"
            >
              {error}
            </div>
          ) : null}

          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-md border border-[color:var(--color-border)] bg-white px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || email.trim().length < 5}
              className="rounded-md bg-primary-600 px-4 py-1.5 text-[13px] font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Add lead"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

const fieldClass =
  "rounded-md border border-[color:var(--color-border)] px-2.5 py-1.5 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-primary-500 disabled:bg-slate-50";

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
      <span className="text-[12px] font-medium text-slate-700">
        {label}
        {required ? (
          <span aria-hidden className="ml-0.5 text-[color:var(--color-danger)]">
            *
          </span>
        ) : null}
      </span>
      {children}
    </label>
  );
}
