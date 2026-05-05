import { defineLocations, type PresentationPluginOptions } from "sanity/presentation";

/**
 * Presentation tool resolver — maps a Sanity document to the public URL(s)
 * where it appears on the Next.js site. Used for visual editing overlays.
 *
 * Lives at `sanity/preview/` (not `sanity/presentation/`) to avoid shadowing
 * the `sanity/presentation` npm subpath when TypeScript resolves bare
 * specifiers with `baseUrl: "."` set — see PR-L′ and apps/web/tsconfig.json.
 */
export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    page: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? "Untitled",
            href: `/${doc?.slug ?? ""}`.replace(/\/+$/, "") || "/",
          },
          { title: "Home", href: "/" },
        ],
      }),
    }),
    service: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? "Untitled service",
            href: `/services/${doc?.slug ?? ""}`,
          },
          { title: "Services index", href: "/services" },
        ],
      }),
    }),
    industry: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? "Untitled industry",
            href: `/industries/${doc?.slug ?? ""}`,
          },
          { title: "Industries index", href: "/industries" },
        ],
      }),
    }),
    insight: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? "Untitled insight",
            href: `/insights/${doc?.slug ?? ""}`,
          },
          { title: "Insights index", href: "/insights" },
        ],
      }),
    }),
    caseStudy: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? "Untitled case study",
            href: `/case-studies/${doc?.slug ?? ""}`,
          },
          { title: "Case studies index", href: "/case-studies" },
        ],
      }),
    }),
  },
};
