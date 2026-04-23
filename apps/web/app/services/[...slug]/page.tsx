import type { Metadata } from "next";

import { PlaceholderPage } from "../../../components/site/PlaceholderPage";

export const metadata: Metadata = {
  title: "Service — coming in Prompt 10",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Service detail"
      promptRef="Prompts 10–13"
      body="Service hub and leaf pages are built from Sanity content in Prompts 10–13. Homepage links keep working so Lighthouse and internal crawlers don't report broken routes during the interim."
    />
  );
}
