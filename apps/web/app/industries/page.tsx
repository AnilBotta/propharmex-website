import type { Metadata } from "next";

import { PlaceholderPage } from "../../components/site/PlaceholderPage";

export const metadata: Metadata = {
  title: "Industries — coming in Prompt 13",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Industries"
      promptRef="Prompt 13"
      body="Sectors served — Innovators, Generics, CDMO partners, NGOs and governments, Biotech, Veterinary. Hub page authored in Prompt 13."
    />
  );
}
