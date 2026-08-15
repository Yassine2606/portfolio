import { useEffect } from "react";

/**
 * Lock page scrolling WITHOUT touching `overflow`. Toggling
 * `body { overflow: hidden }` hides the scrollbar, widens the viewport, and
 * re-centers every centered section (a visible page shift while a dialog
 * opens/closes); its interaction with the browser's scroll anchoring can
 * even jump the page. Instead, block scroll *input* (wheel / touch / keys),
 * leaving layout untouched. Elements marked with
 * `data-scroll-lock-scrollable` remain scrollable (the dialog's own areas).
 */
export function useScrollLock(enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    const canScrollThis = (e: Event) =>
      e.target instanceof HTMLElement &&
      e.target.closest("[data-scroll-lock-scrollable]") !== null;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return; // pinch-zoom / page zoom
      if (canScrollThis(e)) return;
      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.closest("input, textarea, [data-scroll-lock-scrollable]") !== null
      ) {
        return;
      }
      e.preventDefault();
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (
        e.target instanceof HTMLElement &&
        e.target.closest("button, a, input, textarea, select, [contenteditable]")
      ) {
        return; // let the dialog's own controls behave normally
      }
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", " "].includes(
          e.key
        )
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("keydown", onKey, { passive: false });
    return () => {
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("keydown", onKey);
    };
  }, [enabled]);
}