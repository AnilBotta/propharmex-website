import type { Metadata } from "next";

import { PlaceholderPage } from "../../components/site/PlaceholderPage";

export const metadata: Metadata = {
  title: "Insights — coming in Prompt 15",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Insights"
      promptRef="Prompt 15"
      body="Short technical briefings on Health Canada, USFDA, and ICH topics. About one per month. Authored from Prompt 15."
    />
  );
}
