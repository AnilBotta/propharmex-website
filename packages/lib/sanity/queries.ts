/**
 * GROQ queries.
 *
 * Every query is a string constant (tagged with `groq` for tooling). Projections
 * are hand-written to match the exact shape expected by the corresponding Zod
 * parser in `./parsers` — if you change a projection, update the parser too.
 *
 * Drafts are excluded at query level (`!(_id in path("drafts.**"))`) except for
 * queries explicitly meant to feed the preview client (those get their drafts
 * resolved through the `previewDrafts` perspective automatically).
 */
/**
 * Local no-op template tag — lets editors / tooling recognize these as GROQ
 * strings without pulling in a Next-specific dependency (`next-sanity`'s
 * re-export) or a runtime we don't need.
 */
const groq = (strings: TemplateStringsArray, ...values: unknown[]): string =>
  strings.reduce(
    (acc, str, i) => acc + str + (i < values.length ? String(values[i]) : ""),
    "",
  );

/* -------------------------------------------------------------------------- */
/*  Reusable fragments                                                        */
/* -------------------------------------------------------------------------- */

const imageProjection = /* groq */ `{
  _type,
  alt,
  asset,
  caption,
  hotspot,
  crop,
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions{ width, height, aspectRatio }
}`;

const linkProjection = /* groq */ `{ label, href, kind, openInNewTab }`;

const regulatoryAnchorProjection = /* groq */ `{
  authority, url, asOfDate, note
}`;

const addressProjection = /* groq */ `{
  street, locality, region, postal, country
}`;

const seoFields = /* groq */ `
  seoTitle,
  seoDescription,
  "ogImage": ogImage${imageProjection},
  noindex
`;

const personRefProjection = /* groq */ `{
  _id,
  _type,
  name,
  role,
  slug,
  "photo": photo${imageProjection}
}`;

/**
 * Discriminated section projection — every section type is enumerated here
 * so the shape aligns with `zSection` in parsers.
 */
const sectionProjection = /* groq */ `
  _key,
  _type,
  _type == "hero" => {
    eyebrow,
    heading,
    subheading,
    body,
    "primaryCta": primaryCta${linkProjection},
    "secondaryCta": secondaryCta${linkProjection},
    "image": image${imageProjection},
    variant
  },
  _type == "pillars" => {
    heading,
    intro,
    items[]{
      _key, title, description, icon, "link": link${linkProjection}
    }
  },
  _type == "statsStrip" => {
    heading,
    stats[]{ _key, value, label, sourceUrl, sourceLabel }
  },
  _type == "processStepper" => {
    heading,
    intro,
    steps[]{ _key, title, description, body, deliverables }
  },
  _type == "logoWall" => {
    heading,
    intro,
    logos[]{ _key, name, "logo": logo${imageProjection}, logoPermitted }
  },
  _type == "caseStudyCarousel" => {
    heading,
    intro,
    "caseStudies": caseStudies[]->{
      _id,
      _type,
      title,
      slug,
      summary,
      client,
      "industry": industry->title,
      "coverImage": coverImage${imageProjection},
      publishedAt,
      metrics[]{ _key, label, value }
    }
  },
  _type == "capabilityMatrix" => {
    heading,
    intro,
    columns,
    rows[]{ _key, label, cells }
  },
  _type == "certBand" => {
    heading,
    certifications[]{
      _key,
      name,
      issuer,
      "logo": logo${imageProjection},
      link
    }
  },
  _type == "leaderCard" => {
    heading,
    "people": people[]->{
      _id,
      _key,
      name,
      role,
      bio,
      slug,
      "photo": photo${imageProjection}
    }
  },
  _type == "faqBlock" => {
    heading,
    intro,
    items[]{ _key, question, answer }
  },
  _type == "ctaSection" => {
    heading,
    body,
    "primaryCta": primaryCta${linkProjection},
    "secondaryCta": secondaryCta${linkProjection},
    variant
  },
  _type == "bentoGrid" => {
    heading,
    intro,
    cells[]{
      _key,
      title,
      body,
      "image": image${imageProjection},
      "link": link${linkProjection},
      span
    }
  }
`;

