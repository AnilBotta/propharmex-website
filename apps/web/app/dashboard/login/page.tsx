import type { Metadata } from "next";
import Image from "next/image";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in · Propharmex Dashboard",
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
        <div className="mb-5 flex items-center gap-2.5">
          <Image
            src="/Propharmexlogo.png"
            alt="Propharmex"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-md object-contain"
            priority
          />
          <h1
            id="dashboard-login-heading"
            className="text-[16px] font-semibold text-slate-900 leading-tight"
          >
            Propharmex Dashboard
          </h1>
        </div>
        <p className="mb-5 text-[13px] text-slate-600">
          Sign in to view leads, AI-tool funnel stats, and outreach status.
        </p>
        <LoginForm initialError={initialError} />
      </section>
    </main>
  );
}
