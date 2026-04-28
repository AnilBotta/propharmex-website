import type { Metadata, Viewport } from "next";
import { cookies, draftMode } from "next/headers";
import { Manrope, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { env } from "@propharmex/lib";

import "./globals.css";
import { Analytics } from "../components/site/Analytics";
import { ConciergeBubble } from "../components/concierge/ConciergeBubble";
import { DraftModeIndicator } from "../components/site/DraftModeIndicator";
import { Footer } from "../components/site/Footer";
import { Header } from "../components/site/Header";
import { JsonLd } from "../components/site/JsonLd";
import { SkipToContent } from "../components/site/SkipToContent";
import { VisualEditing } from "../components/site/VisualEditing";
import { buildSiteJsonLd } from "../components/site/site-jsonld";
import { REGIONS, type Region } from "../content/site-nav";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default:
      "Propharmex — pharmaceutical development, analytical, regulatory, distribution",
    template: "%s · Propharmex",
  },
  description:
    "Canadian pharmaceutical services company anchored at our Mississauga, Ontario site under Health Canada Drug Establishment Licence. Pharmaceutical development, analytical services, regulatory affairs, and 3PL distribution for drug developers globally.",
  applicationName: "Propharmex",
  // Re-enabled at Prompt 22/27 once content is real.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: "Propharmex",
    locale: "en_CA",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0E4C5A" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const regionCookie = cookieStore.get("propharmex-region")?.value;
  const initialRegion: Region | undefined =
    regionCookie && REGIONS.some((r) => r.code === regionCookie)
      ? (regionCookie as Region)
      : undefined;

  const siteJsonLd = buildSiteJsonLd(env.NEXT_PUBLIC_SITE_URL);
  const { isEnabled: isDraftEnabled } = await draftMode();

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <SkipToContent />
        <DraftModeIndicator enabled={isDraftEnabled} />
        <Header initialRegion={initialRegion} />
        <main id="main-content" className="min-h-dvh">
          {children}
        </main>
        <Footer />
        <ConciergeBubble />
        <JsonLd id="site-jsonld" data={siteJsonLd} />
        <Analytics
          plausibleDomain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          posthogKey={env.NEXT_PUBLIC_POSTHOG_KEY}
          posthogHost={env.NEXT_PUBLIC_POSTHOG_HOST}
        />
        <VisualEditing enabled={isDraftEnabled} />
      </body>
    </html>
  );
}
