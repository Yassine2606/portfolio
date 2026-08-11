"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Brain,
  Cloud,
  Cpu,
  Database,
  Monitor,
  Wrench,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { SiteContent } from "@/lib/content/schema";
import { SectionHeading } from "@/components/ui/section-heading";

interface ToolboxProps {
  site: SiteContent;
}

/** Toolbox category glyph — keyed by the group category in site.json. */
const GROUP_ICONS: Record<string, Icon> = {
  "AI & ML": Brain,
  Backend: Cpu,
  Data: Database,
  Frontend: Monitor,
  Infrastructure: Cloud,
};

/**
 * V2: filterable toolbox. The active category pill slides between options via
 * a shared element (same family as the nav indicator), and the category cards
 * re-flow with a layout animation. Reduced-motion: filtering still works, but
 * the pill swap is instant and cards fade — no slide, no reflow animation.
 */
export function Toolbox({ site }: ToolboxProps) {
  const reduceMotion = useReducedMotion();
  const categories = site.toolbox.groups.map((g) => g.category);
  const [filter, setFilter] = useState<string>("all");

  const groups =
    filter === "all"
      ? site.toolbox.groups
      : site.toolbox.groups.filter((g) => g.category === filter);

  return (
    <section id="toolbox" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading
        eyebrow="Toolbox"
        title="Tools I reach for"
        intro={site.toolbox.intro}
      />

      <div
        role="group"
        aria-label="Filter by category"
        className="mt-10 flex flex-wrap gap-2"
      >
        {["all", ...categories].map((c) => {
          const active = filter === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={active}
              className="relative rounded-full border border-border px-4 py-1.5 text-sm transition-colors hover:border-accent/50 hover:text-foreground active:scale-[0.98]"
            >
              {active && (
                <motion.span
                  layout={!reduceMotion}
                  layoutId={reduceMotion ? undefined : "toolbox-filter"}
                  className="absolute inset-0 rounded-full border border-accent bg-accent-faint"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <span
                className={`relative z-10 ${active ? "text-foreground" : "text-muted"}`}
              >
                {c === "all" ? "All" : c}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {groups.map((group) => {
            const GroupIcon = GROUP_ICONS[group.category] ?? Wrench;
            return (
            <motion.div
              key={group.category}
              layout={!reduceMotion}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-card border border-border bg-surface p-6"
            >
              <h3 className="flex items-center gap-1.5 font-mono text-sm tracking-tight text-accent">
                <GroupIcon size={15} />
                {group.category}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}