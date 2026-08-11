"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds applied to the reveal (for staggers). */
  delay?: number;
  /** Viewport threshold; spec default 0.2–0.3, once. */
  amount?: number;
  /** Distance in px; 0 = opacity-only fade (reduced motion). */
  y?: number;
  as?: "div" | "li" | "section";
}

/**
 * V1 default reveal regime: fires once when the element is mostly on screen,
 * transforms + opacity only. Honors `prefers-reduced-motion` (fade only).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.25,
  y = 24,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Comp = (as === "li" ? motion.li : as === "section" ? motion.section : motion.div) as typeof motion.div;

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </Comp>
  );
}