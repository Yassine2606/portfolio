# 04 — Information architecture

Status: Locked v1.0 · 27 Oct 2026
Companion: `01-brief.md`, `03-content-strategy.md`, `05-design-system.md`
Principle: **three clicks to any proof, one click to the CV.**

---

## Sitemap

```
/                         Home — the argument in five sections
/work                     All work — 4 featured case files + 3 archive cards
/work/documents-assistant Flagship case file
/work/sadine              Featured case file
/work/anomaly-detection-agent
/work/rfid-access-control
/about                    Profile, experience, stack, availability
/resume.pdf               ATS-safe one-page CV
/404                      Recovery page
/sitemap.xml              Generated
/robots.txt               Generated
```

No `/contact` page. Contact is a section on `/` and a link in the header/footer. Fewer routes, less friction.

### Why dedicated case-study routes

The old site opened case studies inside a modal on one page. That is good for browsing and bad for everything else: no shareable URL, no search result, no link preview, no way to send a specific case study to a hiring manager. Each case file gets a real URL, metadata, OG image, JSON-LD, and a place in the sitemap.

The home page earns the click. The case file closes the argument. They are different jobs.

---

## Navigation

### Header (all pages)

```
┌──────────────────────────────────────────────────────────────────────┐
│ Yassine Ben Romdhane        Work   About        ● Open to roles  Resume│
└──────────────────────────────────────────────────────────────────────┘
```

- Height 64px mobile / 72px desktop. Paper background, 1px bottom rule. No blur, no glass.
- Left: full name on desktop; `YBR` monogram on mobile. Links home.
- Center/right: **Work**, **About**, **Contact** (anchor on home, mailto elsewhere).
- Availability: a small green dot + text, hidden below 1024px to protect space. The status is repeated in the hero on mobile.
- **Resume** is a button, not a nav link. Always visible at `md+`; inside the mobile menu at small sizes.
- Active page: 1px underline + `aria-current="page"`. On the home page, the section in view is underlined (IntersectionObserver, no scroll listener).
- Sticky. Never hides on scroll; the CV must stay reachable. If a sticky header covers an anchor target, use `scroll-margin-top: 96px`.

### Mobile menu

- Trigger: "Menu" text + 2-line icon, 44px target. Label changes to "Close" with `aria-expanded`.
- Full-screen paper sheet, 200ms fade + 8px rise; instant under reduced motion.
- Contents: Work, About, Contact, Email, GitHub, Resume (primary button), availability line.
- Focus trap while open; Escape closes; focus returns to the trigger; body scroll locked.
- No hover-only content.

### Footer

```
Yassine Ben Romdhane                         Email · GitHub · LinkedIn · Resume
AI engineer · Monastir, Tunisia (CET+1)
Open to AI roles · Remote-friendly
Set in Bricolage Grotesque, Instrument Sans, JetBrains Mono.  Last updated Oct 2026.
```

- Contact links repeat here for visitors who read to the end.
- No newsletter, no social icons without labels, no "made with ♥".
- Colophon is a craft signal, not a paragraph.

---

## Home page

### Job

Answer who / what / why / next in one viewport, then hand the visitor to a case file.

### Section order

| #   | Section       | Job                                                   | Primary action                |
| --- | ------------- | ----------------------------------------------------- | ----------------------------- |
| 1   | Header        | Identity, nav, CV                                     | Resume                        |
| 2   | Hero          | Role, positioning, availability, proof teaser         | Read the case files           |
| 3   | The Index     | Four systems; the signature interaction; visual proof | Open a case file              |
| 4   | How I work    | Three principles, each linked to evidence             | Open the supporting case file |
| 5   | Experience    | Recency and scope without a full CV                   | Download CV                   |
| 6   | About preview | Human context and range                               | Read more                     |
| 7   | Contact       | One obvious conversation starter                      | Email                         |
| 8   | Footer        | Repeat links, colophon                                | —                             |

That is five content sections, not eight. The old Toolbox, Engineering clusters, Philosophy, and Timeline sections are folded into the case files, the method section, and `/about`.

