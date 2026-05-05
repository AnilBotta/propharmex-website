import { defineArrayMember, defineField, defineType } from "sanity";
import {
  baseContentFields,
  longFormPortableText,
} from "../_helpers/baseFields";

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
  articleType,
  author->{ _id, title, role, photo },
  tags,
  readingMinutes,
  heroImage,
  excerpt,
  body,
  relatedReads[]->{ _id, title, "slug": slug.current, articleType },
  faqRefs[]->{ _id, question, answer, tag }
}`;

export default defineType({
  name: "insight",
  title: "Insight",
  type: "document",
  description:
    "Thought-leadership article. Every claim must be verifiable and every regulatory reference anchored to a primary source.",
  fields: [
    ...baseContentFields,
    defineField({
      name: "articleType",
      title: "Article type",
      type: "string",
      options: {
        list: [
          { title: "News", value: "news" },
          { title: "Tech", value: "tech" },
          { title: "Scholar", value: "scholar" },
          { title: "Insight", value: "insight" },
          { title: "Regulatory update", value: "regulatory-update" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "person" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "readingMinutes",
      title: "Reading time (minutes)",
      type: "number",
      validation: (rule) => rule.positive().integer().min(1).max(120),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
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
              if (parent?.asset && (!value || value.trim().length < 4)) {
                return "Alt text is required.";
              }
              return true;
            }),
        }),
      ],
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(40).max(320),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: longFormPortableText,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "relatedReads",
      title: "Related reads",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "insight" }] })],
    }),
    defineField({
      name: "faqRefs",
      title: "Related FAQs",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "faq" }] })],
    }),
  ],
  preview: {
    select: {
      title: "title",
      articleType: "articleType",
      author: "author.title",
      media: "heroImage",
    },
    prepare({ title, articleType, author, media }) {
      return {
        title: title ?? "Insight",
        subtitle: [articleType, author].filter(Boolean).join(" · "),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Published (new → old)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
