import type { Metadata } from "next";
import { headers } from "next/headers";

import { supabase } from "@propharmex/lib";

import "./dashboard.css";
import { getDashboardUserEmail } from "../../lib/supabase-auth/server";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export const metadata: Metadata = {
  title: "Propharmex Dashboard",
  robots: { index: false, follow: false },
};

/**
 * Dashboard root layout. Marketing chrome is suppressed by RootLayout's
 * `isAppRoute` branch (apps/web/app/layout.tsx). This layout provides the
 * dashboard-specific shell — sidebar nav + top bar + content slot.
 *
 * Public surfaces (login + verify) bypass the shell by returning their own
 * full-bleed layout via the early return below — they should look like
 * standalone marketing pages, not nested inside the admin chrome.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isPublicSurface =
    pathname === "/dashboard/login" ||
    pathname.startsWith("/dashboard/login/");

  if (isPublicSurface) {
    return <div className="pmx-dashboard">{children}</div>;
  }

  // Authenticated shell. The middleware already gated /dashboard/* on
  // session presence; we look the email up here for the sidebar avatar
  // + name. If the email is somehow null (race / config drift), the
  // page itself does its own redirect-on-null.
  const sessionEmail = (await getDashboardUserEmail()) ?? "";

  // Lightweight counts for the sidebar badges. Skipped if Supabase isn't
  // configured.
  let leadCount = 0;
  const sb = supabase.getServerSupabase();
  if (sb && sessionEmail) {
    const { count } = await sb
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");
    leadCount = count ?? 0;
  }

  const active = pathname.startsWith("/dashboard/funnel")
    ? "funnel"
    : "lead-intake";

  const breadcrumb =
    active === "funnel"
      ? ["Workspace", "AI Funnel"]
      : ["Workspace", "Lead intake"];

  return (
    <div className="pmx-dashboard flex">
      <Sidebar
        sessionEmail={sessionEmail}
        active={active}
        counts={{ leads: leadCount }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar breadcrumb={breadcrumb} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
