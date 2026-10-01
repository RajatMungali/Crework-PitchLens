import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  // TODO: set this to your final domain once you rename the Vercel project
  // (e.g. "https://pitchlens.vercel.app") — required for OG/Twitter images
  // to resolve to an absolute URL instead of a relative one.
  metadataBase: new URL("https://creworkpitchlens.vercel.app"),
  title: "PitchLens by Crework Labs",
  description:
    "Free AI pitch deck review for early stage founders. Get a score, slide by slide notes and the one fix that matters most in under a minute.",
  openGraph: {
    title: "PitchLens by Crework Labs",
    description:
      "Free AI pitch deck review for early stage founders. Get a score, slide by slide notes and the one fix that matters most in under a minute.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PitchLens by Crework Labs",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PitchLens by Crework Labs",
    description:
      "Free AI pitch deck review for early stage founders. Get a score, slide by slide notes and the one fix that matters most in under a minute.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={outfit.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