### Desktop wireframe (1440)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Yassine Ben Romdhane            Work  About           ● Open to roles  Resume│
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  AI ENGINEER · MONASTIR, TUNISIA · CET+1                                     │
│                                                                              │
│  AI systems,                                                                 │
│  with the receipts.                                     [ availability card ] │
│                                                                              │
│  I own the whole path: retrieval, backend, interface,                       │
│  and the reliability work that keeps it honest.                             │
│                                                                              │
│  [ Read the case files ]   [ Download CV ]                                  │
│                                                                              │
│  ── 4 systems · 2025–26 ─────────────────────────────────────────────────    │
├──────────────────────────────────────────────────────────────────────────────┤
│  01 / SELECTED SYSTEMS                                        [ 4 case files ]│
│                                                                              │
│  01  Documents Assistant          │  ┌────────────────────────────────────┐  │
│      Enterprise RAG · Capgemini   │  │  real screenshot / schematic       │  │
│  02  Sadine Tours                 │  │                                    │  │
│      Platform · 3 locales         │  │  Outcome line                      │  │
│  03  Anomaly Detection Agent      │  │  [ Read case file → ]              │  │
│      MCP · tool calling           │  └────────────────────────────────────┘  │
│  04  RFID Access Control          │                                          │
│      IoT · realtime               │                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│  02 / HOW I WORK                                                             │
│  Evidence over claims        Reliability is the feature     Measure first    │
│  → flagship case file        → anomaly case file            → RAG eval       │
├──────────────────────────────────────────────────────────────────────────────┤
│  03 / EXPERIENCE                                                             │
│  2026  Capgemini Engineering — AI/RAG platform (PFE)                         │
│  2026  Sadine Tours — platform · RFID — access control                       │
│  2025  YBInnovations — Wave                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│  04 / ABOUT                                                                  │
│  Short bio · portrait (optional) · stack strip · [ More about me → ]         │
├──────────────────────────────────────────────────────────────────────────────┤
│  05 / CONTACT                                                                │
│  "Let's build something that survives production."                           │
│  [ Email ]  [ Copy address ]  [ GitHub ]  [ LinkedIn ]                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Mobile wireframe (390)

```
┌──────────────────────────────┐
│ YBR                 Menu     │
├──────────────────────────────┤
│ AI ENGINEER · MONASTIR       │
│ ● Open to AI roles           │
│                              │
│ AI systems,                  │
│ with the receipts.           │
│                              │
│ I own the whole path …       │
│                              │
│ [ Read the case files ]      │
│ [ Download CV ]              │
│                              │
│ 01 / SELECTED SYSTEMS        │
│ ┌──────────────────────────┐ │
│ │ 01 Documents Assistant   │ │
│ │    Enterprise RAG        │ │
│ ├──────────────────────────┤ │
│ │ 02 Sadine Tours          │ │
│ ├──────────────────────────┤ │
│ │ 03 Anomaly Detection     │ │
│ ├──────────────────────────┤ │
│ │ 04 RFID Access Control   │ │
│ └──────────────────────────┘ │
│ [active row expands into     │
│  screenshot + outcome]       │
│                              │
│ 02 / HOW I WORK              │
│ …                            │
└──────────────────────────────┘
```

### Hero spec

- Eyebrow: `AI engineer · Monastir, Tunisia · CET+1`.
- H1: **AI systems, with the receipts.** Two lines on desktop; the second line in Instrument Serif italic, signal colour. Five words.
- Lede: one sentence, ≤ 32 words: owns the whole path; retrieval, backend, interface, reliability.
- CTAs: primary **Read the case files** (anchor to the Index); secondary **Download CV**.
- Metadata strip: availability, focus, last shipped. No fake metrics.
- Availability card on desktop: a real status, not a decorative badge. Include role types and remote preference; update when it changes.
- No portrait in the hero. The work is the hero.

### The Index spec

- Section heading: `01 / Selected systems`, counter `04 case files`.
- Left: vertical tab list, 4 rows. Each row: number, project name, one-line descriptor, year.
- Right: tab panel with a real screenshot or schematic, a one-line outcome, the stack (max 4), and `Read case file →`.
- Desktop: hover and focus switch the panel; click opens the case file. Keyboard: Up/Down, Home/End; roving tabindex; `aria-selected`; panel labelled by tab.
- Mobile: accordion, one row open at a time; the panel stacks under the row. No hover dependency.
- No auto-rotation. Ever. The user controls it.
- Without JavaScript: all four panels render stacked, each with its link. The tab behaviour is enhancement.

### How I work

Three principles, each a claim with a link to the case study that proves it:

1. **Evidence over claims** → the flagship's measured eval.
2. **Reliability is the feature** → the anomaly agent's failure handling.
3. **Measure before you scale** → the RAG eval / drift monitoring.

Each principle: 1 headline, 2 sentences max, one evidence link. No icons unless they add meaning.

### Experience

Four rows maximum on the home page. Role, company/context, one line of scope, year. Link to `/about` for the full version.

- Capgemini Engineering — AI/RAG platform (PFE), 2026.
- Sadine Tours — travel platform, 2026.
- RFID access control — independent, 2026.
- YBInnovations — Wave, 2025.
- Wardrobe — ongoing (confirm whether it belongs here or only on `/about`).

**Owner input:** exact titles, dates, and whether Capgemini is a PFE/internship or employment. Do not guess.

### About preview

100–140 words + optional portrait + a stack strip (6–10 tools, not 30). Link to `/about`.

