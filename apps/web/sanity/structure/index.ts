import type { StructureResolver, StructureBuilder } from "sanity/structure";
import { SINGLETON_IDS } from "../schemas";

/**
 * Desk structure — pins singletons at the top, then groups remaining
 * document types under logical buckets.
 */
export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title("Propharmex")
    .items([
      // Singletons
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId(SINGLETON_IDS.siteSettings),
        ),
      S.listItem()
        .title("AI prompt config")
        .id("aiPromptConfig")
        .child(
          S.document()
            .schemaType("aiPromptConfig")
            .documentId(SINGLETON_IDS.aiPromptConfig),
        ),

      S.divider(),

      // Content bucket
      S.listItem()
        .title("Content")
        .child(
          S.list()
            .title("Content")
            .items([
              S.documentTypeListItem("page").title("Pages"),
              S.documentTypeListItem("service").title("Services"),
              S.documentTypeListItem("industry").title("Industries"),
              S.documentTypeListItem("insight").title("Insights"),
              S.documentTypeListItem("whitepaper").title("Whitepapers"),
              S.documentTypeListItem("caseStudy").title("Case studies"),
            ]),
        ),

      // People & places bucket
      S.listItem()
        .title("People & places")
        .child(
          S.list()
            .title("People & places")
            .items([
              S.documentTypeListItem("person").title("People"),
              S.documentTypeListItem("facility").title("Facilities"),
              S.documentTypeListItem("certification").title("Certifications"),
            ]),
        ),

      // Components bucket
      S.listItem()
        .title("Components")
        .child(
          S.list()
            .title("Components")
            .items([
              S.documentTypeListItem("faq").title("FAQs"),
              S.documentTypeListItem("testimonial").title("Testimonials"),
              S.documentTypeListItem("sopCapability").title("SOP capabilities"),
            ]),
        ),
    ]);
