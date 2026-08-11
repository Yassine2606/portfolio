"use client";

import { animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowRight,
  BookOpen,
  ChartBar,
  CheckCircle,
  Code,
  DotsThree,
  FileArchive,
  Flask,
  GithubLogo,
  Lightbulb,
  ListChecks,
  Stack,
  Warning,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { Project } from "@/lib/content/schema";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArchitectureDiagram } from "@/components/ui/architecture-diagram";

interface FeaturedWorkProps {
  projects: Project[];
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Case-study panel geometry. */
const DIALOG_MAX_W = 768; // max-w-3xl
const CARD_RADIUS = "14.4px 14.4px 14.4px 14.4px"; // rounded-card
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Deployment status → glyph. Semantic, not decorative. */
const STATUS_ICONS: Record<string, Icon> = {
  production: CheckCircle,
  development: Code,
  archived: FileArchive,
  experimental: Flask,
};

/** Section label glyph inside a case study. */
const CASE_ICONS: Record<string, Icon> = {
  Problem: Warning,
  Requirements: ListChecks,
  Solution: Lightbulb,
  Architecture: Stack,
  Implementation: Code,
  Challenges: WarningCircle,
  Results: ChartBar,
  Lessons: BookOpen,
  "What's next": ArrowRight,
};

/**
 * V2: opening a project morphs the ENTIRE CARD into a dialog — the card's
 * exact box (position, size, corners, surface) is cloned at click time and
 * grows into the dialog geometry using layout properties only, driven
 * imperatively so open and close are exact mirror images. The grid never
 * reflows: the real card stays in place under the dimmed backdrop while the
 * clone covers it, so the seam is invisible on the first frame. No shared
 * elements (`layoutId`), no projection system. The dialog is full-screen
 * on mobile and a centered panel on desktop; Escape, the backdrop,
 * and Close all dismiss it, focus is trapped inside it, and focus returns
 * to the card's button once the reverse morph completes. Reduced-motion:
 * no morph — the dialog simply fades (the documented V1 fallback).
 */
export function FeaturedWork({ projects }: FeaturedWorkProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [origin, setOrigin] = useState<Rect | null>(null);
  const reduceMotion = useReducedMotion();

  const sorted = [...projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured)
  );

  const openProject = sorted.find((p) => p.slug === openSlug) ?? null;

  // Capture the clicked card's exact box as the morph's start geometry (and
  // the reverse morph's exit geometry). The card stays mounted, so focus can
  // always return to its button when the dialog finishes closing.
  // The cards render twice — a snap row on mobile, a grid on desktop — and
  // CSS hides the inactive variant. Pick the one that is actually displayed
  // before measuring (morph origin) or focusing (focus return).
  const visibleEl = (idMobile: string, idDesktop: string) => {
    for (const id of [idMobile, idDesktop]) {
      const el = document.getElementById(id);
      if (el && el.offsetParent !== null) return el;
    }
    return null;
  };

  // Capture the clicked card's exact box as the morph's start geometry (and
  // the reverse morph's exit geometry). The card stays mounted, so focus can
  // always return to its button when the dialog finishes closing.
  const openCase = (slug: string) => {
    const el = visibleEl(`case-card-m-${slug}`, `case-card-d-${slug}`);
    if (el) {
      const r = el.getBoundingClientRect();
      setOrigin({ x: r.left, y: r.top, w: r.width, h: r.height });
    }
    setOpenSlug(slug);
  };

  const closeCase = () => {
    const slug = openSlug;
    setOpenSlug(null);
    if (slug) {
      visibleEl(`case-open-m-${slug}`, `case-open-d-${slug}`)?.focus({
        preventScroll: true,
      });
    }
  };

  const [emblaRef] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });

  return (
    <section id="featured-work" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading
        eyebrow="Featured Work"
        title="Proof, not promises"
        intro="The strongest evidence I have — real codebases, verified stacks, and honest numbers. Each project opens into a full case study."
      />

      {/* Mobile: a swipeable snap row with the next card peeking in. The viewport
          clips the row — without overflow-hidden the 7-slide track would
          widen the section and give the page horizontal overflow. */}
      <div ref={emblaRef} className="-mx-4 mt-14 overflow-hidden px-4 md:hidden">
        <div className="flex touch-pan-y gap-4">
          {sorted.map((project, i) => (
            <div
              key={project.slug}
              className="flex min-w-0 flex-[0_0_85%] flex-col"
            >
              <ProjectCard
                project={project}
                index={i}
                prefix="m"
                animateIn={false}
                reduceMotion={reduceMotion}
                openSlug={openSlug}
                onOpen={openCase}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: the full grid — everyone visible at once. */}
      <div className="mt-14 hidden gap-6 md:grid md:grid-cols-2">
        {sorted.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
            prefix="d"
            animateIn
            reduceMotion={reduceMotion}
            openSlug={openSlug}
            onOpen={openCase}
          />
        ))}
      </div>

      {openProject && (
        <CaseStudyDialog
          project={openProject}
          origin={origin}
          onClose={closeCase}
        />
      )}
    </section>
  );
}

