import type { Metadata } from "next";

import { PlaceholderPage } from "../../components/site/PlaceholderPage";

export const metadata: Metadata = {
  title: "Services — coming in Prompt 10",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Services"
      promptRef="Prompt 10"
      body="The services tree covers pharmaceutical development, analytical, regulatory, and distribution. Full hub + leaf pages are authored starting in Prompt 10."
    />
  );
}
