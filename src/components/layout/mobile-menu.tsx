"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { Close, Menu } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/button-link";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const trigger = triggerRef.current;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusables?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.removeEventListener("keydown", onKeyDown);
      (previouslyFocused ?? trigger)?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="text-ink flex min-h-11 items-center gap-2 text-sm font-medium md:hidden"
      >
        Menu
        <Menu size={18} />
      </button>

      {open ? (
        <div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="menu-sheet bg-paper fixed inset-0 z-50 flex flex-col md:hidden"
        >
          <div className="border-line flex h-16 items-center justify-between border-b px-5">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="font-display text-[15px] font-medium"
            >
              {site.shortName}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-ink flex min-h-11 items-center gap-2 text-sm font-medium"
            >
              Close
              <Close size={18} />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-10">
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/work"
                  onClick={() => setOpen(false)}
                  className="font-display block py-2 text-3xl font-medium tracking-[-0.03em]"
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={() => setOpen(false)}
                  className="font-display block py-2 text-3xl font-medium tracking-[-0.03em]"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="font-display block py-2 text-3xl font-medium tracking-[-0.03em]"
                >
                  Contact
                </Link>
              </li>
            </ul>

            <div className="border-line mt-10 flex flex-col gap-4 border-t pt-8">
              <a href={`mailto:${site.email}`} className="text-ink-soft text-sm">
                {site.email}
              </a>
              <a
                href={site.github}
                rel="me noreferrer"
                target="_blank"
                className="text-ink-soft text-sm"
              >
                GitHub ↗
              </a>
              <div className="mt-2">
                <ButtonLink href={site.resume} icon="download" download>
                  Download resume
                </ButtonLink>
              </div>
              <p className="text-status font-mono text-[10px] tracking-[0.1em] uppercase">
                ● {site.availability.label}
              </p>
              <p className="text-ink-faint font-mono text-[10px] tracking-[0.06em] uppercase">
                {site.availability.detail}
              </p>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
