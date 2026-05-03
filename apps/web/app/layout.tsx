import type { Metadata, Viewport } from "next";
import { draftMode } from "next/headers";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
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

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
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
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Propharmex",
    locale: "en_CA",
    url: env.NEXT_PUBLIC_SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Propharmex",
    description:
      "Canadian pharmaceutical services company under Health Canada Drug Establishment Licence — pharmaceutical development, analytical services, regulatory affairs, 3PL distribution.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFBFD" },
    { media: "(prefers-color-scheme: dark)", color: "#11195A" },
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
  const siteJsonLd = buildSiteJsonLd(env.NEXT_PUBLIC_SITE_URL);
  const { isEnabled: isDraftEnabled } = await draftMode();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <SkipToContent />
        <DraftModeIndicator enabled={isDraftEnabled} />
        <Header />
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
