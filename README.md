# Portfolio v2 — Yassine Ben Romdhane

A recruiter-facing portfolio for an AI engineer. The site is a hiring argument, not a gallery: four production systems, documented end to end, with the evidence attached to every claim.

**Status:** docs locked, scaffold running, evidence sprint next.
**Design direction:** engineering dossier — warm paper, blue-black ink, one vermillion signal, editorial type, evidence in the margin.
**Tagline:** _AI systems, with the receipts._

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (validates content once MDX lands)
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run format     # prettier
```

Copy `.env.example` to `.env.local` before working on metadata or the contact path.

---

## What is in this repo

| Path                 | What it is                                                                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/`              | The complete plan: brief, research, content, IA, design, motion, architecture, quality, roadmap, gates, templates, decisions, evidence ledger |
| `src/app/`           | Next.js App Router shell, tokens, placeholder home, 404, favicon                                                                              |
| `src/content/work/`  | Case studies (MDX) — empty until the evidence sprint                                                                                          |
| `src/components/`    | Components — built in Phase 3–4                                                                                                               |
| `public/`            | Resume PDF and case-study media                                                                                                               |
| `.github/workflows/` | CI — added in Phase 2                                                                                                                         |

This is a new, standalone git repository. The previous portfolio at `../` stays untouched and is the reference for real project content.

---

## Documentation map

Read in order the first time. After that, use it as a working reference.

| #   | Document                                                                     | What it decides                                                      |
| --- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 00  | [`docs/README.md`](docs/README.md)                                           | Status, ownership, how to use the docs                               |
| 01  | [`docs/01-brief.md`](docs/01-brief.md)                                       | Audience, positioning, success tests, scope, aesthetic commitment    |
| 02  | [`docs/02-recruiter-research.md`](docs/02-recruiter-research.md)             | Who visits, how they scan, what convinces them, what repels them     |
| 03  | [`docs/03-content-strategy.md`](docs/03-content-strategy.md)                 | Project selection, evidence standard, content gaps, proof backlog    |
| 04  | [`docs/04-information-architecture.md`](docs/04-information-architecture.md) | Routes, page specs, wireframes, journeys, navigation                 |
| 05  | [`docs/05-design-system.md`](docs/05-design-system.md)                       | Palette, type, grid, components, imagery, tokens                     |
| 06  | [`docs/06-motion-and-interaction.md`](docs/06-motion-and-interaction.md)     | Motion lens, the Index, the evidence margin, reduced motion          |
| 07  | [`docs/07-technical-architecture.md`](docs/07-technical-architecture.md)     | Stack, rendering, content model, folder structure, CI, deployment    |
| 08  | [`docs/08-quality-standards.md`](docs/08-quality-standards.md)               | Accessibility, performance, SEO, security, content quality           |
| 09  | [`docs/09-build-roadmap.md`](docs/09-build-roadmap.md)                       | Phases, tasks, estimates, dependencies, launch criteria              |
| 10  | [`docs/10-quality-gates.md`](docs/10-quality-gates.md)                       | Pre-launch gates, manual test scripts, sign-off                      |
| 11  | [`docs/11-content-templates.md`](docs/11-content-templates.md)               | Case-study skeleton, copy worksheets, resume bullets, scoping prompt |
| 12  | [`docs/12-decision-log.md`](docs/12-decision-log.md)                         | Why the big calls were made; when to revisit                         |
| —   | [`docs/evidence-ledger.md`](docs/evidence-ledger.md)                         | Claim-to-source ledger; every checkable statement gets a row         |
| —   | [`docs/prompts/project-scoping.md`](docs/prompts/project-scoping.md)         | Agent prompt that turns a repo into an evidence-backed case study    |

---

## The rules that do not move

1. **Every checkable claim has a source.** Repo path, commit, benchmark, screenshot, or an explicit "private / not measured" label.
2. **The five-second test wins.** Name, role, availability, strongest work, next action — before any cleverness.
3. **Real work, real screens.** No stock photos, fake dashboards, invented metrics, or unnamed "confidential" projects used as decoration.
4. **Reading is the product.** Motion never delays content; no scroll-jacking; reduced motion is a first-class mode.
5. **Quality is measured.** WCAG 2.2 AA, Core Web Vitals budgets, Lighthouse CI, axe, keyboard and screen-reader passes.
6. **No AI slop.** No Inter, no purple gradients, no glass cards, no 3D blob, no skill bars, no "passionate", no custom cursor.
7. **One action per page.** Home → read a case study. Case study → trust the engineer. Every page → contact or CV.

---

## Stack

- Next.js 16.3 (App Router, RSC, static-first) · React 19.2 · TypeScript strict
- Tailwind CSS v4 with an OKLCH semantic token layer
- CSS-first motion; no animation runtime (ADR-006)
- MDX + zod for case studies validated at build
- Vercel + cookieless analytics
- Vitest, Playwright, axe, Lighthouse CI (Phase 2)

Full rationale and consequences: [`docs/07-technical-architecture.md`](docs/07-technical-architecture.md) and [`docs/12-decision-log.md`](docs/12-decision-log.md).

---

## Current state

- [x] New repo scaffolded, builds, typechecks, lints
- [x] Token layer, fonts, placeholder home, 404, favicon
- [x] Brief, research, strategy, IA, design, motion, architecture, quality, roadmap, gates, templates, decisions
- [ ] Replace the old `public/resume.pdf` with the rewritten CV (Phase 1)
- [ ] Owner inputs: availability, permissions, domain, LinkedIn, target roles
- [ ] Evidence sprint: screenshots, demos, RAG benchmark, resume rewrite
- [ ] Home, work index, four case studies
- [ ] Motion, accessibility, performance and SEO hardening
- [ ] Recruiter tests and launch

The next action is **not code**. It is [`docs/09-build-roadmap.md`](docs/09-build-roadmap.md) Phase 1: confirm what can be shown and capture the proof.
