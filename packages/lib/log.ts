/**
 * Structured logger. Placeholder in Phase 0/1 — swapped for Axiom transport in Phase 9.
 *
 * Rules (CLAUDE.md §4.9):
 * - No `console.log` in committed code.
 * - Use `log.info`, `log.warn`, `log.error` — never raw console.
 * - Structured payloads only: `log.info("cdmo.concierge.query", { userId, topK })`.
 */

type Level = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: Level;
  event: string;
  meta?: Record<string, unknown>;
  ts: string;
}

function emit(entry: LogEntry): void {
  if (process.env.NODE_ENV === "test") return;
  const line = JSON.stringify(entry);
  // Intentional direct console use inside this logger only.
  if (entry.level === "error") console.error(line);
  else if (entry.level === "warn") console.warn(line);
  // eslint-disable-next-line no-console
  else if (process.env.NODE_ENV !== "production") console.log(line);
}

export const log = {
  debug(event: string, meta?: Record<string, unknown>): void {
    emit({ level: "debug", event, meta, ts: new Date().toISOString() });
  },
  info(event: string, meta?: Record<string, unknown>): void {
    emit({ level: "info", event, meta, ts: new Date().toISOString() });
  },
  warn(event: string, meta?: Record<string, unknown>): void {
    emit({ level: "warn", event, meta, ts: new Date().toISOString() });
  },
  error(event: string, meta?: Record<string, unknown>): void {
    emit({ level: "error", event, meta, ts: new Date().toISOString() });
  },
};
