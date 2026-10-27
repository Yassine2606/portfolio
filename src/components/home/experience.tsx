import Link from "next/link";
import { experience } from "@/content/home";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowRight } from "@/components/ui/icons";

export function Experience() {
  return (
    <section aria-labelledby="experience-title" className="scroll-mt-24 pt-14 md:pt-24">
      <SectionHeading
        index="03"
        label="Experience"
        id="experience-title"
        aside={
          <Link href="/about" className="hover:text-signal-text transition-colors">
            Full record →
          </Link>
        }
      />

      <ol className="border-line border-b">
        {experience.map((item) => {
          const content = (
            <>
              <span className="text-ink-faint font-mono text-[10px] tracking-[0.1em] md:col-span-1">
                {item.year}
              </span>
              <span className="font-display text-[17px] leading-tight font-medium tracking-[-0.015em] md:col-span-3">
                {item.company}
              </span>
              <span className="text-ink-soft text-sm md:col-span-3">{item.role}</span>
              <span className="text-ink-faint text-sm md:col-span-4">{item.detail}</span>
              <span className="text-ink-faint hidden justify-self-end md:col-span-1 md:block">
                {item.href ? (
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                ) : null}
              </span>
            </>
          );

          return (
            <li
              key={`${item.company}-${item.role}`}
              className="border-line border-t first:border-t-0"
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="group hover:bg-paper-raised grid gap-x-6 gap-y-2 py-5 transition-colors md:grid-cols-12 md:items-baseline"
                >
                  {content}
                </Link>
              ) : (
                <div className="grid gap-x-6 gap-y-2 py-5 md:grid-cols-12 md:items-baseline">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
