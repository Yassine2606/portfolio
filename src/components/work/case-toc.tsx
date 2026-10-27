"use client";

import { useEffect, useState } from "react";
import { caseSections } from "@/content/case-sections";
import { cn } from "@/lib/utils";

export function CaseToc() {
  const [active, setActive] = useState<string>(caseSections[0].id);

  useEffect(() => {
    const headings = caseSections
      .map((section) => document.getElementById(section.id))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <details className="group border-line border-b pb-4 lg:hidden">
        <summary className="text-ink-faint flex min-h-11 cursor-pointer list-none items-center justify-between font-mono text-[10px] tracking-[0.1em] uppercase">
          On this page
          <span aria-hidden="true" className="group-open:hidden">
            +
          </span>
          <span aria-hidden="true" className="hidden group-open:inline">
            −
          </span>
        </summary>
        <ul className="mt-2 flex flex-col">
          {caseSections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-ink-soft hover:text-signal-text flex min-h-9 items-center text-sm"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </details>

      <nav aria-label="On this page" className="sticky top-24 hidden lg:block">
        <p className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
          On this page
        </p>
        <ul className="border-line mt-3 border-t">
          {caseSections.map((section) => (
            <li key={section.id} className="border-line border-b">
              <a
                href={`#${section.id}`}
                aria-current={active === section.id ? "true" : undefined}
                className={cn(
                  "flex min-h-9 items-center border-l-2 py-1.5 pl-3 text-[13px] transition-colors",
                  active === section.id
                    ? "border-signal text-ink"
                    : "text-ink-faint hover:text-ink border-transparent",
                )}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
