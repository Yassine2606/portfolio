# 06 — Motion and interaction

Status: Locked v1.0 · 27 Oct 2026
Companion: `05-design-system.md`, `08-quality-standards.md`
Rule: **if motion cannot answer "what does this communicate?", it does not ship.**

---

## Lens

| Surface                                 | Lens             | Why                                                |
| --------------------------------------- | ---------------- | -------------------------------------------------- |
| Home hero, Index, case-study headers    | **Polish**       | Brand surfaces: choreographed, measured, confident |
| Case-study reading, evidence, TOC       | **Restraint**    | The reader is working; motion must not interrupt   |
| Index panel switch, small hover details | **Play (light)** | One moment of personality, never a bounce          |

No scroll-jacking, no parallax, no pinning, no custom cursor, no 3D, no autoplay audio. The site is fast and the content is the spectacle.

**No animation runtime at launch.** Hero entrance, hovers, reveals and page transitions are CSS. The Index and mobile menu use small React state islands and CSS transitions. If a future interaction genuinely needs layout animation, add Motion to that island only and measure it against the JS budget (ADR-006).

---

## Tokens

```css
:root {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 120ms;
  --dur-ui: 200ms;
  --dur-overlay: 320ms;
  --dur-reveal: 480ms;
  --dur-scene: 800ms;
  --stagger: 50ms;
  --rise-ui: 8px;
  --rise-reveal: 16px;
}
```

| Value | Use                                            |
| ----- | ---------------------------------------------- |
| 120ms | Hover, underline, colour, copy confirmation    |
| 200ms | Index marker, mobile menu, small state changes |
| 320ms | Overlay, panel, figure reveal                  |
| 480ms | Section reveal (once)                          |
| 800ms | Hero choreography, total                       |

- Entrances use `--ease-out-expo`; reversible state uses `--ease-in-out`.
- No spring bounce. If a spring is ever used, max 4% overshoot.
- Stagger 40–60ms, max 6 siblings.
- Distances: 8px for UI, 16px for reveals, 24px for hero lines.
- Only `transform` and `opacity`. Never `height`, `width`, `top`, `left`, `filter`, `box-shadow`, or `background-position` per frame.

---

## Per-surface spec

| Surface                                      | Motion                                                                                  | Duration                                 | Reduced motion                    |
| -------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------- |
| Header active underline                      | width/position of a 1px underline                                                       | 120ms                                    | Instant                           |
| Hero eyebrow → H1 lines → lede → CTAs → meta | H1 lines clip-reveal (translateY 24px, no opacity 0); other elements 8px rise + opacity | 500–650ms, 60–80ms stagger, total ≤900ms | All content visible; no transform |
| Index active row                             | 2px signal marker slides; row background fades                                          | 200ms                                    | Instant                           |
| Index panel switch                           | 4px rise + opacity 0→1; image static                                                    | 160ms in, 120ms out                      | Instant swap                      |
| Index image hover                            | scale 1.01                                                                              | 240ms                                    | None                              |
| Project card hover/focus                     | border colour, arrow 4px, image 1.01                                                    | 160–240ms                                | Colour only, no transform         |
| Evidence note target                         | background wash on `:target`                                                            | 120ms                                    | Same                              |
| Case-study figure reveal                     | 8px rise + opacity, once, when 20% visible                                              | 320ms                                    | No transform; instant             |
| Sticky TOC active                            | underline/weight                                                                        | 120ms                                    | Instant                           |
| Mobile menu                                  | opacity + 8px rise; backdrop none                                                       | 200ms                                    | Instant                           |
| Resume disclosure                            | 4px rise + opacity 0→1; no height animation                                             | 160ms in                                 | Instant                           |
| Copy email                                   | label swap + check                                                                      | 120ms                                    | Same                              |
| Page transition                              | 180ms cross-fade (CSS view transitions)                                                 | 180ms                                    | Disabled                          |
| 404                                          | None                                                                                    | —                                        | —                                 |

No section "reveal on scroll" on the home page except the case-study figures. The home page is not a slideshow; it is a document.

---

## The Index interaction

### Behaviour

