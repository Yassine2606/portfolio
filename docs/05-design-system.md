# 05 — Design system

Status: Locked v1.0 · 27 Oct 2026
Direction: **The engineering dossier** — warm paper, blue-black ink, one vermillion signal, editorial type, evidence in the margin.

---

## Concept

A technical document you can browse. Hairline rules, numbered sections, schematic diagrams, margin notes, generous type. It should feel like the working file of an engineer who documents systems — because that is the claim the site is making.

**Register:** brand. The design is part of the argument.
**Commitment:** restrained surface + one saturated signal. Paper carries ~90% of the page; vermillion appears only where it means something.
**Light-first.** Dark mode is deliberately out of scope for launch (ADR-002).

### Five principles

1. **Paper, not screen.** Warm off-white, blue-black text, no neon, no glass, no glow.
2. **Type does the work.** One display family, one body family, one mono. Scale and spacing create hierarchy, not cards and shadows.
3. **Rules are structure.** 1px lines separate sections, annotate figures, and connect evidence. No decorative borders.
4. **One signal.** Vermillion marks the active thing, the checkable claim, and the primary hover. If everything is accented, nothing is.
5. **Evidence is visible.** The margin note is a first-class layout element, not a tooltip.

### Anti-patterns

No gradients, glassmorphism, blurred orbs, 3D blobs, neon, dark-mode-by-default, purple, rounded 16px cards, drop shadows, tech-logo walls, skill bars, custom cursors, or scroll-jacking.

---

## Colour

All colours are OKLCH. Never use pure `#000` or `#fff`. Never hardcode a colour in a component.

| Token            | OKLCH                         | Approx. hex | Role                                   |
| ---------------- | ----------------------------- | ----------- | -------------------------------------- |
| `--paper`        | `oklch(0.962 0.012 85)`       | `#f6f2ea`   | Page surface                           |
| `--paper-raised` | `oklch(0.985 0.008 85)`       | `#fdfaf4`   | Figures, active panel, one step up     |
| `--ink`          | `oklch(0.205 0.018 265)`      | `#131720`   | Headings, body, primary button         |
| `--ink-soft`     | `oklch(0.36 0.015 265)`       | `#393d45`   | Secondary text, lede                   |
| `--ink-faint`    | `oklch(0.50 0.012 265)`       | `#60636a`   | Labels, metadata, captions             |
| `--line`         | `oklch(0.885 0.012 85)`       | `#ddd9d0`   | Hairline rules, card borders           |
| `--line-strong`  | `oklch(0.80 0.014 85)`        | `#c6c0b4`   | Hover borders, dividers with emphasis  |
| `--signal`       | `oklch(0.585 0.19 33)`        | `#d54023`   | Active marker, large accents, graphics |
| `--signal-text`  | `oklch(0.50 0.17 33)`         | `#af2e13`   | Signal text, link hover, button hover  |
| `--signal-wash`  | `oklch(0.585 0.19 33 / 0.08)` | —           | Active tab background                  |
| `--status`       | `oklch(0.52 0.11 155)`        | `#267b4c`   | Availability dot/text only             |
| `--danger`       | `oklch(0.50 0.17 25)`         | `#b52a1f`   | Form errors only (post-launch)         |

### Contrast (on `--paper`)

| Pair                    | Ratio   | Use                                 |
| ----------------------- | ------- | ----------------------------------- |
| `ink` / `paper`         | 16.06:1 | Body, headings                      |
| `ink-soft` / `paper`    | 9.76:1  | Secondary text                      |
| `ink-faint` / `paper`   | 5.39:1  | Labels, captions                    |
| `signal-text` / `paper` | 5.84:1  | Signal text, hover                  |
| `signal` / `paper`      | 4.10:1  | Large text (≥24px) or graphics only |
| `paper` / `ink`         | 16.06:1 | Primary button                      |
| `paper` / `signal-text` | 5.84:1  | Primary button hover                |
| `status` / `paper`      | 4.68:1  | Availability text                   |

**Rules**

