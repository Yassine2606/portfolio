import type { ArchiveEntry } from "@/content/home";
import { ArrowUpRight } from "@/components/ui/icons";

export function ArchiveRow({ item }: { item: ArchiveEntry }) {
  const content = (
    <>
      <span className="font-display text-[17px] font-medium tracking-[-0.015em] md:col-span-3">
        {item.title}
      </span>
      <span className="text-ink-soft text-sm md:col-span-5">{item.line}</span>
      <span className="text-ink-faint font-mono text-[10px] tracking-[0.08em] md:col-span-2">
        {item.year}
      </span>
      <span className="text-ink-faint flex items-center gap-2 font-mono text-[9px] tracking-[0.06em] uppercase md:col-span-2 md:justify-end">
        {item.note}
        {item.href ? <ArrowUpRight size={13} /> : null}
      </span>
    </>
  );

  return (
    <li className="border-line border-t first:border-t-0">
      {item.href ? (
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="hover:bg-paper-raised grid gap-x-6 gap-y-2 py-5 transition-colors md:grid-cols-12 md:items-baseline"
        >
          {content}
        </a>
      ) : (
        <div className="grid gap-x-6 gap-y-2 py-5 md:grid-cols-12 md:items-baseline">{content}</div>
      )}
    </li>
  );
}
