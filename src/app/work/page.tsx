import type { Metadata } from "next";
import { getFeaturedWork } from "@/lib/content/load";
import { archive } from "@/content/home";
import { pageMetadata, absoluteUrl } from "@/lib/seo/metadata";
import { itemListJsonLd } from "@/lib/seo/jsonld";
import { ProjectCard } from "@/components/work/project-card";
import { ArchiveRow } from "@/components/work/archive-row";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Four production-oriented systems documented end to end: enterprise RAG, a travel agency platform, an MCP monitoring agent, and MQTT access control.",
  path: "/work",
});

export default function WorkPage() {
  const featured = getFeaturedWork();
  const [flagship, ...rest] = featured;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            itemListJsonLd(
              featured.map((work) => ({
                name: work.frontmatter.title,
                url: absoluteUrl(`/work/${work.slug}`),
              })),
            ),
          ),
        }}
      />

      <main id="main" className="mx-auto max-w-[1440px] px-5 md:px-10">
        <header className="border-line border-b py-12 md:py-20">
          <p className="text-ink-faint font-mono text-[10px] tracking-[0.14em] uppercase">
            01 / Work
          </p>
          <div className="mt-6 grid gap-8 md:grid-cols-12">
            <h1 className="font-display text-[clamp(2.75rem,5.6vw,5rem)] leading-[0.92] font-semibold tracking-[-0.045em] md:col-span-8">
              Four systems,
              <br />
              <span className="text-signal-text font-serif font-normal italic">
                documented end to end.
              </span>
            </h1>
            <p className="text-ink-soft text-[15px] leading-[1.6] md:col-span-4 md:self-end">
              Each case file carries the problem, the architecture, the tradeoffs, the failure
              paths, and the evidence. Where a number does not exist yet, the page says so instead
              of borrowing one.
            </p>
          </div>
          <p className="text-ink-faint mt-8 font-mono text-[9px] tracking-[0.1em] uppercase">
            {String(featured.length).padStart(2, "0")} case files ·{" "}
            {String(archive.length).padStart(2, "0")} archive
          </p>
        </header>

        <section aria-labelledby="featured-title" className="py-12 md:py-16">
          <SectionHeading
            index="02"
            label="Case files"
            id="featured-title"
            aside="Selected systems · 2025–26"
          />
          <div className="mt-8 flex flex-col gap-6">
            {flagship ? <ProjectCard work={flagship} index={0} featured /> : null}
            <div className="grid gap-6 md:grid-cols-3">
              {rest.map((work, index) => (
                <ProjectCard key={work.slug} work={work} index={index + 1} />
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="archive-title" className="pb-16 md:pb-24">
          <SectionHeading
            index="03"
            label="Archive"
            id="archive-title"
            aside="Real builds, no thin pages"
          />
          <ul className="mt-2">
            {archive.map((item) => (
              <ArchiveRow key={item.title} item={item} />
            ))}
          </ul>
          <p className="text-ink-faint mt-4 max-w-[60ch] text-[11px] leading-relaxed">
            Archive projects are listed because they are real work, not because they need a page.
            Private work can be walked through on request.
          </p>
        </section>

        <ContactSection />
      </main>
    </>
  );
}
