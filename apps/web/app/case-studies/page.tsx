import type { Metadata } from "next";

import { PlaceholderPage } from "../../components/site/PlaceholderPage";

export const metadata: Metadata = {
  title: "Case studies — coming in Prompt 14",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Case studies"
      promptRef="Prompt 14"
      body="Problem → Approach → Solution → Result. Anonymized per the content-style guide. The hub and detail surfaces land in Prompt 14."
    />
  );
}
