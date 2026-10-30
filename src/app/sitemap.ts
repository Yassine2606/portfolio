import type { MetadataRoute } from "next";
import { getAllWork } from "@/lib/content/load";
import { absoluteUrl } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const work = getAllWork();
  const reviewed = new Date("2026-10-27");

  return [
    { url: absoluteUrl("/"), lastModified: reviewed, changeFrequency: "monthly", priority: 1 },
    {
      url: absoluteUrl("/work"),
      lastModified: reviewed,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: reviewed,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    ...work.map((entry) => ({
      url: absoluteUrl(`/work/${entry.slug}`),
      lastModified: new Date(entry.frontmatter.evidence[0]?.verifiedAt ?? reviewed),
      changeFrequency: "yearly" as const,
      priority: entry.frontmatter.featured ? 0.8 : 0.5,
    })),
  ];
}
