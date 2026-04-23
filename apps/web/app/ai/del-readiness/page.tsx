import type { Metadata } from "next";

import { PlaceholderPage } from "../../../components/site/PlaceholderPage";

export const metadata: Metadata = {
  title: "DEL Readiness Assessment — coming in Prompt 20",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="DEL Readiness Assessment"
      promptRef="Prompt 20"
      body="A 14-question rubric on quality, facilities, and personnel. Returns a readiness score with gap notes. This is an informational tool; it is not legal advice and is not a Health Canada pre-inspection outcome."
    />
  );
}
