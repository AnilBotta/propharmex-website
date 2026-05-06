"use client";

import { useState } from "react";

export function LoginForm({ initialError }: { initialError?: string | null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(data?.error ?? "Sign-in failed. Check your credentials.");
        setSubmitting(false);
        return;
      }
      // Cookies set on the response — redirect to the dashboard.
      window.location.href = "/dashboard";
    } catch {
      setError("Network error. Please retry.");
      setSubmitting(false);
    }
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

      <label
        htmlFor="dashboard-password"
        className="mt-1 text-[13px] font-medium text-slate-700"
      >
        Password
      </label>
      <input
        id="dashboard-password"
        type="password"
        required
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={submitting}
        placeholder="••••••••"
        className="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-primary-500 disabled:bg-slate-50"
      />

      {error ? (
        <div role="alert" className="text-[13px] text-[color:var(--color-danger)]">
          {error}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={submitting || email.length < 5 || password.length < 6}
        className="mt-1 rounded-md bg-primary-600 px-4 py-2 text-[14px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-[12px] text-slate-500">
        Forgot your password? Reset it from the Supabase dashboard
        (Authentication → Users → your account → Send password recovery).
      </p>
    </form>
  );
}
