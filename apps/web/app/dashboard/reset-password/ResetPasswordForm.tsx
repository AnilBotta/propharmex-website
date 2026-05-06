"use client";

import { useState } from "react";

import { getSupabaseBrowserClient } from "../../../lib/supabase-auth/browser";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: updateErr } = await supabase.auth.updateUser({ password });
      if (updateErr) {
        setError(updateErr.message);
        setSubmitting(false);
        return;
      }
      // Recovery session is now a regular session. Bounce to the dashboard.
      window.location.href = "/dashboard";
    } catch {
      setError("Network error. Please retry.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label
        htmlFor="new-password"
        className="text-[13px] font-medium text-slate-700"
      >
        New password
      </label>
      <input
        id="new-password"
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={submitting}
        placeholder="At least 8 characters"
        className="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-primary-500 disabled:bg-slate-50"
      />
      <label
        htmlFor="confirm-password"
        className="mt-1 text-[13px] font-medium text-slate-700"
      >
        Confirm new password
      </label>
      <input
        id="confirm-password"
        type="password"
        autoComplete="new-password"
        required
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        disabled={submitting}
        className="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-primary-500 disabled:bg-slate-50"
      />
      {error ? (
        <div role="alert" className="text-[13px] text-[color:var(--color-danger)]">
          {error}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={
          submitting ||
          password.length < 8 ||
          confirm.length < 8 ||
          password !== confirm
        }
        className="mt-1 rounded-md bg-primary-600 px-4 py-2 text-[14px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
