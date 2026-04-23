/**
 * Zod parsers for every Sanity document + section object.
 *
 * These are the runtime boundary between GROQ results and TS code — every
 * `sanityFetch` call runs its result through one of these schemas so
 * downstream React Server Components never have to guard against undefined
 * fields or drift between Studio + code.
 *
 * Conventions:
 *  - Use `.passthrough()` for future-proofing where Sanity may add fields we
 *    don't yet care about (analytics, revision meta).
 *  - Optional-with-default wherever Sanity treats the field as not-required.
 *  - Region is always `string[]` to match the multi-region content model.
 */
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                         */
/* -------------------------------------------------------------------------- */

export const zSanityReference = z.object({
  _ref: z.string(),
  _type: z.literal("reference"),
  _weak: z.boolean().optional(),
});
export type SanityReference = z.infer<typeof zSanityReference>;

export const zSlug = z.object({
  _type: z.literal("slug").optional(),
  current: z.string().min(1),
});
export type Slug = z.infer<typeof zSlug>;

/** Image with enforced `alt` for a11y compliance. */
export const zImage = z.object({
  _type: z.literal("image").optional(),
  alt: z.string().min(1, "Image alt text is required"),
  asset: zSanityReference,
  caption: z.string().optional(),
  hotspot: z
    .object({
      x: z.number(),
      y: z.number(),
      height: z.number().optional(),
      width: z.number().optional(),
    })
    .partial()
    .optional(),
  crop: z
    .object({
      top: z.number(),
      bottom: z.number(),
      left: z.number(),
      right: z.number(),
    })
    .partial()
    .optional(),
});
export type Image = z.infer<typeof zImage>;

/** Projection shape after resolving a Sanity image asset (for <Image>). */
export const zResolvedImage = zImage.extend({
  url: z.string().url().optional(),
  lqip: z.string().optional(),
  dimensions: z
    .object({
      width: z.number(),
      height: z.number(),
      aspectRatio: z.number(),
    })
    .partial()
    .optional(),
});
export type ResolvedImage = z.infer<typeof zResolvedImage>;

export const zLink = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  kind: z.enum(["internal", "external"]).optional(),
  openInNewTab: z.boolean().optional(),
});
export type Link = z.infer<typeof zLink>;

/** Portable Text — treated as unknown array; flattened via `toPlainText`. */
export const zPortableText = z.array(z.unknown());
export type PortableText = z.infer<typeof zPortableText>;

export const zRegulatoryAuthority = z.enum([
  "Health Canada",
  "USFDA",
  "ICH",
  "WHO",
  "TGA",
  "EMA",
  "PMDA",
  "Other",
]);

export const zRegulatoryAnchor = z.object({
  authority: zRegulatoryAuthority,
  url: z.string().url(),
  asOfDate: z.string().min(1), // ISO YYYY-MM-DD
  note: z.string().optional(),
});
export type RegulatoryAnchor = z.infer<typeof zRegulatoryAnchor>;

export const zAddress = z.object({
  street: z.string().optional(),
  locality: z.string().min(1),
  region: z.string().optional(),
  postal: z.string().optional(),
  country: z.enum(["CA", "IN"]),
});
export type Address = z.infer<typeof zAddress>;

/** SEO fields shared across docs. */
export const zSeoFields = z.object({
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: zImage.optional(),
  noindex: z.boolean().optional(),
});
export type SeoFields = z.infer<typeof zSeoFields>;

const zRegion = z.array(z.string()).default([]);
const zDocBase = {
  _id: z.string(),
  publishedAt: z.string().optional(),
  region: zRegion,
  ragEligible: z.boolean().optional(),
};

/* -------------------------------------------------------------------------- */
/*  Section objects                                                           */
/* -------------------------------------------------------------------------- */

const zSectionBase = {
  _key: z.string(),
};

export const zHero = z.object({
  ...zSectionBase,
  _type: z.literal("hero"),
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  subheading: z.string().optional(),
  body: zPortableText.optional(),
  primaryCta: zLink.optional(),
  secondaryCta: zLink.optional(),
  image: zImage.optional(),
  variant: z.enum(["default", "split", "centered", "fullBleed"]).optional(),
});
export type Hero = z.infer<typeof zHero>;

