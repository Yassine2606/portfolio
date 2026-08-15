"use client";

import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  CheckCircle,
  EnvelopeSimple,
  FileText,
  GithubLogo,
  PaperPlaneTilt,
  Spinner,
  X,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { SiteContent } from "@/lib/content/schema";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { setDialogOpen } from "@/lib/use-dialog-open";
import { Reveal } from "@/components/motion/reveal";

interface ContactProps {
  site: SiteContent;
}

/** Contact link glyph — keyed by the link label in site.json. */
const LINK_ICONS: Record<string, Icon> = {
  GitHub: GithubLogo,
  Email: EnvelopeSimple,
  Resume: FileText,
};

type FormStatus = "idle" | "sending" | "sent" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DIALOG_MAX_W = 448;
const PILL_RADIUS = "9999px 9999px 9999px 9999px";

/**
 * The CTA does not fly anywhere — it *is* the dialog. On open we clone the
 * button's exact box (same position, size, pill radius, accent fill) and
 * scale/translate/round it into the final panel geometry using transforms
 * only, driven imperatively so every frame is deterministic. No shared
 * elements (`layoutId`), no projection system, no reflow: the open and
 * close morphs are exact mirror images. Reduced-motion: simple fade.
 */
export function Contact({ site }: ContactProps) {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<Rect | null>(null);

  const openDialog = () => {
    // Capture the CTA's exact box as the morph's start geometry.
    const el = document.getElementById("contact-open");
    if (el) {
      const r = el.getBoundingClientRect();
      setOrigin({ x: r.left, y: r.top, w: r.width, h: r.height });
    }
    setOpen(true);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setDialogOpen(false);
  };

  // Return focus to the CTA only after the dialog has fully unmounted.
  // Focusing synchronously during close is a no-op on iOS while the
  // keyboard is up: it refuses to move focus off the input, which then
  // gets removed from the DOM still focused — a dead "ghost input" that
  // swallows every tap and keypress and leaves the page unresponsive.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      document.getElementById("contact-open")?.focus({ preventScroll: true });
    }
    wasOpenRef.current = open;
  }, [open]);

  return (
    <section
      id="contact"
      className="relative mx-auto max-w-6xl overflow-hidden px-4 py-32 sm:px-8"
    >
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-sm tracking-tight text-accent">Contact</p>
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {site.contact.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">
          {site.contact.subtext}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            id="contact-open"
            type="button"
            onClick={openDialog}
            onMouseDown={(e) => e.preventDefault()}
            aria-haspopup="dialog"
            aria-controls="contact-dialog"
            aria-label={`${site.contact.ctaLabel} — opens a contact form`}
            className="cursor-pointer"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-medium text-accent-ink transition hover:bg-accent-hover active:scale-[0.98]">
              <PaperPlaneTilt size={17} weight="bold" />
              {site.contact.ctaLabel}
            </span>
          </button>
          <p className="font-mono text-sm text-muted">
            {site.contact.email}
            <span className="caret" aria-hidden="true" />
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {site.contact.links
            .filter((link) => link.href !== null)
            .map((link) => {
              const LinkIcon = LINK_ICONS[link.label] ?? ArrowUpRight;
              return (
                <a
                  key={link.label}
                  href={link.href!}
                  target={link.href?.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
                >
                  <LinkIcon size={16} />
                  {link.label}
                </a>
              );
            })}
        </div>
      </Reveal>

      {open && (
        <ContactDialog site={site} origin={origin} onClose={closeDialog} />
      )}
    </section>
  );
}

function ContactDialog({
  site,
  origin,
  onClose,
}: {
  site: SiteContent;
  origin: Rect | null;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const morphable = !reduceMotion;

  const leavingRef = useRef(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const naturalRef = useRef(0);
  const startedRef = useRef(false);

  // The CTA box for exit reversal, and reduced-motion fade state.
  const originRef = useRef<Rect | null>(origin);
  useEffect(() => {
    originRef.current = origin;
  });
  const [leaving, setLeaving] = useState(false);

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Lock page scroll WITHOUT touching overflow: see useScrollLock. The
  // dialog's own scrollable face is exempted via [data-scroll-lock-scrollable].
  useScrollLock();

  /** Play the reverse morph (or fade), then unmount. */
  const requestClose = () => {
    if (leavingRef.current) return;
    leavingRef.current = true;

    // Dismiss the keyboard now, while the focused field is still in the
    // DOM. Unmounting a focused input leaves a ghost element holding
    // focus: taps land on an invisible input and the page feels frozen.
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) {
      active.blur();
    }

    const el = rootRef.current;
    if (!morphable || !origin || !el) {
      setLeaving(true);
      return;
    }

    // Reverse: animate the box layout back onto the CTA, then unmount.
    // Slightly slower than the open (0.5s) so the return reads as a
    // deliberate settle rather than a snap.
    const main = animate(
      el,
      {
        left: origin.x,
        top: origin.y,
        width: origin.w,
        height: origin.h,
        borderRadius: PILL_RADIUS,
      },
      { duration: 0.58, ease: EASE, type: "tween" }
    );
    if (backdropRef.current) {
      animate(backdropRef.current, { opacity: 0 }, { duration: 0.35, ease: EASE });
    }
    if (faceRef.current) {
      animate(faceRef.current, { opacity: 0 }, { duration: 0.26, ease: EASE });
    }
    if (pillRef.current) {
      animate(
        pillRef.current,
        { opacity: 1 },
        { duration: 0.18, ease: "easeOut", delay: 0.16 }
      );
    }
    void main.finished.then(onClose).catch(onClose);
  };

  const requestCloseRef = useRef(requestClose);
  useEffect(() => {
    requestCloseRef.current = requestClose;
  });

  // Escape closes; Tab cycles within the dialog (focus trap).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !rootRef.current) return;
      const focusables = rootRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !rootRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Drive the morph: lock the box onto the CTA, then grow into the panel.
  // Layout properties (left/top/width/height) are animated — never scale —
  // so the form stays in flow at its true text size the whole way.
  useLayoutEffect(() => {
    if (!morphable || !origin || !rootRef.current) return;

    // Dev-mode StrictMode double-runs effects on the SAME DOM, so the second
    // pass would re-measure the box we already relocked to the CTA (52px)
    // and collapse the dialog to the 160px floor. Run the morph once.
    if (startedRef.current) return;
    startedRef.current = true;

    const el = rootRef.current;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const sheet = vw < 640;
    // Mobile full-screen: grow the pill to the whole viewport (the form
    // scrolls when it is taller). Desktop: centered, height-capped.
    const w = sheet ? vw : Math.min(DIALOG_MAX_W, vw - 48);
    const natural = el.getBoundingClientRect().height;
    // Mobile full-screen always — the form sits top-aligned like a native
    // full-screen modal. Desktop: centered, height-capped.
    const h = sheet ? vh : Math.min(Math.max(natural, 160), vh - 48);
    naturalRef.current = natural;
    const x = sheet ? 0 : (vw - w) / 2;
    const y = sheet ? 0 : (vh - h) / 2;

    // Frame one of the animation = the CTA, pixel for pixel.
    el.style.left = `${origin.x}px`;
    el.style.top = `${origin.y}px`;
    el.style.width = `${origin.w}px`;
    el.style.height = `${origin.h}px`;
    el.style.visibility = "visible";

    const radius = sheet ? "0px" : "14.4px 14.4px 14.4px 14.4px";

    const main = animate(
      el,
      { left: x, top: y, width: w, height: h, borderRadius: radius },
      { duration: 0.5, ease: EASE, type: "tween" }
    );
    if (backdropRef.current) {
      animate(backdropRef.current, { opacity: 1 }, { duration: 0.35, ease: EASE });
    }
    if (pillRef.current) {
      animate(pillRef.current, { opacity: 0 }, { duration: 0.14, ease: "easeOut" });
    }
    if (faceRef.current) {
      animate(
        faceRef.current,
        { opacity: 1 },
        { duration: 0.28, ease: EASE, delay: 0.14 }
      );
    }

    // Focus the form only after the morph settles (so the mobile keyboard
    // doesn't pop mid-animation). preventScroll is vital: focusing would
    // otherwise make the browser scroll the page to the input.
    void main.finished.then(() => {
      if (!leavingRef.current) {
        // preventScroll is vital: focusing would otherwise make the browser
        // scroll the page to bring the input into view.
        nameRef.current?.focus({ preventScroll: true });
      }
    });
  }, [morphable, origin]);

  // Re-fit if the viewport changes while open.
  useEffect(() => {
    if (!morphable) return;
    const onResize = () => {
      const el = rootRef.current;
      const o = originRef.current;
      if (!el || !o) return;
      // The keyboard retraction fires a resize while closing — re-fitting
      // then would re-grow the panel and fight the reverse morph.
      if (leavingRef.current) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sheet = vw < 640;
      const w = sheet ? vw : Math.min(DIALOG_MAX_W, vw - 48);
      const h = sheet ? vh : Math.min(Math.max(naturalRef.current, 160), vh - 48);
      const x = sheet ? 0 : (vw - w) / 2;
      const y = sheet ? 0 : (vh - h) / 2;
      const radius = sheet ? "0px" : "14.4px 14.4px 14.4px 14.4px";
      animate(
        el,
        { left: x, top: y, width: w, height: h, borderRadius: radius },
        { duration: 0.35, ease: EASE, type: "tween" }
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [morphable]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const nextErrors: FieldErrors = {};
    if (name.length < 2) nextErrors.name = "Please tell me your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "That email doesn't look right.";
    }
    if (message.length < 10) {
      nextErrors.message = "Your message is a bit short — tell me a little more.";
    }

    setErrors(nextErrors);
    setServerError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setServerError(body?.error ?? "Something went wrong on my end.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setServerError("Network error — are you online?");
      setStatus("error");
    }
  }

  const inputClass = (invalid: boolean) =>
    `w-full rounded-ui border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-faint transition-colors focus:outline-none ${
      invalid
        ? "border-danger/60 focus:border-danger"
        : "border-border focus:border-accent/40"
    }`;

  const faceProps = {
    site,
    status,
    errors,
    serverError,
    nameRef,
    inputClass,
    onSubmit,
    onRequestClose: requestClose,
    autoFocusName: !morphable,
  };

  if (!morphable) {
    // Reduced motion — no morph, the dialog simply fades over the backdrop.
    return (
      <div className="fixed inset-0 z-40">
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: leaving ? 0 : 1 }}
          transition={{ duration: 0.25, ease: EASE }}
          onClick={requestClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col sm:flex-row sm:items-center sm:justify-center sm:p-6">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
            id="contact-dialog"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: leaving ? 0 : 1, y: leaving ? 8 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onAnimationComplete={() => {
              if (leaving) onClose();
            }}
            className="pointer-events-auto flex min-h-0 w-full flex-col overflow-hidden bg-surface-raised shadow-raised sm:max-h-[85dvh] sm:max-w-md sm:rounded-card sm:border sm:border-border-strong"
          >
            <ContactFace {...faceProps} className="min-h-0 flex-1 overflow-y-auto overscroll-contain" dataScrollable />
          </motion.div>
        </div>
      </div>
    );
  }

  // Measure width for the hidden first layout (the face needs a width to
  // wrap against before it is measured).
  const vw = typeof window === "undefined" ? 0 : window.innerWidth;
  const sheet = vw < 640;
  const contentW = sheet ? vw : Math.min(DIALOG_MAX_W, Math.max(vw - 48, 0));

  return (
    <div className="fixed inset-0 z-40">
      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={requestClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ opacity: 0 }}
      />

      {/*
        The single shared face. First layout: hidden, at its natural content
        width, form in normal flow so its true height can be measured with
        no text scaling. Before paint, the layout-effect re-fits it to the
        CTA's box and animates its layout properties into the panel
        geometry — a plain element, animated through left/top/width/height
        and border-radius only, so open and close are exact mirror images.
      */}
      <div
        ref={rootRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
        id="contact-dialog"
        className="absolute overflow-hidden"
        style={{
          left: 0,
          top: 0,
          width: contentW,
          height: "auto",
          visibility: "hidden",
          borderRadius: PILL_RADIUS,
        }}
      >
        {/* Pill face — an exact clone of the CTA until the box grows. It never
          takes pointer events: it sits above the form and would otherwise
          swallow wheel/click input aimed at the panel. */}
        <div
          ref={pillRef}
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
          style={{ opacity: 1 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-medium text-accent-ink">
            <PaperPlaneTilt size={17} weight="bold" />
            {site.contact.ctaLabel}
          </span>
        </div>

        {/* Dialog face — fades in as the box grows; fills it exactly. */}
        <div
          ref={faceRef}
          className="overflow-y-auto overscroll-contain border border-border-strong bg-surface-raised shadow-raised"
          style={{
            opacity: 0,
            height: "100%",
            borderRadius: sheet ? "0px" : "14.4px 14.4px 14.4px 14.4px",
          }}
        >
          <ContactFace {...faceProps} className="min-h-0" dataScrollable />
        </div>
      </div>
    </div>
  );
}

interface ContactFaceProps {
  site: SiteContent;
  status: FormStatus;
  errors: FieldErrors;
  serverError: string | null;
  nameRef: React.RefObject<HTMLInputElement | null>;
  inputClass: (invalid: boolean) => string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onRequestClose: () => void;
  autoFocusName: boolean;
  className?: string;
  /** Marks the face as the dialog's own scroll area (scroll-lock exempts it). */
  dataScrollable?: boolean;
}

const ContactFace = forwardRef<HTMLDivElement, ContactFaceProps>(function ContactFace(
  { site, status, errors, serverError, nameRef, inputClass, onSubmit, onRequestClose, autoFocusName, className, dataScrollable },
  ref
) {
  return (
    <div
      ref={ref}
      data-scroll-lock-scrollable={dataScrollable ? "" : undefined}
      className={`flex flex-col ${className ?? ""}`}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border p-6">
        <h2
          id="contact-dialog-title"
          className="flex items-center gap-1.5 font-mono text-sm tracking-tight text-accent"
        >
          <PaperPlaneTilt size={14} weight="bold" />
          New message
        </h2>
        <button
          type="button"
          onClick={onRequestClose}
          aria-label="Close contact form"
          className="rounded-full p-2 text-muted transition hover:bg-surface hover:text-foreground active:scale-[0.98]"
        >
          <X size={18} />
        </button>
      </div>

      {status === "sent" ? (
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <CheckCircle size={42} weight="duotone" className="text-accent" />
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
            Message on its way
          </h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
            Thanks — I&apos;ll get back to you soon. My inbox is also one
            click away if you&apos;d rather write directly.
          </p>
          <a
            href={`mailto:${site.contact.email}`}
            className="mt-4 font-mono text-sm text-accent underline-offset-4 hover:underline"
          >
            {site.contact.email}
          </a>
          <button
            type="button"
            onClick={onRequestClose}
            className="mt-6 rounded-full border border-border-strong px-6 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5 p-6">
          <div>
            <label htmlFor="contact-name" className="mb-1.5 block font-mono text-xs tracking-tight text-muted">
              Name
            </label>
            <input
              id="contact-name"
              ref={nameRef}
              name="name"
              type="text"
              autoComplete="name"
              autoFocus={autoFocusName}
              placeholder="Ada Lovelace"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className={inputClass(Boolean(errors.name))}
            />
            {errors.name && (
              <p id="contact-name-error" className="mt-1.5 text-xs text-danger">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-email" className="mb-1.5 block font-mono text-xs tracking-tight text-muted">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="ada@example.com"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              className={inputClass(Boolean(errors.email))}
            />
            {errors.email && (
              <p id="contact-email-error" className="mt-1.5 text-xs text-danger">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-1.5 block font-mono text-xs tracking-tight text-muted">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              placeholder="What are you building?"
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
              className={`${inputClass(Boolean(errors.message))} resize-none`}
            />
            {errors.message && (
              <p id="contact-message-error" className="mt-1.5 text-xs text-danger">
                {errors.message}
              </p>
            )}
          </div>

          <div aria-live="polite">
            {serverError && (
              <p className="rounded-ui border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
                {serverError}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 pt-1">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition hover:bg-accent-hover active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
            >
              {status === "sending" ? (
                <>
                  <Spinner size={16} weight="bold" className="animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  <PaperPlaneTilt size={16} weight="bold" />
                  Send message
                </>
              )}
            </button>
            <a
              href={`mailto:${site.contact.email}`}
              className="font-mono text-xs text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              or email me
            </a>
          </div>
        </form>
      )}
    </div>
  );
});