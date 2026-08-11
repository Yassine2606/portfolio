"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribed media query — setState-in-effect-free and SSR-safe (false on the
 * server). Used for the desktop-only gates on scrubbed/pinned motion.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}