/**
 * Portable Text helpers.
 *
 * We intentionally do NOT constrain the block shape with Zod — `@portabletext/react`
 * handles validation at render time and the block schema is deeply recursive.
 * For RAG, SEO descriptions, and previews we only need a plain-text flattener.
 */

/**
 * Minimal re-exported type to keep consumers from pulling `@portabletext/types`
 * transitively. Callers that need the full type can import from the upstream
 * package directly.
 */
export interface PortableTextSpan {
  _type?: string;
  _key?: string;
  text?: string;
  marks?: string[];
}

export interface PortableTextBlock {
  _type: string;
  _key?: string;
  children?: PortableTextSpan[];
  style?: string;
  listItem?: string;
  level?: number;
  markDefs?: Record<string, unknown>[];
}

/**
 * Flatten a Portable Text body to a single whitespace-collapsed plain string.
 * Useful for SEO descriptions, RAG chunk sources, and excerpt generation.
 */
export function toPlainText(blocks: unknown[] | null | undefined): string {
  if (!Array.isArray(blocks)) return "";
  const parts: string[] = [];
  for (const block of blocks) {
    if (!block || typeof block !== "object") continue;
    const b = block as PortableTextBlock;
    if (b._type !== "block" || !Array.isArray(b.children)) continue;
    for (const child of b.children) {
      if (child && typeof child.text === "string") {
        parts.push(child.text);
      }
    }
    parts.push("\n");
  }
  return parts.join("").replace(/\s+/g, " ").trim();
}
