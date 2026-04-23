import type { Metadata } from "next";

import { PlaceholderPage } from "../../../components/site/PlaceholderPage";

export const metadata: Metadata = {
  title: "Case study — coming in Prompt 14",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Case study"
      promptRef="Prompt 14"
      body="Detailed Problem → Approach → Solution → Result write-ups are authored against Sanity case-study documents starting Prompt 14. The three homepage proof cards point to stub slugs that route here."
    />
  );
}