const sectionsProjection = /* groq */ `body[]{ ${sectionProjection} }`;

const notDraft = /* groq */ `!(_id in path("drafts.**"))`;

/* -------------------------------------------------------------------------- */
/*  Site settings                                                             */
/* -------------------------------------------------------------------------- */

export const siteSettingsQuery = groq`
*[_type == "siteSettings" && ${notDraft}][0]{
  _id,
  _type,
  title,
  tagline,
  description,
  "logo": logo${imageProjection},
  "logoDark": logoDark${imageProjection},
  "primaryAddress": primaryAddress${addressProjection},
  "secondaryAddress": secondaryAddress${addressProjection},
  primaryEmail,
  primaryPhone,
  "socialLinks": socialLinks[]${linkProjection},
  "navPrimary": navPrimary[]${linkProjection},
  "navFooter": navFooter[]${linkProjection},
  "legalLinks": legalLinks[]${linkProjection},
  slug,
  publishedAt,
  region,
  ragEligible,
  ${seoFields}
}
`;

/* -------------------------------------------------------------------------- */
/*  Pages                                                                     */
/* -------------------------------------------------------------------------- */

export const pageBySlugQuery = groq`
*[_type == "page" && slug.current == $slug && ${notDraft}][0]{
  _id,
  _type,
  title,
  slug,
  intro,
  publishedAt,
  region,
  ragEligible,
  ${sectionsProjection},
  ${seoFields}
}
`;

export const pagePathsQuery = groq`
*[_type == "page" && defined(slug.current) && ${notDraft}]{ "slug": slug.current }
`;

/* -------------------------------------------------------------------------- */
/*  Services                                                                  */
/* -------------------------------------------------------------------------- */

const serviceFullProjection = /* groq */ `
  _id,
  _type,
  title,
  slug,
  pillar,
  "parent": parent->{ _id, title, slug },
  summary,
  overview,
  capabilities,
  deliverables,
  "regulatoryAnchors": regulatoryAnchors[]${regulatoryAnchorProjection},
  publishedAt,
  region,
  ragEligible,
  ${sectionsProjection},
  ${seoFields}
`;

export const servicesListQuery = groq`
*[_type == "service" && ${notDraft}] | order(pillar asc, title asc){
  _id,
  _type,
  title,
  slug,
  pillar,
  summary,
  "parent": parent->{ _id, title, slug },
  publishedAt,
  region,
  ragEligible,
  ${seoFields}
}
`;

export const serviceBySlugQuery = groq`
*[_type == "service" && slug.current == $slug && ${notDraft}][0]{
  ${serviceFullProjection}
}
`;

export const servicePathsQuery = groq`
*[_type == "service" && defined(slug.current) && ${notDraft}]{
  "slug": slug.current,
  "parent": parent->slug.current
}
`;

/* -------------------------------------------------------------------------- */
/*  Industries                                                                */
/* -------------------------------------------------------------------------- */

export const industriesListQuery = groq`
*[_type == "industry" && ${notDraft}] | order(title asc){
  _id,
  _type,
  title,
  slug,
  summary,
  publishedAt,
  region,
  ragEligible,
  ${seoFields}
}
`;

export const industryBySlugQuery = groq`
*[_type == "industry" && slug.current == $slug && ${notDraft}][0]{
  _id,
  _type,
  title,
  slug,
  summary,
  overview,
  "services": services[]->{ _id, title, slug },
  publishedAt,
  region,
  ragEligible,
  ${sectionsProjection},
  ${seoFields}
}
`;

/* -------------------------------------------------------------------------- */
/*  Case studies                                                              */
/* -------------------------------------------------------------------------- */

export const caseStudiesListQuery = groq`
*[_type == "caseStudy" && ${notDraft}] | order(publishedAt desc){
  _id,
  _type,
  title,
  slug,
  summary,
  client,
  "industry": industry->title,
  "coverImage": coverImage${imageProjection},
  publishedAt,
  metrics[]{ _key, label, value }
}
`;

