"use client";

import { useState } from "react";

export function LoginForm({ initialError }: { initialError?: string | null }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok && res.status !== 202) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(data?.error ?? "Something went wrong. Please retry.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please retry.");
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-lg border border-green-200 bg-green-50 p-5"
      >
        <strong className="text-[14px] text-green-700">
          Check your inbox.
        </strong>
        <p className="mt-1 text-[13px] text-slate-600">
          If your email is allowlisted, a sign-in link is on its way. The link
          expires in 15 minutes. Don&apos;t see it? Check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label
        htmlFor="dashboard-email"
        className="text-[13px] font-medium text-slate-700"
      >
        Email address
      </label>
      <input
        id="dashboard-email"
        type="email"
        required
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={submitting}
        placeholder="you@propharmex.com"
        className="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-primary-500 disabled:bg-slate-50"
      />
      {error ? (
        <div role="alert" className="text-[13px] text-[color:var(--color-danger)]">
          {error}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={submitting || email.length < 5}
        className="mt-1 rounded-md bg-primary-600 px-4 py-2 text-[14px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send sign-in link"}
      </button>
      <p className="text-[12px] text-slate-500">
        We&apos;ll email you a one-time link valid for 15 minutes. No password
        needed.
      </p>
    </form>
  );
}
