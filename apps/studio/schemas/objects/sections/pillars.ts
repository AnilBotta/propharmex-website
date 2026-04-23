import { defineArrayMember, defineField, defineType } from "sanity";

export const groqProjection = `{
  _type,
  _key,
  title,
  cards[]{
    icon,
    title,
    body,
    link
  }
}`;

const iconOptions = [
  { title: "Flask (development)", value: "flask" },
  { title: "Microscope (analytical)", value: "microscope" },
  { title: "Shield (regulatory)", value: "shield" },
  { title: "Truck (distribution)", value: "truck" },
  { title: "Check (quality)", value: "check" },
  { title: "Atom (research)", value: "atom" },
  { title: "Globe (regions)", value: "globe" },
  { title: "Document (filing)", value: "document" },
  { title: "Pill (dosage form)", value: "pill" },
];

export default defineType({
  name: "pillars",
  title: "Pillars",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section title",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "cards",
      title: "Pillar cards",
      type: "array",
      validation: (rule) => rule.required().min(2).max(6),
      of: [
        defineArrayMember({
          type: "object",
          name: "pillarCard",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: { list: iconOptions },
            }),
            defineField({
              name: "title",
              title: "Card title",
              type: "string",
              validation: (rule) => rule.required().max(60),
            }),
            defineField({
              name: "body",
              title: "Card body",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required().max(240),
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "link",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "icon" },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", cards: "cards" },
    prepare({ title, cards }) {
      const count = Array.isArray(cards) ? cards.length : 0;
      return {
        title: title ?? "Pillars",
        subtitle: `Pillars · ${count} card${count === 1 ? "" : "s"}`,
      };
    },
  },
});
