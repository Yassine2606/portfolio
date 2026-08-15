import { useSyncExternalStore } from "react";

export type Theme = "system" | "light" | "dark";

const STORAGE_KEY = "theme";
const DARK_BG = "#0a0d0c"; // --background (dark)
const LIGHT_BG = "#f2f6f3"; // --background (light)

let theme: Theme = "system";

// Sync the module state with whatever the no-FOUC head script applied, so
// the toggle icon matches the DOM on first render. Runs only in the browser;
// the server always snapshots "system" (handled by useSyncExternalStore's
// getServerSnapshot below, so hydration never mismatches).
if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      theme = stored;
    }
  } catch {
    // localStorage unavailable (private mode, blocked storage) — stay on
    // "system" and let matchMedia decide.
  }
}

const listeners = new Set<() => void>();

export function getTheme(): Theme {
  return theme;
}

export function setTheme(next: Theme): void {
  theme = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Non-fatal: the DOM still switches for this visit.
  }
  applyTheme(next);
  for (const listener of listeners) listener();
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, () => "system");
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function prefersLight(): boolean {
  return window.matchMedia("(prefers-color-scheme: light)").matches;
}

/**
 * Reflect a theme onto the document: the token swap happens via the
 * `data-theme` attribute on <html> (see globals.css), and the browser
 * chrome follows through the theme-color meta.
 */
export function applyTheme(next: Theme): void {
  const light = next === "light" || (next === "system" && prefersLight());
  document.documentElement.dataset.theme = light ? "light" : "dark";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", light ? LIGHT_BG : DARK_BG);
}
