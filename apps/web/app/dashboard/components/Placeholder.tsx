export function Placeholder({
  title,
  body,
  count,
}: {
  title: string;
  body: string;
  count?: string;
}) {
  return (
    <section className="rounded-lg border border-dashed border-[color:var(--color-border)] bg-white p-6">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-semibold text-slate-800">{title}</h2>
        {count ? (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            {count}
          </span>
        ) : null}
      </header>
      <p className="mt-3 text-[13px] text-slate-500">{body}</p>
      <span className="mt-3 inline-flex rounded-md bg-accent-50 px-2 py-1 text-[11px] font-semibold text-accent-700">
        Coming in PR-N4
      </span>
    </section>
  );
}
