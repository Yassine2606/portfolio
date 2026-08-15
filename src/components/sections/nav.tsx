"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content/schema";
import { handleAnchorClick } from "@/lib/scroll-to";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { useDialogOpen } from "@/lib/use-dialog-open";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavProps {
  site: SiteContent;
}

export function Nav({ site }: NavProps) {
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  const EASE = [0.16, 1, 0.3, 1] as const;

  // The shared spring for the pill shell AND every in-flow child (logo, links,
  // actions). Each child carries its own `layout` projection inside a shared
  // `LayoutGroup`, so nothing snaps to the new geometry while the shell morphs —
  // the whole bar stays in lockstep, shell and content alike.
  const pillSpring = { type: "spring", stiffness: 240, damping: 30 } as const;

  // A state toggle (not a per-frame scrub): past threshold the chrome
  // switches from a full-bleed transparent bar to a centered glass pill.
  // The pill geometry (height 72→56, side insets, top lift) is animated once
  // per switch by Motion `layout` — no layout property animates per scroll
  // frame; the glass itself fades in via a scrubbed opacity value only.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 32);
  });
  // The pill compact (`md`-gated) so the mobile dropdown always anchors to
  // the full-width bar. Reduced motion keeps the bar static and toggles the
  // glass instantly instead.
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const compact = scrolled && isDesktop && !reduceMotion;
  const glassOpacity = useTransform(scrollY, [32, 120], [0, 1]);

  // Freeze the page behind the frosted scrim while the menu is open.
  useScrollLock(menuOpen && !isDesktop);

  // A full-screen dialog owns the viewport — get out of its way so it can't
  // cover the dialog's header. The bar slides up on open and back down once
  // the dialog has fully closed. The mobile menu can't be opened while a
  // dialog is up, but keyboard focus can tab past the scrim and activate a
  // card, so a dialog opening always dismisses the menu. Reset via the
  // render-phase pattern (not an effect): setState in render, guarded by the
  // previous-value comparison, so no cascading render.
  const dialogOpen = useDialogOpen();
  const [wasDialogOpen, setWasDialogOpen] = useState(dialogOpen);
  if (dialogOpen !== wasDialogOpen) {
    setWasDialogOpen(dialogOpen);
    if (dialogOpen) setMenuOpen(false);
  }

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const ids = site.nav.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [site.nav]);

  // The mobile menu slides down from under the bar: the shell's height
  // grows 0 → auto while the panel translates from fully above (-100%) into
  // place, so the whole thing visibly slides into view — no fade. Exit is
  // the exact mirror: the panel rides back up as the shell collapses.
  const menuVariants = reduceMotion
    ? undefined
    : {
        hidden: {
          height: 0,
          transition: { duration: 0.25, ease: EASE },
        },
        show: {
          height: "auto",
          transition: { duration: 0.3, ease: EASE },
        },
      };
  const menuPanelVariants = reduceMotion
    ? undefined
    : {
        hidden: {
          y: "-100%",
          transition: { duration: 0.25, ease: EASE },
        },
        show: {
          y: 0,
          transition: { duration: 0.3, ease: EASE },
        },
      };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      animate={!reduceMotion ? { y: dialogOpen ? "-100%" : "0%" } : undefined}
      style={
        reduceMotion
          ? { transform: dialogOpen ? "translateY(-100%)" : "none" }
          : { pointerEvents: dialogOpen ? "none" : undefined }
      }
      transition={{ duration: 0.35, ease: EASE }}
    >
      {/* The pill: full-bleed 72px bar at rest; centered glass shell 56px and
          inset when scrolled (md+ only). Geometry switches via `layout`, so
          the transition runs once per toggle, spring-damped. */}
      <motion.div
        layout={!reduceMotion}
        transition={pillSpring}
        className={`relative z-10 mx-auto ${
          compact
            ? "mt-2 h-14 w-[calc(100%-2rem)] max-w-6xl"
            : "h-[72px] w-full"
        }`}
      >
        {/* Glass + frame: scrubbed opacity in, static toggle under reduced
            motion. Hairline border only on mobile, full frame on the pill. */}
        <motion.div
          aria-hidden="true"
          style={reduceMotion ? { opacity: scrolled ? 1 : 0 } : { opacity: glassOpacity }}
          className="absolute inset-0 border-b border-glass-border bg-glass backdrop-blur-md md:rounded-2xl md:border md:shadow-raised"
        />
        <LayoutGroup>
        <motion.div
          layout={!reduceMotion}
          transition={pillSpring}
          className="relative flex h-full items-center justify-between px-4 sm:px-8"
        >
        <motion.a
          layout={!reduceMotion}
          transition={pillSpring}
          href="#top"
          onClick={(e) => handleAnchorClick(e, "#top")}
          className="font-mono text-sm tracking-tight text-foreground"
        >
          {site.name}
          <span className="text-accent">_</span>
        </motion.a>

        <motion.nav
          layout={!reduceMotion}
          transition={pillSpring}
          className="hidden items-center gap-6 md:flex"
          aria-label="Primary"
        >
          {site.nav.map((link) => {
            const id = link.href.slice(1);
            const active = activeId === id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="relative py-1 text-sm text-muted transition-colors hover:text-foreground"
                aria-current={active ? "true" : undefined}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-x-0 -bottom-px h-px bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </a>
            );
          })}
        </motion.nav>

        <motion.div
          layout={!reduceMotion}
          transition={pillSpring}
          className="flex items-center gap-3"
        >
          <ThemeToggle />
          <a
            href="#contact"
            onClick={(e) => handleAnchorClick(e, "#contact")}
            className="hidden rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-ink transition hover:bg-accent-hover active:scale-[0.98] md:inline-block"
          >
            {site.contact.ctaLabel}
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-ui text-muted transition hover:text-foreground active:scale-[0.98] md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </motion.div>
      </motion.div>
      </LayoutGroup>
    </motion.div>

    <AnimatePresence>
        {/* Frosted scrim: blurs and dims the page while the menu is open.
            backdrop-filter applies even at opacity 0, so the blur strength
            itself is animated alongside the fade — otherwise the page would
            snap to blurred on the very first frame. The blur amount lives
            in a CSS variable so both the prefixed and unprefixed filters
            follow the animation. */}
        {menuOpen && (
          <motion.div
            key="menu-scrim"
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0, "--menu-blur": "0px" }}
            animate={{ opacity: 1, "--menu-blur": "16px" }}
            exit={reduceMotion ? undefined : { opacity: 0, "--menu-blur": "0px" }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-[5] bg-glass md:hidden"
            style={
              {
                "--menu-blur": "0px",
                backdropFilter: "blur(var(--menu-blur))",
                WebkitBackdropFilter: "blur(var(--menu-blur))",
              } as React.CSSProperties
            }
          />
        )}
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            exit="hidden"
            variants={menuVariants}
            className="absolute inset-x-0 top-full z-20 overflow-hidden md:hidden"
          >
            {/* The sliding panel rides down from above as the shell above
                grows to fit it; overflow-hidden clips the trip. */}
            <motion.div
              initial={reduceMotion ? false : "hidden"}
              animate="show"
              exit="hidden"
              variants={menuPanelVariants}
              className="border-t border-glass-border bg-surface px-4 pb-6 pt-2"
            >
              <nav className="flex flex-col" aria-label="Mobile">
                {site.nav.map((link) => {
                  const id = link.href.slice(1);
                  const active = activeId === id;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        setMenuOpen(false);
                        handleAnchorClick(e, link.href);
                      }}
                      className="border-b border-border py-3 text-sm text-muted transition-colors hover:text-foreground"
                      aria-current={active ? "true" : undefined}
                    >
                      {link.label}
                    </a>
                  );
                })}
                <a
                  href="#contact"
                  onClick={(e) => {
                    setMenuOpen(false);
                    handleAnchorClick(e, "#contact");
                  }}
                  className="mt-4 rounded-full bg-accent px-4 py-2.5 text-center text-sm font-medium text-accent-ink transition hover:bg-accent-hover active:scale-[0.98]"
                >
                  {site.contact.ctaLabel}
                </a>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}