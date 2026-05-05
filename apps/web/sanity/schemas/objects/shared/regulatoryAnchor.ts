import { defineField, defineType } from "sanity";

/**
 * A primary-source regulatory citation. Every regulatory claim on the
 * public site must be anchored to one of these.
 */
export const groqProjection = `{
  authority,
  url,
  asOfDate,
  note
}`;

export default defineType({
  name: "regulatoryAnchor",
  title: "Regulatory anchor",
  type: "object",
  description:
    "Primary-source citation. Link to the issuing authority directly — never to a secondary summary.",
  fields: [
    defineField({
      name: "authority",
      title: "Authority",
      type: "string",
      options: {
        list: [
          { title: "Health Canada", value: "health-canada" },
          { title: "USFDA", value: "usfda" },
          { title: "ICH", value: "ich" },
          { title: "WHO", value: "who" },
          { title: "TGA (Australia)", value: "tga" },
          { title: "EMA", value: "ema" },
          { title: "PMDA (Japan)", value: "pmda" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Primary-source URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "asOfDate",
      title: "As of (date)",
      type: "datetime",
      description:
        "The date on which the citation was last confirmed against the primary source.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      title: "Context note",
      type: "text",
      rows: 2,
      description: "Optional note clarifying scope or version of the citation.",
    }),
  ],
  preview: {
    select: { title: "authority", subtitle: "url" },
    prepare({ title, subtitle }) {
      return {
        title: title ? String(title).toUpperCase() : "Regulatory anchor",
        subtitle,
      };
    },
  },
});
