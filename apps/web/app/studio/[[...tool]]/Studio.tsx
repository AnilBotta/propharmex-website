"use client";

/**
 * Client-side wrapper for the embedded Sanity Studio (PR-L′).
 *
 * The studio's config (`apps/web/sanity.config.ts`) and the underlying
 * `sanity` package call `React.createContext` at module top — that fails
 * when imported into a Server Component (the React export the RSC layer
 * sees doesn't include `createContext`). Pulling the import behind this
 * `"use client"` boundary keeps the RSC layer clean while letting the
 * page.tsx wrapper continue to export `metadata` and `viewport` as a
 * server component.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function Studio() {
  return <NextStudio config={config} />;
}
