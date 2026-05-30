import Image from "next/image";
import Link from "next/link";

import { LogoutButton } from "./LogoutButton";

interface SidebarProps {
  sessionEmail: string;
  active: "lead-intake" | "pipeline" | "inspections" | "funnel" | "other";
  counts?: { leads?: number; pipeline?: number; inspections?: number };
}

const DISABLED_PLACEHOLDER_EMAIL = "disabled-auth@propharmex.local";

export function Sidebar({ sessionEmail, active, counts }: SidebarProps) {
  const isAuthDisabled = sessionEmail === DISABLED_PLACEHOLDER_EMAIL;
  const initials =
    (sessionEmail
      .split("@")[0]
      ?.split(/[._-]/)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .slice(0, 2)
      .join("") as string) || "??";
  const name = sessionEmail.split("@")[0]?.replace(/[._-]/g, " ") || sessionEmail;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[color:var(--color-border)] bg-white">
      {/* Brand block */}
      <div className="flex items-center justify-center px-4 pb-3 pt-4">
        <Image
          src="/Propharmexlogo.png"
          alt="Propharmex"
          width={220}
          height={64}
          className="h-14 w-auto object-contain"
          priority
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 text-sm">
        <NavGroup label="WORKSPACE">
          <NavItem
            href="/dashboard"
            label="Lead intake"
            active={active === "lead-intake"}
            badge={counts?.leads}
            badgeAccent
          />
          <NavItem
            href="/dashboard"
            label="Pipeline"
            active={active === "pipeline"}
            badge={counts?.pipeline}
            disabled
          />
          <NavItem
            href="/dashboard"
            label="Inspections"
            active={active === "inspections"}
            badge={counts?.inspections}
            disabled
          />
        </NavGroup>

        <NavGroup label="OPERATIONS">
          <NavItem href="/dashboard/funnel" label="AI Funnel" active={active === "funnel"} />
          <NavItem href="/dashboard" label="Submissions" disabled />
          <NavItem href="/dashboard" label="Studies" disabled />
          <NavItem href="/dashboard" label="Logistics" disabled />
          <NavItem href="/dashboard" label="Quality / CAPA" disabled />
        </NavGroup>

        <NavGroup label="SETTINGS">
          <NavItem href="/dashboard" label="Workspace" disabled />
        </NavGroup>
      </nav>

      <div className="border-t border-[color:var(--color-border)] p-3">
        {isAuthDisabled ? (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-2 text-[11px] leading-tight text-amber-900">
            <strong className="block text-[12px]">Preview mode</strong>
            <span className="mt-0.5 block">
              Auth is disabled. Anyone with this URL can view leads.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green-100 text-[11px] font-semibold text-green-700">
              {initials}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-[12px] font-semibold capitalize text-slate-800">
                {name}
              </div>
              <div className="truncate text-[10px] text-slate-500">Allowlisted user</div>
            </div>
            <LogoutButton />
          </div>
        )}
      </div>
    </aside>
  );
}

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="px-3 pb-1 text-[10px] font-semibold tracking-[0.1em] text-slate-400">
        {label}
      </div>
      <div className="flex flex-col gap-px">{children}</div>
    </div>
  );
}

function NavItem({
  href,
  label,
  active,
  badge,
  badgeAccent,
  disabled,
}: {
  href: string;
  label: string;
  active?: boolean;
  badge?: number;
  badgeAccent?: boolean;
  disabled?: boolean;
}) {
  const baseClass =
    "relative flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-[13px] transition-colors";
  if (disabled) {
    return (
      <span className={`${baseClass} cursor-not-allowed text-slate-400`} aria-disabled>
        <span>{label}</span>
        {typeof badge === "number" && badge > 0 ? (
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
            {badge}
          </span>
        ) : null}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`${baseClass} ${active ? "pmx-nav-item-active font-semibold" : "text-slate-700 hover:bg-slate-50"}`}
    >
      <span>{label}</span>
      {typeof badge === "number" && badge > 0 ? (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
            badgeAccent ? "bg-accent-500 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