- Desktop: a vertical tablist. Hovering a row previews it; clicking a row navigates to the case file. Focus also previews. The active row has a 2px signal marker and a light wash.
- The panel shows a real screenshot or schematic, a one-line outcome, max four stack tags, and `Read case file →`.
- Mobile: an accordion. One row open; the panel is under the row; the whole row is the trigger. No hover.
- No auto-rotation. No carousel. No separate "view all" that hides the four items.

### Accessibility

- `role="tablist"` with `aria-orientation="vertical"`.
- Each tab: `role="tab"`, `aria-selected`, `aria-controls`, `id`, roving `tabindex` (0 for active, −1 for others).
- Panel: `role="tabpanel"`, `aria-labelledby`, `tabindex="0"` only if it contains scrollable content.
- Keys: Arrow Up/Down, Home, End; Enter/Space activates (or navigation on click).
- The tab label contains the project name; the panel's link is the only navigation in the panel.
- No-JS fallback: all panels rendered stacked with their links. The tab JS is progressive enhancement.
- Do not move focus into the panel on hover; only on keyboard activation if the panel is a true tab panel. Prefer navigation on click to keep behaviour predictable.

### Visual

- Rows separated by 1px `line`; no card backgrounds except the active row wash.
- Active marker: 2px × row height, `signal`, left edge.
- Panel: `paper-raised`, 1px `line`, 2px radius, 24px padding, 16:10 media.
- The panel must not change height between projects; reserve space with `aspect-ratio` and fixed text slots.

---

## The evidence margin interaction

This is not a tooltip. It is a layout that keeps the source next to the claim.

- Claim and note are separate DOM nodes in reading order: claim first, note second.
- Markers are real links to the note (`href="#ev-n"`), with an accessible name.
- On wide screens, the note sits in the right rail aligned to the claim.
- On narrow screens, the note stacks under the claim with a 2px signal left border.
- `:target` highlights the note for 1.2s with a `signal-wash` background; no scroll animation.
- If the note is a link, it opens in a new tab only for external sources, with `rel="noreferrer"` and an external-link icon + visually hidden text.
- Print: notes render as footnotes at the end of the section.

No hover reveal, no popover, no JS. The source is always in the DOM.

---

## Page transitions

Use cross-document view transitions as progressive enhancement:

```css
@view-transition {
  navigation: auto;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 180ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

@media (prefers-reduced-motion: reduce) {
  @view-transition {
    navigation: none;
  }
}
```

- Only a fade. No slide, no shared-element morph at launch.
- No transition on the first load.
- If the browser does not support it, navigation is instant.
- Do not add a JS router transition that delays content.
- Do not use `view-transition-name` on the same element twice; if a shared element is added later, scope IDs per page.

---

## Hero entrance

- CSS keyframes, server-rendered content, no JS.
- H1 lines are clipped by an `overflow: hidden` wrapper and translate from 24px to 0. **Do not animate H1 opacity from 0** — the H1 is the LCP element; keep it painted.
- Order: eyebrow 0ms, H1 line 1 at 60ms, line 2 at 130ms, lede 220ms, CTAs 300ms, meta 360ms. Total under 900ms.
- The animation is `animation-fill-mode: both`, so the final state holds. If CSS fails, content is visible.
- Disable under `prefers-reduced-motion: reduce` and when `navigator.connection.saveData` is true (a small inline check adds a class before paint, or use a CSS-only `@media (prefers-reduced-data: reduce)` where supported).
- No blur, no per-character split, no typewriter.

```css
@media (prefers-reduced-motion: no-preference) {
  .hero-line {
    animation: line-rise 560ms var(--ease-out-expo) both;
  }
  .hero-line:nth-child(2) {
    animation-delay: 70ms;
  }
}
@keyframes line-rise {
  from {
    transform: translateY(24px);
  }
  to {
    transform: translateY(0);
  }
}
```

---

## Scroll reveals

Use CSS scroll-driven animations only where supported, and only for case-study figures:

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal {
      animation: reveal-rise linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 30%;
    }
  }
}
@keyframes reveal-rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- If `animation-timeline` is unsupported, content is visible with no animation.
- Never use `amount: 0` or hide content that is already in the viewport.
- Do not reveal every paragraph; only figures and major blocks.
- No `IntersectionObserver` scroll listeners on the home page.

---

## Sticky elements

