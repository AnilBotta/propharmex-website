"use client";

/**
 * SuggestionChips — three pill buttons rendered in the empty-conversation
 * state. Clicking a chip submits its canonical prompt as a user message.
 */
import type { ConciergeSuggestion } from "../../content/concierge";

interface Props {
  label: string;
  suggestions: ConciergeSuggestion[];
  onPick: (prompt: string) => void;
}

export function SuggestionChips({ label, suggestions, onPick }: Props) {
  return (
    <div className="flex flex-col gap-2" aria-label={label}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
        {label}
      </p>
      <ul className="flex flex-col gap-2" role="list">
        {suggestions.map((s) => (
          <li key={s.id} className="list-none">
            <button
              type="button"
              onClick={() => onPick(s.prompt)}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-left text-sm leading-snug text-[var(--color-fg)] transition hover:border-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            >
              {s.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
