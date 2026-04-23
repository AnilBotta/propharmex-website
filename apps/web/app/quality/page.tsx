import type { Metadata } from "next";

import { PlaceholderPage } from "../../components/site/PlaceholderPage";

export const metadata: Metadata = {
  title: "Quality & compliance — coming in Prompt 8",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Quality & compliance"
      promptRef="Prompt 8"
      body="This surface catalogues the full certification and inspection posture — Health Canada DEL, WHO-GMP, ISO 9001, USFDA registration, TGA recognition — with primary-source references per certification. Authored in Prompt 8."
    />
  );
}
