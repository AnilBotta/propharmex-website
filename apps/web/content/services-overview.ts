export interface ServiceOverviewItem {
  id: "analytical" | "regulatory" | "development";
  label: string;
  title: string;
  body: string;
  href: string;
  ctaLabel: string;
  proof: string;
}

export interface ServicesOverviewContent {
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    headline: string;
    lede: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  services: ServiceOverviewItem[];
  operatingModel: {
    eyebrow: string;
    heading: string;
    lede: string;
    points: { label: string; body: string }[];
  };
  closing: {
    eyebrow: string;
    heading: string;
    body: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
}

export const SERVICES_OVERVIEW: ServicesOverviewContent = {
  metaTitle: "Services for global pharmaceutical sponsors | Propharmex",
  metaDescription:
    "Propharmex is a Canada-headquartered pharmaceutical services partner serving global sponsors through analytical, regulatory, and development support.",
  hero: {
    eyebrow: "Services",
    headline: "Canada-headquartered support for global pharmaceutical programmes.",
    lede: "Propharmex helps sponsors turn complex product questions into scoped workstreams across analytical evidence, regulatory strategy, and pharmaceutical development.",
    primaryCta: {
      label: "Start scoping",
      href: "/ai/project-scoping-assistant",
    },
    secondaryCta: {
      label: "Review AI tools",
      href: "/ai",
    },
  },
  services: [
    {
      id: "analytical",
      label: "Analytical evidence",
      title: "Analytical services",
      body: "Method development, validation planning, stability thinking, impurity profiling, and related analytical work shaped around what the dossier and product decision need to support.",
      href: "/services/analytical-services",
      ctaLabel: "Explore analytical services",
      proof:
        "Best first when the central risk is evidence quality, method readiness, stability, or a filing-supporting analytical package.",
    },
    {
      id: "regulatory",
      label: "Pathway clarity",
      title: "Regulatory strategy",
      body: "Regulatory affairs support that connects product profile, target markets, CMC evidence, and submission planning without promising agency outcomes.",
      href: "/services/regulatory-services",
      ctaLabel: "Explore regulatory services",
      proof:
        "Best first when the team needs to understand filing path, dossier gaps, or how development work should be documented.",
    },
    {
      id: "development",
      label: "Product development",
      title: "Pharmaceutical development",
      body: "Formulation and dosage-form development for complex or niche products, coordinated with analytical and regulatory expectations from the start.",
      href: "/services/pharmaceutical-development",
      ctaLabel: "Explore development services",
      proof:
        "Best first when the key question is dosage form, formulation risk, manufacturability, or development programme shape.",
    },
  ],
  operatingModel: {
    eyebrow: "Operating model",
    heading: "Built around the first useful scope.",
    lede: "The website should not force a sponsor to guess the right department. The first task is to understand the product, market, stage, and evidence gap, then route the work to the right Propharmex team.",
    points: [
      {
        label: "One qualified brief",
        body: "Scoping captures product, dosage form, stage, target markets, timeline, and service need before the first call.",
      },
      {
        label: "Named accountability",
        body: "The engagement is framed around the people who will review the science, regulatory path, and deliverables.",
      },
      {
        label: "Evidence before claims",
        body: "Trust comes from documented process, careful assumptions, and clear deliverables rather than unsupported badges or outcome promises.",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Not sure where the work belongs? Start with scoping.",
    body: "A short AI-assisted scope gives both sides a better first conversation. Share the product, stage, target markets, and the problem you need solved; our team reviews before any real scope is confirmed.",
    primaryCta: {
      label: "Start scoping",
      href: "/ai/project-scoping-assistant",
    },
    secondaryCta: {
      label: "Contact Propharmex",
      href: "/contact?source=services-overview",
    },
  },
};
