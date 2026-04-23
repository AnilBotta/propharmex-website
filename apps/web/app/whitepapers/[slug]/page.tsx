import type { Metadata } from "next";

import { PlaceholderPage } from "../../../components/site/PlaceholderPage";

export const metadata: Metadata = {
  title: "Whitepaper — coming in Prompt 15",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Whitepaper"
      promptRef="Prompt 15"
      body="Gated long-form downloads assembled via the whitepaper-generator skill. Placeholder slug renders here until Prompt 15 authors the first batch."
    />
  );
}
