import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Propharmex — Canada–India pharmaceutical services",
    template: "%s · Propharmex",
  },
  description:
    "End-to-end pharmaceutical development, analytical services, Health Canada DEL regulatory, and distribution. Mississauga, Canada + Hyderabad, India.",
  applicationName: "Propharmex",
  robots: { index: false, follow: false }, // Re-enabled at Prompt 22/27 once content is real.
  openGraph: {
    type: "website",
    siteName: "Propharmex",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
