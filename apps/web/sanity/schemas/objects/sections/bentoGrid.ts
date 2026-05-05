import { defineArrayMember, defineField, defineType } from "sanity";

export const groqProjection = `{
  _type,
  _key,
  title,
  tiles[]{
    size,
    kind,
    content,
    image,
    linkHref,
    linkLabel
  }
}`;

export default defineType({
  name: "bentoGrid",
  title: "Bento grid",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section title",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "tiles",
      title: "Tiles",
      type: "array",
      validation: (rule) => rule.required().min(2).max(12),
      of: [
        defineArrayMember({
          type: "object",
          name: "bentoTile",
          fields: [
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              options: {
                list: [
                  { title: "Small", value: "sm" },
                  { title: "Medium", value: "md" },
                  { title: "Large", value: "lg" },
                  { title: "Extra large", value: "xl" },
                ],
              },
              initialValue: "md",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "kind",
              title: "Kind",
              type: "string",
              options: {
                list: [
                  { title: "Image", value: "image" },
                  { title: "Stat", value: "stat" },
                  { title: "Quote", value: "quote" },
                  { title: "Copy", value: "copy" },
                ],
              },
              initialValue: "copy",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "content",
              title: "Content",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [
                    { title: "Normal", value: "normal" },
                    { title: "H3", value: "h3" },
                    { title: "H4", value: "h4" },
                    { title: "Quote", value: "blockquote" },
                  ],
                  lists: [],
                  marks: {
                    decorators: [
                      { title: "Strong", value: "strong" },
                      { title: "Emphasis", value: "em" },
                    ],
                  },
                }),
              ],
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                  validation: (rule) =>
                    rule.custom((value, context) => {
                      const parent = context.parent as
                        | { asset?: unknown }
                        | undefined;
                      if (parent?.asset && (!value || value.length < 2)) {
                        return "Alt text is required for all images.";
                      }
                      return true;
                    }),
                }),
              ],
            }),
            defineField({
              name: "linkHref",
              title: "Link href",
              type: "string",
            }),
            defineField({
              name: "linkLabel",
              title: "Link label",
              type: "string",
            }),
          ],
          preview: {
            select: {
              kind: "kind",
              size: "size",
              media: "image",
              label: "linkLabel",
            },
            prepare({ kind, size, media, label }) {
              return {
                title: `${kind ?? "tile"} · ${size ?? "md"}`,
                subtitle: label,
                media,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", tiles: "tiles" },
    prepare({ title, tiles }) {
      const count = Array.isArray(tiles) ? tiles.length : 0;
      return {
        title: title ?? "Bento grid",
        subtitle: `${count} tile${count === 1 ? "" : "s"}`,
      };
    },
  },
});
