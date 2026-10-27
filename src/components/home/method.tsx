import Link from "next/link";
import { method } from "@/content/home";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowRight } from "@/components/ui/icons";

export function Method() {
  return (
    <section aria-labelledby="method-title" className="scroll-mt-24 pt-14 md:pt-24">
      <SectionHeading
        index="02"
        label="How I work"
        id="method-title"
        aside="Three claims, three sources"
      />
      <div className="border-line grid border-b md:grid-cols-3">
        {method.map((item, index) => (
          <article
            key={item.title}
            className="border-line flex flex-col py-8 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
          >
            <span className="text-ink-faint font-mono text-[10px] tracking-[0.12em]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display mt-3 text-[clamp(1.25rem,1.7vw,1.5rem)] leading-[1.15] font-medium tracking-[-0.02em]">
              {item.title}
            </h3>
            <p className="text-ink-soft mt-3 max-w-[38ch] text-[15px] leading-[1.6]">{item.body}</p>
            <Link
              href={item.link.href}
              className="decoration-line-strong hover:decoration-signal-text mt-5 inline-flex min-h-11 items-center gap-2 self-start text-[13px] font-medium underline decoration-1 underline-offset-4 transition-colors"
            >
              {item.link.label}
              <ArrowRight size={14} />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
