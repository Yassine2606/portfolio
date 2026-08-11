"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import type { MotionValue, Transition } from "motion/react";
import {
  ArrowDown,
  Brain,
  Cloud,
  Code,
  Database,
  Monitor,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { ArchitectureEdge, ArchitectureNode } from "@/lib/content/schema";

interface ArchitectureDiagramProps {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  description: string;
  /**
   * V2: scrubbed reveal — stages light up top-to-bottom as the card crosses
   * the viewport. Gated: desktop only, and reduced-motion falls back to the
   * static diagram. Featured Work passes nothing; only the AI Systems section
   * opts in.
   */
  scrubbed?: boolean;
}

/** Pipeline stage: an ordered group of nodes plus the edges leaving it. */
interface StageGroup {
  name: string;
  nodes: ArchitectureNode[];
  /** Edges that leave this stage; `target` is set when the edge skips ahead. */
  outLabels: { text: string; target: string | null }[];
  /** Edges between nodes inside this stage. */
  innerLabels: string[];
}

const FALLBACK_STAGE = "Core";

/** Shared-element spring for the chip ring ⇄ panel line morph. */
const MORPH_SPRING: Transition = { type: "spring", stiffness: 500, damping: 38 };

/** Panel expand/collapse — height only: the content inside owns the fade,
 *  so they can't double-animate (double opacity = visible flicker). */
const PANEL_TRANSITION: Transition = { duration: 0.3, ease: [0.16, 1, 0.3, 1] };

/** Content crossfade when the shown chip changes. */
const CONTENT_TRANSITION: Transition = { duration: 0.18, ease: [0.16, 1, 0.3, 1] };

/**
 * Group nodes by their authored `stage`, ordered by first appearance, and
 * classify each edge as leaving a stage (forward, with a jump target when it
 * skips stages), internal, or a back-edge rendered as an incoming note.
 */
function buildStages(
  nodes: ArchitectureNode[],
  edges: ArchitectureEdge[]
): StageGroup[] {
  const stageOf = new Map<string, string>();
  const order: string[] = [];
  for (const node of nodes) {
    const stage = (node.stage ?? FALLBACK_STAGE).trim() || FALLBACK_STAGE;
    stageOf.set(node.id, stage);
    if (!order.includes(stage)) order.push(stage);
  }

  const grouped = new Map<string, ArchitectureNode[]>();
  for (const node of nodes) {
    const stage = stageOf.get(node.id)!;
    const list = grouped.get(stage);
    if (list) list.push(node);
    else grouped.set(stage, [node]);
  }

  const stages: StageGroup[] = order.map((name) => ({
    name,
    nodes: grouped.get(name)!,
    outLabels: [],
    innerLabels: [],
  }));

  for (const edge of edges) {
    const from = stageOf.get(edge.from);
    const to = stageOf.get(edge.to);
    if (!from || !to) continue;
    const fi = order.indexOf(from);
    const ti = order.indexOf(to);
    if (fi === ti) {
      stages[fi].innerLabels.push(edge.label);
    } else if (fi < ti) {
      stages[fi].outLabels.push({
        text: edge.label,
        target: ti > fi + 1 ? order[ti] : null,
      });
    } else {
      stages[ti].innerLabels.push(`→ ${order[fi]}: ${edge.label}`);
    }
  }

  return stages;
}

/**
 * Signature component. Renders the project pipeline as an ordered flow of
 * stage cards — no SVG, no fixed pixel canvas, so it is fully responsive.
 * Each service is a chip: hovering (or focusing) reveals its description,
 * clicking pins it, Escape unpins. Edges read as the mono lines that connect
 * a stage to the next one, with the target stage named when an edge jumps
 * ahead. A text alternative is provided for screen readers.
 *
 * The morph: the chip ring and the panel's accent line share a layoutId. When
 * a chip is hovered while the diagram is resting, `ringSourceId` is assigned
 * to it and the ring mounts in the same commit as the panel's line — the line
 * flies out of the chip. While that panel session stays open no other ring is
 * ever mounted, so hopping between chips never drags the divider out of the
 * panel. Keyboard focus opens the panel instantly (no animation, per the
 * motion spec).
 *
 * When `scrubbed` is set, the stages light up top-to-bottom, tied to scroll.
 */
/** Node-kind icons — the chip glyph is semantic, not decorative. */
const NODE_ICONS: Record<ArchitectureNode["type"], Icon> = {
  frontend: Monitor,
  backend: Code,
  database: Database,
  ai: Brain,
  infra: Cloud,
};

export function ArchitectureDiagram({
  nodes,
  edges,
  description,
  scrubbed = false,
}: ArchitectureDiagramProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  // The chip that opened the current panel session — the only chip ever
  // allowed to mount a shared ring. It stays mounted (invisible after the
  // flight) until the session ends, so no hop can re-run the morph.
  const [ringSourceId, setRingSourceId] = useState<string | null>(null);
  // Keyboard focus must open the panel instantly — no morph, no height spin.
  const [pointerInput, setPointerInput] = useState(true);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const enableMorph = !reduceMotion;
  const animate = enableMorph && pointerInput;
  const ns = useId().replace(/:/g, "");
  const morphId = `stage-explainer-${ns}`;

  // The scrubbed reveal is desktop-only per the motion spec (mobile is static).
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const scrubActive = scrubbed && isDesktop && !reduceMotion;

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end 0.55"],
  });

  const stages = useMemo(() => buildStages(nodes, edges), [nodes, edges]);
  const shownId = pinnedId ?? hoverId;

  // Escape unpins a selected node.
  useEffect(() => {
    if (!pinnedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPinnedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pinnedId]);

  if (stages.length === 0) {
    return <p className="text-muted">No architecture available for this project yet.</p>;
  }

  const selectPointer = (id: string) => {
    setPointerInput(true);
    // The ring role is assigned only when the diagram is resting (no panel
    // open): the committed hoverId is still null. Hops inside an open session
    // never re-run the morph.
    if (hoverId === null) setRingSourceId(id);
    setHoverId(id);
  };
  const selectKeyboard = (id: string) => {
    setPointerInput(false);
    setHoverId(id);
  };
  const selectNone = () => {
    setRingSourceId(null);
    setHoverId(null);
  };
  const togglePin = (id: string) => {
    setRingSourceId(null);
    setPinnedId((prev) => (prev === id ? null : id));
  };
  const progress = scrubActive ? scrollYProgress : null;

  return (
    <div
      ref={rootRef}
      className="rounded-card border border-border bg-surface/60 p-4 sm:p-6"
    >
      <p className="sr-only">{description}</p>
      <ol className="mx-auto max-w-3xl">
        {stages.map((stage, i) => (
          <StageItem
            key={stage.name}
            stage={stage}
            index={i}
            total={stages.length}
            progress={progress}
            shownId={shownId}
            pressedId={pinnedId}
            ringSourceId={ringSourceId}
            morphId={morphId}
            animate={animate}
            onHoverPointer={selectPointer}
            onHoverKeyboard={selectKeyboard}
            onHoverNone={selectNone}
            onPin={togglePin}
          />
        ))}
      </ol>
    </div>
  );
}

