/**
 * Inline JSON-LD <script> helper.
 *
 * Accepts any JSON-serializable object and renders it as a
 * `<script type="application/ld+json">` block. Next.js 15 App Router renders
 * server components to static HTML by default — no hydration cost.
 */
import type { FC } from "react";

type Props = { id?: string; data: unknown };

export const JsonLd: FC<Props> = ({ id, data }) => (
  <script
    id={id}
    type="application/ld+json"
    // Safe: the payload is built from typed helpers in packages/lib/schema-org.
    // No user input reaches here.
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