### Contact

- Headline: "Let's build something that survives production."
- One sentence: role types, location/remote.
- Email as a visible address + Copy button (`aria-live` confirmation).
- GitHub, LinkedIn, Resume.
- No form at launch. No "contact me" that opens a mail client with no context.

---

## Work index `/work`

### Job

Give a recruiter every project in one scan, and give a hiring manager a fast path to the four deep files.

### Layout

```
01 / WORK
Four systems, documented end to end. Every claim has a source.

FEATURED
┌───────────────────────────────┬───────────────────────────────┐
│ Documents Assistant  (large)  │ Sadine Tours                  │
│ screenshot                    │ screenshot                    │
│ one-line outcome + stack      │ one-line outcome + stack      │
├───────────────────────────────┼───────────────────────────────┤
│ Anomaly Detection Agent       │ RFID Access Control           │
└───────────────────────────────┴───────────────────────────────┘

ARCHIVE
Wave — campus app, 2025 — private, overview on request →
TranscriptoSense — multilingual speech, 2025 — GitHub →
Data Drift — ML monitoring, 2025 — GitHub →
```

- Featured cards: image, title, one-line problem, role/year, 3–4 stack tags, outcome, link.
- Flagship card spans 7 columns on desktop, the other three fill a 5-column stack or a 2×2 below. No uniform 3-column grid.
- Archive rows: title, one line, year, link (GitHub or `Private — overview on request`). No thin pages.
- No filters. Seven projects do not need filtering; filters hide work.

---

## Case study `/work/[slug]`

### Job

In 60 seconds: what it is, what was hard, what shipped, proof. In 10 minutes: architecture, decisions, failures, and judgment.

### Layout (desktop 1440)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ header                                                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Home / Work / Documents Assistant                                            │
│                                                                              │
│ Documents Assistant                                                          │
│ A conversational RAG agent that cites its evidence.                          │
│                                                                              │
│ ┌──────────────┬──────────────┬──────────────┬──────────────┐                │
│ │ PROBLEM      │ ROLE         │ CONSTRAINT   │ PROOF        │                │
│ │ answer …     │ Solo · 2026  │ private …    │ eval + demo  │                │
│ └──────────────┴──────────────┴──────────────┴──────────────┘                │
│                                                                              │
│ [ hero screenshot / 16:10 ]                                                  │
├────────────┬──────────────────────────────────────┬──────────────────────────┤
│ ON THIS    │ Context                              │ EVIDENCE MARGIN          │
│ PAGE       │ …                                    │ [1] repo path            │
│            │                                      │                          │
│ Context    │ Problem & constraints                │ [2] benchmark            │
│ Problem    │ …                                    │                          │
│ Architecture│ Architecture                        │                          │
│ Decisions  │ [diagram]                            │                          │
│ Evidence   │ …                                    │                          │
│ Reliability│ Decisions & tradeoffs                │                          │
│ Outcome    │ …                                    │                          │
│ Next       │                                      │                          │
│            │ Evidence                             │                          │
│            │ [figure] [figure]                    │                          │
│            │ …                                    │                          │
│            │ Outcome / What I'd do differently    │                          │
├────────────┴──────────────────────────────────────┴──────────────────────────┤
│ ← Previous case file                          Next case file →              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Section spec

| Order | Section                 | Content                                                | Visual                |
| ----- | ----------------------- | ------------------------------------------------------ | --------------------- |
| 1     | Header                  | Title, tagline, 60-second summary box, hero screenshot | 16:10                 |
| 2     | Context                 | Why the system existed; the user; the setting          | optional small figure |
| 3     | Problem & constraints   | The hard part; what could not change                   | constraint list       |
| 4     | Architecture            | One diagram + plain-language walkthrough               | designed diagram      |
| 5     | Decisions & tradeoffs   | 3–5 decisions: choice, alternative, why, cost          | comparison table      |
| 6     | Evidence                | Screenshots, demo video, metrics with sources          | 3–6 figures           |
| 7     | Reliability             | Failure modes, detection, fallback, what still breaks  | table/list            |
| 8     | Outcome                 | What changed; measured vs expected; honest limits      | metric strip          |
| 9     | What I'd do differently | 2–3 concrete changes                                   | text                  |
| 10    | Next case file          | Prev/next + back to work                               | cards                 |

- Word budget: flagship 1,800–2,400; featured 1,200–1,800. Cut anything that does not help a hiring decision.
- Sticky TOC on desktop (≥1200): 3-column rail, active section underline. On mobile: a `<details>` "On this page" at the top, collapsed by default.
- Evidence margin: 2–3 column right rail matching claims to sources. At <1200, notes stack under the claim.
- Every image has a caption that states what the reader is looking at and what is redacted.
- Every metric has a source link or a visible `source` line.
- The 60-second box is above the hero image; a visitor can stop there and still know the outcome.