export const caseStudyBySlugQuery = groq`
*[_type == "caseStudy" && slug.current == $slug && ${notDraft}][0]{
  _id,
  _type,
  title,
  slug,
  client,
  clientLogoPermitted,
  "industry": industry->{ _id, title, slug },
  "services": services[]->{ _id, title, slug },
  summary,
  problem,
  approach,
  solution,
  result,
  metrics[]{ _key, label, value },
  "coverImage": coverImage${imageProjection},
  "gallery": gallery[]${imageProjection},
  publishedAt,
  region,
  ragEligible,
  ${sectionsProjection},
  ${seoFields}
}
`;

/* -------------------------------------------------------------------------- */
/*  Insights                                                                  */
/* -------------------------------------------------------------------------- */

export const insightsListQuery = groq`
*[_type == "insight" && ${notDraft}
  && (!defined($articleType) || articleType == $articleType)
  && (!defined($tag) || $tag in tags)
  && (!defined($pillar) || pillar == $pillar)
] | order(publishedAt desc)[0...$limit]{
  _id,
  _type,
  title,
  slug,
  articleType,
  pillar,
  tags,
  summary,
  "coverImage": coverImage${imageProjection},
  "author": author->${personRefProjection},
  publishedAt,
  region,
  ragEligible,
  ${seoFields}
}
`;

export const insightBySlugQuery = groq`
*[_type == "insight" && slug.current == $slug && ${notDraft}][0]{
  _id,
  _type,
  title,
  slug,
  articleType,
  pillar,
  tags,
  summary,
  body,
  "coverImage": coverImage${imageProjection},
  "author": author->${personRefProjection},
  "contributors": contributors[]->${personRefProjection},
  "regulatoryAnchors": regulatoryAnchors[]${regulatoryAnchorProjection},
  "related": related[]->{
    _id,
    title,
    slug,
    summary,
    "coverImage": coverImage${imageProjection}
  },
  faq[]{ _key, question, answer },
  publishedAt,
  region,
  ragEligible,
  ${seoFields}
}
`;

export const insightPathsQuery = groq`
*[_type == "insight" && defined(slug.current) && ${notDraft}]{ "slug": slug.current }
`;

/* -------------------------------------------------------------------------- */
/*  Whitepapers                                                               */
/* -------------------------------------------------------------------------- */

export const whitepapersListQuery = groq`
*[_type == "whitepaper" && ${notDraft}] | order(publishedAt desc){
  _id,
  _type,
  title,
  slug,
  subtitle,
  summary,
  pages,
  "coverImage": coverImage${imageProjection},
  gated,
  publishedAt,
  region,
  ragEligible,
  ${seoFields}
}
`;

export const whitepaperBySlugQuery = groq`
*[_type == "whitepaper" && slug.current == $slug && ${notDraft}][0]{
  _id,
  _type,
  title,
  slug,
  subtitle,
  summary,
  pages,
  "coverImage": coverImage${imageProjection},
  "heroImage": heroImage${imageProjection},
  "pdfAsset": pdfAsset{
    _type,
    asset,
    "url": asset->url
  },
  gated,
  "authors": authors[]->${personRefProjection},
  body,
  publishedAt,
  region,
  ragEligible,
  ${seoFields}
}
`;

/* -------------------------------------------------------------------------- */
/*  People                                                                    */
/* -------------------------------------------------------------------------- */

export const peopleListQuery = groq`
*[_type == "person" && ${notDraft}] | order(name asc){
  _id,
  _type,
  title,
  name,
  slug,
  role,
  org,
  shortBio,
  "photo": photo${imageProjection},
  credentials,
  publishedAt,
  region,
  ragEligible
}
`;

export const personBySlugQuery = groq`
*[_type == "person" && slug.current == $slug && ${notDraft}][0]{
  _id,
  _type,
  title,
  name,
  slug,
  role,
  org,
  bio,
  shortBio,
  "photo": photo${imageProjection},
  credentials,
  "links": links[]${linkProjection},
  publishedAt,
  region,
  ragEligible,
  ${seoFields}
}
`;

/* -------------------------------------------------------------------------- */
/*  Facilities                                                                */
/* -------------------------------------------------------------------------- */

