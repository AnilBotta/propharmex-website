import { defineArrayMember, defineField, defineType } from "sanity";
import { baseContentFields } from "../_helpers/baseFields";

export const groqProjection = `{
  _id,
  title,
  "slug": slug.current,
  role,
  bio,
  photo,
  credentials,
  linkedin,
  publications,
  orderRank
}`;

export default defineType({
  name: "person",
  title: "Person",
  type: "document",
  description:
    "Leadership, scientists, and named authors. Use the full legal name in `title`.",
  fields: [
    ...baseContentFields,
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 5,
      description: "Factual, anti-hype biography. Credentials and relevant experience only.",
      validation: (rule) => rule.max(800),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as { asset?: unknown } | undefined;
              if (parent?.asset && (!value || value.trim().length < 2)) {
                return "Alt text is required.";
              }
              return true;
            }),
        }),
      ],
    }),
    defineField({
      name: "credentials",
      title: "Credentials",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description:
        "Post-nominals, degrees, or certifications (e.g. 'PhD, Pharmaceutics', 'RAC').",
      options: { layout: "tags" },
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "publications",
      title: "Publications",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "publication",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
            }),
            defineField({
              name: "year",
              title: "Year",
              type: "number",
              validation: (rule) => rule.integer().min(1950).max(2100),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "year" },
          },
        }),
      ],
    }),
    defineField({
      name: "orderRank",
      title: "Order rank",
      type: "number",
      description: "Controls display order in leadership grids. Lower = earlier.",
      initialValue: 100,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "role", media: "photo" },
  },
  orderings: [
    {
      title: "Order rank",
      name: "orderRankAsc",
      by: [{ field: "orderRank", direction: "asc" }],
    },
  ],
});
