import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  return [
    {
      url: base,
      // Fixed date, not `new Date()`: a dynamic date busts sitemap caching on
      // every build for zero benefit. Bump it when site content changes.
      lastModified: new Date("2026-09-18"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
