interface TopBarProps {
  breadcrumb: string[];
}

export function TopBar({ breadcrumb }: TopBarProps) {
  return (
    <div className="flex h-14 items-center gap-4 border-b border-[color:var(--color-border)] bg-white px-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-[13px] text-slate-500"
      >
        {breadcrumb.map((part, i) => (
          <span key={i} className="flex items-center gap-2">
            <span
              className={
                i === breadcrumb.length - 1
                  ? "font-medium text-slate-800"
                  : "text-slate-500"
              }
            >
              {part}
            </span>
            {i < breadcrumb.length - 1 ? (
              <span className="text-slate-300">/</span>
            ) : null}
          </span>
        ))}
      </nav>

      <div className="ml-auto flex flex-1 items-center justify-end gap-3">
        <label className="relative w-72 max-w-full">
          <span className="sr-only">Search leads, projects, submissions</span>
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            disabled
            placeholder="Search leads, projects, submissions…"
            className="h-8 w-full rounded-md border border-[color:var(--color-border)] bg-slate-50 pl-8 pr-12 text-[13px] text-slate-700 placeholder:text-slate-400 disabled:cursor-not-allowed"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded border border-[color:var(--color-border)] bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500"
          >
            ⌘K
          </span>
        </label>
        <button
          type="button"
          aria-label="Notifications"
          className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Settings"
          className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
