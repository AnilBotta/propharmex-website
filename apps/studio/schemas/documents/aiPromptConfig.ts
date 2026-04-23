import { defineField, defineType } from "sanity";
import { longFormPortableText } from "../_helpers/baseFields";

/**
 * Singleton — source of truth for every system prompt used by the four AI
 * tools (Concierge, Scoping, DEL Readiness, Dosage Matcher). Accessible via
 * fixed document ID `aiPromptConfig`.
 */
export const groqProjection = `{
  _id,
  concierge,
  scoping,
  delReadiness,
  dosageMatcher,
  globalDisclaimer
}`;

type PromptKey = "concierge" | "scoping" | "delReadiness" | "dosageMatcher";

function promptField(name: PromptKey, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({
        name: "systemPrompt",
        title: "System prompt",
        type: "text",
        rows: 12,
        validation: (rule) => rule.required().min(40),
      }),
      defineField({
        name: "temperature",
        title: "Temperature",
        type: "number",
        initialValue: 0.4,
        validation: (rule) => rule.min(0).max(2),
      }),
      defineField({
        name: "model",
        title: "Model",
        type: "string",
        initialValue: "claude-opus-4-7",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "lastUpdatedBy",
        title: "Last updated by",
        type: "string",
      }),
      defineField({
        name: "changelog",
        title: "Changelog",
        type: "array",
        of: longFormPortableText,
      }),
      defineField({
        name: "disclaimer",
        title: "Tool-specific disclaimer",
        type: "text",
        rows: 3,
        description:
          "Shown to users alongside every response from this tool. Factual, anti-hype.",
        validation: (rule) => rule.required().max(480),
      }),
    ],
    options: { collapsible: true, collapsed: false },
  });
}

export default defineType({
  name: "aiPromptConfig",
  title: "AI prompt config",
  type: "document",
  // Singleton — hidden create/delete via desk structure; only update/publish.
  // @ts-expect-error __experimental_actions is typed permissively in Sanity v3.
  __experimental_actions: ["update", "publish"],
  fields: [
    promptField("concierge", "Concierge"),
    promptField("scoping", "Scoping"),
    promptField("delReadiness", "DEL readiness"),
    promptField("dosageMatcher", "Dosage form matcher"),
    defineField({
      name: "globalDisclaimer",
      title: "Global AI disclaimer",
      type: "text",
      rows: 3,
      description:
        "Shown alongside any AI-generated output on the public site. Required.",
      validation: (rule) => rule.required().min(40).max(480),
    }),
  ],
  preview: {
    prepare() {
      return { title: "AI prompt config", subtitle: "Singleton" };
    },
  },
});
