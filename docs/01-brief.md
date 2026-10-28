# 01 — Brief

Status: Locked v1.0 · 27 Oct 2026 · Owner: Yassine
This document decides what the portfolio is for, who it serves, and what "good" means. Every other doc inherits from it.

---

## One line

A recruiter-facing portfolio that proves Yassine builds production AI systems end to end — and shows the evidence for every claim.

## Why this exists

The old portfolio already lists the work. The new one has to do a harder job: make a hiring manager believe, in under five minutes, that Yassine can own an AI product from problem to production.

That means the site is not a gallery of screenshots and it is not a personal blog. It is a **hiring argument** with four exhibits:

1. **Proof** — four systems, documented with architecture, decisions, tradeoffs, and evidence.
2. **Method** — how he works when the demo stops being enough.
3. **Range** — AI, backend, frontend, infrastructure, product context.
4. **Invitation** — one obvious way to start a conversation, plus a CV picker that is one click away.

If a page does not help one of those four jobs, it does not ship.

---

## Audience

Weighted deliberately: design for the person who can assess depth, while keeping the gatekeeper's five-second scan effortless.

| Priority  | Audience                   | Time on site | What they need to decide                                 | What wins                                                      |
| --------- | -------------------------- | ------------ | -------------------------------------------------------- | -------------------------------------------------------------- |
| 1 (60%)   | Hiring manager / tech lead | 3–10 min     | "Can this person own a system like ours?"                | Judgment, tradeoffs, evidence, honest limits                   |
| 2 (25%)   | Recruiter / talent partner | 20–90 sec    | "Does the role, location and stack fit? Is the CV here?" | Clear title, availability, stack keywords, one-click CV picker |
| 3 (15%)   | Founder / CTO              | 2–5 min      | "Can they ship end to end without hand-holding?"         | Scope of ownership, shipped outcomes, speed                    |
| Secondary | Engineer peer              | 2–10 min     | "Would I learn from this person?"                        | Architecture depth, code links, clear writing                  |

### What each audience must never have to guess

- **Recruiter:** role, seniority, location/timezone, availability, work authorization, stack, CV, contact.
- **Hiring manager:** what was built, by whom, under what constraints, what broke, what was measured.
- **Founder:** where the person starts and stops — AI only, backend too, frontend too, deployment too.
- **Peer:** whether the architecture is real or decorative.

---

## Positioning

**Category:** applied AI engineer with full-stack range.

**Positioning statement (internal, not site copy):**

> For teams that need AI features to survive real users, Yassine is the engineer who owns the system end to end — retrieval, backend, interface, reliability — and shows the evidence behind every claim.

### Three differentiators

1. **End-to-end ownership.** Not "I write prompts." Retrieval, APIs, data models, UI, containers, failure handling — one person who can hold the whole path.
2. **Reliability-first AI.** Verification, provider failover, monitoring, honest failure. The unglamorous part that decides whether an AI feature ships.
3. **Evidence-based storytelling.** Claims trace to artifacts. Private work is labeled, not invented. Unmeasured results say "not measured."

### What this is not

- Not a "passionate AI enthusiast" page.
- Not a ChatGPT-wrapper showcase.
- Not a design agency site where the owner disappears behind the aesthetic.
- Not a 3D experience that takes eight seconds to load.
- Not a blog, a newsletter, or a playground at launch.
- Not a list of every technology touched since 2021.

---

## Success tests

The site passes only if real people pass these tests. Run them in Phase 7 with 5 participants who hire or work with engineers.

### 5-second test (clarity)

Show the home page for five seconds, then hide it. Ask:

1. What does this person do?
2. Where are they based / are they available?
3. What would you click first?

**Pass:** 4/5 say "AI engineer" (or close), 4/5 mention availability or location, 4/5 choose work or CV. **Fail:** anyone says "designer", "student", or cannot find the CV.

### 30-second test (proof)

Ask them to find evidence that this person has shipped production AI. Observe, do not help.

**Pass:** they open a case study and can name one system and one technology without scrolling the whole page.

### 2-minute test (judgment)

Ask them to explain one tradeoff from a case study.

**Pass:** they can say what was chosen, what was rejected, and why. **Fail:** the case study is a feature list.

### 5-minute test (conviction)

Ask a hiring manager: "Would you interview this person for an AI engineering role? What would you ask first?"

**Pass:** yes, with a specific technical question. **Fail:** "maybe", or questions only about the visual design.

### Interview-question test (content quality)

If the site does not provoke a single technical interview question, the content is too generic. Every case study should make a reviewer want to ask about one decision.

### Technical and content gates

- WCAG 2.2 AA; axe: 0 critical/serious.
- LCP ≤ 1.8s lab on mobile 4G; field p75 ≤ 2.5s.
- INP ≤ 200ms; CLS ≤ 0.05.
- First-load JS ≤ 120KB gzipped.
- Lighthouse ≥ 95 on all four categories, mobile.
- Every featured project has at least one real screenshot and one source for every metric.
- Zero broken links or dead buttons.
- The CV picker is reachable in one click from every page; the chosen file downloads in one more.

Full gates: `10-quality-gates.md`.

---

## Aesthetic direction

**Register:** brand. Design is part of the argument; it is not a neutral container.

**Concept:** _The engineering dossier._ A technical document you can browse: warm paper, blue-black ink, hairline rules, numbered sections, schematic diagrams, margin notes. It should feel like the working file of someone who documents systems — because that is the claim.

**One extreme, committed:** editorial-technical, light, typographic, evidence-first. Not "dark AI startup".

