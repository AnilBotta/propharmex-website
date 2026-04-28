"use client";

/**
 * Single chat message for the scoping surface.
 *
 * User messages render right-aligned in a primary-tinted bubble; assistant
 * messages render left-aligned in a neutral bubble.
 *
 * Tool calls are rendered as a thin status pill underneath the assistant
 * bubble (or replacing it when the bubble has no text content yet) — the
 * structured `proposeScope` args don't need to appear in the chat thread,
 * they belong on the preview card. Showing the pill gives the user a clear
 * "the assistant just drafted your scope" signal without cluttering the
 * conversation.
 */
import type { Message } from "ai";

import { SCOPING } from "../../content/scoping";

interface Props {
  message: Message;
  /** True when this message contains a `proposeScope` tool invocation. */
  hasToolCall: boolean;
}

export function ScopingMessage({ message, hasToolCall }: Props) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const hasText = message.content.trim().length > 0;

  return (
    <div
      className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
    >
      {hasText ? (
        <div
          className={`max-w-[85%] rounded-[var(--radius-lg)] px-3 py-2 text-sm leading-relaxed ${
            isUser
              ? "bg-[var(--color-primary-700)] text-white"
              : "bg-[var(--color-slate-50)] text-[var(--color-fg)]"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      ) : null}

      {isAssistant && hasToolCall ? (
        <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-full)] border border-[var(--color-primary-700)] bg-[var(--color-primary-50)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary-700)]">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[var(--color-primary-700)]"
          />
          {SCOPING.message.toolCallResolved}
        </span>
      ) : null}
    </div>
  );
}