function StageItem({
  stage,
  index,
  total,
  progress,
  shownId,
  pressedId,
  ringSourceId,
  morphId,
  animate,
  onHoverPointer,
  onHoverKeyboard,
  onHoverNone,
  onPin,
}: {
  stage: StageGroup;
  index: number;
  total: number;
  progress: MotionValue<number> | null;
  shownId: string | null;
  pressedId: string | null;
  ringSourceId: string | null;
  morphId: string;
  animate: boolean;
  onHoverPointer: (id: string) => void;
  onHoverKeyboard: (id: string) => void;
  onHoverNone: () => void;
  onPin: (id: string) => void;
}) {
  // A constant fallback keeps the transforms static when the scrub is off.
  const constant = useMotionValue(1);
  const p = progress ?? constant;
  const range = [index / total, (index + 1) / total];
  const opacity = useTransform(p, range, [0.2, 1]);
  const y = useTransform(p, range, [16, 0]);

  const shownNode = stage.nodes.find((n) => n.id === shownId) ?? null;
  const detail = shownNode ? (
    <motion.div
      key={shownNode.id}
      initial={animate ? { opacity: 0, y: 5 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={animate ? CONTENT_TRANSITION : undefined}
    >
      <div className="pt-3">
        <p className="text-sm font-medium text-foreground">{shownNode.label}</p>
        <p className="mt-0.5 text-sm text-muted">{shownNode.description}</p>
      </div>
    </motion.div>
  ) : null;

  return (
    <motion.li style={{ opacity, y }}>
      {/* Hover follows the whole card, not just each chip: moving from a chip
          toward its explanation keeps the panel open (no flicker on the way). */}
      <article
        className="rounded-card border border-border bg-background/70 p-4 sm:p-5"
        onMouseLeave={onHoverNone}
        onBlur={onHoverNone}
      >
        <div className="mb-3 flex items-baseline gap-2.5">
          <span className="font-mono text-[11px] text-muted-faint">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h4 className="font-mono text-[13px] font-medium tracking-tight text-foreground">
            {stage.name}
          </h4>
        </div>

        <div className="flex flex-wrap gap-2">
          {stage.nodes.map((node) => {
            const shown = shownId === node.id;
            const NodeIcon = NODE_ICONS[node.type];
            // The ring stays mounted (and visible) on the pinned chip for the
            // whole session — it doubles as the pinned affordance, so pinning
            // never makes the ring vanish abruptly.
            const ringVisible =
              (ringSourceId === node.id || pressedId === node.id) && animate;
            return (
              <motion.button
                key={node.id}
                type="button"
                aria-pressed={pressedId === node.id}
                onMouseEnter={() => onHoverPointer(node.id)}
                onFocus={() => onHoverKeyboard(node.id)}
                onClick={() => onPin(node.id)}
                whileTap={animate ? { scale: 0.96 } : undefined}
                transition={{ duration: 0.12 }}
                className={`relative rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
                  shown
                    ? "border-accent bg-accent-faint text-foreground"
                    : "border-border bg-surface text-muted hover:border-accent/60 hover:text-foreground"
                }`}
              >
                {ringVisible && (
                  <motion.span
                    layoutId={morphId}
                    initial={false}
                    className="pointer-events-none absolute inset-0 rounded-full border-[1.5px] border-accent bg-accent/10"
                    transition={MORPH_SPRING}
                  />
                )}
                <span className="relative inline-flex items-center gap-1.5">
                  <NodeIcon
                    size={13}
                    weight="regular"
                    className={shown ? "text-accent" : "text-muted-faint"}
                  />
                  {node.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {stage.innerLabels.length > 0 && (
          <ul className="mt-3 space-y-1">
            {stage.innerLabels.map((label, i) => (
              <li key={`${label}-${i}`} className="font-mono text-[11px] text-muted-faint">
                ↺ {label}
              </li>
            ))}
          </ul>
        )}

        <AnimatePresence initial={false}>
          {shownNode && (
            <motion.div
              aria-live="polite"
              initial={animate ? { height: 0 } : false}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={animate ? PANEL_TRANSITION : { duration: 0 }}
              className="relative overflow-hidden"
            >
              <div className="relative mt-4 border-t border-border">
                {animate && (
                  <motion.div
                    layoutId={morphId}
                    initial={false}
                    className="absolute inset-x-0 -top-px h-[2px] rounded-full bg-accent"
                    transition={MORPH_SPRING}
                  />
                )}
                {detail}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </article>

      {index < total - 1 && <Connector labels={stage.outLabels} />}
    </motion.li>
  );
}

function Connector({ labels }: { labels: StageGroup["outLabels"] }) {
  return (
    <div className="flex flex-col items-center py-3">
      <div aria-hidden="true" className="flex flex-col items-center">
        <span className="h-7 w-px bg-accent/40" />
        <ArrowDown size={13} weight="bold" className="-mt-0.5 text-accent/70" />
      </div>
      {labels.length > 0 && (
        <ul className="mt-2.5 space-y-1 text-center">
          {labels.map((label) => (
            <li
              key={label.text}
              className="font-mono text-[11px] leading-relaxed text-muted-faint"
            >
              {label.text}
              {label.target && <span className="text-accent/80"> → {label.target}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
