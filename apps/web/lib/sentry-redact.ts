/**
 * PII redaction for Sentry events (Prompt 25 PR-A).
 *
 * Sentry's stock SDK is privacy-permissive by default — it collects user
 * IPs, request bodies, cookies, query strings, and form values. None of
 * that is acceptable for a regulated pharma site. This module is the
 * single `beforeSend` we attach across all three Sentry runtimes
 * (client / server / edge) so the redaction policy is uniform and
 * version-controlled.
 *
 * Hard rules — match the structured-log policy in
 * `packages/lib/redact.ts` and the analytics rules in
 * `docs/analytics-taxonomy.md`:
 *
 *   1. Drop `event.user.ip_address` and `event.user.email`.
 *   2. Drop request `cookies`, `data` (request body), and any query
 *      parameter values from `event.request.query_string`.
 *   3. Strip raw email-looking strings out of `event.message`,
 *      breadcrumbs, and exception values. Replace with `<email>`.
 *   4. Strip Resend / Anthropic / OpenAI / Sentry / Upstash bearer-token
 *      headers if they ever leaked into a captured event.
 *   5. Truncate any captured `extra` field longer than 2 KB to avoid
 *      capturing inadvertent prose (chat messages, contact-form bodies).
 *
 * If the upstream SDK adds a new PII-relevant field we don't yet redact,
 * the hardening should land here — never per-call-site.
 */
import type { ErrorEvent } from "@sentry/nextjs";

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const TOKEN_HEADER_KEYS = new Set([
  "authorization",
  "x-api-key",
  "anthropic-api-key",
  "openai-api-key",
  "x-resend-api-key",
  "cookie",
  "set-cookie",
]);

const MAX_EXTRA_LEN = 2_000;

/** Redact email addresses from an arbitrary string. */
function scrubString(value: string): string {
  return value.replace(EMAIL_RE, "<email>");
}

/**
 * Recursively scrub a value. Strings get email-redacted; long strings
 * truncated. Arrays / objects walked. All other primitives pass through.
 *
 * Paths that match TOKEN_HEADER_KEYS at any depth are replaced with
 * `<redacted>` regardless of value. We do this at the key level so we
 * don't accidentally leak partial bearer tokens through email regex.
 */
function scrubValue(input: unknown, key?: string): unknown {
  if (key && TOKEN_HEADER_KEYS.has(key.toLowerCase())) return "<redacted>";

  if (typeof input === "string") {
    const scrubbed = scrubString(input);
    return scrubbed.length > MAX_EXTRA_LEN
      ? `${scrubbed.slice(0, MAX_EXTRA_LEN)}…`
      : scrubbed;
  }

  if (Array.isArray(input)) {
    return input.map((item) => scrubValue(item));
  }

  if (input && typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input)) {
      out[k] = scrubValue(v, k);
    }
    return out;
  }

  return input;
}

/**
 * Redact a `query_string` value into the same structural type Sentry
 * gave us. Sentry's `QueryParams` is `string | { [k]: string } | [k,v][]`
 * — we keep keys, replace values.
 */
function scrubQueryString<T>(qs: T): T {
  if (typeof qs === "string") {
    return qs
      .split("&")
      .map((pair) => {
        const idx = pair.indexOf("=");
        return idx < 0 ? pair : `${pair.slice(0, idx)}=<redacted>`;
      })
      .join("&") as unknown as T;
  }
  if (Array.isArray(qs)) {
    return qs.map(([k]) => [k, "<redacted>"]) as unknown as T;
  }
  if (qs && typeof qs === "object") {
    const out: Record<string, string> = {};
    for (const k of Object.keys(qs as Record<string, string>)) {
      out[k] = "<redacted>";
    }
    return out as unknown as T;
  }
  return qs;
}

/**
 * Stock `beforeSend` to install across all three Sentry runtimes.
 * Returns the same event reference (mutated) so the SDK's strict
 * `ErrorEvent` discriminator (`type: undefined`) is preserved.
 */
export function redactSentryEvent(event: ErrorEvent): ErrorEvent {
  // 1. User identity
  if (event.user) {
    delete event.user.ip_address;
    delete event.user.email;
  }

  // 2. Request envelope
  if (event.request) {
    delete event.request.cookies;
    delete event.request.data;
    if (event.request.query_string) {
      event.request.query_string = scrubQueryString(
        event.request.query_string,
      );
    }
    if (event.request.headers) {
      for (const k of Object.keys(event.request.headers)) {
        if (TOKEN_HEADER_KEYS.has(k.toLowerCase())) {
          event.request.headers[k] = "<redacted>";
        }
      }
    }
  }

  // 3. Free-text fields
  if (typeof event.message === "string") {
    event.message = scrubString(event.message);
  }
  if (event.exception?.values) {
    for (const ex of event.exception.values) {
      if (typeof ex.value === "string") ex.value = scrubString(ex.value);
    }
  }
  if (event.breadcrumbs) {
    for (const bc of event.breadcrumbs) {
      if (typeof bc.message === "string") bc.message = scrubString(bc.message);
      if (bc.data) bc.data = scrubValue(bc.data) as typeof bc.data;
    }
  }

  // 4. Extra / contexts — recursive
  if (event.extra) {
    event.extra = scrubValue(event.extra) as typeof event.extra;
  }
  if (event.contexts) {
    event.contexts = scrubValue(event.contexts) as typeof event.contexts;
  }

  return event;
}
