import { defineArrayMember, defineField, defineType } from "sanity";

export const groqProjection = `{
  _type,
  _key,
  title,
  subtitle,
  logos[]{
    image,
    label,
    url,
    permissionGranted
  }
}`;

export default defineType({
  name: "logoWall",
  title: "Logo wall",
  type: "object",
  description:
    "Display partner, certification body, or client logos. Only logos with explicit written permission may be shown.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      validation: (rule) => rule.required().min(1).max(24),
      of: [
        defineArrayMember({
          type: "object",
          name: "logoItem",
          fields: [
            defineField({
              name: "image",
              title: "Logo image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                  validation: (rule) => rule.required().min(2),
                }),
              ],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
            }),
            defineField({
              name: "permissionGranted",
              title: "Written permission on file",
              type: "boolean",
              description:
                "Set true only when the client or partner has granted written permission to display their mark.",
              initialValue: false,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "label",
              media: "image",
              permission: "permissionGranted",
            },
            prepare({ title, media, permission }) {
              return {
                title: title ?? "Logo",
                subtitle: permission ? "Permission granted" : "Permission missing",
                media,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", logos: "logos" },
    prepare({ title, logos }) {
      const count = Array.isArray(logos) ? logos.length : 0;
      return {
        title: title ?? "Logo wall",
        subtitle: `${count} logo${count === 1 ? "" : "s"}`,
      };
    },
  },
});
