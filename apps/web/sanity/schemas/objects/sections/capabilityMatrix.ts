import { defineArrayMember, defineField, defineType } from "sanity";

export const groqProjection = `{
  _type,
  _key,
  title,
  columns,
  rows[]{
    label,
    values
  }
}`;

export default defineType({
  name: "capabilityMatrix",
  title: "Capability matrix",
  type: "object",
  description:
    "Tabular matrix. Columns define headers; each row pairs a label with one value per column.",
  fields: [
    defineField({
      name: "title",
      title: "Section title",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(2).max(8),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      validation: (rule) => rule.required().min(1).max(40),
      of: [
        defineArrayMember({
          type: "object",
          name: "matrixRow",
          fields: [
            defineField({
              name: "label",
              title: "Row label",
              type: "string",
              validation: (rule) => rule.required().max(100),
            }),
            defineField({
              name: "values",
              title: "Values (one per column)",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "label" },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", rows: "rows", columns: "columns" },
    prepare({ title, rows, columns }) {
      const r = Array.isArray(rows) ? rows.length : 0;
      const c = Array.isArray(columns) ? columns.length : 0;
      return {
        title: title ?? "Capability matrix",
        subtitle: `${r} row${r === 1 ? "" : "s"} × ${c} column${c === 1 ? "" : "s"}`,
      };
    },
  },
});
