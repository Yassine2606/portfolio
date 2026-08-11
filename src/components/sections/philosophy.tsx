"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { SiteContent } from "@/lib/content/schema";
import { SectionHeading } from "@/components/ui/section-heading";
import { useMediaQuery } from "@/hooks/use-media-query";

interface PhilosophyProps {
  site: SiteContent;
}

/**
 * V2 kinetic device: each principle's headline gets a scrubbed line-highlight
 * — an accent sweep that fills left→right as the card crosses the viewport.
 * Desktop-only and reduced-motion-static (the V1 plain reveal is the fallback).
 */
export function Philosophy({ site }: PhilosophyProps) {
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const enabled = isDesktop && !reduceMotion;

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading eyebrow="Philosophy" title={site.philosophy.title} intro={site.philosophy.intro} />

      <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2">
        {site.philosophy.principles.map((principle, i) => (
          <PrincipleCard
            key={principle.title}
            index={i}
            title={principle.title}
            body={principle.body}
            enabled={enabled}
          />
        ))}
      </div>
    </section>
  );
}

function PrincipleCard({
  index,
  title,
  body,
  enabled,
}: {
  index: number;
  title: string;
  body: string;
  enabled: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.7"],
  });
  const highlight = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={ref}
      className="flex flex-col gap-2 border-l border-accent/40 pl-6"
    >
      <p className="font-mono text-xs text-muted-faint">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="relative w-fit text-lg font-semibold tracking-tight text-foreground">
        {enabled && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 -z-10 origin-left rounded-[3px] bg-accent-faint"
            style={{ scaleX: highlight }}
          />
        )}
        {title}
      </h3>
      <p className="text-pretty leading-relaxed text-muted">{body}</p>
    </div>
  );
}