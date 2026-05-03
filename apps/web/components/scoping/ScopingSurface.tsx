"use client";

/**
 * ScopingSurface — the full-page chat + preview-card surface for the Project
 * Scoping Assistant (Prompt 19 PR-A).
 *
 * Layout:
 *   - Desktop (lg ≥): two columns. Left = chat (scrollable). Right = preview
 *     card (sticky, full-height).
 *   - Mobile: single column. Chat at the top, preview card below. Preview
 *     remains visible as the user scrolls past it.
 *
 * Data flow:
 *   - `useChat` from `ai/react` posts to `/api/ai/scoping` and streams the
 *     model's text deltas + tool calls.
 *   - When the model calls `proposeScope`, the structured args appear on the
 *     last assistant message's `toolInvocations`. We extract them and feed
 *     them into local `previewScope` state.
 *   - The preview card is fully controlled — every inline edit updates
 *     `previewScope` immediately. PR-B reads it back when Submit / Download
 *     fires.
 *   - "See a sample" loads `SAMPLE_SCOPE` directly into `previewScope`,
 *     bypassing the model. Useful for first-time visitors.
 *
 * Graceful 503: the route returns a JSON 503 body when ANTHROPIC_API_KEY is
 * unset; we surface it via `useChat`'s `onResponse` and show the same
 * "being provisioned" copy used by the Concierge.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "ai/react";
import type { Message } from "ai";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";

import { SAMPLE_SCOPE, type ScopeSummary } from "@propharmex/lib/scoping";

import { SCOPING } from "../../content/scoping";

import { ScopePreviewCard } from "./ScopePreviewCard";
import { ScopingMessage } from "./ScopingMessage";
import { SubmitDialog } from "./SubmitDialog";
import { SuggestionChips } from "./SuggestionChips";
import {
  bucketMessageLength,
  trackScopingEscapeClicked,
  trackScopingMessageSent,
  trackScopingOpened,
  trackScopingPdfDownloaded,
  trackScopingSampleLoaded,
  trackScopingScopeEdited,
  trackScopingScopeGenerated,
  trackScopingSubmitted,
} from "./telemetry";

/**
 * Walk a message's `toolInvocations` looking for our `proposeScope` call. The
 * AI SDK v4 represents tool calls as `{ toolCallId, toolName, args, state,
 * result? }` entries on the message. We trust the route's `tools` config
 * (only one tool exposed, parameters validated by Zod against
 * `ScopeSummarySchema`), so a name match is sufficient.
 */
function extractProposeScope(message: Message): ScopeSummary | null {
  const invocations = message.toolInvocations;
  if (!invocations || invocations.length === 0) return null;
  for (const inv of invocations) {
    if (inv.toolName === "proposeScope" && inv.args) {
      // Args have already passed Zod validation server-side via the tool's
      // `parameters` schema, so the type assertion is safe.
      return inv.args as ScopeSummary;
    }
  }
  return null;
}

function messageHasProposeScope(message: Message): boolean {
  return Boolean(message.toolInvocations?.some((i) => i.toolName === "proposeScope"));
}