- `--signal` is never body text. Use `--signal-text` for words, `--signal` for graphics and large display accents.
- `--status` green means availability only. Never use it for "success" decoration.
- `--danger` is reserved for errors. It is not a second accent.
- No colour-only meaning: active tabs also change weight and underline; errors also have text and an icon.
- Test every new pair with a contrast checker; document it in the PR.

### CSS tokens

```css
:root {
  --paper: oklch(0.962 0.012 85);
  --paper-raised: oklch(0.985 0.008 85);
  --ink: oklch(0.205 0.018 265);
  --ink-soft: oklch(0.36 0.015 265);
  --ink-faint: oklch(0.5 0.012 265);
  --line: oklch(0.885 0.012 85);
  --line-strong: oklch(0.8 0.014 85);
  --signal: oklch(0.585 0.19 33);
  --signal-text: oklch(0.5 0.17 33);
  --signal-wash: oklch(0.585 0.19 33 / 0.08);
  --status: oklch(0.52 0.11 155);
  --danger: oklch(0.5 0.17 25);
}
```

The live file is `src/app/globals.css`; Tailwind v4 maps these to `bg-paper`, `text-ink`, `border-line`, etc. in `@theme inline`.

---

## Typography

### Families

| Role    | Family                      | Why                                                                                                     | Weights    |
| ------- | --------------------------- | ------------------------------------------------------------------------------------------------------- | ---------- |
| Display | **Bricolage Grotesque**     | Characterful variable grotesque with optical size; confident without being the AI-default Space Grotesk | 500–700    |
| Body    | **Instrument Sans**         | Humanist, high x-height, excellent at 17px for long reading                                             | 400–500    |
| Mono    | **JetBrains Mono**          | Labels, numbers, evidence tags, code; unmistakably technical                                            | 400–500    |
| Accent  | **Instrument Serif Italic** | One or two words in the hero and pull quotes; editorial contrast                                        | 400 italic |

All four are free, variable where possible, and self-hosted through `next/font/google`. Subset Latin. `display: swap`.

**Fallbacks:** display → `"Helvetica Neue", sans-serif`; body → same; mono → `ui-monospace, monospace`; serif → `Georgia, serif`.

**Do not add a fifth family.** No icon fonts.

### Scale

| Token        | Size                               | Line height | Tracking         | Use                           |
| ------------ | ---------------------------------- | ----------- | ---------------- | ----------------------------- |
| `display-xl` | `clamp(3.5rem, 8.2vw, 8.5rem)`     | 0.88        | −0.045em         | Hero H1 only                  |
| `display-l`  | `clamp(2.75rem, 5.4vw, 5rem)`      | 0.92        | −0.04em          | Section openers, 404          |
| `h2`         | `clamp(2rem, 3.6vw, 3.25rem)`      | 0.96        | −0.03em          | Section headings              |
| `h3`         | `clamp(1.375rem, 2vw, 1.75rem)`    | 1.1         | −0.02em          | Case-study subsections, cards |
| `lede`       | `clamp(1.125rem, 1.5vw, 1.375rem)` | 1.5         | 0                | Hero lede, case-study intro   |
| `body`       | `1.0625rem` (17px)                 | 1.62        | 0                | Prose                         |
| `body-s`     | `0.9375rem` (15px)                 | 1.55        | 0                | Captions, UI                  |
| `mono`       | `0.6875rem` (11px)                 | 1.3         | 0.12em uppercase | Labels, section numbers       |
| `mono-s`     | `0.625rem` (10px)                  | 1.3         | 0.08em uppercase | Metadata, tags                |

**Rules**

- Hero H1: 2 lines desktop, 3 lines mobile max; ≤ 7 words.
- H2: ≤ 8 words; no sentence case inconsistency.
- Body measure: 64ch (prose), 68ch (case study), 30ch (evidence notes).
- No all-caps body. No letter-spacing on body.
- Italic is for the serif accent and titles of works only. Never italicize a whole paragraph.
- `text-wrap: balance` on headings; `pretty` on paragraphs.
- Minimum body size 17px desktop, 16px mobile. Never 14px for prose.
- Mono labels are labels, not sentences. Maximum 4 words.

