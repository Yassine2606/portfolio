import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import {
  getFeaturedWork,
  getNextWork,
  getPreviousWork,
  getWork,
  getWorkSlugs,
} from "@/lib/content/load";
import { pageMetadata, absoluteUrl } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, creativeWorkJsonLd } from "@/lib/seo/jsonld";
import { mdxComponents } from "@/lib/content/mdx-components";
import { CaseHeader } from "@/components/work/case-header";
import { CaseToc } from "@/components/work/case-toc";
import { MetricStrip } from "@/components/work/metric-strip";
import { EvidenceRegister } from "@/components/work/evidence-register";
import { PrevNext } from "@/components/work/prev-next";
import { ProjectPlate } from "@/components/visual/project-plate";
import { ContactSection } from "@/components/sections/contact-section";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWorkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const work = getWork(slug);
    return pageMetadata({
      title: work.frontmatter.seo.title,
      description: work.frontmatter.seo.description,
      path: `/work/${slug}`,
      type: "article",
    });
  } catch {
    return { title: "Case file not found" };
  }
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;

  let work;
  try {
    work = getWork(slug);
  } catch {
    notFound();
  }

  const fm = work.frontmatter;
  const featured = getFeaturedWork();
  const index = Math.max(
    featured.findIndex((entry) => entry.slug === slug),
    0,
  );
  const previous = getPreviousWork(slug);
  const next = getNextWork(slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            creativeWorkJsonLd({
              title: fm.title,
              description: fm.seo.description,
              year: fm.year,
              keywords: fm.capabilities,
              url: absoluteUrl(`/work/${slug}`),
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: absoluteUrl("/") },
              { name: "Work", url: absoluteUrl("/work") },
              { name: fm.title, url: absoluteUrl(`/work/${slug}`) },
            ]),
          ),
        }}
      />

      <main id="main" className="mx-auto max-w-[1440px] px-5 md:px-10">
        <CaseHeader work={work} index={index} total={featured.length} />

        <figure className="reveal border-line mt-4 border-b pb-8">
          <ProjectPlate slug={slug} index={String(index + 1).padStart(2, "0")} />
          <figcaption className="text-ink-faint mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] leading-relaxed">
            <span className="text-ink-soft font-mono text-[9px] tracking-[0.1em] uppercase">
              Fig. {String(index + 1).padStart(2, "0")}
            </span>
            <span className="max-w-[70ch]">
              System map drawn from the documented architecture.{" "}
              {fm.confidentiality === "public"
                ? "No interface capture has been published yet."
                : "Not a screenshot: interface captures and client data are withheld."}
            </span>
          </figcaption>
        </figure>

        <div className="mt-8">
          <MetricStrip metrics={fm.metrics} />
        </div>

        <div className="case-body grid gap-8 pt-4 lg:grid-cols-12 lg:gap-12">
          <aside className="lg:col-span-2">
            <CaseToc />
          </aside>

          <div className="min-w-0 lg:col-span-10">
            <div className="prose-dossier max-w-[60rem]">
              <MDXRemote
                source={work.body}
                components={mdxComponents}
                options={{ mdxOptions: { rehypePlugins: [rehypeSlug] } }}
              />
            </div>

            <EvidenceRegister evidence={fm.evidence} />
            <PrevNext previous={previous} next={next} />
          </div>
        </div>

        <ContactSection />
      </main>
    </>
  );
}
