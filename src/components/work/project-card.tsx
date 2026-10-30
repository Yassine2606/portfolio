import Link from "next/link";
import type { WorkEntry } from "@/lib/content/load";
import { ProjectPlate } from "@/components/visual/project-plate";
import { Tag } from "@/components/ui/status";
import { ArrowRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function ProjectCard({
  work,
  index,
  featured = false,
}: {
  work: WorkEntry;
  index: number;
  featured?: boolean;
}) {
  const fm = work.frontmatter;
  const number = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/work/${work.slug}`}
      className={cn(
        "group border-line hover:border-line-strong block border transition-colors",
        featured ? "bg-paper-raised" : "",
      )}
    >
      <div className={cn(featured ? "grid gap-0 md:grid-cols-12" : "flex h-full flex-col")}>
        <div
          className={cn(
            "overflow-hidden",
            featured
              ? "border-line order-2 md:col-span-7 md:border-l"
              : "border-line order-2 border-b",
          )}
        >
          <ProjectPlate
            slug={work.slug}
            index={number}
            dense={!featured}
            className={cn(
              "border-0 transition-transform duration-300 group-hover:scale-[1.01]",
              featured ? "h-full" : "",
            )}
          />
        </div>

        <div className={cn("order-1 flex flex-col", featured ? "p-6 md:col-span-5 md:p-8" : "p-5")}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-ink-faint font-mono text-[10px] tracking-[0.12em]">
              {number} / {String(fm.year)}
            </span>
            <span className="text-ink-faint font-mono text-[9px] tracking-[0.08em] uppercase">
              {fm.role}
            </span>
          </div>

          <h2
            className={cn(
              "font-display mt-4 leading-[1.02] font-semibold tracking-[-0.035em]",
              featured ? "text-[clamp(2rem,3.2vw,3rem)]" : "text-[clamp(1.5rem,2.2vw,2rem)]",
            )}
          >
            {fm.title}
          </h2>
          <p
            className={cn(
              "text-ink-faint mt-1.5 leading-snug",
              featured ? "text-[13px]" : "text-[12.5px]",
            )}
          >
            {fm.tagline}
          </p>

          <p
            className={cn(
              "text-ink-soft mt-4 leading-[1.6]",
              featured ? "max-w-[46ch] text-[15px]" : "text-sm",
            )}
          >
            {featured ? fm.summary : fm.contract.problem}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {fm.capabilities.slice(0, 4).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          <span className="decoration-line-strong group-hover:decoration-signal-text mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-medium underline decoration-1 underline-offset-4 transition-colors">
            Read the case file
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