### Type specimen intent

```
AI systems,
with the receipts.        ← Bricolage 600 + Instrument Serif italic, signal-text
```

The contrast between the grotesque and the italic is the brand's voice: technical, then human. Use it once per page, never in every heading.

---

## Layout

### Grid

- Max width `1440px`; page padding 20px mobile, 40px tablet, 40px desktop (content aligns to a 1360px inner grid).
- 12 columns, 24px gutter desktop, 16px mobile.
- Hero: 12 columns; headline spans 9; metadata spans 3.
- Index: 5 columns list + 7 columns panel.
- Case study: 2 columns TOC + 6 columns prose + 3 columns evidence margin + 1 gap at ≥1200. At 1024–1199: TOC collapses to a `<details>` above prose; prose 8 + notes 3. Below 1024: single column; notes inline.
- About: 7 columns prose + 4 columns portrait/meta.
- Work index: flagship 7 columns, secondary stack 5; archive rows full width.

### Spacing

4px base. Use only: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 120, 160.

- Section vertical padding: 80px mobile, 120px desktop.
- Hero top: 64px mobile, 96px desktop; bottom 80/120.
- Space between heading and content: 32/48.
- Space between paragraphs: 1em.
- Card padding: 20px mobile, 24px desktop.
- Rule-to-content: 16px.

No arbitrary margins. If a value is not on the scale, justify it in the PR.

### Density

Airy, not empty. The page should feel like a well-set document: generous margins, tight internal rhythm, no floating cards in a void. One idea per band; no more than three columns of text.

### Radius and elevation

- `--radius-card: 2px` for buttons, cards, figures, inputs.
- `--radius-pill: 999px` for the availability status and tags only.
- No drop shadows. Elevation is a 1px line + `paper-raised`. A figure can sit on a raised surface; it does not float.
- No glass, no blur, no translucent panels.

---

## Components

### 1. Header

- 64px mobile, 72px desktop; paper background; 1px bottom border.
- Name (Bricolage 500, 15px) left; nav (Instrument Sans 14px) right; availability + Resume disclosure.
- Sticky. No blur. Active link: 1px underline + `aria-current`.
- Mobile: monogram + Menu button (44px); full-screen sheet.

### 1b. Resume picker

- A native `<details>` disclosure, not a modal and not `role="menu"`. Four ordinary download links: English/Français × Designed/ATS.
- Trigger uses the button styles (primary in the header, text in the hero). Panel: 22rem wide, 1px border, 2px radius, no shadow (ADR-018), max width `calc(100vw - 2.5rem)`.
- Panel header: `Resume / 04 files` in mono; rows numbered `01–04`, each with language · format, a one-line note, and a download icon. Footer: `One page each · Updated October 2026`.
- Header panel aligns to the trigger's right edge. Hero panel anchors to the CTA row and aligns left with the page margin, so it never slices a stat column mid-word.
- Mobile menu repeats the same four rows inline; there is no second disclosure inside the sheet.
- Escape closes and returns focus to the summary; outside click closes. The disclosure still opens with JavaScript off.
- Short labels: "Designed" / "ATS", not "ATS-friendly optimized for applicant tracking systems".

### 2. Button

| Variant   | Rest                                | Hover                    | Active          | Focus                              |
| --------- | ----------------------------------- | ------------------------ | --------------- | ---------------------------------- |
| Primary   | `ink` bg, `paper` text, 2px radius  | `signal-text` bg         | translate-y 1px | 2px `signal-text` ring, 3px offset |
| Secondary | transparent, 1px `ink` border       | `ink` bg, `paper` text   | translate-y 1px | ring                               |
| Text      | underline, `line-strong` decoration | `signal-text` decoration | —               | ring                               |

- Min height 44px; padding 12px 20px; label 15px/500.
- No icon-only buttons except menu/close/play with accessible names.
- Disabled: 45% opacity, `cursor: not-allowed`, no hover.
- Loading: label + 14px spinner, `aria-busy="true"`, width locked.