### Metadata per case study

- Title: `Documents Assistant — Production RAG with cited answers | Yassine Ben Romdhane` (≤ 60 chars before the brand if possible).
- Description: 140–160 chars, problem + outcome + stack.
- OG image: 1200×630, project name + one-line outcome + the dossier frame, generated from the same tokens.
- JSON-LD: `CreativeWork` with `author`, `dateCreated`, `keywords`, `url`.
- Canonical URL.

---

## About `/about`

### Job

Human context and the full record, for the visitor who already believes the work.

### Sections

1. **Intro** (120–180 words): who, where, what kind of systems, what he cares about. No life story.
2. **What I'm looking for**: role types, remote/relocation, availability. One short paragraph.
3. **Experience**: Capgemini, Sadine, RFID, YBInnovations, Wardrobe (confirm titles/dates). Each: role, context, 1–2 lines, link to the case file.
4. **Education**: ESPRIM, engineering cycle, 2021–2026. No course list.
5. **Stack**: grouped by use, each group 4–8 items, with links to projects where used. No logos.
6. **Languages**: Arabic, French, English (confirm levels).
7. **Portrait** (optional): one candid image, 4:5, natural light, no suit, no stock. Alt text: "Yassine Ben Romdhane".
8. **Contact**: same block as home.

No "fun facts", no "my journey", no "I fell in love with code at 12".

---

## 404

- Headline: "This page is not in the dossier."
- One sentence: the link may be old or the case study is still in the evidence sprint.
- Links: Home, Work, Resume.
- Status code 404, no redirect to home (bad for SEO and confusing).

---

## User journeys

### Recruiter, 20 seconds, mobile

Header → name + role in hero → availability → CV button in menu → done. If they stay: Index row 01 → case file summary box → back.

**Requirement:** the CV is reachable without scrolling and without opening a desktop-only control.

### Hiring manager, 5 minutes, desktop

Hero → Index → flagship → 60-second box → Architecture → Decisions → Evidence → What I'd do differently → next case file.

**Requirement:** the case file must be readable in one column with a sticky TOC; no modal, no horizontal scroll, no "read more" truncation.

### Founder, 2 minutes

Hero → How I work → Experience → About → Contact.

**Requirement:** ownership and availability must be explicit before the contact section.

### Engineer peer, 10 minutes

Case file → architecture diagram → code/demo links → previous/next → GitHub.

**Requirement:** every technical claim links to something checkable, or is labeled private.

### Return visitor

`/work` directly → newest case file. The work index must be a real page, not an anchor on the home page.

---

## Content hierarchy

- One `<h1>` per page.
- Section headings are `<h2>`; subsections `<h3>`; never skip a level.
- Section numbers (`01 /`) are text, not images, and are hidden from screen readers only if they duplicate the heading (they do not; keep them).
- The 60-second summary is a `<dl>` (problem, role, constraint, proof), not four divs.
- The Index is a tablist; the evidence margin is a series of claim/note pairs; the case-study TOC is a nav landmark.
- Links use descriptive text; never "click here".
- Images: alt text describes the UI or the diagram's meaning; decorative lines are `aria-hidden`.

---

## URL and redirect rules

- Lowercase, hyphenated slugs: `documents-assistant`, `anomaly-detection-agent`, `rfid-access-control`.
- No dates in case-study URLs; the project page is evergreen.
- Trailing slash off; canonical without it.
- Old site is a single page; the only asset to preserve is `/resume.pdf`. If the domain changes, 301 the old origin to the new one.
- If a case study is unpublished, return 404 and remove it from the sitemap; do not redirect to `/work` (search engines treat that as a soft 404).

---

## Internal linking rules

1. Every home Index row links to its case file.
2. Every case file links to the next case file and back to `/work`.
3. Every metric/evidence note links to its source when public.
4. Every stack group on `/about` links to a project where the tool is used.
5. Every mention of a project in the experience section links to its case file.
6. The header `Work` link goes to `/work`, not `/#work`.
7. No orphan pages: `/about`, `/work`, and every case file are reachable from the header or footer.

---

## Definition of done for IA

- [ ] Every route has a single job and a primary action.
- [ ] The CV is reachable in one click from every page (header or menu).
- [ ] The home page fits the five-section order and does not duplicate `/work`.
- [ ] Every case study has a real URL, metadata, OG image, and JSON-LD.
- [ ] Mobile has no hover-only content and no horizontal scroll at 320px.
- [ ] The 404 is useful and returns a 404 status.
- [ ] Sitemap includes `/`, `/work`, `/about`, and every published case file; excludes 404 and `/resume.pdf` (or includes the PDF with a low priority if desired).
