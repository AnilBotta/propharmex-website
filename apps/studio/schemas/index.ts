import type { SchemaTypeDefinition } from "sanity";

/**
 * Schema index. Empty at Prompt 1 — populated in Prompt 4 by the
 * `sanity-schema-builder` skill across ~16 document types:
 * service, industry, caseStudy, insight, whitepaper, leader, facility,
 * certification, navigation, siteSettings, aiPromptConfig, region,
 * testimonial, faq, and author.
 */
export const schemaTypes: SchemaTypeDefinition[] = [];
