import type { Metadata } from "next";

import { PlaceholderPage } from "../../../components/site/PlaceholderPage";

export const metadata: Metadata = {
  title: "Industry — coming in Prompt 13",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Industry detail"
      promptRef="Prompt 13"
      body="Industry pages (Innovators, Generics, CDMO partners, NGOs and governments, Biotech, Veterinary) are authored from Sanity in Prompt 13."
    />
  );
}