export const zPillars = z.object({
  ...zSectionBase,
  _type: z.literal("pillars"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  items: z
    .array(
      z.object({
        _key: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        icon: z.string().optional(),
        link: zLink.optional(),
      })
    )
    .default([]),
});
export type Pillars = z.infer<typeof zPillars>;

export const zStatsStrip = z.object({
  ...zSectionBase,
  _type: z.literal("statsStrip"),
  heading: z.string().optional(),
  stats: z
    .array(
      z.object({
        _key: z.string(),
        value: z.string().min(1),
        label: z.string().min(1),
        sourceUrl: z.string().url().optional(),
        sourceLabel: z.string().optional(),
      })
    )
    .default([]),
});
export type StatsStrip = z.infer<typeof zStatsStrip>;

export const zProcessStepper = z.object({
  ...zSectionBase,
  _type: z.literal("processStepper"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  steps: z
    .array(
      z.object({
        _key: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        body: zPortableText.optional(),
        deliverables: z.array(z.string()).optional(),
      })
    )
    .default([]),
});
export type ProcessStepper = z.infer<typeof zProcessStepper>;

export const zLogoWall = z.object({
  ...zSectionBase,
  _type: z.literal("logoWall"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  logos: z
    .array(
      z.object({
        _key: z.string(),
        name: z.string().min(1),
        logo: zImage,
        logoPermitted: z.boolean().default(false),
      })
    )
    .default([]),
});
export type LogoWall = z.infer<typeof zLogoWall>;

export const zCaseStudySummary = z.object({
  _id: z.string(),
  _type: z.literal("caseStudy"),
  title: z.string(),
  slug: zSlug,
  summary: z.string().optional(),
  client: z.string().optional(),
  industry: z.string().optional(),
  coverImage: zImage.optional(),
  publishedAt: z.string().optional(),
  metrics: z
    .array(
      z.object({
        _key: z.string().optional(),
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});
export type CaseStudySummary = z.infer<typeof zCaseStudySummary>;

export const zCaseStudyCarousel = z.object({
  ...zSectionBase,
  _type: z.literal("caseStudyCarousel"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  caseStudies: z.array(zCaseStudySummary).default([]),
});
export type CaseStudyCarousel = z.infer<typeof zCaseStudyCarousel>;

export const zCapabilityMatrix = z.object({
  ...zSectionBase,
  _type: z.literal("capabilityMatrix"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  columns: z.array(z.string()).default([]),
  rows: z
    .array(
      z.object({
        _key: z.string(),
        label: z.string().min(1),
        cells: z.array(z.string()).default([]),
      })
    )
    .default([]),
});
export type CapabilityMatrix = z.infer<typeof zCapabilityMatrix>;

export const zCertBand = z.object({
  ...zSectionBase,
  _type: z.literal("certBand"),
  heading: z.string().optional(),
  certifications: z
    .array(
      z.object({
        _key: z.string(),
        name: z.string().min(1),
        issuer: z.string().optional(),
        logo: zImage.optional(),
        link: z.string().url().optional(),
      })
    )
    .default([]),
});
export type CertBand = z.infer<typeof zCertBand>;

export const zLeaderCard = z.object({
  ...zSectionBase,
  _type: z.literal("leaderCard"),
  heading: z.string().optional(),
  people: z
    .array(
      z.object({
        _key: z.string(),
        _id: z.string().optional(),
        name: z.string().min(1),
        role: z.string().min(1),
        bio: z.string().optional(),
        photo: zImage.optional(),
        slug: zSlug.optional(),
      })
    )
    .default([]),
});
export type LeaderCard = z.infer<typeof zLeaderCard>;

export const zFaqBlock = z.object({
  ...zSectionBase,
  _type: z.literal("faqBlock"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  items: z
    .array(
      z.object({
        _key: z.string(),
        question: z.string().min(1),
        answer: zPortableText,
      })
    )
    .default([]),
});
export type FaqBlock = z.infer<typeof zFaqBlock>;

export const zCtaSection = z.object({
  ...zSectionBase,
  _type: z.literal("ctaSection"),
  heading: z.string().min(1),
  body: z.string().optional(),
  primaryCta: zLink,
  secondaryCta: zLink.optional(),
  variant: z.enum(["default", "dark", "gradient"]).optional(),
});
export type CtaSection = z.infer<typeof zCtaSection>;

export const zBentoGrid = z.object({
  ...zSectionBase,
  _type: z.literal("bentoGrid"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  cells: z
    .array(
      z.object({
        _key: z.string(),
        title: z.string().min(1),
        body: z.string().optional(),
        image: zImage.optional(),
        link: zLink.optional(),
        span: z.enum(["1x1", "2x1", "1x2", "2x2"]).optional(),
      })
    )
    .default([]),
});
export type BentoGrid = z.infer<typeof zBentoGrid>;

export const zSection = z.discriminatedUnion("_type", [
  zHero,
  zPillars,
  zStatsStrip,
  zProcessStepper,
  zLogoWall,
  zCaseStudyCarousel,
  zCapabilityMatrix,
  zCertBand,
  zLeaderCard,
  zFaqBlock,
  zCtaSection,
  zBentoGrid,
]);
export type Section = z.infer<typeof zSection>;

export const zSectionList = z.array(zSection);
export type SectionList = z.infer<typeof zSectionList>;

/* -------------------------------------------------------------------------- */
/*  Referenced / projected mini-shapes                                        */
/* -------------------------------------------------------------------------- */

export const zPersonRef = z.object({
  _id: z.string(),
  _type: z.literal("person").optional(),
  name: z.string(),
  role: z.string().optional(),
  slug: zSlug.optional(),
  photo: zImage.optional(),
});
export type PersonRef = z.infer<typeof zPersonRef>;

export const zTagList = z.array(z.string()).default([]);

/* -------------------------------------------------------------------------- */
/*  Document schemas                                                          */
/* -------------------------------------------------------------------------- */

export const zSiteSettings = z
  .object({
    ...zDocBase,
    _type: z.literal("siteSettings"),
    title: z.string(),
    tagline: z.string().optional(),
    description: z.string().optional(),
    logo: zImage.optional(),
    logoDark: zImage.optional(),
    primaryAddress: zAddress.optional(),
    secondaryAddress: zAddress.optional(),
    primaryEmail: z.string().email().optional(),
    primaryPhone: z.string().optional(),
    socialLinks: z.array(zLink).default([]),
    navPrimary: z.array(zLink).default([]),
    navFooter: z.array(zLink).default([]),
    legalLinks: z.array(zLink).default([]),
    slug: zSlug.optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    ogImage: zImage.optional(),
  })
  .passthrough();
export type SiteSettings = z.infer<typeof zSiteSettings>;

export const zPage = z
  .object({
    ...zDocBase,
    _type: z.literal("page"),
    title: z.string(),
    slug: zSlug,
    intro: z.string().optional(),
    body: zSectionList.optional(),
    ...zSeoFields.shape,
  })
  .passthrough();
export type Page = z.infer<typeof zPage>;

export const zServicePillar = z.enum([
  "drug-development",
  "analytical",
  "regulatory",
  "manufacturing",
  "logistics",
  "quality",
  "other",
]);

export const zService = z
  .object({
    ...zDocBase,
    _type: z.literal("service"),
    title: z.string(),
    slug: zSlug,
    pillar: zServicePillar,
    parent: z
      .object({
        _id: z.string(),
        title: z.string(),
        slug: zSlug,
      })
      .nullable()
      .optional(),
    summary: z.string().optional(),
    overview: zPortableText.optional(),
    capabilities: z.array(z.string()).default([]),
    deliverables: z.array(z.string()).default([]),
    regulatoryAnchors: z.array(zRegulatoryAnchor).default([]),
    body: zSectionList.optional(),
    ...zSeoFields.shape,
  })
  .passthrough();
export type Service = z.infer<typeof zService>;

export const zIndustry = z
  .object({
    ...zDocBase,
    _type: z.literal("industry"),
    title: z.string(),
    slug: zSlug,
    summary: z.string().optional(),
    overview: zPortableText.optional(),
    services: z
      .array(
        z.object({
          _id: z.string(),
          title: z.string(),
          slug: zSlug,
        })
      )
      .default([]),
    body: zSectionList.optional(),
    ...zSeoFields.shape,
  })
  .passthrough();
export type Industry = z.infer<typeof zIndustry>;

export const zCaseStudy = z
  .object({
    ...zDocBase,
    _type: z.literal("caseStudy"),
    title: z.string(),
    slug: zSlug,
    client: z.string().optional(),
    clientLogoPermitted: z.boolean().default(false),
    industry: z
      .object({
        _id: z.string(),
        title: z.string(),
        slug: zSlug,
      })
      .nullable()
      .optional(),
    services: z
      .array(
        z.object({
          _id: z.string(),
          title: z.string(),
          slug: zSlug,
        })
      )
      .default([]),
    summary: z.string().optional(),
    problem: zPortableText.optional(),
    approach: zPortableText.optional(),
    solution: zPortableText.optional(),
    result: zPortableText.optional(),
    metrics: z
      .array(
        z.object({
          _key: z.string().optional(),
          label: z.string(),
          value: z.string(),
        })
      )
      .default([]),
    coverImage: zImage.optional(),
    gallery: z.array(zImage).default([]),
    body: zSectionList.optional(),
    ...zSeoFields.shape,
  })
  .passthrough();
export type CaseStudy = z.infer<typeof zCaseStudy>;

export const zInsightType = z.enum([
  "article",
  "guide",
  "news",
  "regulatory-update",
  "explainer",
  "interview",
]);

export const zInsight = z
  .object({
    ...zDocBase,
    _type: z.literal("insight"),
    title: z.string(),
    slug: zSlug,
    articleType: zInsightType.default("article"),
    pillar: zServicePillar.optional(),
    tags: zTagList,
    summary: z.string().optional(),
    body: zPortableText.optional(),
    coverImage: zImage.optional(),
    author: zPersonRef.nullable().optional(),
    contributors: z.array(zPersonRef).default([]),
    regulatoryAnchors: z.array(zRegulatoryAnchor).default([]),
    related: z
      .array(
        z.object({
          _id: z.string(),
          title: z.string(),
          slug: zSlug,
          summary: z.string().optional(),
          coverImage: zImage.optional(),
        })
      )
      .default([]),
    faq: z
      .array(
        z.object({
          _key: z.string().optional(),
          question: z.string(),
          answer: zPortableText,
        })
      )
      .default([]),
    ...zSeoFields.shape,
  })
  .passthrough();
export type Insight = z.infer<typeof zInsight>;

export const zWhitepaper = z
  .object({
    ...zDocBase,
    _type: z.literal("whitepaper"),
    title: z.string(),
    slug: zSlug,
    subtitle: z.string().optional(),
    summary: z.string().optional(),
    pages: z.number().int().nonnegative().optional(),
    coverImage: zImage.optional(),
    heroImage: zImage.optional(),
    pdfAsset: z
      .object({
        _type: z.literal("file").optional(),
        asset: zSanityReference,
        url: z.string().url().optional(),
      })
      .nullable()
      .optional(),
    gated: z.boolean().default(true),
    authors: z.array(zPersonRef).default([]),
    body: zPortableText.optional(),
    ...zSeoFields.shape,
  })
  .passthrough();
export type Whitepaper = z.infer<typeof zWhitepaper>;

export const zPerson = z
  .object({
    ...zDocBase,
    _type: z.literal("person"),
    title: z.string().optional(), // honorific / salutation
    name: z.string(),
    slug: zSlug,
    role: z.string(),
    org: z.enum(["propharmex", "partner", "other"]).default("propharmex"),
    bio: zPortableText.optional(),
    shortBio: z.string().optional(),
    photo: zImage.optional(),
    credentials: z.array(z.string()).default([]),
    links: z.array(zLink).default([]),
    ...zSeoFields.shape,
  })
  .passthrough();
export type Person = z.infer<typeof zPerson>;

export const zFacility = z
  .object({
    ...zDocBase,
    _type: z.literal("facility"),
    title: z.string(),
    slug: zSlug,
    summary: z.string().optional(),
    address: zAddress,
    geo: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
    squareFootage: z.number().optional(),
    capabilities: z.array(z.string()).default([]),
    certifications: z
      .array(
        z.object({
          _id: z.string(),
          name: z.string(),
          slug: zSlug.optional(),
        })
      )
      .default([]),
    images: z.array(zImage).default([]),
    body: zSectionList.optional(),
    ...zSeoFields.shape,
  })
  .passthrough();
export type Facility = z.infer<typeof zFacility>;

export const zCertification = z
  .object({
    ...zDocBase,
    _type: z.literal("certification"),
    name: z.string(),
    slug: zSlug,
    issuer: z.string().optional(),
    summary: z.string().optional(),
    logo: zImage.optional(),
    document: z
      .object({
        _type: z.literal("file").optional(),
        asset: zSanityReference,
        url: z.string().url().optional(),
      })
      .nullable()
      .optional(),
    validFrom: z.string().optional(),
    validTo: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    ...zSeoFields.shape,
  })
  .passthrough();
export type Certification = z.infer<typeof zCertification>;

export const zFaq = z
  .object({
    ...zDocBase,
    _type: z.literal("faq"),
    title: z.string().optional(),
    slug: zSlug.optional(),
    question: z.string(),
    answer: zPortableText,
    tags: zTagList,
  })
  .passthrough();
export type Faq = z.infer<typeof zFaq>;

export const zTestimonial = z
  .object({
    ...zDocBase,
    _type: z.literal("testimonial"),
    title: z.string().optional(),
    quote: z.string(),
    author: z.string(),
    authorRole: z.string().optional(),
    authorCompany: z.string().optional(),
    authorPhoto: zImage.optional(),
    companyLogo: zImage.optional(),
    logoPermitted: z.boolean().default(false),
    relatedService: z
      .object({
        _id: z.string(),
        title: z.string(),
        slug: zSlug,
      })
      .nullable()
      .optional(),
  })
  .passthrough();
export type Testimonial = z.infer<typeof zTestimonial>;

export const zSopCapability = z
  .object({
    ...zDocBase,
    _type: z.literal("sopCapability"),
    title: z.string(),
    slug: zSlug,
    dosageForm: z.string(),
    category: z.string().optional(),
    description: z.string().optional(),
    equipment: z.array(z.string()).default([]),
    scaleMin: z.string().optional(),
    scaleMax: z.string().optional(),
    applicableServices: z
      .array(
        z.object({
          _id: z.string(),
          title: z.string(),
          slug: zSlug,
        })
      )
      .default([]),
    regulatoryAnchors: z.array(zRegulatoryAnchor).default([]),
    tags: zTagList,
  })
  .passthrough();
export type SopCapability = z.infer<typeof zSopCapability>;

export const zAiPromptConfig = z
  .object({
    ...zDocBase,
    _type: z.literal("aiPromptConfig"),
    title: z.string().optional(),
    slug: zSlug.optional(),
    concierge: z
      .object({
        systemPrompt: z.string(),
        temperature: z.number().min(0).max(2).optional(),
        model: z.string().optional(),
        disclaimer: z.string().optional(),
      })
      .optional(),
    dosageFormMatcher: z
      .object({
        systemPrompt: z.string(),
        temperature: z.number().min(0).max(2).optional(),
        model: z.string().optional(),
        disclaimer: z.string().optional(),
      })
      .optional(),
    regulatoryExplainer: z
      .object({
        systemPrompt: z.string(),
        temperature: z.number().min(0).max(2).optional(),
        model: z.string().optional(),
        disclaimer: z.string().optional(),
      })
      .optional(),
    rfpAssistant: z
      .object({
        systemPrompt: z.string(),
        temperature: z.number().min(0).max(2).optional(),
        model: z.string().optional(),
        disclaimer: z.string().optional(),
      })
      .optional(),
    globalDisclaimer: z.string().optional(),
  })
  .passthrough();
export type AiPromptConfig = z.infer<typeof zAiPromptConfig>;

/* -------------------------------------------------------------------------- */
/*  List wrappers                                                             */
/* -------------------------------------------------------------------------- */

export const zServiceList = z.array(zService);
export const zIndustryList = z.array(zIndustry);
export const zCaseStudyList = z.array(zCaseStudy);
export const zCaseStudySummaryList = z.array(zCaseStudySummary);
export const zInsightList = z.array(zInsight);
export const zWhitepaperList = z.array(zWhitepaper);
export const zPersonList = z.array(zPerson);
export const zFacilityList = z.array(zFacility);
export const zCertificationList = z.array(zCertification);
export const zFaqList = z.array(zFaq);
export const zTestimonialList = z.array(zTestimonial);
export const zSopCapabilityList = z.array(zSopCapability);
