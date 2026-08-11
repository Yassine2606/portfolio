# AI Engineer Portfolio — Build Plan

Owner: Yassine · Companion to `docs/PRD.md` · Status: Active

Docs map: `docs/PRD.md` (vision + requirements) → this plan (ordered execution) →
`docs/prompts/project-scoping.md` (content contract).

This plan converts the PRD brainstorm into decisive, ordered work. Every phase has an
explicit Definition of Done so a session either finishes a phase or reports precisely why
it didn't. Phases and motion features carry version stamps (`[V1]`/`[V2]`/`[V3]`) so a
session never builds V2 work during a V1 phase.

**How to read this plan:** the **Section spec** below is the canonical description of every
section; phases reference it by row and never restate behavior. Motion values here are
starting points — exact feel is tuned in the browser during Phase 7.

---

## Versions at a glance

| Version | Shipping goal | Phases | What ships |
|---|---|---|---|
| **V1 — Premium Proof** (public launch) | 30-second comprehension + 5-minute conviction, calm restrained motion | 0, 1, 2, 3, 4, 5, 8 | All sections present and polished; interactive architecture diagrams as the signature |
| **V2 — Technical Showcase** | Demonstrate AI systems, not just mention them | 6a, 7, plus `[V2]` rows in the Section spec | AI Systems stage-card diagrams with scrubbed reveal + chip-ring⇄explainer morph, Featured Work card→showcase morph, timeline rotation, Toolbox filtering, Philosophy kinetic line |
| **V3 — Extensions** | Optional depth that must not endanger V1/V2 | 6b | Playground demo, light theme, analytics depth |

Rule: never implement V2/V3 work during a V1 phase; every spec row carries its stamp.

> **Current build state (Aug 2026):** Phases 0–6a are complete and the V2 feature set is
> implemented (morphs, timeline pin, philosophy sweep, toolbox filtering — see decision
> log). Phase 7 is partial (per-section audit still pending), Phase 8 has not been run.
> Remaining known gaps tracked in the decision log: Toolbox cross-linking (V1 row),
> AI Systems lazy-loading, Phase 8 performance gate.

---

## Design read & dials

> Reading this as: an AI-engineer portfolio for technical recruiters, CTOs, and startup
> founders, with a premium + dark-tech + confident language, leaning toward Tailwind v4 +
> Geist + Motion with restrained glass and one accent, every animation motivated.

| Dial | Value | Meaning |
|---|---|---|
| DESIGN_VARIANCE | 6–7 | Asymmetric layouts, editorial type, not chaos |
| MOTION_INTENSITY | 6 | Motivated motion, no cheap bounces |
| VISUAL_DENSITY | 3–4 | Airy, premium whitespace |

## Non-negotiable brand rules (from PRD)

- **Every animation must communicate something.** If it can't answer "what does this
  communicate?", it gets cut.
- **Premium, minimal, technical, confident.** No template feel, no overcrowding, no cheap
  animation, no rainbow colors, no gaming aesthetic.
- **Performance is part of the design. Accessibility is not optional.**
- **One accent color, locked site-wide.** Desaturated (electric blue or emerald). Not
  AI-purple.
- **No pure `#000000` / `#ffffff`.** Off-black base + off-white text.
- **Mobile is not a desktop port.** `min-h-[100dvh]`, touch gestures, reduced animations.
- **Reduced motion is honored globally** (`prefers-reduced-motion`).
- **No skill bars.** Capabilities, not percentages.
- **No invented metrics.** Only real data from the scoping agent's output.
- **No gimmick ships in V1 without a written rationale.** Cursor spotlight, magnetic
  hover, 3D tilt, and typewriter are cut by default; they may return only as `[V3]` items
  with a documented justification.

## Technology

- Next.js 16 (App Router, RSC) + React 19 + TypeScript — installed
- Tailwind CSS v4 (`@tailwindcss/postcss`) — installed
- Motion (`motion/react`) for animation — install in Phase 0; no GSAP in V1 (pinning via
  CSS `position: sticky` + `useScroll`; revisit only if a specific moment can't be done
  without it)
- Fonts: Geist + Geist Mono via `next/font` — installed
- Icons: one library, one family (e.g. `@phosphor-icons/react`), standardized stroke
- Content: `src/content/**` JSON extracted by the scoping agent — no API, no CMS

