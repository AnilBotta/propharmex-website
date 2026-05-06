import type { LeadSource, LeadStatus } from "@propharmex/lib/leads/types";

export const SOURCE_LABEL: Record<LeadSource, string> = {
  contact: "Hero CTA",
  whitepaper: "Briefings",
  newsletter: "Footer form",
  scoping: "Quote form",
  del_readiness: "DEL readiness",
  dosage_matcher: "Capabilities",
  concierge: "Industries",
};

export const SOURCE_COLOR: Record<LeadSource, { bg: string; fg: string; dot: string }> = {
  contact: { bg: "#FCE6D4", fg: "#9B4A0A", dot: "#F47B20" },
  scoping: { bg: "#DEF1FA", fg: "#0E5E86", dot: "#1E9BD8" },
  del_readiness: { bg: "#DDF3DF", fg: "#1F7A2C", dot: "#3DB54A" },
  concierge: { bg: "#FFE0E0", fg: "#9B1C1C", dot: "#E11D48" },
  dosage_matcher: { bg: "#EEE0FF", fg: "#5B2A8A", dot: "#7C3AED" },
  whitepaper: { bg: "#E0E2F2", fg: "#2A3050", dot: "#11195A" },
  newsletter: { bg: "#ECEEF5", fg: "#3A4061", dot: "#6B7090" },
};

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "NEW",
  contacted: "QUA",
  won: "WON",
  lost: "LOST",
};

const STATUS_COLOR: Record<LeadStatus, { bg: string; fg: string }> = {
  new: { bg: "#FCE6D4", fg: "#9B4A0A" },
  contacted: { bg: "#DEF1FA", fg: "#0E5E86" },
  won: { bg: "#DDF3DF", fg: "#1F7A2C" },
  lost: { bg: "#ECEEF5", fg: "#3A4061" },
};

export function SourcePill({ source }: { source: LeadSource }) {
  const c = SOURCE_COLOR[source];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ background: c.bg, color: c.fg }}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: c.dot }}
      />
      {SOURCE_LABEL[source]}
    </span>
  );
}

export function StatusPill({ status }: { status: LeadStatus }) {
  const c = STATUS_COLOR[status];
  return (
    <span
      className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.04em]"
      style={{ background: c.bg, color: c.fg }}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
