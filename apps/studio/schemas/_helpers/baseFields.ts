import { defineArrayMember, defineField } from "sanity";
import type { FieldDefinition, SlugRule } from "sanity";

interface SlugUniquenessContext {
  readonly document?: {
    readonly _id?: string;
    readonly _type?: string;
  } | null;
  readonly getClient: (options: { apiVersion: string }) => {
    fetch<T>(query: string, params?: Record<string, unknown>): Promise<T>;
  };
}

/**
 * Shared field factories and validators applied across every content document
 * (page, service, industry, caseStudy, insight, whitepaper, person, facility,
 * certification, faq, testimonial, sopCapability).
 *
 * These are not documents themselves — they produce field definitions that
 * are spread into each document's `fields` array.
 */

export const regionOptions = [
  { title: "Canada", value: "canada" },
  { title: "India", value: "india" },
  { title: "Global", value: "global" },
];

/**
 * Slug uniqueness rule. Confirms no other published doc of the same `_type`
 * already owns the slug. Called inside the slug field's `isUnique` option.
 */
export async function isUniqueSlugAcrossType(
  slug: string,
  context: SlugUniquenessContext,
): Promise<boolean> {
  const { document, getClient } = context;
  if (!document?._type) return true;
  const client = getClient({ apiVersion: "2024-01-01" });
  const id = document._id?.replace(/^drafts\./, "");
  const params = {
    draft: `drafts.${id ?? ""}`,
    published: id ?? "",
    slug,
    type: document._type,
  };
  const query = `!defined(*[_type == $type && !(_id in [$draft, $published]) && slug.current == $slug][0]._id)`;
  return client.fetch<boolean>(query, params);
}

export function slugField(sourceField = "title"): FieldDefinition {
  return defineField({
    name: "slug",
    title: "Slug",
    type: "slug",
    options: {
      source: sourceField,
      maxLength: 96,
      isUnique: isUniqueSlugAcrossType as unknown as (
        slug: string,
        context: unknown,
      ) => Promise<boolean>,
    },
    validation: (rule: SlugRule) => rule.required(),
  });
}

export const titleField: FieldDefinition = defineField({
  name: "title",
  title: "Title",
  type: "string",
  validation: (rule) => rule.required().min(4).max(140),
});

export const seoTitleField: FieldDefinition = defineField({
  name: "seoTitle",
  title: "SEO title",
  type: "string",
  description: "Up to 60 characters. Avoid hype adjectives.",
  validation: (rule) => rule.max(60),
});

export const seoDescriptionField: FieldDefinition = defineField({
  name: "seoDescription",
  title: "SEO description",
  type: "text",
  rows: 2,
  description: "Up to 160 characters. Plain, accurate, scannable.",
  validation: (rule) => rule.max(160),
});

export const ogImageField: FieldDefinition = defineField({
  name: "ogImage",
  title: "Open Graph image",
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
            return "Alt text is required and should describe the image.";
          }
          return true;
        }),
    }),
  ],
});

export const publishedAtField: FieldDefinition = defineField({
  name: "publishedAt",
  title: "Published at",
  type: "datetime",
});

export const isVisibleField: FieldDefinition = defineField({
  name: "isVisible",
  title: "Visible on site",
  type: "boolean",
  description: "Soft toggle. Unchecking hides the document from public routes without unpublishing.",
  initialValue: true,
});

export const regionField: FieldDefinition = defineField({
  name: "region",
  title: "Regions",
  type: "array",
  of: [
    defineArrayMember({
      type: "string",
      options: { list: regionOptions },
    }),
  ],
  initialValue: ["global"],
  validation: (rule) => rule.min(1),
});

export const ragEligibleField: FieldDefinition = defineField({
  name: "ragEligible",
  title: "Eligible for AI retrieval",
  type: "boolean",
  description:
    "Include in the Concierge RAG index. Disable for drafts, legal pages, or client-sensitive content.",
  initialValue: true,
});

/**
 * Base fields present on every content document.
 * Excludes `title` so documents can position it in the correct group.
 */
export const baseContentFields: FieldDefinition[] = [
  titleField,
  slugField("title"),
  seoTitleField,
  seoDescriptionField,
  ogImageField,
  publishedAtField,
  isVisibleField,
  regionField,
  ragEligibleField,
];

/**
 * Portable-text style config reused for long-form body fields.
 */
export const longFormPortableText = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "H2", value: "h2" },
      { title: "H3", value: "h3" },
      { title: "H4", value: "h4" },
      { title: "Quote", value: "blockquote" },
    ],
    lists: [
      { title: "Bullet", value: "bullet" },
      { title: "Numbered", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Strong", value: "strong" },
        { title: "Emphasis", value: "em" },
        { title: "Code", value: "code" },
      ],
      annotations: [
        {
          name: "link",
          type: "object",
          title: "Link",
          fields: [
            defineField({
              name: "href",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({ scheme: ["http", "https", "mailto"] }),
            }),
            defineField({
              name: "openInNewTab",
              title: "Open in new tab",
              type: "boolean",
              initialValue: false,
            }),
          ],
        },
      ],
    },
  }),
  defineArrayMember({
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        validation: (rule) => rule.required().min(4),
      }),
      defineField({
        name: "caption",
        title: "Caption",
        type: "string",
      }),
    ],
  }),
];

/**
 * Section builder array members. Documents using the site's section builder
 * (page, service, industry) pass this list into their `body` field.
 */
export const sectionBuilderMembers = [
  defineArrayMember({ type: "hero" }),
  defineArrayMember({ type: "pillars" }),
  defineArrayMember({ type: "statsStrip" }),
  defineArrayMember({ type: "processStepper" }),
  defineArrayMember({ type: "logoWall" }),
  defineArrayMember({ type: "caseStudyCarousel" }),
  defineArrayMember({ type: "capabilityMatrix" }),
  defineArrayMember({ type: "certBand" }),
  defineArrayMember({ type: "leaderCard" }),
  defineArrayMember({ type: "faqBlock" }),
  defineArrayMember({ type: "ctaSection" }),
  defineArrayMember({ type: "bentoGrid" }),
];
