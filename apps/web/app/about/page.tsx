import type { Metadata } from "next";

import { PlaceholderPage } from "../../components/site/PlaceholderPage";

export const metadata: Metadata = {
  title: "About Propharmex — coming in Prompt 7",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PlaceholderPage
      title="About Propharmex"
      promptRef="Prompt 7"
      body="The About surface — story, team, leadership — is authored in Prompt 7. The homepage Leadership glimpse section links directly into the leadership anchor on this page."
    />
  );
}
