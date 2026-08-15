"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { SiteContent } from "@/lib/content/schema";
import { handleAnchorClick } from "@/lib/scroll-to";
import { useMediaQuery } from "@/hooks/use-media-query";

interface HeroProps {
  site: SiteContent;
  projectSlugs: string[];
}

/**
 * The entrance is one choreographed timeline, not a generic stagger:
 *   eyebrow → masked headline words (blur + 3D pop, 45ms apart)
 *   → subtext → status line → CTAs; the terminal session starts typing in
 *   the same window. Continuous motion is transform/opacity only; blur
 *   appears once, at the entrance, and never again.
 *
 * The living layers (desktop, reduced-motion off):
 *   - a Canvas 2D signal-dust field drifts up from the terminal zone
 *     (DPR-capped, paused off-screen);
 *   - a trailing cursor spotlight lights the stage;
 *   - an ambient glow breathes behind the headline;
 *   - scrolling out tilts the content -2° and the terminal +8° with depth
 *     (perspective-shifted), and the HUD reads hero progress.
 * Everything else — scan line, parallax, magnetic CTA — stays.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ site, projectSlugs }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  // The scrubbed exit is desktop-only (no parallax below md) and off under
  // reduced motion. SSR-safe: false on the server, so no transform is
  // applied until the client agrees the gate is open.
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const active = isDesktop && !reduceMotion;

  // Scrub hero exit: as the section scrolls out (0→1), content lags at ~0.6x,
  // fades, and tilts back; the diagram scales up and tips forward for depth.
  // HUD progress reads the same scrub.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentRotateX = useTransform(scrollYProgress, [0, 1], [0, -4]);
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);
  const visualRotateX = useTransform(scrollYProgress, [0, 1], [0, 10]);

  // Cursor parallax — the visual drifts a few px behind the pointer, the
  // spotlight trails further behind. Motion values only; no re-renders.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const visualX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-22, 22]), {
    stiffness: 90,
    damping: 18,
  });
  const visualY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-16, 16]), {
    stiffness: 90,
    damping: 18,
  });
  const spotlightX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-90, 90]), {
    stiffness: 50,
    damping: 22,
  });
  const spotlightY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-60, 60]), {
    stiffness: 50,
    damping: 22,
  });

  const words = site.hero.headline.split(" ");

  return (
    <section
      ref={sectionRef}
      id="top"
      onMouseMove={(e) => {
        pointerX.set(e.clientX / window.innerWidth - 0.5);
        pointerY.set(e.clientY / window.innerHeight - 0.5);
      }}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pt-20 sm:px-8"
    >
      {/* Ambient glow — breathes behind the headline */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.2, ease: EASE }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        {active && (
          <motion.div
            className="absolute left-[calc(50%-35vmin)] top-[calc(50%-35vmin)] h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.055),transparent_62%)]"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>

      {/* Trailing spotlight — follows the cursor with a slow spring */}
      {active && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[70rem] w-[70rem] -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            style={{ x: spotlightX, y: spotlightY }}
            className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.06),transparent_58%)]"
          />
        </motion.div>
      )}

      {/* Signal dust — the living canvas layer (desktop, no reduced motion) */}
      {active && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.1, ease: EASE }}
          className="pointer-events-none absolute inset-0 z-0"
        >
          <SignalDust />
        </motion.div>
      )}

      {/* One-shot scan line across the hero top after the headline lands */}
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "100%", opacity: [0, 0.8, 0.8, 0] }}
          transition={{ delay: 1.35, duration: 1.15, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/25 to-transparent"
        />
      )}

      {/* HUD — system status (top right) and scroll progress (bottom left) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden items-center justify-between px-6 pt-20 md:flex"
      >
        <span />
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, ease: EASE }}
          className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-muted-faint"
        >
          <span className="relative flex h-1.5 w-1.5">
            {!reduceMotion && (
              <motion.span
                className="absolute inset-0 rounded-full bg-accent"
                animate={{ scale: [1, 1.9, 1], opacity: [0.7, 0.15, 0.7] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          system online
        </motion.span>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden items-center gap-3 px-6 md:flex"
      >
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6, ease: EASE }}
          className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-faint"
        >
          Scroll
        </motion.span>
        <span className="relative h-px w-16 bg-border-strong">
          <motion.span
            style={active ? { scaleX: scrollYProgress } : undefined}
            className="absolute inset-0 origin-left bg-accent"
          />
        </span>
      </div>

      {/* Scrubbed exit: transform + opacity only, disabled when inactive */}
      <div className="relative z-10 [perspective:1400px]">
        <motion.div
          style={
            active
              ? { y: contentY, opacity: contentOpacity, rotateX: contentRotateX }
              : undefined
          }
        >
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
            <div className="flex flex-col gap-6">
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
                className="flex items-center gap-2 font-mono text-sm tracking-tight text-accent"
              >
                <span className="h-px w-6 bg-accent/60" aria-hidden="true" />
                {site.name} — {site.role}
              </motion.p>

              <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                <span className="sr-only">{site.hero.headline}</span>
                <span aria-hidden="true" className="block [perspective:900px]">
                  {words.map((word, i) => (
                    <Fragment key={i}>
                      {i > 0 ? " " : null}
                      <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
                        <motion.span
                          className="inline-block will-change-transform"
                          initial={
                            reduceMotion
                              ? false
                              : {
                                  y: "120%",
                                  rotateX: 45,
                                  filter: "blur(8px)",
                                  opacity: 0,
                                }
                          }
                          animate={{
                            y: "0%",
                            rotateX: 0,
                            filter: "blur(0px)",
                            opacity: 1,
                          }}
                          transition={{
                            duration: 0.9,
                            delay: 0.35 + i * 0.05,
                            ease: EASE,
                          }}
                        >
                          {word}
                        </motion.span>
                      </span>
                    </Fragment>
                  ))}
                </span>
              </h1>

              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.15, ease: EASE }}
                className="max-w-md text-pretty text-lg leading-relaxed text-muted"
              >
                {site.hero.subtext}
              </motion.p>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.25, ease: EASE }}
                className="flex flex-col gap-1.5 font-mono text-sm"
              >
                <p className="flex items-center gap-2 text-accent-strong">
                  <span className="relative flex h-1.5 w-1.5">
                    {!reduceMotion && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-accent"
                        animate={{ scale: [1, 1.9, 1], opacity: [0.7, 0.15, 0.7] }}
                        transition={{
                          duration: 2.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                    <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  {site.hero.availability}
                </p>
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.45, ease: EASE }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Magnetic
                  href={site.hero.ctaPrimary.href}
                  onClick={(e) => handleAnchorClick(e, site.hero.ctaPrimary.href)}
                  className="group relative overflow-hidden rounded-full bg-accent px-6 py-3 text-center text-sm font-medium text-accent-ink transition hover:bg-accent-hover"
                >
                  {site.hero.ctaPrimary.label}
                  {/* Gloss sweep on hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 opacity-0 transition-all duration-500 ease-out group-hover:left-[120%] group-hover:opacity-100"
                  />
                </Magnetic>
                <a
                  href={site.hero.ctaSecondary.href}
                  onClick={(e) => handleAnchorClick(e, site.hero.ctaSecondary.href)}
                  className="group inline-flex items-center justify-center gap-1.5 rounded-full border border-border-strong px-6 py-3 text-center text-sm font-medium text-foreground transition hover:bg-surface active:scale-[0.98]"
                >
                  {site.hero.ctaSecondary.label}
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </motion.div>
            </div>

            {/* Session terminal — a typed log of real content */}
            <div className="relative hidden items-center justify-center md:flex">
              <TerminalVisual
                style={
                  active
                    ? {
                        scale: canvasScale,
                        rotateX: visualRotateX,
                        x: visualX,
                        y: visualY,
                        transformPerspective: 1100,
                      }
                    : undefined
                }
                site={site}
                slugs={projectSlugs}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Magnetic wrapper — the element drifts toward the pointer, springs back.
 *  Press feedback is `whileTap` (motion owns the transform, so the CSS
 *  `active:scale` class would never fire). Reduced motion: static anchor. */
function Magnetic({
  href,
  onClick,
  className,
  children,
}: {
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 15, mass: 0.4 });
  const y = useSpring(my, { stiffness: 180, damping: 15, mass: 0.4 });

  return (
    <motion.a
      href={href}
      onClick={onClick}
      className={className}
      style={reduceMotion ? undefined : { x, y }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      onMouseMove={(e) => {
        if (reduceMotion) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width / 2)) * 0.35);
        my.set((e.clientY - (r.top + r.height / 2)) * 0.35);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.a>
  );
}

/**
 * Signal dust — a Canvas 2D field of faint emerald motes that drift upward
 * from the diagram half of the hero and briefly link when near one another,
 * like traces on a monitoring dashboard. This is the only per-frame cost on
 * the page, so it is deliberately budgeted: DPR ≤ 2, particle count scales
 * with width, the loop pauses when the hero leaves the viewport, and the
 * whole layer is desktop-only and off under reduced motion.
 */
function SignalDust() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const LINK_DIST = 96;
    let raf = 0;
    let width = 0;
    let height = 0;
    let running = true;
    let particles: {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      phase: number;
      wobble: number;
    }[] = [];

    // Read the active accent from tokens so the field follows light mode too.
    let accentRgb =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-rgb")
        .trim() || "79, 199, 147";

    // Re-read the accent when the theme switches: the data-theme swap
    // changes the token value, and the loop draws from this live variable
    // every frame, so the dust recolors in place without restarting.
    const accentObserver = new MutationObserver(() => {
      accentRgb =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent-rgb")
          .trim() || accentRgb;
    });
    accentObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(90, Math.max(40, Math.floor(width / 16)));
      particles = Array.from({ length: count }, () => seed());
    };

    const seed = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.6 + Math.random() * 1.1,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -(0.06 + Math.random() * 0.26),
      phase: Math.random() * Math.PI * 2,
      wobble: 0.1 + Math.random() * 0.25,
    });

    const step = () => {
      raf = requestAnimationFrame(step);
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx + Math.sin(performance.now() * 0.001 * p.wobble + p.phase) * 0.08;
        p.y += p.vy;
        if (p.y < -8) {
          p.y = height + 8;
          p.x = Math.random() * width;
        }
        if (p.x < -8) p.x = width + 8;
        if (p.x > width + 8) p.x = -8;
      }

      // Constellation links between near particles.
      const link = (a: (typeof particles)[number], b: (typeof particles)[number]) => {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < LINK_DIST) {
          const alpha = (1 - d / LINK_DIST) * 0.09;
          ctx.strokeStyle = `rgba(${accentRgb}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      };
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          link(particles[i], particles[j]);
        }
      }

      for (const p of particles) {
        ctx.fillStyle = `rgba(${accentRgb}, 0.5)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();
    step();

    const onVisibility = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting && !document.hidden;
    });
    io.observe(canvas);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      accentObserver.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}

