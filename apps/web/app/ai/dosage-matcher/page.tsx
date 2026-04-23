import type { Metadata } from "next";

import { PlaceholderPage } from "../../../components/site/PlaceholderPage";

export const metadata: Metadata = {
  title: "Dosage Form Capability Matcher — coming in Prompt 21",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Dosage Form Capability Matcher"
      promptRef="Prompt 21"
      body="Describe a target product. The matcher returns the dosage forms we support end-to-end, the ones we support with a named partner, and the ones we will not pitch on. Reasoning is shown."
    />
  );
}
