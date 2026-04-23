import { defineArrayMember, defineField, defineType } from "sanity";

export const groqProjection = `{
  _type,
  _key,
  stats[]{
    value,
    unit,
    label,
    sourceUrl,
    asOfDate
  }
}`;

export default defineType({
  name: "statsStrip",
  title: "Stats strip",
  type: "object",
  description:
    "Numeric highlights. Every stat must carry a source URL and a date it was confirmed.",
  fields: [
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      validation: (rule) => rule.required().min(2).max(6),
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
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
              description: "e.g. '%', 'days', 'batches'.",
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: "sourceUrl",
              title: "Source URL",
              type: "url",
              description:
                "Primary source that verifies the figure. Required for regulatory or efficacy claims.",
              validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
            }),
            defineField({
              name: "asOfDate",
              title: "As of (date)",
              type: "datetime",
            }),
          ],
          preview: {
            select: { value: "value", unit: "unit", label: "label" },
            prepare({ value, unit, label }) {
              return {
                title: [value, unit].filter(Boolean).join(" "),
                subtitle: label,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { stats: "stats" },
    prepare({ stats }) {
      const count = Array.isArray(stats) ? stats.length : 0;
      return { title: "Stats strip", subtitle: `${count} stat${count === 1 ? "" : "s"}` };
    },
  },
});