## Project content pipeline

Real project data is the proof layer of the portfolio. It is produced by an agent running
`docs/prompts/project-scoping.md`, which:

1. Inventories the real repos.
2. Verifies stack from manifests (not vibes).
3. Mines metrics only from evidence.
4. Emits one JSON file per project to `src/content/projects/<slug>.json` against the
   schema in the prompt (slug, links, stack, capabilities, caseStudy, architecture graph,
   results, gallery).

Frontend consumes these JSON files directly at build time. The schema doubles as the
TypeScript types and is validated at build time with zod (`src/lib/content/schema.ts`) so a
bad JSON fails the build, never the runtime.

Fallback if the scoping agent finds fewer than three featured-worthy repos: add open-source
contributions plus a case study of this site itself (free, on-brand content) before
shrinking the showcase.

## Motion system

> Ordering principle for every animation: **communicate → regime → technique → values → fallback.**
> The spec below fixes intent and regime so no section drifts into decorative motion. Exact
> feel (distances, curves) is tuned in the browser during Phase 7, not argued here.

### Global motion tokens

- Default ease: `cubic-bezier(0.16, 1, 0.3, 1)` (exit ease). Springs (`stiffness: 120`,
  `damping: 20`) only for micro/physics feel.
- Durations: micro 120–200ms (hover/focus/active) · section reveal 400–600ms ·
  choreography 700–1000ms.
- Stagger between siblings: 50–80ms.
- Reveal distance: `y: 16–32px`. No dramatic slides; premium = restraint.
- Only `transform` and `opacity` animate. Never `top/left/width/height`.
- No custom mouse cursors. No pure `#000` glows. Max 1 marquee per page (likely none).

### Scroll regimes (the vocabulary)

| Regime | What it is | Tool | Where it belongs |
|---|---|---|---|
| **Reveal** | Content enters when mostly visible, fires once | Motion `whileInView` + `viewport={{ once: true, amount: 0.2–0.3 }}` | Default for all content blocks |
| **Parallax** | Layer moves at a different speed than scroll (scrubbed offset) | `useScroll` + `useTransform` | Backgrounds / decorative depth only; max a few on the page |
| **Pinned / scrubbed** | Progress tied to a scroll range; element is choreographed (draws, rotates, pans) | `useScroll` on a ref + `useTransform` + CSS `position: sticky`; no GSAP in V1 | Reserved for the page's 2–3 "moments", V2+ |
| **Micro** | Hover / focus / active / tap feedback | Motion values (never `useState`) + CSS | Interactive elements |

**Threshold discipline:** reveals fire at `amount: 0.2–0.3` (element mostly on screen),
`once: true`, never `amount: 0`. This is what "threshold" means in this plan.

