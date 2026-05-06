import type { Metadata } from "next";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in · Propharmex Console",
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  missing: "That sign-in link is incomplete. Request a new one below.",
  invalid: "That sign-in link is invalid or expired. Request a new one below.",
};

export default async function DashboardLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const initialError =
    typeof params.error === "string" && params.error in ERROR_MESSAGES
      ? ERROR_MESSAGES[params.error]
      : null;

  return (
    <main className="grid min-h-dvh place-items-center bg-slate-50 px-4 py-12">
      <section
        aria-labelledby="dashboard-login-heading"
        className="w-full max-w-[420px] rounded-lg border border-[color:var(--color-border)] bg-white p-8 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary-600 text-[13px] font-semibold text-white">
            PX
          </span>
          <div className="leading-tight">
            <h1
              id="dashboard-login-heading"
              className="text-[16px] font-semibold text-slate-900"
            >
              Propharmex Console
            </h1>
            <div className="text-[10px] tracking-[0.08em] text-slate-500">
              MISSISSAUGA · <span className="text-green-600">LIVE</span>
            </div>
          </div>
        </div>
        <p className="mb-5 text-[13px] text-slate-600">
          Sign in to view leads, AI-tool funnel stats, and outreach status.
        </p>
        <LoginForm initialError={initialError} />
      </section>
    </main>
  );
}
