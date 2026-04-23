import type { Metadata } from "next";

import { PlaceholderPage } from "../../../components/site/PlaceholderPage";

export const metadata: Metadata = {
  title: "Insight — coming in Prompt 15",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Insight"
      promptRef="Prompt 15"
      body="Regulatory and development briefings are authored from Sanity `insight` docs in Prompt 15. The three homepage cards link to placeholder slugs that route here until then."
    />
  );
}