**Rotation mid-scroll** is a pinned/scrubbed technique used deliberately and only at
`[V2]`: the active timeline node rotates/scales as it crosses the viewport center (a "you
are here" moment). Nothing else rotates on scroll; AI nodes do not orbit.

### Morphing (state transitions)

Morphing is **not** a scroll regime — it is a shared-element technique (Motion `layoutId`)
used only to show one element *becoming* another. Rule: if it doesn't communicate "this is
now that", it doesn't morph. **Morphing is `[V2]`.** The fallbacks below are the `[V1]`
spec; a morph ships only if it survives a performance + accessibility review. Confined to 3
moments:

| Where | What morphs | What it communicates |
|---|---|---|
| **Featured Work** | Project card → case-study dialog: the card's title crosses into the dialog header (shared `layoutId`); the grid never reflows | "This card is that project" |
| **AI Systems** | Service chip ring ⇄ explainer accent line (shared `layoutId`); view-morph between RAG / multi-agent / MCP is **not shipped** — only one RAG project exists (see decision log) | "This service is the system that answers" |
| **Toolbox** | Active filter pill slides/morphs between categories | "This filter is selected" (same family as the nav indicator) |

Never used in: hero, hero identity, nav logo, or any purely decorative shape.

**V1 fallbacks (the default spec):** Featured Work = plain fade dialog; AI Systems =
panel opens beneath the stage; Toolbox = active pill via CSS. The morph replaces its
fallback only in V2 and only where it passes the gate above.

### Reduced motion & mobile LOD (canonical, applies to every section)

- `prefers-reduced-motion: reduce` → parallax = static, pinned/scrubbed = static or
  instant, reveals = opacity-only fade (no y), no magnetic/tilt, no infinite loops.
  Implemented with `useReducedMotion()` + a CSS gate on infinite/decorative animations.
- Mobile (<768px): no parallax, no pinned/scrub (timeline/AI collapse to reveals +
  still-interactive), particle/canvas counts capped, `will-change` only on live layers.

## Section spec

The canonical description of every section. Phases reference rows here and never restate
behavior. Regimes and fallbacks follow the Motion system above; `[V2]` rows are not built
during V1.

| Section | Layout | Motion regime | Key interactions | Fallback |
|---|---|---|---|---|
| **Nav** `[V1]` | Full-bleed transparent bar at rest → **floating glass pill** once scrolled: glass + hairline + shadow fade in via scrubbed opacity only; the pill geometry (height 72→56, ~1rem side insets, floating top margin, `max-w-6xl`) switches once per scroll threshold via Motion `layout` spring — no layout property animates per frame. Pill is `md+` only, so the mobile dropdown always anchors to the constant full-width bar. Reduced motion: instant toggle, static bar | Active-section marker slides with `layoutId`; link underline grows; smooth scroll | Static chrome; indicator still works |
| **Hero** `[V1]` | Split: left = copy (headline ≤2 lines, subtext ≤20 words, 2 CTAs), right = **labeled RAG pipeline diagram** (QUERY → RETRIEVE → RANK → ANSWER + VECTOR DB satellite; glass chips, HUD dot field) | **One choreographed entrance, not a generic stagger**: eyebrow → headline words reveal through per-word masks (blur→sharp, 45ms apart) → subtext → CTAs → meta; rails draw `pathLength` 0→1, chips spring-pop, then the scene stays alive: emerald data packets travel the rails forever (SMIL `animateMotion`, zero JS per frame), the ANSWER node breathes, rails brighten on hover. Cursor parallax holds the whole diagram ±14px (`useMotionValue`+`useSpring`); primary CTA is magnetic; one-shot scan line sweeps the hero top after the headline lands. The diagram is viewport-contained (right-anchored `right-4`, height-driven sizing — no negative offsets, no bleed) and hidden below `md`. Scrubbed exit as before | Magnetic + gloss-sweep CTA; hover brightens rails; reduced-motion → instant static content, no packets/pulse/parallax/scan | Static content; simple fade-out |
| **Featured Work** `[V1]` | Asymmetric grid; featured project gets the most prominent treatment | Reveal stagger (`amount: 0.2`); `[V2]` the card's title morphs into a responsive case-study dialog via `layoutId` (fallback = plain fade dialog) | Opens a dialog: bottom sheet on mobile, centered modal on desktop; interactive architecture diagram; hover cross-links | Pure fade reveals |
| **Engineering** `[V1]` | Capability clusters in an asymmetric grid | Reveal stagger | Hover highlights cross-links to projects (shared accent) | Pure fade |
| **Timeline** `[V1]` | Vertical line, alternating events | Events reveal at threshold; `[V2]` pinned moment #1: line draws top→bottom scrubbed to `scrollYProgress` (**desktop-only** via `useMediaQuery`; mobile keeps the static rail + still-interactive events), active node rotates 45° (square→diamond) and scales as it crosses the center band | Expandable event details | Static line, fade reveals |
| **AI Systems** `[V1]` | Stage-card pipeline: nodes grouped into ordered `stage` cards, edges as connector labels between stages | `[V1]` static-but-interactive; `[V2]` pinned moment #2: stages light up top-to-bottom scrubbed to scroll (desktop-only; reduced-motion → static), chip ring ⇄ explainer line morph on hover/pin | Hover/pin a service chip → explanation expands beneath the stage; Escape unpins | Static stage cards, still fully interactive |
| **Toolbox** `[V1]` | Grouped technologies, cross-linked to projects | `[V1]` grouped list; `[V2]` filterable, items re-flow with `layout` animation, active pill slides between categories | Hover reveals usage context + related projects | No filter animation, still functional |
| **Philosophy** `[V1]` | Editorial manifesto, large type | `[V1]` reveal; `[V2]` one kinetic device: scrubbed word/line highlight | — | Static, plain lines |
| **Contact** `[V1]` | Closing statement + one CTA | Reveal; CSS caret blink | CTA | Static CTA |

Loading: hero load sequence only — no fake full-page loader. Smooth scroll is enabled
site-wide (`scroll-behavior` with `prefers-reduced-motion` gate).

## Phases

### Phase 0 — Foundation [V1]

**Goal:** everything that makes later phases fast and consistent: decisions locked, stack
verified, real content in the repo.

- Lock design tokens: palette (off-black + one accent + neutrals), type scale, spacing,
  radii (one scale), shadows, glass spec, motion tokens (durations, easings).
- Verify/install stack: Motion, icon library; confirm Tailwind v4 + fonts + eslint and that
  Next 16 + React 19 + Motion are compatible before any motion work starts.
- Set up folder structure: `src/components/{ui,sections,canvas,motion}`, `src/content`,
  `src/lib`, `src/hooks`. Motion primitives (`Reveal`, `Parallax`, `Pin`) live in
  `src/components/motion` so the regimes are built once and reused.
- Write CSS variables (semantic tokens) so light mode is a later swap.
- Write the zod schema at `src/lib/content/schema.ts` and validate every content JSON at
  build time.
- Run the scoping agent on the real repos → `src/content/projects/*.json`.
- Author site copy (hero, philosophy, toolbox, contact) as `src/content/site.json` and
  check it against the above-the-fold test from Success criteria — copy is a deliverable,
  not an afterthought.
- Capture project screenshots into `public/projects/<slug>/`.

**Done when:** tokens documented and wired; all project JSON present, factual, parseable,
and schema-validated; site copy authored.

### Phase 1 — Shell & Navigation [V1]

**Goal:** the whole page scrolls with real layout, content-driven, before any polish.

- Global background system (base gradient + fixed noise overlay + subtle ambient light).
- Sticky glass nav: shrinks while scrolling, current-section indicator, smooth scroll,
  single line at desktop, mobile menu.
- All 8 sections (Hero, Featured Work, Engineering, AI Systems, Timeline, Toolbox,
  Philosophy, Contact) as typed, content-driven skeletons with real rhythm.
- Baseline semantics: landmarks, headings order, focus-visible states.

**Done when:** full scroll structure renders from content JSON; nav works; keyboard
navigable; no `h-screen` anywhere (`min-h-[100dvh]`).

### Phase 2 — Hero [V1]

**Goal:** answer who / what / why in one viewport, and open with a signal of engineering.

- Split/asymmetric layout (anti-center), large editorial type, animated identity.
- Copy: name, role, one-sentence mission, current focus, availability.
- Restrained pipeline visual (Canvas/SVG) as the hero's signature motif — the same
  node/edge language used by the architecture diagrams. No heavy 3D, no custom cursor, no
  spotlight.
- Primary + secondary CTA; load sequence (staggered, 300–600ms, shared easing).

**Done when:** hero fits initial viewport; subtext ≤ 20 words; CTAs visible without scroll;
60fps; collapses to static under reduced motion.

### Phase 3 — Featured Work [V1]

**Goal:** the strongest proof, shown with full depth.

- Case-study cards → dedicated showcase per project (overview, problem, solution,
  architecture, implementation, results, lessons).
- Interactive architecture diagram component (shared with AI Systems later).
- Reveal-on-scroll, hover exploration, expandable details. Showcase opens as an expandable
  panel (the `[V2]` morph's fallback is the V1 behavior).
- Real metrics from JSON only; `featured` projects get the most prominent treatment.

**Done when:** all projects render from JSON; diagram is accessible and explainable;
motion audit passes for this section.

### Phase 4 — Engineering & Toolbox [V1]

**Goal:** prove breadth without clichés.

- Engineering: capability clusters (Frontend / Backend / AI / ML / Cloud / DevOps /
  Databases / Tooling), each with experience, projects-used-in, related technologies.
- Toolbox: grouped list of technologies with usage context and related-project links
  (filtering is `[V2]`).

**Done when:** zero percent/skill bars; toolbox ↔ project cross-linking works; accessible.

### Phase 5 — Timeline, Philosophy & Contact [V1]

**Goal:** complete the narrative and close the action.

- Timeline: vertical reveal timeline (no pin/rotation in V1), expandable events, links.
- Philosophy: manifesto section explaining how software gets built (architecture, code
  quality, AI-assisted dev, performance, accessibility).
- Contact: one CTA intent ("Get in touch") used consistently in nav, hero, and footer;
  email + LinkedIn + GitHub + resume.

**Done when:** full page complete; one contact label site-wide; CTA contrast ≥ WCAG AA.

### Phase 6a — AI Systems [V2]

**Goal:** demonstrate AI systems, not just mention them.

- Interactive pipeline diagrams for RAG (plus multi-agent/MCP once such a project exists)
  built on the Phase 3 diagram component; in V1 these are static-but-fully-interactive.
- Services grouped into ordered `stage` cards — the `stage` field is explicit content
  metadata (`architectureNodeSchema`), not rank-derived — with edge labels read as mono
  connector lines between stages; hovering or pinning a service chip expands its
  explanation beneath the stage (height + fade, `AnimatePresence`).
- `[V2]` pinned moment #2: stages light up top-to-bottom scrubbed to `scrollYProgress`
  (desktop-only via `useMediaQuery`; reduced-motion → static), and the chip ring morphs
  into the explainer's accent line (shared `layoutId`, `useId`-scoped per diagram).
- **Not shipped:** the diagram "draws itself" edge-dash scrub, the data-flow pulse, and
  the view-morph between system shapes. The section now renders three real systems —
  RAG (documents-assistant), speech/LLM pipeline (transcriptosense), MCP agent
  (anomaly-detection-agent) — filtered by AI-systems capability, one diagram per
  project; see the decision log.

**Done when:** wow works on mobile and desktop; reduced-motion safe; lazy-loaded and under
the JS budget (≤ 60KB gz of interactive JS for this module).

> **Tracker (Aug 2026):** diagrams ship, but the module is **not** lazy-isolated — all
> sections load in the initial bundle (whole page ≈ 150 KB gz, at the V1 total budget).
> The 60 KB module budget is unmeasurable until code-splitting exists; tracked in Phase 8.

### Phase 6b — Playground [V3]

**Goal:** one simulated, client-side demo that teaches a real concept.

- One client-side playground demo (no API, no keys): e.g. RAG/document-QA or a
  prompt→pipeline visualizer. Loading/empty/error states.

**Done when:** self-contained, lazy-loaded, under the JS budget, reduced-motion safe.

### Phase 7 — Motion polish [V2]

**Goal:** refine, then cut.

- Walk the per-section spec table above section by section and confirm each animation
  answers "what does this communicate?" — remove the rest.
- Verify every section honors its regime, thresholds, and reduced-motion fallback; no
  section drifted into decorative motion.
- Tune distances and curves in the browser against the motion tokens (Phase 0 values are
  the starting point, not the argument).
- Micro-interactions: tactile `:active` (`scale-[0.98]`), hover/focus states via motion
  values (never `useState`).
- Loading sequence, page transitions, empty/error states.

**Done when:** no decorative motion remains; all motion uses transform/opacity; springs
have a shared ease (`cubic-bezier(0.16, 1, 0.3, 1)` default).

### Phase 8 — Quality gate [V1]

**Goal:** launch-grade, verified.

- Performance budget: LCP < 2.5s, INP < 200ms, CLS < 0.1, 60fps; code-splitting, lazy
  loading, image optimization; interactive JS ≤ 150KB gz total (V1), with the AI Systems
  module counted against its own 60KB budget.
- Lighthouse ≥ 90 on perf/a11y/best-practices/SEO; keyboard + screen-reader + contrast
  (AA) audit.
- SEO + Open Graph; analytics (Vercel Analytics or Plausible).
- Mobile-first pass; light-mode token swap smoke test (dark is primary).
- Walk the PRD success criteria: 30-second comprehension, 5-minute conviction.

**Done when:** all budgets green and the success-criteria walkthrough passes.

## Risks & fallbacks

1. **Thin repos.** The pitch rests on 3–5 evidence-backed projects. If the scoping agent
   finds fewer than three featured-worthy repos, add open-source contributions and a case
   study of this site itself before shrinking the showcase.
2. **Copy quality.** The 30-second criterion is won or lost on hero and manifesto copy.
   Copy is authored and reviewed in Phase 0/1 against the above-the-fold test — not left to
   implementation.
3. **`layoutId` morphing** is fragile and can cause scroll jumps. It is V2-only and gated
   on a performance + accessibility review; the fallbacks are the V1 spec. As of V2 it has
   shipped in three features — Featured Work card→showcase, AI Systems chip ring ⇄
   explainer line, Toolbox filter pill — each with `useId`-scoped `layoutId`s so separate
   instances on one page never cross-morph.
4. **Second animation runtime.** No GSAP in V1. Pinning uses CSS `position: sticky` +
   Motion `useScroll`. Revisit only if a specific moment can't be done without it.
5. **Framework churn.** Next 16 + React 19 + Motion compatibility is verified in Phase 0
   before any motion work starts.

## Scope rails

**In scope:** all phases above; the scoping prompt file.
**Explicitly out (defer to V3 / never):** real API playgrounds, sound, light theme rollout,
blog/talks, certificates, localization, most Easter eggs (max 1–2 cheap ones), portfolio
chatbot.
**Cut from PRD:** skill bars, custom mouse cursors, heavy 3D, rainbow/gaming aesthetics,
cursor spotlight, magnetic hover, 3D tilt, typewriter.

## Success criteria (from PRD)

A recruiter understands within 30 seconds: what kind of engineer, what problems they
solve, technical depth, strongest projects, engineering philosophy, how to contact.
Within 5 minutes they should be convinced this person builds production-quality AI
software with strong product and engineering instincts.

**V1 proxy — the above-the-fold test:** the hero alone answers who / what / why and shows
how to proceed, without scrolling. This is the measurable version of "30 seconds".

## Decision log

Record of notable calls. Revisit only with a written reason.

- **V1 motion = reveal + micro + gentle parallax.** No pinned moments, no morphs, no
  spotlight / tilt / magnetic / typewriter. Premium comes from restraint.
- **No GSAP in V1.** CSS `position: sticky` + `useScroll` covers pinning.
- **Engineering = capabilities ("what I do"); Toolbox = technologies ("what I use").**
  Toolbox is a grouped, cross-linking list in V1; filtering is V2.
- **Morphing is V2-only**, gated on performance + accessibility review; fallbacks are the
  V1 spec.
- **Philosophy is a section, not a nav link** — discovered by scrolling. Revisit if
  analytics show it's never seen.
- **Playground is V3**, after the core page proves itself.
- **The pipeline node/edge motif is the signature** — reused across hero, section
  dividers, and architecture diagrams so the page is recognizable without branding.
- **Architecture diagrams ship as stage cards (Aug 2026).** The fixed-pixel SVG graph
  (~1772px wide for documents-assistant) forced horizontal scrolling and truncated edge
  labels. Nodes are now grouped into ordered `stage` cards driven by explicit `stage`
  metadata in the schema, edges read as mono connector labels between stages (with the
  jump target named when an edge skips stages), and the layout is fully responsive.
  dagre and `src/lib/graph-layout.ts` were removed with the SVG.
- **The "view morphs between RAG / multi-agent / MCP" row is not built.** The morph
  itself (one diagram pivoting between system views) is still not implemented — the AI
  Systems section stacks one diagram per project instead. The *content* gap that made it
  impossible is closed: the section now ships three real AI systems (documents-assistant
  = RAG, transcriptosense = speech/LLM pipeline, anomaly-detection-agent = MCP +
  tool-calling agent), and the section filter was widened from RAG-only to any
  AI-systems capability (RAG, Multi-Agent, MCP, LLM Pipelines, Embeddings, Tool
  Calling). A view-switcher morph is a possible future nicety, not a correctness fix.
- **V2 shipped in-sequence with the V1 sections (Aug 2026).** The three morphs (Featured
  Work, AI Systems chip ring, Toolbox pill), timeline pin, philosophy sweep, and toolbox
  filtering are all live. Phase 7 is now an audit of those, not a build phase. Revisit
  only with written reason.
- **Hero entrance is one choreographed timeline (Aug 2026).** Replaced the flat
  container-stagger with hand-timed layers: masked per-word headline reveal
  (blur→sharp, `[0.16,1,0.3,1]` at 900ms), then subtext/CTAs/meta at 1.15–1.5s;
  the pipeline SVG draws in (paths `pathLength` 0→1 at 0.55s+, nodes spring-pop
  1.0s+) and then only breathes (halo pulse + ±6px orbit drift, transform/opacity
  loops, nothing paint-heavy). Continuous layers are `useMotionValue`/`useSpring`
  (cursor parallax ±14px, magnetic primary CTA ±35%), never `useState`. Every
  layer collapses to static under reduced motion; blur appears exactly once at
  the entrance and never again. The gloss-sweep CTA is a `group-hover` translate
  (transform-only) inside the button, not a clip/repaint loop.
- **Hero diagram is a live RAG pipeline (Aug 2026).** The abstract diamond was
  replaced by a labeled stage diagram, matching the pattern award-winning AI
  sites use (Contiant's transaction flow, Tobiko's product diagram, AI71's data
  streams): glass chips QUERY → RETRIEVE → RANK → ANSWER with a VECTOR DB
  satellite, rails that draw in (`pathLength`), and emerald data packets
  traveling the rails in a perpetual loop via SMIL `animateMotion` — zero JS or
  paint cost per frame. The ANSWER node breathes; rails brighten on hover.
- **Hero viewport containment + word spacing (Aug 2026).** The old diagram used
  `right-[-10%]`, which pushed ~10% of the artwork past the viewport edge.
  Now it is right-anchored at `right-4` and sized by height so it can never
  bleed (verified: `scrollWidth === clientWidth` at 768/1024/1440, no
  text overlap; hidden below `md`). The masked headline words lost their spaces
  when wrapped in `inline-block` masks — `inline-block` spans containing only a
  space character collapse to zero width — fixed by rendering a plain text-node
  space between word spans (the classic inline-block gap technique; keeps
  wrapping and `text-balance` intact).
- **Nav shrink is transform-only (Aug 2026).** Replaced the per-scroll-frame `height`
  scrub. The nav is now a full-bleed transparent bar at rest that becomes a
  **floating glass pill** once scrolled: the glass fades in (`opacity` scrub only),
  and the geometry (72→56 height, ~1rem insets, top lift, `max-w-6xl`) toggles once
  per scroll threshold with a Motion `layout` spring — nothing layout-related
  animates per frame. The pill only applies at `md+`, so the mobile dropdown always
  anchors to the constant full-width bar. Under reduced motion the switch is
  static and instant.
- **Timeline pin is desktop-only (Aug 2026).** The scrubbed line draw and node
  rotation are gated behind `useMediaQuery("(min-width: 768px)")`; mobile keeps the
  static rail per the mobile LOD rule. The active-node rotate is a square→diamond 45°
  — a previous attempt rotated a circle, which was visually equivalent to nothing.
- **AA fixes (Aug 2026):** `--muted-faint` was raised to `#75817a` (dark) / `#5f6d66`
  (light) so the faintest text passes 4.5:1 on every surface it renders on. Featured
  Work case studies now manage focus: `autoFocus` the Close, Escape to close, focus
  returns to the card's open button.
- **Known open items (Aug 2026):** Toolbox still lacks the V1 cross-linking row
  (usage context + related-project links — filtering shipped, cross-links pending);
  AI Systems lazy-loading not implemented; Phase 8 performance/audit gate not yet
  run; project screenshots/gallery (Phase 0/3 deliverable) not captured.
- **Featured Work case studies are a dialog, not an inline expand (Aug 2026).**
  The old inline showcase forced the card to span the grid (`col-span-2`), reflowing
  the whole section on open/close. Now a card opens a responsive dialog (bottom sheet
  on mobile, centered modal on desktop) while the grid itself never changes: the card's
  title is the shared element (`layoutId`) that crosses into the dialog header, the
  backdrop dims the source card, and both directions animate. The dialog traps
  focus, closes on Escape / backdrop click / Close, locks page scroll while open,
  and returns focus to the card's button on close. Reduced-motion = plain fade,
  no morph. The `V1` "plain expand" fallback row in the section spec is superseded
  by the plain fade dialog.
