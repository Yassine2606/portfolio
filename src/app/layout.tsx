import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Yassine Ben Romdhane — AI Engineer",
    template: "%s — Yassine Ben Romdhane",
  },
  description:
    "AI engineer building production RAG systems, agents, and the backend infrastructure that keeps them honest. Four systems documented end to end.",
  applicationName: "Yassine Ben Romdhane — Portfolio",
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: "Yassine Ben Romdhane — AI Engineer",
    description:
      "AI systems, with the receipts. Four production-oriented systems documented end to end: RAG, agents, IoT, and platform engineering.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "AI systems, with the receipts. — Yassine Ben Romdhane, AI engineer.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yassine Ben Romdhane — AI Engineer",
    description: "AI systems, with the receipts.",
    images: [
      {
        url: "/og.png",
        alt: "AI systems, with the receipts. — Yassine Ben Romdhane, AI engineer.",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f6f2ea",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="grain flex min-h-dvh flex-col">
        <nav aria-label="Skip navigation">
          <a href="#main" className="skip-link">
            Skip to content
          </a>
        </nav>
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
