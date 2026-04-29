"use client";

/**
 * ConciergePanel — chat surface inside the floating bubble.
 *
 * Uses Vercel AI SDK's `useChat` hook to manage message state + streaming.
 * Posts to /api/ai/concierge.
 *
 * Sources + disclaimer arrive as a structured `concierge.meta` MESSAGE
 * ANNOTATION written by the route handler via `writer.writeMessageAnnotation`
 * (frame type `8:` in the AI SDK data-stream protocol). The SDK attaches
 * the annotation to the assistant message's `annotations` array, so we can
 * read it back per-message without any id-tracking gymnastics.
 *
 * The 503 "being provisioned" path is detected via `useChat`'s `onResponse`
 * (the route returns 503 with a JSON body before the stream starts).
 */
import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";

import { CONCIERGE } from "../../content/concierge";

import { ConciergeMessage, type SourceRef } from "./ConciergeMessage";
import { SuggestionChips } from "./SuggestionChips";
import {
  bucketMessageLength,
  trackConciergeEscapeClicked,
  trackConciergeMessageReceived,
  trackConciergeMessageSent,
} from "./telemetry";

interface Props {
  onClose: () => void;
}

interface ConciergeMeta {
  type: "concierge.meta";
  sources: SourceRef[];
  disclaimer: string;
}

function isConciergeMeta(value: unknown): value is ConciergeMeta {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return obj.type === "concierge.meta" && Array.isArray(obj.sources);
}

/**
 * Pull the concierge.meta annotation off a message, if present. Annotations
 * are typed as `JSONValue[] | undefined` by the SDK, so we narrow at runtime.
 */
function extractMeta(annotations: unknown): ConciergeMeta | null {
  if (!Array.isArray(annotations)) return null;
  for (const a of annotations) {
    if (isConciergeMeta(a)) return a;
  }
  return null;
}

