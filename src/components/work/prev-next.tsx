import Link from "next/link";
import type { WorkEntry } from "@/lib/content/load";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";

export function PrevNext({
  previous,
  next,
}: {
  previous: WorkEntry | null;
  next: WorkEntry | null;
}) {
  return (
    <nav aria-label="Case files" className="border-line mt-16 grid border-t sm:grid-cols-2">
      {previous ? (
        <Link
          href={`/work/${previous.slug}`}
          className="group border-line hover:bg-paper-raised flex flex-col gap-2 py-6 transition-colors sm:border-r sm:pr-6"
        >
          <span className="text-ink-faint flex items-center gap-2 font-mono text-[9px] tracking-[0.12em] uppercase">
            <ArrowLeft size={13} />
            Previous case file
          </span>
          <span className="font-display text-lg font-medium tracking-[-0.02em]">
            {previous.frontmatter.title}
          </span>
          <span className="text-ink-faint text-sm">{previous.frontmatter.tagline}</span>
        </Link>
      ) : (
        <span aria-hidden="true" className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={`/work/${next.slug}`}
          className="group hover:bg-paper-raised flex flex-col gap-2 py-6 transition-colors sm:items-end sm:pl-6 sm:text-right"
        >
          <span className="text-ink-faint flex items-center gap-2 font-mono text-[9px] tracking-[0.12em] uppercase">
            Next case file
            <ArrowRight size={13} />
          </span>
          <span className="font-display text-lg font-medium tracking-[-0.02em]">
            {next.frontmatter.title}
          </span>
          <span className="text-ink-faint text-sm">{next.frontmatter.tagline}</span>
        </Link>
      ) : null}
    </nav>
  );
}
