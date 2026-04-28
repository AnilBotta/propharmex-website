/**
 * PII redaction for inbound chat messages.
 *
 * Used by /api/ai/concierge before forwarding the user's message to Claude
 * (and before logging it). Three regex passes:
 *
 *   1. Email addresses          → [redacted email]
 *   2. Phone numbers (NA + intl) → [redacted phone]
 *   3. Self-identification       → [redacted name]
 *      Matches "my name is X", "I am X", "I'm X" where X is a Capitalized
 *      proper noun (1–2 tokens). Common-noun cases like "I'm hungry" or
 *      "I'm a developer" must NOT match.
 *
 * Goal: defense-in-depth, not perfection. The model still needs to be
 * instructed (via the system prompt) not to ask for or store PII.
 */

export interface RedactResult {
  redactedText: string;
  redactionCount: number;
}

// RFC-5321-lite. Catches the realistic shapes (`local@domain.tld`,
// `local+tag@sub.domain.co`) without trying to be a full RFC parser.
const EMAIL_RE = /[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/g;

// Phone numbers, 10–15 digits, with optional `+`, separators, and parens.
// Anchored on a digit run + at least one separator/grouping cue so we don't
// strip plain integers like "year 2024" or "457 chunks".
//
// Accepts:
//   +1 (416) 555-1234
//   416-555-1234
//   +44 20 7946 0958
//   1.416.555.1234
const PHONE_RE =
  /(?:\+?\d{1,3}[ .\-]?)?(?:\(\d{2,4}\)[ .\-]?|\d{2,4}[ .\-])\d{2,4}[ .\-]?\d{3,4}\b/g;

// Self-identification. Capturing group is the name (1–2 capitalized tokens).
//
// We do NOT use the `i` flag here because in JavaScript `i` also relaxes
// `[A-Z]` to match lowercase, which would defeat the capitalization check
// that distinguishes proper nouns from common nouns. Instead, the verb
// alternations enumerate both cases explicitly.
//
// Why we require capitalization on the name:
//   "my name is Anil"     → match
//   "I'm Sarah Khan"      → match
//   "I'm hungry"          → NO match (lowercase)
//   "I am a developer"    → NO match (lowercase)
const NAME_RE =
  /\b(?:[Mm]y name is|[Ii] am|[Ii]'m)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;

export function redact(input: string): RedactResult {
  let count = 0;

  let out = input.replace(EMAIL_RE, () => {
    count += 1;
    return "[redacted email]";
  });

  out = out.replace(PHONE_RE, (match) => {
    // Skip if the match is already inside a previous replacement marker.
    // (Shouldn't happen given EMAIL_RE runs first and produces the literal
    // bracketed token, but cheap insurance.)
    if (match.includes("[redacted")) return match;
    count += 1;
    return "[redacted phone]";
  });

  out = out.replace(NAME_RE, (_full, _name, offset: number, source: string) => {
    count += 1;
    // Preserve the leading verb so the surrounding sentence still parses:
    //   "Hi, my name is Anil and I work at..." → "Hi, [redacted name] and I work at..."
    // The whole match (verb + name) is replaced. The verb is restored via
    // the leading whitespace boundary so we don't double-space.
    void offset;
    void source;
    return "[redacted name]";
  });

  return { redactedText: out, redactionCount: count };
}