export const facilitiesListQuery = groq`
*[_type == "facility" && ${notDraft}] | order(title asc){
  _id,
  _type,
  title,
  slug,
  summary,
  "address": address${addressProjection},
  geo,
  squareFootage,
  capabilities,
  "images": images[]${imageProjection},
  publishedAt,
  region,
  ragEligible,
  ${seoFields}
}
`;

export const facilityBySlugQuery = groq`
*[_type == "facility" && slug.current == $slug && ${notDraft}][0]{
  _id,
  _type,
  title,
  slug,
  summary,
  "address": address${addressProjection},
  geo,
  squareFootage,
  capabilities,
  "certifications": certifications[]->{ _id, name, slug },
  "images": images[]${imageProjection},
  publishedAt,
  region,
  ragEligible,
  ${sectionsProjection},
  ${seoFields}
}
`;

/* -------------------------------------------------------------------------- */
/*  Certifications                                                            */
/* -------------------------------------------------------------------------- */

export const certificationsListQuery = groq`
*[_type == "certification" && ${notDraft}] | order(name asc){
  _id,
  _type,
  name,
  slug,
  issuer,
  summary,
  "logo": logo${imageProjection},
  "document": document{
    _type,
    asset,
    "url": asset->url
  },
  validFrom,
  validTo,
  sourceUrl,
  publishedAt,
  region,
  ragEligible,
  ${seoFields}
}
`;

/* -------------------------------------------------------------------------- */
/*  FAQs                                                                      */
/* -------------------------------------------------------------------------- */

export const faqsByTagQuery = groq`
*[_type == "faq" && ${notDraft} && (!defined($tag) || $tag in tags)]{
  _id,
  _type,
  title,
  slug,
  question,
  answer,
  tags,
  publishedAt,
  region,
  ragEligible
}
`;

/* -------------------------------------------------------------------------- */
/*  Testimonials                                                              */
/* -------------------------------------------------------------------------- */

export const testimonialsListQuery = groq`
*[_type == "testimonial" && ${notDraft}]{
  _id,
  _type,
  title,
  quote,
  author,
  authorRole,
  authorCompany,
  "authorPhoto": authorPhoto${imageProjection},
  "companyLogo": companyLogo${imageProjection},
  logoPermitted,
  "relatedService": relatedService->{ _id, title, slug },
  publishedAt,
  region,
  ragEligible
}
`;

/* -------------------------------------------------------------------------- */
/*  SOP capabilities (Dosage Form Matcher)                                    */
/* -------------------------------------------------------------------------- */

export const sopCapabilitiesQuery = groq`
*[_type == "sopCapability" && ${notDraft}] | order(dosageForm asc, title asc){
  _id,
  _type,
  title,
  slug,
  dosageForm,
  category,
  description,
  equipment,
  scaleMin,
  scaleMax,
  "applicableServices": applicableServices[]->{ _id, title, slug },
  "regulatoryAnchors": regulatoryAnchors[]${regulatoryAnchorProjection},
  tags,
  publishedAt,
  region,
  ragEligible
}
`;

/* -------------------------------------------------------------------------- */
/*  AI prompt config                                                          */
/* -------------------------------------------------------------------------- */

export const aiPromptConfigQuery = groq`
*[_type == "aiPromptConfig" && ${notDraft}][0]{
  _id,
  _type,
  title,
  slug,
  concierge,
  dosageFormMatcher,
  regulatoryExplainer,
  rfpAssistant,
  globalDisclaimer,
  publishedAt,
  region,
  ragEligible
}
`;

/* -------------------------------------------------------------------------- */
/*  RAG extraction (Prompt 18 consumer)                                       */
/* -------------------------------------------------------------------------- */

/**
 * Plain-text extraction over all RAG-eligible content. Used by the RAG
 * ingestion pipeline in Prompt 18. The result is an array of chunks with
 * enough metadata to cite back to the source doc.
 */
export const ragExtractQuery = groq`
*[_type in ["insight", "service", "industry", "caseStudy", "whitepaper", "facility", "certification", "faq", "sopCapability"]
  && ${notDraft}
  && ragEligible == true
]{
  _id,
  _type,
  title,
  slug,
  "plainText": pt::text(coalesce(body, overview, answer)),
  publishedAt,
  region,
  tags
}
`;
