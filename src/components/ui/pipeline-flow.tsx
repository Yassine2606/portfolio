"use client";

import { motion, useReducedMotion } from "motion/react";

interface PipelineFlowProps {
  /** Ordered stage labels, e.g. the RAG flow. */
  stages: string[];
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Compact end-to-end flow for a case study (currently the Documents Assistant
 * RAG pipeline). A labeled rail: each stage is a dot on a vertical line, the
 * line draws top→bottom once, and a small accent pulse travels the rail after
 * the draw settles — the same node/edge language as the architecture diagram,
 * no libraries. Reduced motion: static rail + dots, no pulse, no draw.
 */
export function PipelineFlow({ stages }: PipelineFlowProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="img"
      aria-label={`Pipeline: ${stages.join(" → ")}`}
      className="rounded-card border border-border bg-surface p-5 sm:p-6"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-faint">
        End-to-end flow
      </p>
      <ol className="mt-4 space-y-0">
        {stages.map((stage, i) => {
          const last = i === stages.length - 1;
          return (
            <li key={stage} className="relative flex gap-4 pb-5 last:pb-0">
              {/* Rail */}
              {!last && (
                <motion.span
                  aria-hidden="true"
                  className="absolute left-[7px] top-5 h-full w-px bg-border-strong"
                  initial={reduceMotion ? false : { scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + i * 0.1,
                    ease: EASE,
                  }}
                  style={{ transformOrigin: "top" }}
                />
              )}

              {/* Node */}
              <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                <motion.span
                  aria-hidden="true"
                  className="absolute h-2 w-2 rounded-full bg-accent"
                  initial={reduceMotion ? false : { scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 24,
                    delay: 0.05 + i * 0.1,
                  }}
                />
                {!reduceMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute h-4 w-4 rounded-full border border-accent/40"
                    initial={{ scale: 0.4, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.35, delay: 0.15 + i * 0.1, ease: EASE }}
                  />
                )}
                {/* Traveling pulse — once, after the rail draws */}
                {!last && !reduceMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-[7px] top-5 h-1.5 w-px bg-accent"
                    initial={{ y: 0, opacity: 0 }}
                    whileInView={{ y: "calc(100% - 6px)", opacity: [0, 1, 1, 0] }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.5 + i * 0.28,
                      ease: "easeIn",
                    }}
                  />
                )}
              </span>

              <p className="pt-px leading-relaxed text-sm text-foreground">{stage}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}