### 3. Status

- Pill: 24px height, 1px `line` border, 6px dot `status`, mono 10px uppercase.
- Text: `Available immediately` (or the current confirmed status). Never "available for opportunities".
- On paper, `status` text is 4.68:1; the dot is decorative but paired with text.

### 4. Section heading

```
01 / SELECTED SYSTEMS                              04 CASE FILES
────────────────────────────────────────────────────────────────
```

- Left: mono number + label, 11px uppercase, `ink-faint`.
- Right: optional counter or link.
- 1px rule below; 16px gap to content.
- Not a heading for screen readers unless it is the actual `<h2>`; use a visually hidden `<h2>` if the visible label is decorative. Prefer making the label the `<h2>`.

### 5. The Index (tablist)

**Desktop**

```
01  Documents Assistant        ┌──────────────────────────────┐
    Enterprise RAG · 2026      │  screenshot / schematic      │
02  Sadine Tours               │                              │
    Platform · 3 locales       │  One-line outcome            │
03  Anomaly Detection Agent    │  RAG · pgvector · FastAPI    │
    MCP · 2025                 │  Read case file →            │
04  RFID Access Control        └──────────────────────────────┘
    IoT · 2026
```

- Left rail: 5 columns. Row height 72–88px; 1px `line` between; active row gets a 2px `signal` left border and `signal-wash` background.
- Right panel: 7 columns; `paper-raised`; 1px `line`; 2px radius; 16:10 media; 24px padding.
- Panel transition: 160ms opacity + 4px y; no layout animation. Active marker: 200ms width/position.
- Keyboard: `role="tablist"` vertical; Arrow Up/Down, Home/End; roving tabindex; `aria-selected`; panel `role="tabpanel"` labelled by the tab.
- Mobile: `<details>` accordion or a controlled accordion with one open row; the panel sits under the row; no hover.
- No auto-advance, no carousel, no scroll hijack.

### 6. Project card

- Media 16:10, 1px border, 2px radius; image `object-fit: cover`; caption below.
- Title (h3, 24–28px), one-line problem (15px, `ink-soft`), meta row (role · year), stack tags (max 4).
- Whole card is a link; hover/focus: border `line-strong`, image scale 1.01, arrow moves 4px. No lift, no shadow.
- The link label is the project title; add a visually hidden `Read the case study` if needed.

### 7. Case summary box (60-second contract)

```
┌───────────────┬───────────────┬───────────────┬───────────────┐
│ PROBLEM       │ ROLE          │ CONSTRAINT    │ PROOF         │
│ One sentence  │ Solo · 2026   │ Private data  │ Eval + demo   │
└───────────────┴───────────────┴───────────────┴───────────────┘
```

- `<dl>` with 4 pairs; 1px lines between; no background.
- 4 columns ≥1024; 2×2 tablet; stacked mobile with labels above values.
- Max 18 words per value.
- Sits above the hero image.

### 8. Claim + evidence note (the signature)

```html
<div class="claim">
  <p>
    Answers are verified against retrieved chunks before they stream.
    <sup><a href="#ev-1" id="ev-1-ref">[1]</a></sup>
  </p>
  <aside id="ev-1" class="claim__note" aria-label="Evidence 1">
    <span class="claim__label">Evidence / repo</span>
    <span>ai-service/app/verification/verifier.py</span>
    <a href="…">View source</a>
  </aside>
</div>
```

- Desktop ≥1200: CSS grid `minmax(0, 8fr) minmax(14rem, 3fr)`, 32px gap; note aligns to the top of the claim.
- Mobile: single column; note below with a 2px `signal` left border and `ink-faint` text.
- The marker is a real link; the note has an `id`; add a backlink to the marker in the note (`↩` with accessible name) if the note is long.
- `aria-label` on the note: "Evidence 1: …" or the source title.
- No tooltip-only evidence. No hover requirement.
- Print: notes become footnotes at the end of the section; keep the numbering.

CSS:

```css
.claim {
  display: grid;
  gap: 12px;
  margin-block: 1.5em;
}
.claim__note {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--ink-faint);
  border-left: 2px solid var(--signal);
  padding-left: 12px;
}
@media (min-width: 1200px) {
  .claim {
    grid-template-columns: minmax(0, 8fr) minmax(14rem, 3fr);
    gap: 32px;
  }
  .claim__note {
    border-left: 0;
    padding-left: 0;
  }
}
```

### 9. Metric

- Value: Bricolage 500, 32–40px, `ink`. Unit in 14px `ink-soft`.
- Label: mono 10px uppercase, `ink-faint`.
- Source: 12px `ink-faint` with a link or `Private` label.
- Kind badge: `MEASURED`, `ARTIFACT`, `SCOPE`; mono 9px, 1px border.
- Max 4 per case study; no decorative counters.

### 10. Figure

- `<figure>` + `<figcaption>`; 1px border; 2px radius; `paper-raised`; 8px padding? No, media flush to the border.
- Caption: `FIG. 01` mono + one sentence; redaction note if applicable.
- Image: `next/image`, AVIF/WebP, width/height set, `sizes` correct. No layout shift.
- Lightbox only if it helps inspect UI; if added, focus-trapped dialog with close and arrow keys. Default: link to full-size image.

### 11. Video

- `<video>` with `poster`, `muted`, `playsInline`, `preload="metadata"`, captions (`<track kind="captions">`).
- No autoplay unless the user has not requested reduced motion and the video is ≤ 10s and silent; still provide a pause control.
- Custom controls? Use native controls at launch; style only the wrapper. Accessible and cheap.
- 16:10 or 16:9; max 3MB; lazy-loaded below the fold.

### 12. Architecture diagram

- HTML ordered stages, not a fixed-pixel SVG. Each stage: name, nodes, edge labels.
- Node: 1px border, `paper-raised`, 2px radius, mono type label, 15px name, 13px description.
- Edge: mono 10px label between stages; an arrow glyph (decorative) plus text describing the flow.
- Data flow highlight: 2px `signal` line on the active node only in interactive contexts; static otherwise.
- Provide a text summary before the diagram and a `<details>` "Read the flow as text" after it.
- At 390px: stages stack; no horizontal scroll; no tiny SVG text.
- Never use canvas for diagrams.

### 13. Table of contents

- Desktop: sticky, top 96px, 2-column rail; links 13px; active section gets 1px `signal-text` underline and `ink` weight.
- Mobile: `<details>` "On this page" collapsed by default; links close the details on click.
- `aria-label="On this page"`.
- No scroll-spy jitter: IntersectionObserver with rootMargin `-20% 0px -70%`.

### 14. Mobile menu

- Full-screen paper sheet; header row with name + Close; nav links 28px display; contact links; four resume rows (English/Français × Designed/ATS); availability.
- Focus trap, Escape, return focus, scroll lock.
- 200ms fade + 8px rise; instant reduced motion.

### 15. Contact block

- Headline (display-l), one sentence, email address in 20–24px, Copy button.
- Links: Email, GitHub, Resume (English and French designed files, plus both ATS files in the portal note); 44px targets; external links `rel="me noreferrer"`. Add LinkedIn only when the owner supplies the URL.
- Copy confirmation: `aria-live="polite"`, label changes to "Copied" for 2s.
- No form at launch.

### 16. Footer

- 1px top rule; name + role/location; contact links; colophon; last updated.
- No newsletter, no social icon row without labels.

### 17. Tag

- Mono 10px uppercase, 24px height, 1px border, 2px radius (not pill); max 4 per card.
- Not clickable at launch (no filter pages). If clickable, 44px target.

### 18. Previous / next

- Two columns; each a link with mono label `PREVIOUS CASE FILE`, project name, one-line outcome.
- On mobile, stack; next first? Keep chronological order and label clearly.

---

## Imagery

### Screenshots