function ProjectCard({
  project,
  index,
  prefix,
  animateIn,
  reduceMotion,
  openSlug,
  onOpen,
}: {
  project: Project;
  index: number;
  /** "m" for the mobile snap row, "d" for the desktop grid — keeps the ids unique across the two mounted variants. */
  prefix: "m" | "d";
  /**
   * Desktop cards fade in with a stagger as they enter the viewport. The
   * carousel variant skips this — slides are clipped by the viewport, so
   * animating them would leave blank cards until a swipe reveals them.
   */
  animateIn: boolean;
  reduceMotion: boolean | null;
  openSlug: string | null;
  onOpen: (slug: string) => void;
}) {
  const StatusIcon =
    STATUS_ICONS[project.status] ?? STATUS_ICONS.experimental;

  return (
    <motion.article
      id={`case-card-${prefix}-${project.slug}`}
      initial={animateIn && !reduceMotion ? { opacity: 0, y: 24 } : false}
      whileInView={animateIn ? { opacity: 1, y: 0 } : undefined}
      viewport={animateIn ? { once: true, amount: 0.2 } : undefined}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.08,
      }}
      className="flex h-full flex-col rounded-card border border-border bg-surface p-6 sm:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-faint">
          <span>{project.year}</span>
          <span aria-hidden="true">·</span>
          <span>{project.role}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <StatusIcon size={11} className="text-accent" />
            {project.status}
          </span>
        </p>
        {project.featured && (
          <span className="rounded-full border border-accent-faint bg-accent-faint px-3 py-1 text-xs font-medium text-accent">
            Featured
          </span>
        )}
      </div>

      {/* The card's title stays put — the whole card is the morph. */}
      <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
        {project.title}
      </h3>
      <p className="mt-2 text-sm text-accent">{project.tagline}</p>

      <p className="mt-4 text-pretty text-sm leading-relaxed text-muted">
        {project.summary}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.capabilities.slice(0, 4).map((cap) => (
          <span
            key={cap}
            className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
          >
            {cap}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-border pt-5">
        <button
          type="button"
          id={`case-open-${prefix}-${project.slug}`}
          onClick={() => onOpen(project.slug)}
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition hover:bg-accent-hover active:scale-[0.98]"
          aria-haspopup="dialog"
          aria-expanded={openSlug === project.slug}
          aria-controls={`case-${project.slug}`}
        >
          Read the case study
        </button>
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            <GithubLogo size={16} />
            GitHub
          </a>
        )}
      </div>
    </motion.article>
  );
}

