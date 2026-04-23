import { defineArrayMember, defineField, defineType } from "sanity";
import {
  baseContentFields,
  sectionBuilderMembers,
} from "../_helpers/baseFields";

export const pillarOptions = [
  { title: "Development", value: "development" },
  { title: "Analytical", value: "analytical" },
  { title: "Regulatory", value: "regulatory" },
  { title: "Distribution", value: "distribution" },
  { title: "Quality", value: "quality" },
];

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
  variant,
  parent->{ _id, title, "slug": slug.current },
  pillar,
  summary,
  body,
  deliverables,
  stages[]{ label, duration, description },
  regulatoryAnchors[]{ authority, url, asOfDate, note }
}`;

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    ...baseContentFields,
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Hub (pillar overview)", value: "hub" },
          { title: "Leaf (individual service)", value: "leaf" },
        ],
        layout: "radio",
      },
      initialValue: "leaf",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "parent",
      title: "Parent hub",
      type: "reference",
      to: [{ type: "service" }],
      options: {
        filter: ({ document }) => ({
          filter: '_type == "service" && variant == "hub" && _id != $selfId && !(_id in path("drafts.**"))',
          params: { selfId: document._id?.replace(/^drafts\./, "") ?? "" },
        }),
      },
      hidden: ({ document }) => document?.variant !== "leaf",
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as
            | { variant?: string; _id?: string }
            | undefined;
          if (doc?.variant === "leaf" && !value) {
            return "Leaf services must reference a parent hub.";
          }
          return true;
        }),
    }),
    defineField({
      name: "pillar",
      title: "Pillar",
      type: "string",
      options: { list: pillarOptions },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 4,
      description: "Plain-language summary. What the service is, for whom, and on what timeline.",
      validation: (rule) => rule.required().min(60).max(480),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: sectionBuilderMembers,
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Concrete artifacts the client receives.",
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "stages",
      title: "Stages",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "serviceStage",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required().max(60),
            }),
            defineField({
              name: "duration",
              title: "Duration",
              type: "string",
              description:
                "Indicative range only (e.g. '4-6 weeks'). Do not promise timelines.",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (rule) => rule.max(320),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "duration" },
          },
        }),
      ],
    }),
    defineField({
      name: "regulatoryAnchors",
      title: "Regulatory anchors",
      type: "array",
      description:
        "Every regulatory claim on this page must tie to a primary-source URL.",
      of: [defineArrayMember({ type: "regulatoryAnchor" })],
    }),
  ],
  preview: {
    select: {
      title: "title",
      pillar: "pillar",
      variant: "variant",
      media: "ogImage",
    },
    prepare({ title, pillar, variant, media }) {
      return {
        title: title ?? "Service",
        subtitle: [variant, pillar].filter(Boolean).join(" · "),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Pillar",
      name: "pillarAsc",
      by: [
        { field: "pillar", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
});
