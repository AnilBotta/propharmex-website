import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import { getDashboardUserEmail } from "../../../lib/supabase-auth/server";

import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset password · Propharmex Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Lands on this page after Supabase verified a password-recovery OTP via
 * /api/auth/confirm?type=recovery. At that point the user has a recovery
 * session — we can call supabase.auth.updateUser({ password }) from the
 * client to set the new password, then redirect them back to /dashboard.
 *
 * If someone navigates here without a valid recovery session, the
 * middleware bounces them to /dashboard/login.
 */
export default async function ResetPasswordPage() {
  const email = await getDashboardUserEmail();
  if (!email) redirect("/dashboard/login");

  return (
    <main className="grid min-h-dvh place-items-center bg-slate-50 px-4 py-12">
      <section
        aria-labelledby="reset-password-heading"
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
            id="reset-password-heading"
            className="text-[16px] font-semibold text-slate-900 leading-tight"
          >
            Propharmex Dashboard
          </h1>
        </div>
        <p className="mb-5 text-[13px] text-slate-600">
          Set a new password for <strong>{email}</strong>. After saving,
          you&apos;ll be signed in.
        </p>
        <ResetPasswordForm />
      </section>
    </main>
  );
}