- Real UI only. No mockups of features that do not exist.
- 16:10, 2560px wide source, exported AVIF/WebP at 1280/1920.
- Redact names, emails, tokens, client logos, customer data. Use a neutral demo dataset.
- Browser frame: 1px `line`, white paper, no fake macOS traffic lights. A simple URL bar is enough.
- Mobile screens: 9:19.5, 2–3 per project max, in a simple 2px border; no fake device notch.
- Caption every shot with what it shows and what is redacted.

### Diagrams

- Paper background, ink lines, signal only for data flow or the active path.
- Rounded rectangles are 2px; arrows are 1px with a small head; labels in mono.
- One diagram per case study, plus small inline diagrams only if they explain a decision.
- Always pair with a text walkthrough.

### Portrait

- One owner-supplied image, `/about` only. 4:5 crop, warm monochrome filter, paper-matte frame with a 1px border and 8px padding. Caption `Fig. 00 / The person` in mono 9px uppercase.
- Plain `<img>` with a three-width `srcset` (432/648/864), not `next/image`: the component injects an inline `color:transparent` style that the production CSP blocks.
- Alt text: "Portrait of Yassine Ben Romdhane." No "professional headshot of a confident…".
- No stock photo, no AI-generated portrait, no studio backdrop.

### Video

- 60–90 seconds for the flagship, 45 seconds for others.
- 16:10, H.264 MP4 + WebM, poster, captions, no audio at launch.
- Show the real flow; no motion-graphics intro longer than 2 seconds.
- Storyboard: `11-content-templates.md`.

### Prohibited

Stock photography, AI-generated UI, fake dashboards, fake testimonials, client logos without permission, generic abstract 3D renders, gradient mesh backgrounds, emoji as icons.

---

## Iconography

- Inline SVG only; 16/20/24px; 1.5px stroke; `currentColor`; round caps? Use square caps to match the 2px radius.
- Allowed: arrow-right, arrow-up-right (external), download, copy, check, menu, close, play, pause, chevron.
- No technology logos. No icon for every heading. No emoji.
- Decorative icons `aria-hidden="true"`; icon-only buttons need `aria-label`.

---

## Motion

Full spec: `06-motion-and-interaction.md`. Summary:

- Lens: polish for brand surfaces, restraint for reading.
- Durations: 120 / 200 / 320 / 480 / 800ms.
- Ease: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances; `cubic-bezier(0.65, 0, 0.35, 1)` for state.
- Transform and opacity only. No layout animation per frame.
- Reduced motion: no transforms, no autoplay, no view transitions; content appears instantly.

---

## Accessibility requirements baked into the system

- Focus ring: 2px `signal-text`, 3px offset; on `ink` surfaces use 2px `paper` ring.
- Minimum target: 44×44px for primary controls; 24×24px absolute minimum for inline controls (WCAG 2.2).
- Text contrast: all body text ≥ 4.5:1; large text ≥ 3:1; UI borders ≥ 3:1 where they carry meaning.
- Active states use weight + underline + colour, never colour alone.
- Hover content is duplicated on focus and tap.
- Sticky header: `scroll-margin-top: 96px` on anchor targets; focus never hidden behind the header.
- Motion respects `prefers-reduced-motion` at the component level, not only globally.
- Forced colors: solid buttons switch to `ButtonFace`/`ButtonText` with a `Highlight` hover, so Windows High Contrast keeps the label legible.
- Images have meaningful alt text; diagrams have a text alternative; videos have captions.
- No text in images except screenshots (which have captions and alt).

---

## Design QA checklist

- [ ] Every colour comes from a token; no hex in components.
- [ ] Every spacing value is on the 4px scale.
- [ ] Every text style maps to the scale; no one-off font sizes.
- [ ] Contrast verified for every new pair.
- [ ] Focus visible on every interactive element.
- [ ] Hover and focus states match; no hover-only information.
- [ ] 320px, 390px, 768px, 1024px, 1440px, 1920px screenshots reviewed.
- [ ] No horizontal scroll at any width.
- [ ] Reduced motion checked.
- [ ] Print stylesheet for case studies.
- [ ] No anti-pattern from the list appears.
