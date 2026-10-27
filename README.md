# Portfolio v2 — Yassine Ben Romdhane

A recruiter-facing portfolio for an AI engineer. Four systems are documented as case files, with evidence notes and scope metrics attached to the claims.

**Status:** built and verified locally (v1.0). Not deployed.
**Design direction:** engineering dossier — warm paper, blue-black ink, one vermillion signal, editorial type, evidence in the margin.
**Tagline:** _AI systems, with the receipts._

---

## Quick start

Node 22 is tested.

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL if you want a non-local canonical
npm run dev                  # http://localhost:3000
npm run typecheck            # tsc --noEmit
npm run lint                 # eslint
npm run format               # prettier --write .
npm run format:check         # prettier --check .
npm run build                # production build; validates every case file
npm run start                # serve the production build
```

`npm run build` is a content gate, not just a compile step. It fails when a case study is missing a required frontmatter field, a slug does not match its filename, a metric is malformed, or fewer than two evidence notes exist.

---

## What is shipped

| Route                                      | State  | Notes                                                            |
| ------------------------------------------ | ------ | ---------------------------------------------------------------- |
| `/`                                        | Static | Hero, Index preview, method, experience, archive, about, contact |
| `/work`                                    | Static | Featured case, three case cards, archive rows, contact           |
| `/work/documents-assistant`                | SSG    | Flagship; partially private                                      |
| `/work/sadine`                             | SSG    | Private client system                                            |
| `/work/anomaly-detection-agent`            | SSG    | Public repository                                                |
| `/work/rfid-access-control`                | SSG    | Private build                                                    |
| `/about`                                   | Static | Profile, experience, education, stack, availability              |
| `/resume.pdf`                              | Asset  | **Temporary:** the old CV; replace before launch                 |
| `/404`                                     | Static | Recovery page                                                    |
| `/sitemap.xml`, `/robots.txt`, `/icon.svg` | Static | App Router metadata routes                                       |

Also shipped: header and footer, focus-trapped mobile menu, home Index with tabs and a mobile accordion, per-case table of contents, evidence margin, scope metrics, code-generated system maps, previous/next case navigation, print stylesheet, Person/CreativeWork/BreadcrumbList/ItemList JSON-LD, canonical metadata, and a default 1200×630 Open Graph card at `public/og.png`.

### What is deliberately not shipped

- No contact form, dark mode, blog, analytics script, or animation runtime.
- No deployment, custom domain, or remote. The canonical fallback is the old Vercel origin until `NEXT_PUBLIC_SITE_URL` is set.
- No screenshots or recorded demos. The figures are architecture maps, not interface captures.
- No retrieval benchmark for the flagship. The evaluation is designed but unrun, and the case file says so.
- No rewritten CV. `public/resume.pdf` is the old one.
- No CI, axe, Lighthouse, screen-reader, or cross-browser pass yet. Internal checks were run in Chromium at desktop and mobile widths.
- No LinkedIn link, phone number, portrait, or language proficiency levels. Those await owner confirmation.

---

## Content model

Each case study is a validated MDX file:

- `src/content/work/*.mdx` — body plus frontmatter.
- `src/lib/content/schema.ts` — zod contracts for title, tagline, contract, capabilities, stack, links, metrics, evidence, and SEO.
- `src/lib/content/load.ts` — reads, validates, sorts, and resolves previous/next.
- `src/lib/content/mdx-components.tsx` — maps `Claim` and `Architecture` into MDX.
- `src/components/evidence/claim.tsx` — claim, inline marker, and evidence margin.
- `src/components/work/architecture-view.tsx` — stage cards, text flow, and boundary note.

**MDX constraint:** `next-mdx-remote`'s RSC mode strips JSX expression attributes for safety. Props must be string literals in MDX (`n="1"`, not `n={1}`). `Claim` also derives the number from the `id` as a fallback. This is a library security behaviour, not a site bug.

Every `Claim` renders its source in the margin on wide screens and in reading order on mobile. The source is either a public repository path, a private repository path labelled `private`, or an explicit unmeasured plan.

---

## Evidence policy

1. **No borrowed proof.** Do not use a screenshot of another product, a stock dashboard, or an invented metric.
2. **Partial proof is allowed if it is labelled.** The flagship is partially private: architecture and code paths are described, but no interface, repository, or benchmark is published.
3. **Private stays private.** Sadine, RFID, and the flagship do not publish customer, employee, or client data.
4. **Artifacts are not outcomes.** A model count, module count, or route count is labelled `artifact`. It does not imply quality, adoption, or correctness.
5. **Unmeasured is a status, not a footnote.** The 50-question RAG benchmark is listed as not run.

The full claim-to-source mapping is [`docs/evidence-ledger.md`](docs/evidence-ledger.md). The build and verification record is [`docs/13-implementation-report.md`](docs/13-implementation-report.md).

---

## Verification

Last full run: 27 Oct 2026, from this directory.

| Check              | Command                | Result                                                         |
| ------------------ | ---------------------- | -------------------------------------------------------------- |
| Types              | `npm run typecheck`    | Pass                                                           |
| Lint               | `npm run lint`         | Pass, 0 errors / 0 warnings                                    |
| Format             | `npm run format:check` | Pass                                                           |
| Production build   | `npm run build`        | Pass; all four case studies prerendered                        |
| Desktop sweep      | Playwright, 1440×1000  | 8 routes: no horizontal overflow, no visible `undefined`/`NaN` |
| Mobile sweep       | Playwright, 390×844    | Same 8 routes: no horizontal overflow                          |
| Evidence rendering | Playwright + HTML      | 4 labels and 4 markers per case; no nested paragraphs          |
| Keyboard           | Playwright             | First Tab reaches the skip link; mobile menu restores focus    |
| Print              | Playwright             | Navigation hidden, grid collapsed, evidence notes kept         |

Not run: axe-core, Lighthouse, NVDA/VoiceOver, cross-browser, real-device, or load tests. Do not call the site externally audited until those pass.

Public-repository claims were re-checked against shallow clones on 27 Oct 2026. The anomaly route count was corrected from 5 to 9, and two overbroad read-only/normalization sentences were narrowed. Details and commands are in the evidence ledger.

---

## Deployment

No deployment has been performed. The procedure is in [`docs/13-implementation-report.md`](docs/13-implementation-report.md).

Before deploying:

1. Set `NEXT_PUBLIC_SITE_URL` to the final origin for Production and Preview.
2. Replace `public/resume.pdf` with the rewritten CV.
3. Re-run the four build gates.
4. Check canonical URLs, OG image resolution, the 404 status, and a printed case file.
5. Point the domain, then 301 the old `yassine-ben-romdhane.vercel.app` origin.

---

## Stack

- Next.js 16.3.5 (App Router, RSC, static-first) · React 19.2.8 · TypeScript strict with `noUncheckedIndexedAccess`
- Tailwind CSS v4 with an OKLCH semantic token layer
- MDX via `next-mdx-remote` 6, `gray-matter`, `rehype-slug`, and zod validation
- CSS-first motion; no animation runtime (ADR-006)
- No database, auth, CMS, analytics, or client state library

Full rationale: [`docs/07-technical-architecture.md`](docs/07-technical-architecture.md) and [`docs/12-decision-log.md`](docs/12-decision-log.md).

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
| 13  | [`docs/13-implementation-report.md`](docs/13-implementation-report.md)       | What shipped, how it was verified, what is still open                |
| —   | [`docs/evidence-ledger.md`](docs/evidence-ledger.md)                         | Claim-to-source ledger for the 16 evidence notes and 16 metrics      |
| —   | [`docs/prompts/project-scoping.md`](docs/prompts/project-scoping.md)         | Agent prompt that turns a repo into an evidence-backed case study    |

---

## Open owner inputs

These block launch or would materially strengthen it:

1. **Availability:** exact date and notice period; remote / hybrid / on-site preference; relocation; work authorization.
2. **Permissions:** what Capgemini allows (screenshots, demo, repository), and whether Sadine, RFID, or Wave can publish redacted visuals.
3. **Flagship proof:** synthetic-corpus demo, recorded walkthrough, or both; run the 50-question retrieval benchmark.
4. **Identity and contact:** custom domain, LinkedIn URL, phone policy for the CV, portrait yes/no, language proficiency labels, target-role priority.
5. **Resume and audit:** rewritten one-page CV; CI plus axe, Lighthouse, screen-reader, and cross-browser passes.

The site avoids unconfirmed claims: no remote-friendly promise, notice date, LinkedIn placeholder, portrait, phone number, or language levels.

---

## Repository note

This is a standalone git repository inside the old portfolio directory. The outer portfolio stays untouched, and `/v2/` is excluded from the outer repository through `.git/info/exclude`. The outer working tree has a pre-existing `package-lock.json` modification that is unrelated to this work.
