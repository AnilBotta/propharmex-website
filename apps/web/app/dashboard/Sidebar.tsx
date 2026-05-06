import Link from "next/link";

import { LogoutButton } from "./LogoutButton";

interface SidebarProps {
  sessionEmail: string;
  active: "lead-intake" | "pipeline" | "inspections" | "funnel" | "other";
  counts?: { leads?: number; pipeline?: number; inspections?: number };
}

export function Sidebar({ sessionEmail, active, counts }: SidebarProps) {
  const initials = sessionEmail
    .split("@")[0]
    ?.split(/[._-]/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("") || "??";
  const name = sessionEmail.split("@")[0]?.replace(/[._-]/g, " ") || sessionEmail;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[color:var(--color-border)] bg-white">
      {/* Brand block */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-primary-600 text-xs font-semibold text-white">
          PX
        </span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-slate-800">
            Propharmex Console
          </div>
          <div className="text-[10px] tracking-[0.08em] text-slate-500">
            MISSISSAUGA · <span className="text-green-600">LIVE</span>
          </div>
        </div>
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
          <NavItem href="/dashboard" label="3PL & shipping" disabled />
          <NavItem href="/dashboard" label="Quality / CAPA" disabled />
        </NavGroup>

        <NavGroup label="SETTINGS">
          <NavItem href="/dashboard" label="Workspace" disabled />
        </NavGroup>
      </nav>

      <div className="border-t border-[color:var(--color-border)] p-3">
        <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green-100 text-[11px] font-semibold text-green-700">
            {initials}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-[12px] font-semibold capitalize text-slate-800">
              {name}
            </div>
            <div className="truncate text-[10px] text-slate-500">
              Allowlisted user
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

function NavGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
      <span
        className={`${baseClass} cursor-not-allowed text-slate-400`}
        aria-disabled
      >
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
            badgeAccent
              ? "bg-accent-500 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
