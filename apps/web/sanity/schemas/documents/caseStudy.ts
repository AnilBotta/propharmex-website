import { defineArrayMember, defineField, defineType } from "sanity";
import {
  baseContentFields,
  longFormPortableText,
} from "../_helpers/baseFields";
import { pillarOptions } from "./service";

export const groqProjection = `{
  _id,
  title,
  "slug": slug.current,
  seoTitle,
  seoDescription,
  ogImage,
  publishedAt,
  isVisible,
  region,
  ragEligible,
  clientName,
  clientLogo,
  logoPermitted,
  pillar,
  problem,
  approach,
  solution,
  result,
  metrics[]{ label, value, unit },
  timeline,
  relatedServices[]->{ _id, title, "slug": slug.current, pillar }
}`;

export default defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  description:
    "Problem-Approach-Solution-Result. Anonymize unless the client has granted written permission to use their name and logo.",
  fields: [
    ...baseContentFields,
    defineField({
      name: "clientName",
      title: "Client name",
      type: "string",
      description: "Anonymize (e.g. 'Top-five generics sponsor') unless permission is granted.",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "clientLogo",
      title: "Client logo",
      type: "image",
      options: { hotspot: false },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as { asset?: unknown } | undefined;
              if (parent?.asset && (!value || value.trim().length < 2)) {
                return "Alt text is required when a logo is provided.";
              }
              return true;
            }),
        }),
      ],
      hidden: ({ document }) => !document?.logoPermitted,
    }),
    defineField({
      name: "logoPermitted",
      title: "Client logo usage permitted in writing",
      type: "boolean",
      description:
        "Set true only when the client has granted written permission to display their name and logo.",
      initialValue: false,
    }),
    defineField({
      name: "pillar",
      title: "Pillar",
      type: "string",
      options: { list: pillarOptions },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "problem",
      title: "Problem",
      type: "array",
      of: longFormPortableText,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "approach",
      title: "Approach",
      type: "array",
      of: longFormPortableText,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "solution",
      title: "Solution",
      type: "array",
      of: longFormPortableText,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "result",
      title: "Result",
      type: "array",
      of: longFormPortableText,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "caseMetric",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "unit",
              title: "Unit",
              type: "string",
            }),
          ],
          preview: {
            select: { label: "label", value: "value", unit: "unit" },
            prepare({ label, value, unit }) {
              return {
                title: [value, unit].filter(Boolean).join(" "),
                subtitle: label,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      type: "object",
      fields: [
        defineField({
          name: "start",
          title: "Start",
          type: "date",
        }),
        defineField({
          name: "end",
          title: "End",
          type: "date",
        }),
        defineField({
          name: "summary",
          title: "Summary",
          type: "string",
          description: "Plain-language summary (e.g. 'Completed in 9 months from kick-off to filing').",
        }),
      ],
    }),
    defineField({
      name: "relatedServices",
      title: "Related services",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
  ],
  preview: {
    select: {
      title: "title",
      clientName: "clientName",
      media: "ogImage",
    },
    prepare({ title, clientName, media }) {
      return {
        title: title ?? "Case study",
        subtitle: clientName,
        media,
      };
    },
  },
});
