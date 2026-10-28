import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { experience } from "@/content/home";
import { pageMetadata } from "@/lib/seo/metadata";
import { personJsonLd } from "@/lib/seo/jsonld";
import { ContactSection } from "@/components/sections/contact-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowRight } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "AI engineer in Monastir, Tunisia. RAG systems, agents, and the backend that keeps them honest. Experience, education, stack, and what I am looking for.",
  path: "/about",
});

const stackGroups = [
  {
    label: "AI & retrieval",
    items: [
      "RAG",
      "Tool calling",
      "Hybrid retrieval",
      "pgvector",
      "sentence-transformers",
      "Gemini",
      "MCP",
    ],
  },
  {
    label: "Backend",
    items: [
      "TypeScript",
      "Node.js",
      "Fastify",
      "Express",
      "Python",
      "FastAPI",
      "Prisma",
      "Redis",
      "BullMQ",
      "MQTT",
    ],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "TanStack Query", "Tailwind CSS", "Vite"],
  },
  {
    label: "Infrastructure",
    items: ["Docker", "Docker Compose", "PostgreSQL", "MySQL", "MongoDB", "EMQX", "NGINX"],
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />

      <main id="main" className="mx-auto max-w-[1440px] px-5 md:px-10">
        <header className="border-line border-b py-12 md:py-20">
          <p className="text-ink-faint font-mono text-[10px] tracking-[0.14em] uppercase">
            01 / About
          </p>
          <div className="mt-6 grid gap-8 md:grid-cols-12">
            <h1 className="font-display text-[clamp(2.75rem,5.6vw,5rem)] leading-[0.92] font-semibold tracking-[-0.045em] md:col-span-8">
              The person behind
              <br />
              <span className="text-signal-text font-serif font-normal italic">the receipts.</span>
            </h1>
            <p className="text-ink-soft text-[15px] leading-[1.6] md:col-span-4 md:self-end">
              I&rsquo;m {site.name}, an AI engineer in {site.location}. I build the whole path, not
              just the model call — and I try to be specific about what is proven.
            </p>
          </div>
        </header>

        <div className="grid gap-12 py-12 md:grid-cols-12 md:py-16">
          <div className="md:col-span-7">
            <div className="measure text-ink-soft flex flex-col gap-5 text-[17px] leading-[1.65]">
              <p>
                I studied computer engineering at ESPRIM, after a preparatory cycle at ESPRIMS in
                Monastir, and most of what I know comes from building systems end to end: a RAG
                assistant for private documentation, a travel agency platform with three surfaces,
                an MQTT access-control system, and a monitoring agent that talks to three databases.
                In each one, the interesting work was rarely the model. It was the retrieval
                quality, the transaction boundary, the offline transition, the reason attached to a
                denial.
              </p>
              <p>
                I work solo by default, which means I own the schema, the API, the worker, the
                interface, and the container stack. That range is useful, but the part I care about
                most is reliability: what happens when a provider rate-limits, a queue disappears, a
                quote is accepted twice, or a device stops sending heartbeats. A system that only
                works on the happy path is a demo with better styling.
              </p>
              <p>
                I care about honest evidence. If a number cannot be traced to a repository, a
                benchmark, or a screenshot, it does not go on this site. That is why some pages say
                &ldquo;not measured yet&rdquo; instead of showing an impressive figure with no
                source. The constraint is uncomfortable, and it is the point.
              </p>
            </div>

            <div className="border-line mt-10 border-t pt-6">
              <h2 className="font-display text-2xl font-medium tracking-[-0.025em]">
                What I&rsquo;m looking for
              </h2>
              <p className="text-ink-soft measure mt-3 text-[15px] leading-[1.65]">
                An AI engineering role on a team that ships to production and measures what it
                ships: retrieval and agents, applied ML, or a backend-leaning AI role where
                reliability is part of the job. I&rsquo;m available immediately, with no notice
                period. I&rsquo;m based in {site.location} ({site.timezone}), open to remote,
                hybrid, or on-site work, and willing to relocate. Roles outside Tunisia would
                require visa sponsorship.
              </p>
              <Link
                href="/#contact"
                className="decoration-line-strong hover:decoration-signal-text mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline decoration-1 underline-offset-4"
              >
                Start a conversation
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <figure className="mb-8">
              <div className="border-line bg-paper-raised relative aspect-[4/5] overflow-hidden border p-2">
                <div className="relative h-full w-full overflow-hidden">
                  {/* Plain <img>, not next/image: next/image injects
                      style="color:transparent", which the production CSP blocks.
                      The 4:5 crop and the width/height pair prevent layout shift. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/yassine.jpg"
                    srcSet="/images/yassine-432.jpg 432w, /images/yassine-648.jpg 648w, /images/yassine.jpg 864w"
                    sizes="(min-width: 1440px) 400px, (min-width: 768px) 30vw, 100vw"
                    alt="Portrait of Yassine Ben Romdhane."
                    width={864}
                    height={1080}
                    loading="lazy"
                    decoding="async"
                    className="portrait-warm h-full w-full object-cover object-center"
                  />
                </div>
              </div>
              <figcaption className="text-ink-faint mt-2 font-mono text-[9px] tracking-[0.1em] uppercase">
                Fig. 00 / The person
              </figcaption>
            </figure>

            <dl className="border-line border-t">
              <div className="border-line flex items-baseline justify-between gap-4 border-b py-3">
                <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                  Base
                </dt>
                <dd className="text-ink-soft text-right text-sm">{site.location}</dd>
              </div>
              <div className="border-line flex items-baseline justify-between gap-4 border-b py-3">
                <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                  Timezone
                </dt>
                <dd className="text-ink-soft text-right text-sm">{site.timezone}</dd>
              </div>
              <div className="border-line flex items-baseline justify-between gap-4 border-b py-3">
                <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                  Status
                </dt>
                <dd className="text-status text-right text-sm">{site.availability.label}</dd>
              </div>
              <div className="border-line flex items-baseline justify-between gap-4 border-b py-3">
                <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                  Work mode
                </dt>
                <dd className="text-ink-soft text-right text-sm">{site.availability.workModes}</dd>
              </div>
              <div className="border-line flex items-baseline justify-between gap-4 border-b py-3">
                <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                  Relocation
                </dt>
                <dd className="text-ink-soft text-right text-sm">{site.availability.relocation}</dd>
              </div>
              <div className="border-line flex items-baseline justify-between gap-4 border-b py-3">
                <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                  Sponsorship
                </dt>
                <dd className="text-ink-soft text-right text-sm">
                  {site.availability.visaSponsorship}
                </dd>
              </div>
              <div className="border-line flex items-baseline justify-between gap-4 border-b py-3">
                <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                  Languages
                </dt>
                <dd className="text-ink-soft text-right text-sm">{site.languages.join(" · ")}</dd>
              </div>
            </dl>
            <p className="text-ink-faint mt-4 font-mono text-[9px] leading-relaxed tracking-[0.06em] uppercase">
              No stock photo. The work is the introduction.
            </p>
          </aside>
        </div>

        <section aria-labelledby="record-title">
          <SectionHeading index="02" label="Experience" id="record-title" aside="Full record" />
          <ol className="border-line border-b">
            {experience.map((item) => (
              <li
                key={`${item.company}-${item.role}`}
                className="border-line border-t first:border-t-0"
              >
                <div className="grid gap-x-6 gap-y-2 py-5 md:grid-cols-12 md:items-baseline">
                  <span className="text-ink-faint font-mono text-[10px] tracking-[0.1em] md:col-span-1">
                    {item.year}
                  </span>
                  <span className="font-display text-[17px] leading-tight font-medium tracking-[-0.015em] md:col-span-3">
                    {item.company}
                  </span>
                  <span className="text-ink-soft text-sm md:col-span-4">{item.role}</span>
                  <span className="text-ink-faint text-sm md:col-span-4">{item.detail}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="education-title" className="pt-12 md:pt-16">
          <SectionHeading index="03" label="Education" id="education-title" />
          <div className="border-line border-b">
            {site.education.map((item) => (
              <div
                key={item.school}
                className="border-line grid gap-x-6 gap-y-2 border-t py-5 first:border-t-0 md:grid-cols-12"
              >
                <span className="text-ink-faint font-mono text-[10px] tracking-[0.1em] md:col-span-1">
                  {item.years}
                </span>
                <div className="md:col-span-5">
                  <p className="font-display text-[17px] font-medium tracking-[-0.015em]">
                    {item.school}
                  </p>
                  <p className="text-ink-soft mt-1 text-sm">{item.programme}</p>
                </div>
                <p className="text-ink-faint text-sm md:col-span-5 md:col-start-8">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="stack-title" className="pt-12 md:pt-16">
          <SectionHeading
            index="04"
            label="Stack"
            id="stack-title"
            aside="Tools used in the work"
          />
          <div className="border-line grid border-b md:grid-cols-2">
            {stackGroups.map((group, index) => (
              <div
                key={group.label}
                className={`border-line py-6 md:px-6 ${index % 2 === 0 ? "md:border-r md:pl-0" : "md:pr-0"}`}
              >
                <h3 className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                  {group.label}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border-line rounded-card text-ink-soft inline-flex h-7 items-center border px-2 text-[11px]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-ink-faint mt-3 font-mono text-[9px] tracking-[0.06em] uppercase">
            Every tool here appears in at least one case file or archive project.
          </p>
        </section>

        <div className="mt-4">
          <ContactSection />
        </div>
      </main>
    </>
  );
}
