export type AiToolStatus = "live" | "sitewide";

export type AiTool = {
  id: "scoping" | "dosage" | "readiness" | "concierge";
  title: string;
  eyebrow: string;
  body: string;
  href: string;
  ctaLabel: string;
  status: AiToolStatus;
  goodFor: string[];
};

export type AiToolsContent = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    headline: string;
    lede: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  tools: AiTool[];
  workflow: {
    eyebrow: string;
    heading: string;
    lede: string;
    steps: { label: string; body: string }[];
  };
  disclaimer: string;
};

export const AI_TOOLS: AiToolsContent = {
  metaTitle: "AI tools for pharmaceutical programme scoping | Propharmex",
  metaDescription:
    "AI-assisted tools from Propharmex help global pharma sponsors scope product development, dosage-form fit, regulatory readiness, and early questions before a human review.",
  hero: {
    eyebrow: "AI-assisted scoping",
    headline: "Tools that turn early uncertainty into a sharper first conversation.",
    lede: "Use the Propharmex tools to frame a programme, test dosage-form fit, review regulatory readiness, or ask a source-linked question. The output is informational; our team confirms real scope before any engagement.",
    primaryCta: {
      label: "Start scoping",
      href: "/ai/project-scoping-assistant",
    },
    secondaryCta: {
      label: "Talk to the team",
      href: "/contact?source=ai-tools",
    },
  },
  tools: [
    {
      id: "scoping",
      title: "Project Scoping Assistant",
      eyebrow: "Primary conversion",
      body: "Draft a structured programme brief with objective, stage, dosage form, target markets, deliverables, risks, and recommended Propharmex workstreams.",
      href: "/ai/project-scoping-assistant",
      ctaLabel: "Start a scope",
      status: "live",
      goodFor: [
        "Product or programme uncertainty",
        "Early vendor qualification",
        "Preparing a technical first call",
      ],
    },
    {
      id: "dosage",
      title: "Dosage Form Matcher",
      eyebrow: "Product fit",
      body: "Describe the target product and receive an AI-assisted view of dosage-form fit, with reasoning and capability coverage shown separately from the model output.",
      href: "/ai/dosage-matcher",
      ctaLabel: "Match a dosage form",
      status: "live",
      goodFor: [
        "Complex dosage form triage",
        "Formulation pathway discussion",
        "Internal sponsor alignment",
      ],
    },
    {
      id: "readiness",
      title: "Regulatory Readiness Assessment",
      eyebrow: "Readiness view",
      body: "Answer a short set of questions and receive a stage-of-readiness view with gap notes to shape the first regulatory or quality conversation.",
      href: "/ai/del-readiness",
      ctaLabel: "Review readiness",
      status: "live",
      goodFor: [
        "Pre-engagement gap finding",
        "Quality and regulatory triage",
        "Preparing internal next steps",
      ],
    },
    {
      id: "concierge",
      title: "Propharmex Concierge",
      eyebrow: "Source-linked answers",
      body: "Ask a general question from any page. The Concierge draws on published Propharmex content and shows the sources it used when retrieval is available.",
      href: "/contact?source=concierge-handoff",
      ctaLabel: "Ask from the chat bubble",
      status: "sitewide",
      goodFor: [
        "General service questions",
        "Finding the right tool",
        "Low-friction handoff to a person",
      ],
    },
  ],
  workflow: {
    eyebrow: "How the tools fit together",
    heading: "AI first, human review before scope.",
    lede: "The tools help visitors prepare a better first conversation. They do not quote, promise outcomes, or replace Propharmex review.",
    steps: [
      {
        label: "Frame the programme",
        body: "The scoping assistant captures the product, stage, target markets, timeline, and service need.",
      },
      {
        label: "Check technical fit",
        body: "Dosage and readiness tools help surface the most useful technical questions before the call.",
      },
      {
        label: "Send a qualified brief",
        body: "The visitor can send a structured brief to the team and continue to booking or human follow-up.",
      },
    ],
  },
  disclaimer:
    "AI outputs are informational and do not create a quote, regulatory commitment, or engagement scope. Propharmex confirms scope, assumptions, and responsibilities before work begins.",
};
