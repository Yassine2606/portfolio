"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowRight } from "@/components/ui/icons";
import { ProjectPlate } from "@/components/visual/project-plate";
import { Tag } from "@/components/ui/status";
import { cn } from "@/lib/utils";

export type IndexItem = {
  slug: string;
  index: string;
  title: string;
  descriptor: string;
  outcome: string;
  year: string;
  stack: string[];
};

export function IndexTabs({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState(0);
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  function focusTab(index: number) {
    const nextIndex = (index + items.length) % items.length;
    setActive(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusTab(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusTab(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(items.length - 1);
    }
  }

  const current = items[active] ?? items[0];

  return (
    <div>
      {/* Desktop: tablist + preview panel */}
      <div className="hidden gap-8 lg:grid lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div role="tablist" aria-orientation="vertical" aria-label="Selected systems">
            {items.map((item, index) => {
              const selected = index === active;
              return (
                <a
                  key={item.slug}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  href={`/work/${item.slug}`}
                  role="tab"
                  id={`tab-${item.slug}`}
                  aria-selected={selected}
                  aria-controls="index-panel"
                  tabIndex={selected ? 0 : -1}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={cn(
                    "border-line group relative flex items-baseline gap-5 border-b py-5 pr-4 pl-4 transition-colors duration-200",
                    selected ? "bg-signal-wash" : "hover:bg-paper-raised",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "bg-signal absolute top-0 bottom-0 left-0 w-0.5 origin-top transition-transform duration-200",
                      selected ? "scale-y-100" : "scale-y-0",
                    )}
                  />
                  <span className="text-ink-faint font-mono text-[10px]">{item.index}</span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display flex items-baseline justify-between gap-4 text-[19px] leading-tight font-medium tracking-[-0.02em]">
                      {item.title}
                      <span className="text-ink-faint font-mono text-[9px] font-normal tracking-[0.08em] uppercase">
                        {item.year}
                      </span>
                    </span>
                    <span className="text-ink-faint mt-1.5 block font-mono text-[9px] tracking-[0.08em] uppercase">
                      {item.descriptor}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>

          <p className="text-ink-faint mt-4 font-mono text-[9px] leading-relaxed tracking-[0.06em] uppercase">
            Hover or focus a row to preview. Open it for the full case file.
          </p>
        </div>

        <div className="lg:col-span-7">
          {current ? (
            <div
              role="tabpanel"
              id="index-panel"
              aria-labelledby={`tab-${current.slug}`}
              className="border-line bg-paper-raised rounded-card flex h-full flex-col border p-4"
            >
              <ProjectPlate slug={current.slug} index={current.index} dense />
              <div className="flex flex-1 flex-col px-1 pt-5">
                <p className="text-ink-soft max-w-[52ch] text-[15px] leading-[1.5]">
                  {current.outcome}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {current.stack.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                <div className="mt-auto pt-5">
                  <Link
                    href={`/work/${current.slug}`}
                    className="decoration-line-strong hover:decoration-signal-text inline-flex min-h-11 items-center gap-2 text-sm font-medium underline decoration-1 underline-offset-4 transition-colors"
                  >
                    Read the case file
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile: accordion */}
      <div className="lg:hidden">
        {items.map((item, index) => {
          const expanded = index === openMobile;
          return (
            <div key={item.slug} className="border-line border-b">
              <h3>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`mobile-panel-${item.slug}`}
                  onClick={() => setOpenMobile(expanded ? -1 : index)}
                  className="flex w-full items-baseline gap-4 py-4 pr-2 text-left"
                >
                  <span className="text-ink-faint font-mono text-[10px]">{item.index}</span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display block text-lg leading-tight font-medium tracking-[-0.02em]">
                      {item.title}
                    </span>
                    <span className="text-ink-faint mt-1 block font-mono text-[9px] tracking-[0.08em] uppercase">
                      {item.descriptor}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-ink-faint font-mono text-sm">
                    {expanded ? "−" : "+"}
                  </span>
                </button>
              </h3>
              <div id={`mobile-panel-${item.slug}`} hidden={!expanded} className="pb-5">
                <ProjectPlate slug={item.slug} index={item.index} dense />
                <p className="text-ink-soft mt-4 text-sm leading-relaxed">{item.outcome}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.stack.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                <Link
                  href={`/work/${item.slug}`}
                  className="decoration-line-strong mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline decoration-1 underline-offset-4"
                >
                  Read the case file
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
