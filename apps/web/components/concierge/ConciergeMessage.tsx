"use client";

/**
 * ConciergeMessage — single message bubble for the chat surface.
 *
 * User messages render right-aligned in a primary-tinted bubble; assistant
 * messages render left-aligned in a neutral bubble. Assistant messages also
 * render the citation footer (numbered Sources list + thumbs feedback hooks)
 * when sources are attached.
 *
 * Inline `[N]` citation markers in the assistant text are upgraded into
 * superscript anchor links pointing at the matching footer entry. The model
 * is instructed (via the system prompt in PR-A's prompt config) to use this
 * exact format, so the substitution is mechanical.
 *
 * Thumbs feedback is a placeholder hook here — PR-C wires PostHog telemetry
 * to it. In this PR the click only flips local state to render the
 * "Thanks — noted." confirmation.
 */
import { useState, type ReactNode } from "react";
import type { Message } from "ai";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { CONCIERGE } from "../../content/concierge";

export interface SourceRef {
  n: number;
  title: string;
  section: string;
  url: string;
}

interface Props {
  message: Message;
  sources: SourceRef[] | null;
}

export function ConciergeMessage({ message, sources }: Props) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-[var(--radius-lg)] px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-[var(--color-primary-700)] text-white"
            : "bg-[var(--color-slate-50)] text-[var(--color-fg)]"
        }`}
      >
        {isAssistant && sources ? (
          renderWithCitations(message.content, sources)
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>

      {isAssistant && sources && sources.length > 0 ? (
        <SourcesFooter sources={sources} />
      ) : null}

      {isAssistant ? <FeedbackRow messageId={message.id} /> : null}
    </div>
  );
}

/**
 * Replace inline `[N]` markers with superscript anchor links to the footer.
 * Falls back to plain text when no matching source exists.
 */
function renderWithCitations(text: string, sources: SourceRef[]): ReactNode {
  const indexByN = new Map(sources.map((s) => [s.n, s]));
  const parts: (string | ReactNode)[] = [];
  // Split on [N] tokens but keep the delimiters via a capturing group.
  const tokens = text.split(/(\[\d+\])/g);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i] ?? "";
    const match = /^\[(\d+)\]$/.exec(token);
    if (match) {
      const n = Number(match[1]);
      const source = indexByN.get(n);
      if (source) {
        parts.push(
          <sup key={`cite-${i}-${n}`} className="ml-0.5 align-super text-[10px]">
            <a
              href={`#concierge-source-${source.n}`}
              className="text-[var(--color-primary-700)] underline-offset-2 hover:underline"
              aria-label={`Source ${source.n}: ${source.title}`}
            >
              [{source.n}]
            </a>
          </sup>,
        );
        continue;
      }
    }
    if (token) parts.push(token);
  }
  return <p className="whitespace-pre-wrap">{parts}</p>;
}

function SourcesFooter({ sources }: { sources: SourceRef[] }) {
  return (
    <div className="mt-1 max-w-[85%] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[11px] text-[var(--color-slate-800)]">
      <p className="mb-1 font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
        {CONCIERGE.message.sourcesHeading}
      </p>
      <ol className="flex flex-col gap-1">
        {sources.map((s) => (
          <li
            key={s.n}
            id={`concierge-source-${s.n}`}
            className="flex items-baseline gap-1.5"
          >
            <span className="font-medium text-[var(--color-muted)]">[{s.n}]</span>
            <a
              href={s.url}
              className="text-[var(--color-primary-700)] underline-offset-2 hover:underline"
            >
              {s.title}
              {s.section ? ` — ${s.section}` : ""}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

function FeedbackRow({ messageId }: { messageId: string }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  if (vote) {
    return (
      <p className="text-[10px] italic text-[var(--color-muted)]">
        {CONCIERGE.message.feedbackThanks}
      </p>
    );
  }

  return (
    <div className="flex items-center gap-1 text-[var(--color-muted)]">
      <button
        type="button"
        onClick={() => {
          setVote("up");
          // PR-C wires PostHog telemetry here.
          notifyFeedbackPlaceholder({ messageId, vote: "up" });
        }}
        aria-label={CONCIERGE.message.thumbsUpLabel}
        className="rounded-[var(--radius-xs)] p-1 hover:bg-[var(--color-slate-100)] hover:text-[var(--color-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
      >
        <ThumbsUp aria-hidden="true" size={12} />
      </button>
      <button
        type="button"
        onClick={() => {
          setVote("down");
          notifyFeedbackPlaceholder({ messageId, vote: "down" });
        }}
        aria-label={CONCIERGE.message.thumbsDownLabel}
        className="rounded-[var(--radius-xs)] p-1 hover:bg-[var(--color-slate-100)] hover:text-[var(--color-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
      >
        <ThumbsDown aria-hidden="true" size={12} />
      </button>
    </div>
  );
}

/**
 * Placeholder telemetry sink. PR-C replaces this with a PostHog event call.
 * Kept as a separate function so the swap-in is a one-line diff. The `void`
 * expression marks the param as intentionally received but unused.
 */
function notifyFeedbackPlaceholder(payload: {
  messageId: string;
  vote: "up" | "down";
}): void {
  void payload;
}
