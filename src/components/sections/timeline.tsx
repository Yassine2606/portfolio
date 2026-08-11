"use client";

import { useEffect, useRef, useState } from "react";
import { GithubLogo } from "@phosphor-icons/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { SiteContent } from "@/lib/content/schema";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { useMediaQuery } from "@/hooks/use-media-query";

interface TimelineProps {
  site: SiteContent;
}

/**
 * Pinned moment #1: as the timeline crosses the viewport, an accent line draws
 * top→bottom scrubbed to scroll, and each event's node rotates once it reaches
 * the center band ("you are here"). Reduced-motion keeps the full line and
 * static dots (no scrub, no rotation).
 */
export function Timeline({ site }: TimelineProps) {
  const events = [...site.timeline].sort((a, b) => b.year.localeCompare(a.year));
  const reduceMotion = useReducedMotion();
  // The pin (line draw + node rotation) is desktop-only per the motion spec;
  // mobile keeps the static rail and still-interactive events.
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const scrubOn = isDesktop && !reduceMotion;
  const listRef = useRef<HTMLOListElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.9", "end 0.7"],
  });
  // A spring keeps the draw from jittering as the dot-detection changes state.
  const lineScale = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1]),
    { stiffness: 120, damping: 30 }
  );

  // A dot is "active" while its event crosses the viewport center band.
  useEffect(() => {
    const listeners = listRef.current?.querySelectorAll(`[data-index]`);
    if (!listeners) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.getAttribute("data-index")));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    listeners.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [events]);

  return (
    <section id="timeline" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading
        eyebrow="Timeline"
        title="The engineering journey"
        intro="Milestones backed by repos, not résumé lines."
      />

      <ol
        ref={listRef}
        className="relative mt-14 space-y-12 border-l border-border pl-8"
      >
        {/* The scrubbed "you are here" line — draws over the static rail */}
        <motion.span
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-px origin-top bg-accent"
          style={scrubOn ? { scaleY: lineScale } : undefined}
        />

        {events.map((event, i) => {
          const active = activeIndex === i;
          return (
            <Reveal as="li" key={`${event.year}-${event.title}`} delay={i * 0.05} className="relative" >
              <span
                data-index={i}
                aria-hidden="true"
                className={`absolute -left-[37px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors duration-200 ${
                  active ? "border-accent" : "border-accent/40 bg-background"
                }`}
              >
                <motion.span
                  className={`block h-1.5 w-1.5 rounded-[2px] ${
                    active ? "bg-accent" : "bg-accent/40"
                  }`}
                  animate={
                    scrubOn
                      ? active
                        ? { scale: 1.5, rotate: 45 }
                        : { scale: 1, rotate: 0 }
                      : undefined
                  }
                  transition={{ type: "spring", stiffness: 400, damping: 26 }}
                />
              </span>
              <p className="font-mono text-sm text-accent">{event.year}</p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                {event.title}
              </h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted">{event.detail}</p>
              {event.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {event.links.map((link) => (
                    <a
                      key={link}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-accent transition-colors hover:text-accent-hover"
                    >
                      <GithubLogo size={13} />
                      {new URL(link).pathname.slice(1)}
                    </a>
                  ))}
                </div>
              )}
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}