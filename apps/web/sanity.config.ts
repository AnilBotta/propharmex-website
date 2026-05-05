import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schemaTypes, SINGLETON_TYPES } from "./sanity/schemas";
// Local desk + preview live under sanity/desk and sanity/preview (NOT
// sanity/structure or sanity/presentation) to avoid shadowing the npm
// subpath exports of the same name when TypeScript resolves bare
// specifiers with `baseUrl: "."` set in apps/web/tsconfig.json.
import { structure } from "./sanity/desk";
import { resolve } from "./sanity/preview/resolve";

/**
 * Sanity Studio v3 config — embedded into apps/web at /studio.
 * Schemas, desk structure, and presentation resolver live alongside the Next.js app.
 */
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  process.env.SANITY_STUDIO_PROJECT_ID ??
  "veo2rnkc";

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  process.env.SANITY_STUDIO_DATASET ??
  "production";

// Same-origin preview — the embedded studio frames its own host. In dev that's
// http://localhost:3000; in prod the canonical site URL.
const previewOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SANITY_STUDIO_PREVIEW_URL ??
  "http://localhost:3000";

export default defineConfig({
  name: "propharmex",
  title: "Propharmex",
  // Studio mounts at /studio inside the Next.js app — no separate host.
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: previewOrigin,
        previewMode: { enable: "/api/draft" },
      },
      resolve,
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // Prevent users from creating or deleting singleton documents.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    // Hide "Duplicate", "Delete", and "Create" actions for singleton docs.
    actions: (prev, context) => {
      if (SINGLETON_TYPES.has(context.schemaType)) {
        return prev.filter(({ action }) =>
          ["publish", "discardChanges", "restore"].includes(action ?? ""),
        );
      }
      return prev;
    },
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter(
          (item) => !SINGLETON_TYPES.has(item.templateId ?? ""),
        );
      }
      return prev;
    },
  },
});
