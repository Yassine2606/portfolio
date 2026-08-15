"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CircleHalf, Moon, Sun } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { setTheme, useTheme } from "@/lib/theme";
import type { Theme } from "@/lib/theme";

// Cycle: system → light → dark → system. "system" is the default and the
// safe resting state; one tap from there always produces a visible change.
const NEXT_THEME: Record<Theme, Theme> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const THEME_ICONS: Record<Theme, Icon> = {
  system: CircleHalf,
  light: Sun,
  dark: Moon,
};

const THEME_LABELS: Record<Theme, string> = {
  system: "Follow system",
  light: "Light",
  dark: "Dark",
};

export function ThemeToggle() {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const Icon = THEME_ICONS[theme];

  return (
    <button
      type="button"
      onClick={() => setTheme(NEXT_THEME[theme])}
      className="inline-flex h-9 w-9 items-center justify-center rounded-ui text-muted transition hover:text-foreground active:scale-[0.98]"
      aria-label={`Switch color theme — current: ${THEME_LABELS[theme]}`}
      title={`Color theme: ${THEME_LABELS[theme]}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={reduceMotion ? false : { rotate: -60, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={reduceMotion ? undefined : { rotate: 60, scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex"
        >
          <Icon size={18} weight="bold" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
