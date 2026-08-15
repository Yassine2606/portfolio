import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { InlineScript } from "@/components/ui/inline-script";
import { getSite } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  const base = SITE_URL;
  return {
    title: `${site.name} — ${site.role}`,
    description: site.hero.subtext,
    metadataBase: new URL(base),
    openGraph: {
      title: `${site.name} — ${site.role}`,
      description: site.hero.subtext,
      type: "website",
      url: base,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: site.hero.subtext }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${site.role}`,
      description: site.hero.subtext,
      images: ["/og.png"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0d0c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/*
          Apply the stored theme before first paint so there is no flash of
          the wrong palette. This mirrors src/lib/theme.ts — keep them in
          sync. No localStorage / unknown value: fall back to the OS scheme.
        */}
        <InlineScript
          html={`(function(){try{var s=localStorage.getItem("theme");var l=s==="light"||((s==="system"||!s)&&window.matchMedia("(prefers-color-scheme: light)").matches);var r=document.documentElement;r.setAttribute("data-theme",l?"light":"dark");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",l?"#f2f6f3":"#0a0d0c")}catch(e){}})()`}
        />
      </head>
      <body className="min-h-full">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-ink"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
