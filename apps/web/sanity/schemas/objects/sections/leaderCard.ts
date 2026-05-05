import { defineField, defineType } from "sanity";

export const groqProjection = `{
  _type,
  _key,
  style,
  person->{
    _id,
    title,
    role,
    photo,
    bio,
    credentials,
    linkedin
  }
}`;

export default defineType({
  name: "leaderCard",
  title: "Leader card",
  type: "object",
  fields: [
    defineField({
      name: "person",
      title: "Person",
      type: "reference",
      to: [{ type: "person" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Minimal (photo + name + role)", value: "minimal" },
          { title: "Detailed (with bio + credentials)", value: "detailed" },
        ],
        layout: "radio",
      },
      initialValue: "minimal",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "person.title",
      subtitle: "person.role",
      media: "person.photo",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? "Leader card",
        subtitle,
        media,
      };
    },
  },
});
