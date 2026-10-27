import { getFeaturedWork } from "@/lib/content/load";
import { site } from "@/content/site";
import { personJsonLd } from "@/lib/seo/jsonld";
import { Hero } from "@/components/home/hero";
import { IndexTabs, type IndexItem } from "@/components/home/index-tabs";
import { Method } from "@/components/home/method";
import { Experience } from "@/components/home/experience";
import { AboutPreview } from "@/components/home/about-preview";
import { ContactSection } from "@/components/sections/contact-section";
import { SectionHeading } from "@/components/ui/section-heading";

export default function HomePage() {
  const featured = getFeaturedWork();

  const items: IndexItem[] = featured.map((work, index) => ({
    slug: work.slug,
    index: String(index + 1).padStart(2, "0"),
    title: work.frontmatter.title,
    descriptor: work.frontmatter.descriptor,
    outcome: work.frontmatter.summary,
    year: String(work.frontmatter.year),
    stack: work.frontmatter.capabilities.slice(0, 4),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />

      <main id="main" className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Hero />

        <section aria-labelledby="index-title" id="index" className="scroll-mt-24 py-14 md:py-24">
          <SectionHeading
            index="01"
            label="Selected systems"
            id="index-title"
            aside={`${String(featured.length).padStart(2, "0")} case files`}
          />
          <div className="pt-8">
            <IndexTabs items={items} />
          </div>
        </section>

        <Method />
        <Experience />
        <AboutPreview />
        <ContactSection />
      </main>

      <p className="sr-only">
        {site.name} — AI engineer, {site.location}.
      </p>
    </>
  );
}
