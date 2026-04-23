import { defineArrayMember, defineField, defineType } from "sanity";

export const groqProjection = `{
  _type,
  _key,
  title,
  steps[]{
    number,
    title,
    description,
    duration
  }
}`;

export default defineType({
  name: "processStepper",
  title: "Process stepper",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section title",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      validation: (rule) => rule.required().min(2).max(12),
      of: [
        defineArrayMember({
          type: "object",
          name: "processStep",
          fields: [
            defineField({
              name: "number",
              title: "Step number",
              type: "number",
              validation: (rule) => rule.required().positive().integer(),
            }),
            defineField({
              name: "title",
              title: "Step title",
              type: "string",
              validation: (rule) => rule.required().max(60),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required().max(280),
            }),
            defineField({
              name: "duration",
              title: "Typical duration",
              type: "string",
              description:
                "Indicative duration only — use a range (e.g. '2-3 weeks'). Avoid promises.",
            }),
          ],
          preview: {
            select: {
              number: "number",
              title: "title",
              duration: "duration",
            },
            prepare({ number, title, duration }) {
              return {
                title: `${number ?? "?"}. ${title ?? ""}`,
                subtitle: duration,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", steps: "steps" },
    prepare({ title, steps }) {
      const count = Array.isArray(steps) ? steps.length : 0;
      return {
        title: title ?? "Process",
        subtitle: `Process stepper · ${count} step${count === 1 ? "" : "s"}`,
      };
    },
  },
});