/**
 * Session terminal — the right-side visual. A typed, living terminal card;
 * every line is drawn from real site content (role, availability, project
 * slugs, the integrity principle), so nothing is fabricated. After the
 * script types out, a status ticker keeps the card alive with the build and
 * serving state of the page itself. Typing runs once on load; under reduced
 * motion the session renders pre-typed and the ticker holds its first line.
 */
function TerminalVisual({
  style,
  site,
  slugs,
}: {
  style?: MotionStyle;
  site: SiteContent;
  slugs: string[];
}) {
  const reduceMotion = useReducedMotion();

  // Project names, wrapped to two per line (~46 mono chars at this size) —
  // built from the real slugs so the listing tracks content.
  const projectRows = useMemo(() => {
    const rows: string[] = [];
    let line = "";
    for (const slug of [...slugs].sort()) {
      const trial = line ? `${line}  ${slug}` : slug;
      if (trial.length <= 46) line = trial;
      else {
        rows.push(line);
        line = slug;
      }
    }
    if (line) rows.push(line);
    return rows;
  }, [slugs]);

  const steps = useMemo(
    () =>
      [
        { kind: "cmd", text: `whoami --role` },
        { kind: "out", text: `${site.role} — RAG, agents & monitoring` },
        { kind: "cmd", text: "ls projects/" },
        ...projectRows.map((r) => ({ kind: "out", text: r })),
        { kind: "cmd", text: "check --integrity" },
        { kind: "out", text: "✓ every claim traces to a repo or benchmark" },
        { kind: "cmd", text: "status --work" },
        { kind: "out", text: `● ${site.hero.availability}` },
      ] as const,
    [site, projectRows]
  );

  // Typing engine — one clock, scheduled up-front, cleared on unmount.
  const [typing, setTyping] = useState<{ index: number; chars: number } | null>(
    null
  );
  const [shown, setShown] = useState(() => (reduceMotion ? steps.length : 0));
  const [idle, setIdle] = useState(() => Boolean(reduceMotion));
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timers: number[] = [];
    let t = 800;
    steps.forEach((step, i) => {
      if (step.kind === "cmd") {
        for (let c = 1; c <= step.text.length; c++) {
          timers.push(
            window.setTimeout(() => setTyping({ index: i, chars: c }), t)
          );
          t += 26;
        }
        t += 170;
        timers.push(
          window.setTimeout(() => {
            setTyping(null);
            setShown(i + 1);
          }, t)
        );
      } else {
        t += 110;
        timers.push(window.setTimeout(() => setShown(i + 1), t));
      }
    });
    timers.push(window.setTimeout(() => setIdle(true), t + 400));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [reduceMotion, steps]);

  // Status ticker — only after the script finishes.
  useEffect(() => {
    if (reduceMotion || !idle) return;
    const iv = window.setInterval(
      () => setTicker((v) => (v + 1) % TICKER.length),
      5200
    );
    return () => window.clearInterval(iv);
  }, [reduceMotion, idle]);

  const user = site.name.split(" ")[0].toLowerCase();

  return (
    <motion.div
      aria-hidden="true"
      style={style}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
      className="pointer-events-none hidden w-full max-w-[340px] md:block lg:max-w-[360px]"
    >
      <div className="overflow-hidden rounded-2xl border border-border-strong/80 bg-surface/80 shadow-raised backdrop-blur-lg">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border-strong/60 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-faint">
            {user}@portfolio — zsh
          </span>
        </div>

        {/* Session body */}
        <div className="relative h-[290px] overflow-hidden px-4 py-3.5 font-mono text-xs leading-5 text-foreground/90 lg:h-[310px]">
          {steps.map((step, i) => {
            if (shown <= i && typing?.index !== i) return null;
            const text =
              typing?.index === i ? step.text.slice(0, typing.chars) : step.text;
            return step.kind === "cmd" ? (
              <div key={i} className="flex items-center gap-2">
                <span className="shrink-0 select-none text-accent">❯</span>
                <span className="min-w-0">{text}</span>
                {typing?.index === i && <BlinkCursor />}
              </div>
            ) : (
              <p key={i} className="text-muted">
                {text}
              </p>
            );
          })}

          {idle && (
            <div className="flex items-center gap-2">
              <span className="shrink-0 select-none text-accent">❯</span>
              {reduceMotion ? (
                <span className="text-muted-faint">▍</span>
              ) : (
                <BlinkCursor />
              )}
            </div>
          )}

          {/* Status ticker — pinned to the bottom, swaps in place */}
          {idle && (
            <motion.p
              key={`ticker-${ticker}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute inset-x-4 bottom-3 flex items-center gap-2 text-accent"
            >
              <span className="h-1 w-1 rounded-full bg-accent" />
              {TICKER[ticker]}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/** Rotating status lines — true of the page itself, kept abstract. */
const TICKER = [
  "[ok] build — clean",
  "[ok] serving / — 200",
  "[ok] watch: content — idle",
] as const;

/** The blinking block cursor at the active prompt. */
function BlinkCursor() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-[1.05em] w-[0.55em] translate-y-[0.15em] bg-accent/90 motion-safe:animate-pulse"
    />
  );
}