- Case-study TOC and figure rail use `position: sticky; top: 96px;` — no JS.
- The sticky element must not cover focus targets; `scroll-margin-top: 96px` on headings.
- On mobile, sticky is disabled; the TOC becomes a `<details>`.
- Sticky is not pinning: the content continues to scroll; the figure stays for the length of its section.
- Test at 768px height (laptop) and 390px (phone).

---

## Hover and focus

- Hover and focus-visible share the same visual state (border, underline, arrow). Hover alone is never the only way to discover information.
- No magnetic buttons, cursor followers, or 3D tilt.
- Button press: `translateY(1px)` for 80ms, then return. No scale.
- Links: underline appears/grows 120ms; colour shifts to `signal-text`.
- Images: scale 1.01 inside an `overflow: hidden` frame; no layout shift.
- Touch: no sticky hover states; use `@media (hover: hover)`.

---

## Video

- No autoplay at launch. Poster + play button. If a short silent loop is added later: `muted`, `playsInline`, `loop`, `preload="none"`, and a pause control; disabled under reduced motion.
- Captions always (`.vtt`), even for silent walkthroughs with on-screen text.
- No audio track at launch.
- `preload="metadata"`; lazy-load below the fold with `loading="lazy"` on the poster or a click-to-load facade.
- Max 3MB; 16:10; H.264 + WebM.

---

## Reduced motion

`prefers-reduced-motion: reduce` means:

- No transform animations; opacity changes ≤150ms or instant.
- Hero content appears immediately; no clip reveal.
- Index switches instantly; no panel rise.
- Mobile menu opens instantly.
- Resume disclosure opens instantly, with no rise.
- No scroll-driven reveals; all content visible.
- No view transitions.
- No video autoplay; native controls only.
- No smooth scroll (`scroll-behavior: auto`).
- Hover colour changes still work; they are not motion.

Implement with a global media query for the baseline, plus component-level checks where CSS cannot express the behaviour (e.g., Index state). Test on macOS, iOS, Windows, and Android.

---

## Performance rules

1. Animate only `transform` and `opacity`.
2. No layout reads in a frame loop. No `requestAnimationFrame` loops.
3. No `will-change` on more than 2 elements at once; remove it after the animation if set via JS.
4. No `filter: blur` animation; no large box-shadow animation.
5. No scroll listeners; use CSS or IntersectionObserver.
6. No animation library in the initial bundle. If one is added later, lazy-load the island and measure.
7. No animation that blocks LCP or delays text paint.
8. Test at 4× CPU throttle and Slow 4G; the page must remain usable.
9. Respect `prefers-reduced-data` where supported; otherwise check `navigator.connection.saveData` once for video.
10. Record a Performance panel trace for the home page and one case study before launch.

---

## Gotchas

| Gotcha                                            | Fix                                                                |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| H1 at `opacity: 0` delays LCP                     | Animate transform only; keep text painted                          |
| Hidden content in SSR that never reveals          | Content visible by default; animation is additive                  |
| `overflow: hidden` on a section clips focus rings | Add padding or use `overflow: clip` with care; test keyboard focus |
| Sticky header covers anchor targets               | `scroll-margin-top` on headings                                    |
| View transitions duplicate IDs                    | Scope `view-transition-name`; do not share names across pages      |
| iOS `100vh` jumps                                 | Use `100dvh`, never `100vh`                                        |
| Autoplay video fails on iOS                       | `muted` + `playsInline`; still provide controls                    |
| Hover-only evidence                               | Notes are always in the DOM; hover is optional                     |
| `prefers-reduced-motion` misses JS state          | Component checks for the Index/menu; not CSS-only                  |
| Motion causes layout shift in tabs                | Reserve panel height with `aspect-ratio` + fixed text slots        |

---

## Motion QA

- [ ] Every animation answers "what does this communicate?"
- [ ] No animation on the LCP element's opacity.
- [ ] Reduced motion: no transforms, no autoplay, no view transitions, no smooth scroll.
- [ ] Keyboard: Index tabs, mobile menu, video controls, copy button.
- [ ] 60fps on a mid-range Android with 4× CPU throttle.
- [ ] No long task > 200ms during load.
- [ ] No CLS from the Index panel, fonts, images, or sticky elements.
- [ ] No horizontal scroll at 320px.
- [ ] Hover and focus states match.
- [ ] View transitions disabled under reduced motion and absent on first load.
