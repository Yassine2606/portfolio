import { site } from "@/content/site";

type JsonLd = Record<string, unknown>;

export function personJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    description:
      "AI engineer building production RAG systems, agents, and the backend infrastructure that keeps them honest.",
    url: site.url,
    email: `mailto:${site.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Monastir", addressCountry: "TN" },
    alumniOf: site.education.map((item) => ({
      "@type": "CollegeOrUniversity",
      name: item.school,
      description: item.programme,
    })),
    knowsAbout: site.knowsAbout,
    sameAs: [site.github],
  };
}

export function creativeWorkJsonLd(input: {
  title: string;
  description: string;
  year: number;
  keywords: string[];
  url: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.title,
    description: input.description,
    author: { "@type": "Person", name: site.name, url: site.url },
    dateCreated: String(input.year),
    keywords: input.keywords.join(", "),
    url: input.url,
    inLanguage: "en",
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemListJsonLd(items: { name: string; url: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
