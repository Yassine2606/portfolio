/**
 * Deterministic in-page scroll. Native `scroll-behavior: smooth` gets canceled
 * mid-flight by layout projections (the nav pill morph runs at the 32px
 * threshold while the page is still scrolling), landing short in random
 * sections — sometimes. This animates the scroll position frame by frame, so
 * nothing can interrupt it except the user, and it shares the site's expressive
 * ease family. Reduced-motion users get an instant jump.
 */

const NAV_OFFSET = 88;

let rafId: number | null = null;

function cancelActive() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = null;
}

export function scrollToHash(href: string): void {
  const id = href.startsWith("#") ? href.slice(1) : href;
  const el = id ? document.getElementById(id) : null;
  if (!el) return;

  cancelActive();

  const startY = window.scrollY;
  const targetY = Math.max(
    0,
    el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
  );
  const distance = targetY - startY;
  if (Math.abs(distance) < 1) return;

  // Instant jump under reduced motion — no animation, ever.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo({ top: targetY });
    return;
  }

  // Distance-scaled duration on the site's expressive curve family
  // (ease-out expo: fast start, long settle).
  const duration = Math.min(1.2, 0.45 + Math.abs(distance) * 0.0004);
  const start = performance.now();
  const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  // The user wins over the animation: wheel, touch, or keyboard cancel it.
  const onUserInterrupt = () => cancelActive();
  window.addEventListener("wheel", onUserInterrupt, { once: true, passive: true });
  window.addEventListener("touchstart", onUserInterrupt, { once: true, passive: true });
  window.addEventListener("keydown", onUserInterrupt, { once: true });

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo(0, startY + distance * ease(t));
    if (t < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
      history.replaceState(null, "", href);
    }
  };
  rafId = requestAnimationFrame(step);
}

/** preventDefault + scroll for an anchor click. */
export function handleAnchorClick(
  e: { preventDefault: () => void },
  href: string
): void {
  e.preventDefault();
  scrollToHash(href);
}