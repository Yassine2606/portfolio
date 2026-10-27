import Link from "next/link";
import { site } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowRight } from "@/components/ui/icons";

export function AboutPreview() {
  return (
    <section aria-labelledby="about-preview-title" className="scroll-mt-24 pt-14 md:pt-24">
      <SectionHeading
        index="04"
        label="About"
        id="about-preview-title"
        aside={
          <Link href="/about" className="hover:text-signal-text transition-colors">
            More about me →
          </Link>
        }
      />

      <div className="grid gap-10 pt-8 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <p className="text-ink-soft measure text-[17px] leading-[1.65]">
            I&rsquo;m an AI engineer based in {site.location}. I studied computer engineering at
            ESPRIM, and I build systems where the model is only one part of the product: retrieval
            that finds the right passage, queues that survive a Redis outage, access rules that can
            explain a denial, and interfaces that show their sources.
          </p>
          <p className="text-ink-soft measure mt-5 text-[17px] leading-[1.65]">
            Most of my work is solo and end to end — schema, API, worker, interface, container. I
            care about the unglamorous half: what happens when a provider rate-limits, a quote is
            accepted twice, or a device drops offline. That is usually where trust is won or lost.
          </p>
          <Link
            href="/about"
            className="decoration-line-strong hover:decoration-signal-text mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline decoration-1 underline-offset-4 transition-colors"
          >
            Read the full profile
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <dl className="border-line border-t">
            <div className="border-line flex items-baseline justify-between gap-4 border-b py-3">
              <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                Based
              </dt>
              <dd className="text-ink-soft text-right text-sm">{site.location}</dd>
            </div>
            <div className="border-line flex items-baseline justify-between gap-4 border-b py-3">
              <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                Education
              </dt>
              <dd className="text-ink-soft text-right text-sm">ESPRIM · 2021–26</dd>
            </div>
            <div className="border-line flex items-baseline justify-between gap-4 border-b py-3">
              <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                Languages
              </dt>
              <dd className="text-ink-soft text-right text-sm">{site.languages.join(" · ")}</dd>
            </div>
            <div className="border-line flex items-baseline justify-between gap-4 border-b py-3">
              <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                Open to
              </dt>
              <dd className="text-ink-soft text-right text-sm">AI engineering roles</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