export function ConciergePanel({ onClose }: Props) {
  const [unconfigured, setUnconfigured] = useState<string | null>(null);
  const [disclaimerOverride, setDisclaimerOverride] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
    append,
  } = useChat({
    api: "/api/ai/concierge",
    onResponse: (res) => {
      if (res.status === 503) {
        // Read the JSON body once for the friendly fallback message. The
        // stream parser won't fire because there's no stream body.
        void res
          .clone()
          .json()
          .then((body: { error?: string }) => {
            setUnconfigured(body.error ?? CONCIERGE.errors.unconfigured);
          })
          .catch(() => {
            setUnconfigured(CONCIERGE.errors.unconfigured);
          });
      }
    },
    onFinish: (msg) => {
      // The assistant message has finished streaming. Read its annotation to
      // count citations — the route attaches a `concierge.meta` payload via
      // `writer.writeMessageAnnotation`.
      const meta = extractMeta(msg.annotations);
      trackConciergeMessageReceived({
        citationCount: meta?.sources.length ?? 0,
      });
    },
    onError: (e) => {
      // eslint-disable-next-line no-console
      console.error("[concierge] stream error:", e);
    },
  });

  // Surface the most recent assistant message's tool-specific disclaimer (if
  // present in its annotation) so the composer footer can override the
  // generic copy. Annotations attach per-message; we just read the latest.
  useEffect(() => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant) return;
    const meta = extractMeta(lastAssistant.annotations);
    if (meta?.disclaimer) {
      setDisclaimerOverride(meta.disclaimer);
    }
  }, [messages]);

  // Auto-scroll to the bottom on new content.
  useEffect(() => {
    const el = messageListRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  // Focus the input on open.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function reset() {
    setMessages([]);
    setUnconfigured(null);
    setDisclaimerOverride(null);
  }

  // Wraps the AI SDK's `handleSubmit` with a telemetry call. Used both by
  // the form's onSubmit and by the textarea's Enter-to-submit shortcut so
  // both paths emit `concierge.message_sent`.
  function submitWithTelemetry(e: React.FormEvent<HTMLFormElement>) {
    if (input.trim().length > 0) {
      trackConciergeMessageSent({
        source: "composer",
        lengthBucket: bucketMessageLength(input.length),
      });
    }
    handleSubmit(e);
  }

  return (
    // Non-modal panel — does not trap focus, does not dim background.
    // Using `role="region"` (not "dialog") so screen readers don't expect
    // modal-style focus management. Resolves Prompt 26 a11y S2-1.
    <section
      id="concierge-panel"
      aria-labelledby="concierge-panel-heading"
      className="flex h-[600px] max-h-[calc(100dvh-7rem)] w-[400px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_48px_-12px_rgba(15,32,80,0.3)]"
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-primary-50)] px-4 py-3">
        <div>
          <h2
            id="concierge-panel-heading"
            className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-[var(--color-primary-900)]"
          >
            {CONCIERGE.bubble.title}
          </h2>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
            {CONCIERGE.bubble.subEyebrow}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 ? (
            <button
              type="button"
              onClick={reset}
              className="rounded-[var(--radius-xs)] px-2 py-1 text-[11px] font-medium text-[var(--color-primary-700)] hover:bg-[color-mix(in_oklab,var(--color-primary-700)_10%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            >
              New chat
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label={CONCIERGE.bubble.closeLabel}
            className="rounded-[var(--radius-xs)] p-1 text-[var(--color-primary-700)] hover:bg-[color-mix(in_oklab,var(--color-primary-700)_10%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            <X aria-hidden="true" size={16} />
          </button>
        </div>
      </header>

      {/* Message list */}
      <div
        ref={messageListRef}
        className="flex-1 overflow-y-auto px-4 py-4"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {messages.length === 0 && !unconfigured ? (
          <EmptyState
            onPick={(prompt) => {
              trackConciergeMessageSent({
                source: "suggestion-chip",
                lengthBucket: bucketMessageLength(prompt.length),
              });
              void append({ role: "user", content: prompt });
            }}
          />
        ) : null}

        {unconfigured ? (
          <p className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-slate-800)]">
            {unconfigured}
          </p>
        ) : null}

        <ul className="flex flex-col gap-3">
          {messages.map((m, i) => {
            const meta = extractMeta(m.annotations);
            // Hide the sources footer + inline citation links for the
            // assistant message that is still streaming. The annotation
            // arrives on the first text chunk, so without this gate the
            // footer would pop in below an empty bubble and the message
            // text would then "type" in above it. Only show citations once
            // the stream for this message has completed.
            const isStreamingThisMessage =
              isLoading && i === messages.length - 1 && m.role === "assistant";
            const sources = isStreamingThisMessage ? null : meta?.sources ?? null;
            return (
              <li key={m.id} className="list-none">
                <ConciergeMessage message={m} sources={sources} />
              </li>
            );
          })}
        </ul>

        {error ? (
          <p
            role="alert"
            className="mt-3 rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[color-mix(in_oklab,var(--color-danger)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-danger)]"
          >
            {CONCIERGE.errors.streamFailed}
          </p>
        ) : null}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          submitWithTelemetry(e);
        }}
        className="flex flex-col gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3"
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isLoading) {
                  submitWithTelemetry(
                    new Event("submit") as unknown as React.FormEvent<HTMLFormElement>,
                  );
                }
              }
            }}
            placeholder={CONCIERGE.input.placeholder}
            rows={1}
            className="min-h-[36px] w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm leading-snug text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-primary-700)] focus-visible:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || input.trim().length === 0}
            aria-label={isLoading ? CONCIERGE.input.sendingLabel : CONCIERGE.input.sendLabel}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-700)] text-white transition hover:bg-[var(--color-primary-800)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1"
          >
            <ArrowRight aria-hidden="true" size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between gap-3 text-[11px] leading-snug">
          <p className="text-[var(--color-muted)]">
            {disclaimerOverride ?? CONCIERGE.input.disclaimer}
          </p>
          <a
            href={CONCIERGE.escapeHatch.href}
            onClick={() => trackConciergeEscapeClicked()}
            className="inline-flex items-center gap-0.5 whitespace-nowrap font-medium text-[var(--color-primary-700)] hover:underline"
          >
            {CONCIERGE.escapeHatch.label}
            <ArrowUpRight aria-hidden="true" size={11} />
          </a>
        </div>
      </form>
    </section>
  );
}

function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
          {CONCIERGE.empty.heading}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
          {CONCIERGE.empty.body}
        </p>
      </div>
      <SuggestionChips
        label={CONCIERGE.empty.suggestionsLabel}
        suggestions={CONCIERGE.empty.suggestions}
        onPick={onPick}
      />
    </div>
  );
}
