// Placeholder home page. Replaced wholesale in Prompt 5 by the design-system-driven Home.
export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-6 px-6 py-20 text-center">
      <div
        aria-hidden="true"
        className="size-12 rounded-[var(--radius-md)]"
        style={{ background: "var(--color-primary)" }}
      />
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Propharmex
      </h1>
      <p className="max-w-xl text-[var(--color-muted)]">
        Canada–India bridge for pharmaceutical development, analytical services,
        Health&nbsp;Canada DEL regulatory, and distribution. Site under
        construction.
      </p>
      <p className="text-xs text-[var(--color-muted)]">
        Scaffold — Prompt&nbsp;1. Phase 2 design system is next.
      </p>
    </main>
  );
}
