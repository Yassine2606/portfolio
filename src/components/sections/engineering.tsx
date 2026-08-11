"use client";

import { ArrowUpRight, Brain, ChartLine, Cpu, Database } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { Project, SiteContent } from "@/lib/content/schema";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { handleAnchorClick } from "@/lib/scroll-to";

interface EngineeringProps {
  site: SiteContent;
  projects: Project[];
}

/** Capability cluster glyph — keyed by the cluster title in site.json. */
const CLUSTER_ICONS: Record<string, Icon> = {
  "AI Engineering": Brain,
  "Backend Engineering": Cpu,
  "Data & ML": ChartLine,
  "Engineering Practice": Database,
};

export function Engineering({ site, projects }: EngineeringProps) {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));

  return (
    <section id="engineering" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading
        eyebrow="Engineering"
        title="What I do"
        intro={site.engineering.intro}
      />

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {site.engineering.clusters.map((cluster, i) => {
          const ClusterIcon = CLUSTER_ICONS[cluster.title] ?? Cpu;
          return (
          <Reveal
            key={cluster.title}
            delay={i * 0.06}
            className="rounded-card border border-border bg-surface p-6 sm:p-8"
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
              <ClusterIcon size={17} className="shrink-0 text-accent" />
              {cluster.title}
            </h3>
            <ul className="mt-6 space-y-5">
              {cluster.items.map((item) => {
                const related = item.projects
                  .map((slug) => bySlug.get(slug))
                  .filter((p): p is Project => p !== undefined);
                return (
                  <li key={item.name}>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{item.note}</p>
                    {related.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-2">
                        <span className="font-mono text-[11px] tracking-tight text-muted-faint">
                          Demonstrated in
                        </span>
                        <span className="flex flex-wrap gap-2" role="list">
                          {related.map((p) => (
                            <a
                              key={p.slug}
                              href="#featured-work"
                              onClick={(e) => handleAnchorClick(e, "#featured-work")}
                              className="group inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-accent transition-colors hover:border-accent/50 hover:text-foreground"
                              role="listitem"
                            >
                              {p.shortName}
                              <ArrowUpRight
                                size={10}
                                className="text-muted-faint transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                              />
                            </a>
                          ))}
                        </span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
          );
        })}
      </div>
    </section>
  );
}