### Why light, not dark

Every AI portfolio is dark with a neon accent. A warm paper dossier is immediately different, easier to read for long case studies, prints well, and signals confidence rather than mood. It also makes the evidence margin legible. Dark mode is a later enhancement, not a launch requirement.

### The unforgettable thing

**The evidence margin.** Every checkable claim can carry a marker; the source sits beside it in the margin — a repo path, a benchmark, a screenshot, or an explicit `private / not measured` note. On mobile the note sits under the claim. It is CSS-only, accessible, and it makes the site's philosophy visible instead of stated.

The hero's **Index** is the visual delivery: four systems, keyboard-switchable, each with a one-line outcome and a path into the case file.

### Anti-direction (auto-reject)

- Inter, Roboto, Arial, system fonts as display.
- Purple-blue gradients on white or black.
- Glassmorphism cards, blurred neon orbs.
- A 3D blob, particles, or a WebGL hero.
- Centered hero with heading + subhead + two pills and no evidence.
- Skill bars, percentage bars, logo walls without context.
- Custom cursors, scroll-jacking, autoplay audio, fake loaders.
- "Passionate", "innovative", "cutting-edge", "seamless", "10x".
- Stock photography, fake dashboards, invented testimonials.

---

## Scope

### Launch (v1)

| Route          | Purpose                                                                                 |
| -------------- | --------------------------------------------------------------------------------------- |
| `/`            | Narrative home: hero + Index, selected work, method, experience, about preview, contact |
| `/work`        | All work: four featured case files + three archive cards                                |
| `/work/[slug]` | Four deep case studies                                                                  |
| `/about`       | Full profile, experience, stack, education, availability                                |
| `/resume.pdf`  | English designed one-page CV; FR and ATS variants also shipped                          |
| `/404`         | Useful recovery page                                                                    |

**Content:** four featured projects (Documents Assistant, Sadine Tours, Anomaly Detection Agent, RFID Access Control) and three archive cards (Wave, TranscriptoSense, Data Drift).

**Interaction:** the Index, evidence margin, sticky case-study figures, mobile menu, copy-email. Nothing else.

**Infrastructure:** static-first Next.js, Vercel, cookieless analytics, sitemap, OG images, JSON-LD.

### Explicitly out (launch)

- Blog, notes, newsletter, RSS.
- Interactive playground or live chatbot.
- Dark mode toggle.
- WebGL / Three.js / custom cursor / sound.
- Standalone Toolbox, Philosophy, Engineering, or AI Systems sections.
- Testimonials, client logos, "trusted by".
- CMS, i18n, auth, database.
- Contact form (email first; revisit only if data says otherwise).

### Later (only after launch proves itself)

- HTML resume page in addition to PDF.
- A fifth case study (Wave) if app visuals are strong.
- One interactive proof: a RAG retrieval demo on a synthetic corpus.
- Dark mode as a token swap.
- Notes / writing, only with three real posts.

---

## Constraints

- **Solo build, part-time.** Content is the critical path, not code.
- **Private client work.** Capgemini, Sadine, RFID, and Wave need permission or anonymization. No screenshots of client data, names, or internal URLs.
- **No invented evidence.** No benchmark, user count, latency number, or testimonial without a source.
- **Zero paid services required** except a domain. Resend free tier is acceptable if a form is added later.
- **Real devices.** Test on a mid-range Android and an iPhone, not only a desktop browser.
- **Accessibility is not a phase.** Every component ships keyboard-accessible and reduced-motion safe.

---

## Non-negotiables

1. The five-second answer: AI engineer, location, availability, proof, CV.
2. A recruiter can reach the CV picker from any page in one click and download the chosen file in a second.
3. Every featured project has a real visual and a truthful evidence line.
4. Every metric has a source, a date, and a method — or it is removed.
5. Reading works without JavaScript; interaction is enhancement.
6. WCAG 2.2 AA and the performance budgets in `08-quality-standards.md`.
7. No dead links, no disabled-looking buttons, no "coming soon" in production.
8. Private work is labeled private; it is never faked.
9. One visual language: paper, ink, signal, rules, type. No decorative drift.
10. The site itself is a case study in craft: fast, accessible, maintainable, documented.

---

## Owner inputs (blocking)

Answer these before Phase 1. They are repeated in `docs/README.md` and the roadmap.

- [x] Availability: immediate, no notice period (resolved 27 Oct 2026).
- [x] Work modes: remote, hybrid, or on-site; open to relocation (resolved 27 Oct 2026).
- [x] Work authorization: visa sponsorship required outside Tunisia (resolved 27 Oct 2026).
- [ ] What Capgemini allows: architecture, screenshots, metrics, name, logo.
- [ ] Permission for Sadine, RFID, Wave visuals; redaction rules.
- [ ] Demo plan for the flagship: hosted synthetic corpus, recorded walkthrough, or both.
- [ ] LinkedIn URL, preferred contact channel, phone policy for the public CV.
- [ ] Domain choice.
- [ ] Languages and proficiency labels.
- [ ] Role priority and target companies (for copy emphasis, not name-dropping).
- [x] Portrait — resolved 28 Oct 2026: one owner-supplied image on `/about` only.

---

## Definition of done for the brief

- This document is signed off by Yassine.
- The 5-second and 30-second tests are scheduled with 5 real participants.
- Every open owner input above has an answer or an explicit "decide later" with a date.
- The four featured projects are confirmed against the evidence backlog in `03-content-strategy.md`.