function CaseStudyDialog({
  project,
  origin,
  onClose,
}: {
  project: Project;
  origin: Rect | null;
  onClose: () => void;
}) {
  const cs = project.caseStudy;

  const reduceMotion = useReducedMotion();
  const morphable = !reduceMotion;

  const leavingRef = useRef(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const naturalRef = useRef(0);
  const startedRef = useRef(false);

  // The card box for exit reversal, and reduced-motion fade state.
  const originRef = useRef<Rect | null>(origin);
  useEffect(() => {
    originRef.current = origin;
  });
  const [leaving, setLeaving] = useState(false);

  // Lock page scroll WITHOUT touching overflow: see useScrollLock. The
  // dialog's own scrollable body is exempted via [data-scroll-lock-scrollable].
  useScrollLock();

  /** Play the reverse morph (or fade), then unmount. */
  const requestClose = () => {
    if (leavingRef.current) return;
    leavingRef.current = true;

    const el = rootRef.current;
    if (!morphable || !origin || !el) {
      setLeaving(true);
      return;
    }

    // Reverse: animate the box layout back onto the card, then unmount.
    const main = animate(
      el,
      {
        left: origin.x,
        top: origin.y,
        width: origin.w,
        height: origin.h,
        borderRadius: CARD_RADIUS,
      },
      { duration: 0.45, ease: EASE, type: "tween" }
    );
    if (backdropRef.current) {
      animate(backdropRef.current, { opacity: 0 }, { duration: 0.3, ease: EASE });
    }
    if (faceRef.current) {
      animate(faceRef.current, { opacity: 0 }, { duration: 0.2, ease: EASE });
    }
    if (cardRef.current) {
      animate(
        cardRef.current,
        { opacity: 1 },
        { duration: 0.16, ease: "easeOut", delay: 0.12 }
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
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

  const titleId = `case-title-${project.slug}`;

  // The dialog's own scroll area (scroll-lock exempts it). The header stays
  // pinned above it; the face gives the column a defined height.
  const dialogBody = (
    <>
      <div className="shrink-0 border-b border-border p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2
            id={titleId}
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {project.title}
          </h2>
          <button
            type="button"
            ref={closeRef}
            autoFocus={!morphable}
            onClick={requestClose}
            aria-label="Close case study"
            className="rounded-full p-2 text-muted transition hover:bg-surface hover:text-foreground active:scale-[0.98]"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div
        data-scroll-lock-scrollable
        className="min-h-0 flex-1 space-y-8 overflow-y-auto overscroll-contain p-6 pt-6 sm:p-8 sm:pt-8"
      >
        <CaseBlock label="Problem">
          <p className="whitespace-pre-line">{cs.problem}</p>
        </CaseBlock>

        <CaseBlock label="Requirements">
          <ul className="list-disc space-y-2 pl-5">
            {cs.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </CaseBlock>

        <CaseBlock label="Solution">
          <p className="whitespace-pre-line">{cs.solution}</p>
        </CaseBlock>

        <CaseBlock label="Architecture">
          <ArchitectureDiagram
            nodes={cs.architecture.nodes}
            edges={cs.architecture.edges}
            description={cs.architecture.description}
          />
        </CaseBlock>

        <CaseBlock label="Implementation">
          <p className="whitespace-pre-line">{cs.implementation}</p>
        </CaseBlock>

        {cs.challenges.length > 0 && (
          <CaseBlock label="Challenges">
            <ul className="space-y-4">
              {cs.challenges.map((c) => (
                <li
                  key={c.title}
                  className="rounded-card border border-border bg-surface p-4"
                >
                  <p className="font-medium text-foreground">{c.title}</p>
                  <p className="mt-1 text-sm text-muted">{c.resolution}</p>
                </li>
              ))}
            </ul>
          </CaseBlock>
        )}

        {cs.results.length > 0 && (
          <CaseBlock label="Results">
            <ul className="space-y-3">
              {cs.results.map((r) => (
                <li
                  key={r.metric}
                  className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3"
                >
                  <span className="font-mono text-lg text-accent">{r.value}</span>
                  <span className="text-sm text-foreground">{r.metric}</span>
                  <span className="text-xs text-muted-faint">({r.source})</span>
                </li>
              ))}
            </ul>
          </CaseBlock>
        )}

        {cs.lessons.length > 0 && (
          <CaseBlock label="Lessons">
            <ul className="list-disc space-y-2 pl-5">
              {cs.lessons.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </CaseBlock>
        )}

        {cs.future.length > 0 && (
          <CaseBlock label="What's next">
            <ul className="list-disc space-y-2 pl-5">
              {cs.future.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </CaseBlock>
        )}
      </div>
    </>
  );

  // Drive the morph: lock the box onto the card, then grow into the panel.
  // Layout properties (left/top/width/height) are animated — never scale —
  // so the case study stays in flow at its true text size the whole way.
  useLayoutEffect(() => {
    if (!morphable || !origin || !rootRef.current) return;

    // Dev-mode StrictMode double-runs effects on the SAME DOM, so the second
    // pass would re-measure the box we already relocked to the card and
    // collapse the dialog. Run the morph once.
    if (startedRef.current) return;
    startedRef.current = true;

    const el = rootRef.current;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const sheet = vw < 640;
    const w = sheet ? vw : Math.min(DIALOG_MAX_W, vw - 48);
    const natural = el.getBoundingClientRect().height;
    // Mobile full-screen: grow the card box to the whole viewport (the body
    // scrolls when the content is taller). Desktop: centered, height-capped.
    const h = sheet
      ? Math.min(Math.max(natural, 160), vh)
      : Math.min(Math.max(natural, 160), vh * 0.85);
    naturalRef.current = natural;
    const x = sheet ? 0 : (vw - w) / 2;
    const y = sheet ? 0 : (vh - h) / 2;

    // Frame one of the animation = the card, pixel for pixel.
    el.style.left = `${origin.x}px`;
    el.style.top = `${origin.y}px`;
    el.style.width = `${origin.w}px`;
    el.style.height = `${origin.h}px`;
    el.style.visibility = "visible";

    const radius = sheet ? "0px" : CARD_RADIUS;

    const main = animate(
      el,
      { left: x, top: y, width: w, height: h, borderRadius: radius },
      { duration: 0.5, ease: EASE, type: "tween" }
    );
    if (backdropRef.current) {
      animate(backdropRef.current, { opacity: 1 }, { duration: 0.35, ease: EASE });
    }
    if (cardRef.current) {
      animate(cardRef.current, { opacity: 0 }, { duration: 0.14, ease: "easeOut" });
    }
    if (faceRef.current) {
      animate(
        faceRef.current,
        { opacity: 1 },
        { duration: 0.28, ease: EASE, delay: 0.14 }
      );
    }

    // Focus the panel only after the morph settles, so the focus ring never
    // animates mid-flight. preventScroll is vital: focusing would otherwise
    // make the browser scroll the page to bring the close button into view.
    void main.finished.then(() => {
      if (!leavingRef.current) {
        closeRef.current?.focus({ preventScroll: true });
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
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sheet = vw < 640;
      const w = sheet ? vw : Math.min(DIALOG_MAX_W, vw - 48);
      const h = sheet
        ? Math.min(Math.max(naturalRef.current, 160), vh)
        : Math.min(Math.max(naturalRef.current, 160), vh * 0.85);
      const x = sheet ? 0 : (vw - w) / 2;
      const y = sheet ? 0 : (vh - h) / 2;
      const radius = sheet ? "0px" : CARD_RADIUS;
      animate(
        el,
        { left: x, top: y, width: w, height: h, borderRadius: radius },
        { duration: 0.35, ease: EASE, type: "tween" }
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [morphable]);

  if (!morphable) {
    // Reduced motion — no morph, the dialog simply fades over the backdrop.
    return (
      <div className="fixed inset-0 z-[60]">
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
            aria-labelledby={titleId}
            id={`case-${project.slug}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: leaving ? 0 : 1, y: leaving ? 8 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onAnimationComplete={() => {
              if (leaving) onClose();
            }}
            className="pointer-events-auto flex min-h-0 w-full flex-col overflow-hidden bg-surface-raised shadow-raised sm:max-h-[85dvh] sm:max-w-3xl sm:rounded-card sm:border sm:border-border-strong"
          >
            {dialogBody}
          </motion.div>
        </div>
      </div>
    );
  }

  // Measure the hidden first layout (the face needs a width to wrap against
  // before it is measured).
  const vw = typeof window === "undefined" ? 0 : window.innerWidth;
  const sheet = vw < 640;
  const contentW = sheet ? vw : Math.min(DIALOG_MAX_W, Math.max(vw - 48, 0));

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={requestClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ opacity: 0 }}
      />

      {/*
        The single morphing face. First layout: hidden, at its natural
        content width, the case study in normal flow so its true height can
        be measured with no text scaling. Before paint, the layout-effect
        re-fits it to the card's box and animates its layout properties into
        the panel geometry — a plain element, animated through
        left/top/width/height and border-radius only, so open and close are
        exact mirror images.
      */}
      <div
        ref={rootRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        id={`case-${project.slug}`}
        className="absolute overflow-hidden"
        style={{
          left: 0,
          top: 0,
          width: contentW,
          height: "auto",
          visibility: "hidden",
          borderRadius: CARD_RADIUS,
        }}
      >
        {/* Card face — an exact clone of the clicked card until it fades.
            Never takes pointer events: it sits above the dialog face and
            would otherwise swallow wheel/click input aimed at the panel. */}
        <div
          ref={cardRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] flex border border-border bg-surface"
          style={{ opacity: 1, borderRadius: CARD_RADIUS }}
        />

        {/* Dialog face — fades in as the box grows; fills it exactly. */}
        <div
          ref={faceRef}
          className="flex h-full flex-col overflow-hidden border border-border-strong bg-surface-raised shadow-raised"
          style={{
            opacity: 0,
            borderRadius: sheet ? "0px" : CARD_RADIUS,
          }}
        >
          {dialogBody}
        </div>
      </div>
    </div>
  );
}

function CaseBlock({ label, children }: { label: string; children: React.ReactNode }) {
  const BlockIcon = CASE_ICONS[label] ?? DotsThree;
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-1.5 font-mono text-sm tracking-tight text-accent">
        <BlockIcon size={14} />
        {label}
      </h3>
      <div className="text-pretty leading-relaxed text-muted">{children}</div>
    </div>
  );
}