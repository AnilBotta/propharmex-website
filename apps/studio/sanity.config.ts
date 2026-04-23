import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schemaTypes, SINGLETON_TYPES } from "./schemas";
import { structure } from "./structure";
import { resolve } from "./presentation/resolve";

/**
 * Sanity Studio v3 config.
 * Schemas, desk structure, and presentation resolver are wired here.
 */
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  "veo2rnkc";

const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";

const previewOrigin =
  process.env.SANITY_STUDIO_PREVIEW_URL ?? "http://localhost:3000";

export default defineConfig({
  name: "propharmex",
  title: "Propharmex",
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
