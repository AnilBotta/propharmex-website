/**
 * Keyboard skip-to-content link.
 *
 * Visible only on :focus-visible. Must be the first interactive element in
 * the DOM. The Tab key on page load should land here. Target id must exist
 * on every page — the root layout renders `<main id="main-content">`.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only fixed left-4 top-4 z-[60] rounded-[var(--radius-sm)] bg-[var(--color-primary-600)] px-4 py-2 text-sm font-medium text-[var(--color-primary-fg)] shadow-[var(--shadow-md)]"
    >
      Skip to main content
    </a>
  );
}