export function ScopingSurface() {
  const [unconfigured, setUnconfigured] = useState<string | null>(null);
  const [previewScope, setPreviewScope] = useState<ScopeSummary | null>(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastTrackedScopeId = useRef<string | null>(null);

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
    api: "/api/ai/scoping",
    onResponse: (res) => {
      if (res.status === 503) {
        void res
          .clone()
          .json()
          .then((body: { error?: string }) => {
            setUnconfigured(body.error ?? SCOPING.errors.unconfigured);
          })
          .catch(() => {
            setUnconfigured(SCOPING.errors.unconfigured);
          });
      } else if (res.status === 429) {
        setUnconfigured(SCOPING.errors.rateLimited);
      }
    },
    onError: (e) => {
      // eslint-disable-next-line no-console
      console.error("[scoping] stream error:", e);
    },
  });

  // Page-mount telemetry (fire once).
  useEffect(() => {
    trackScopingOpened();
  }, []);

  // Sync the preview card from the latest assistant message that contains a
  // `proposeScope` tool call. We always take the most recent one — if the
  // user nudges the assistant to redraft, the latest call wins.
  useEffect(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m && m.role === "assistant") {
        const scope = extractProposeScope(m);
        if (scope) {
          setPreviewScope(scope);
          // Fire scope_generated once per source message id — avoids
          // duplicate events when the user edits a section locally and
          // useEffect re-runs with the same toolInvocation.
          if (lastTrackedScopeId.current !== m.id) {
            lastTrackedScopeId.current = m.id;
            trackScopingScopeGenerated({
              serviceCount: scope.recommendedServices.length,
              phaseCount: scope.phases.length,
              riskCount: scope.risks.length,
            });
          }
          return;
        }
      }
    }
  }, [messages]);

  // Auto-scroll to the bottom on new content.
  useEffect(() => {
    const el = messageListRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const isToolCallMessage = useMemo(() => {
    return new Set(
      messages.filter((m) => messageHasProposeScope(m)).map((m) => m.id),
    );
  }, [messages]);

  function reset() {
    setMessages([]);
    setUnconfigured(null);
    setPreviewScope(null);
    setSubmitted(false);
    setSubmitError(null);
    lastTrackedScopeId.current = null;
  }

  function loadSample() {
    setPreviewScope(SAMPLE_SCOPE);
    trackScopingSampleLoaded();
  }

  function submitWith(e: React.FormEvent<HTMLFormElement>) {
    if (input.trim().length > 0) {
      trackScopingMessageSent({
        source: "composer",
        lengthBucket: bucketMessageLength(input.length),
      });
    }
    handleSubmit(e);
  }

  /**
   * Build a redacted transcript snapshot to pass to the submit / pdf routes.
   * The /api/ai/scoping route already redacts inbound user messages before
   * the model sees them, but the local `messages` array still holds the
   * pre-redaction text the user typed. We don't redact again on the client
   * (CPU on the wrong side); the server's redact pass is the load-bearing
   * one. For PR-B we pass the messages through verbatim — the route's PII
   * posture (counts-only logging, domain-only persistence) handles privacy.
   *
   * Imperative push avoids a `.filter(...).map(...)` chain whose type
   * predicate fights the AI SDK's narrowed Message type (Message["role"]
   * includes "data"; the predicate intersection trips UIMessage's required
   * `parts` field).
   */
  function snapshotTranscript(): {
    role: "user" | "assistant" | "system";
    content: string;
  }[] {
    const out: { role: "user" | "assistant" | "system"; content: string }[] = [];
    for (const m of messages) {
      if (
        m.role === "user" ||
        m.role === "assistant" ||
        m.role === "system"
      ) {
        out.push({ role: m.role, content: m.content });
      }
    }
    return out;
  }

  async function handleDownloadPdf() {
    if (!previewScope || downloading) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/ai/scoping/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: previewScope,
          transcript: snapshotTranscript(),
          referrer:
            typeof document !== "undefined"
              ? document.referrer || undefined
              : undefined,
        }),
      });
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error("[scoping] pdf download failed:", res.status);
        return;
      }
      const blob = await res.blob();
      const today = new Date().toISOString().slice(0, 10);
      const filename = `propharmex-scope-${today}.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      trackScopingPdfDownloaded({
        bytes: blob.size,
        serviceCount: previewScope.recommendedServices.length,
        phaseCount: previewScope.phases.length,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[scoping] pdf download error:", err);
    } finally {
      setDownloading(false);
    }
  }

  async function handleSubmitToBd(contact: {
    email: string;
    company: string;
    name?: string;
    message?: string;
  }) {
    if (!previewScope || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/ai/scoping/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: previewScope,
          contact,
          transcript: snapshotTranscript(),
          referrer:
            typeof document !== "undefined"
              ? document.referrer || undefined
              : undefined,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setSubmitError(body?.error ?? SCOPING.errors.generic);
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { queued?: boolean };
      setSubmitDialogOpen(false);
      setSubmitted(true);
      trackScopingSubmitted({
        queued: Boolean(body.queued),
        serviceCount: previewScope.recommendedServices.length,
        phaseCount: previewScope.phases.length,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[scoping] submit error:", err);
      setSubmitError(SCOPING.errors.generic);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
      {/* Chat column */}
      <div className="flex h-[640px] max-h-[calc(100dvh-12rem)] flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_4px_12px_-4px_rgba(15,32,80,0.08)]">
        <header className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-primary-50)] px-4 py-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-[var(--color-primary-900)]">
              Conversation
            </h2>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
              5–8 questions, then a structured scope
            </p>
          </div>
          {messages.length > 0 ? (
            <button
              type="button"
              onClick={reset}
              className="rounded-[var(--radius-xs)] px-2 py-1 text-[11px] font-medium text-[var(--color-primary-700)] hover:bg-[color-mix(in_oklab,var(--color-primary-700)_10%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            >
              New scope
            </button>
          ) : null}
        </header>

        <div
          ref={messageListRef}
          className="flex-1 overflow-y-auto px-4 py-4"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {messages.length === 0 && !unconfigured ? (
            <EmptyState
              onPick={(prompt) => {
                trackScopingMessageSent({
                  source: "suggestion-chip",
                  lengthBucket: bucketMessageLength(prompt.length),
                });
                void append({ role: "user", content: prompt });
              }}
              onLoadSample={loadSample}
            />
          ) : null}

          {unconfigured ? (
            <p className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-slate-800)]">
              {unconfigured}
            </p>
          ) : null}

          <ul className="flex flex-col gap-3">
            {messages.map((m) => (
              <li key={m.id} className="list-none">
                <ScopingMessage
                  message={m}
                  hasToolCall={isToolCallMessage.has(m.id)}
                />
              </li>
            ))}
          </ul>

          {error ? (
            <p
              role="alert"
              className="mt-3 rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[color-mix(in_oklab,var(--color-danger)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-danger)]"
            >
              {SCOPING.errors.streamFailed}
            </p>
          ) : null}
        </div>

        <form
          onSubmit={submitWith}
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
                    submitWith(
                      new Event(
                        "submit",
                      ) as unknown as React.FormEvent<HTMLFormElement>,
                    );
                  }
                }
              }}
              placeholder={SCOPING.input.placeholder}
              rows={2}
              className="min-h-[44px] w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm leading-snug text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-primary-700)] focus-visible:outline-none"
              disabled={isLoading || Boolean(unconfigured)}
            />
            <button
              type="submit"
              disabled={
                isLoading ||
                Boolean(unconfigured) ||
                input.trim().length === 0
              }
              aria-label={
                isLoading ? SCOPING.input.sendingLabel : SCOPING.input.sendLabel
              }
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-700)] text-white transition hover:bg-[var(--color-primary-800)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1"
            >
              <ArrowRight aria-hidden="true" size={16} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 text-[11px] leading-snug">
            <p className="text-[var(--color-muted)]">
              {SCOPING.input.disclaimer}
            </p>
            <a
              href={SCOPING.escapeHatch.href}
              onClick={() => trackScopingEscapeClicked()}
              className="inline-flex items-center gap-0.5 whitespace-nowrap font-medium text-[var(--color-primary-700)] hover:underline"
            >
              {SCOPING.escapeHatch.label}
              <ArrowUpRight aria-hidden="true" size={11} />
            </a>
          </div>
        </form>
      </div>

      {/* Preview column */}
      <div className="flex flex-col gap-3 lg:sticky lg:top-24 lg:h-[calc(100dvh-8rem)] lg:max-h-[640px]">
        {submitted ? (
          <div
            role="status"
            className="rounded-[var(--radius-md)] border border-[var(--color-success)] bg-[color-mix(in_oklab,var(--color-success)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-success)]"
          >
            <p className="font-semibold">{SCOPING.preview.submittedHeading}</p>
            <p className="mt-0.5 text-[13px] leading-snug text-[var(--color-fg)]">
              {SCOPING.preview.submittedBody}
            </p>
          </div>
        ) : null}
        <ScopePreviewCard
          scope={previewScope}
          onChange={setPreviewScope}
          onEdit={(section) => trackScopingScopeEdited({ section })}
          onRequestSubmit={() => {
            setSubmitError(null);
            setSubmitDialogOpen(true);
          }}
          onDownloadPdf={() => {
            void handleDownloadPdf();
          }}
          downloading={downloading}
        />
      </div>

      <SubmitDialog
        open={submitDialogOpen}
        submitting={submitting}
        errorMessage={submitError}
        onClose={() => setSubmitDialogOpen(false)}
        onSubmit={(contact) => {
          void handleSubmitToBd(contact);
        }}
      />
    </div>
  );
}

function EmptyState({
  onPick,
  onLoadSample,
}: {
  onPick: (prompt: string) => void;
  onLoadSample: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
          {SCOPING.empty.heading}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
          {SCOPING.empty.body}
        </p>
      </div>
      <SuggestionChips
        label={SCOPING.empty.suggestionsLabel}
        suggestions={SCOPING.empty.suggestions}
        onPick={onPick}
      />
      <button
        type="button"
        onClick={onLoadSample}
        className="inline-flex w-fit items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-primary-700)] hover:border-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
      >
        <Sparkles aria-hidden="true" size={14} />
        {SCOPING.hero.sampleCtaLabel}
      </button>
    </div>
  );
}
