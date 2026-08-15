import { useSyncExternalStore } from "react";

let open = false;
const listeners = new Set<() => void>();

/**
 * Global "is any full-screen dialog open" flag. The dialogs (case study,
 * contact form) set it when they open/close; the fixed navbar consumes it so
 * it can get out of the way — a fullscreen dialog owns the whole viewport and
 * a floating bar would cover its header. A tiny module store beats context
 * here: there is exactly one page, one nav, and no prop drilling.
 */
export function setDialogOpen(value: boolean): void {
  if (open === value) return;
  open = value;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useDialogOpen(): boolean {
  return useSyncExternalStore(subscribe, () => open, () => false);
}
