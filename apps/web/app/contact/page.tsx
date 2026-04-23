import type { Metadata } from "next";

import { PlaceholderPage } from "../../components/site/PlaceholderPage";

export const metadata: Metadata = {
  title: "Contact Propharmex — coming in Prompt 17",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Contact Propharmex"
      promptRef="Prompt 17"
      body="The full contact surface — scoping call booking, facility contact routing, and region-aware form — lands with Prompt 17. In the meantime, the brief on the homepage routes to the same inbox."
    />
  );
}
