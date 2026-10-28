# Portfolio v2 — Yassine Ben Romdhane

A recruiter-facing portfolio for an AI engineer. Four systems are documented as case files, with evidence notes and scope metrics attached to the claims.

**Status:** built and verified locally (v1.0). Not deployed.
**Availability:** immediate, no notice period.
**Work:** remote, hybrid, or on-site; open to relocation; visa sponsorship required outside Tunisia.
**CV:** English and French, designed and ATS-friendly versions.
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
| `/resume.pdf`                              | Asset  | English designed CV, one page                                    |
| `/resume-fr.pdf`                           | Asset  | French designed CV, one page                                     |
| `/resume-ats.pdf`                          | Asset  | English ATS-friendly CV                                          |
| `/resume-fr-ats.pdf`                       | Asset  | French ATS-friendly CV                                           |
| `/404`                                     | Static | Recovery page                                                    |
| `/sitemap.xml`, `/robots.txt`, `/icon.svg` | Static | App Router metadata routes                                       |

Also shipped: header and footer, focus-trapped mobile menu, home Index with tabs and a mobile accordion, per-case table of contents, evidence margin, scope metrics, code-generated system maps, previous/next case navigation, print stylesheet, Person/CreativeWork/BreadcrumbList/ItemList JSON-LD, canonical metadata, and a default 1200×630 Open Graph card at `public/og.png`.

### What is deliberately not shipped

- No contact form, dark mode, blog, analytics script, or animation runtime.
- No deployment, custom domain, or git remote. The canonical fallback is the old Vercel origin until `NEXT_PUBLIC_SITE_URL` is set.
- No screenshots or recorded demos. The figures are architecture maps, not interface captures.
- No retrieval benchmark for the flagship. The evaluation is designed but unrun, and the case file says so.
- No CI run, screen-reader pass, or real Safari device pass yet. Chromium, Firefox, and Playwright WebKit scripted checks pass at desktop and mobile widths; the CI workflow is committed but has not run.
- No LinkedIn link, portrait, or language proficiency levels. The CV PDFs include the phone number; site copy uses email only.

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

Last full run: 28 Oct 2026, from this directory.

| Check              | Command                | Result                                                                       |
| ------------------ | ---------------------- | ---------------------------------------------------------------------------- |
| Types              | `npm run typecheck`    | Pass                                                                         |
| Lint               | `npm run lint`         | Pass, 0 errors / 0 warnings                                                  |
| Format             | `npm run format:check` | Pass                                                                         |
| Production build   | `npm run build`        | Pass; all four case studies prerendered                                      |
| Desktop sweep      | Playwright, 1440×1000  | 8 routes: no horizontal overflow, no visible `undefined`/`NaN`               |
| Mobile sweep       | Playwright, 390×844    | Same 8 routes: no horizontal overflow                                        |
| Narrow sweep       | Playwright, 320×800    | Same 8 routes: no horizontal overflow; tables fit at 320                     |
| Viewport sweep     | Playwright, 10 widths  | 320–2560px: 5 routes, no horizontal overflow                                 |
| Reflow and spacing | Playwright, 640/390    | 200% zoom equivalent and WCAG 1.4.12 text-spacing overrides pass             |
| Reduced motion     | Playwright             | 0 running animations; `scroll-behavior` returns to `auto`                    |
| Accessibility      | `npm run audit:a11y`   | 0 axe-core violations: 8 routes × 3 widths, plus the open menu               |
| Keyboard           | Playwright             | 31/24/20/19 focus stops; every indicator visible; first Tab is skip          |
| HTML validity      | Nu HTML Checker 26.10  | 8 routes: 0 errors, 0 warnings (informational self-closing notes only)       |
| Lighthouse mobile  | Lighthouse 13.6.0      | 96–99 on the final build (median 97); 100 accessibility, best practices, SEO |
| Lighthouse desktop | Lighthouse 13.6.0      | 100 in all four categories on `/`                                            |
| Cross-browser      | Playwright             | Chromium 1248, Firefox 157, WebKit 27.2: routes, menu, Index, copy           |
| First-load JS      | 8 modern script tags   | `/` 144.0 KB gzip / 123.4 KB Brotli; flagship 140.0 / 120.0                  |
| Links and assets   | `npm run audit:links`  | 14 internal URLs, all 200; 4 external GitHub links, all 200                  |
| Evidence rendering | Playwright + HTML      | 4 labels and 4 markers per case; no nested paragraphs                        |
| Security headers   | `curl -I`              | nosniff, referrer, frame, permissions, HSTS, enforced CSP                    |
| Dependencies       | `npm audit`            | 0 vulnerabilities; Next.js upgraded to 16.4.3                                |
| Print              | Playwright             | Navigation hidden, grid collapsed, evidence notes kept                       |
| CI                 | GitHub Actions         | Workflow committed; not run (no remote or account access)                    |

The axe audit covers `/`, `/work`, all four case files, `/about`, and a 404 at 320, 390, and 1440px. It found five accessibility issues on 28 Oct 2026, all fixed: the home link name, overlong card and archive link names, the French ATS link name, and the skip link landmark. A separate 320px sweep found contact-section overflow, also fixed. The script is `scripts/audit-a11y.mjs`.

Markdown tables in the case files now render as real tables through `remark-gfm`; before the fix they were literal pipe text, which caused horizontal overflow in Firefox. Tables are wrapped in a keyboard-focusable scroll container and fit at 320px after the narrow-width type adjustment.

Lighthouse home performance was 97, 96, 97 across three runs on the final build; the other routes scored 99. An earlier run set on the prior build was 99, 94, 96, where the 94 run had a 2.6s LCP outlier. Results are local lab runs, not field data or a CI median; across both sets one run fell below the 95 target, and that miss is recorded rather than discarded.

First-load JavaScript is 144.0 KB gzip / 123.4 KB Brotli on `/` and 140.0 / 120.0 on the flagship, excluding the `noModule` polyfill chunk. The 120 KB gzip budget is missed; React and the App Router runtime account for about 115 KB gzip before any site code. The budget is recorded as missed rather than redefined.

WebKit 27.2 now passes the same scripted checks as Chromium and Firefox. The host lacked `libavif16`; the package and its two dependencies were unpacked into the Playwright WebKit bundle, which is an environment workaround, not a Safari UI test. NVDA/VoiceOver, real-device, and CI runs are still outstanding.

Public-repository claims were re-checked against shallow clones on 27 Oct 2026. The anomaly route count was corrected from 5 to 9, and two overbroad read-only/normalization sentences were narrowed. Details and commands are in the evidence ledger.

---

## Deployment

No deployment has been performed. The procedure is in [`docs/13-implementation-report.md`](docs/13-implementation-report.md).

Before deploying:

1. Set `NEXT_PUBLIC_SITE_URL` to the final origin for Production and Preview.
2. Confirm the four CV PDFs are current, then re-run the four build gates.
3. Check canonical URLs, OG image resolution, the 404 status, and a printed case file.
4. Point the domain, then 301 the old `yassine-ben-romdhane.vercel.app` origin.

---

## Stack

- Next.js 16.4.3 (App Router, RSC, static-first) · React 19.2.8 · TypeScript strict with `noUncheckedIndexedAccess`
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

Resolved 27 Oct 2026: availability and work arrangements — immediate, no notice period; remote, hybrid, or on-site; open to relocation; visa sponsorship required outside Tunisia.

These block launch or would materially strengthen it:

1. **Permissions:** what Capgemini allows (screenshots, demo, repository), and whether Sadine, RFID, or Wave can publish redacted visuals.
2. **Flagship proof:** synthetic-corpus demo, recorded walkthrough, or both; run the 50-question retrieval benchmark.
3. **Identity and contact:** custom domain, LinkedIn URL, portrait yes/no, language proficiency labels, target-role priority.
4. **Audit:** CI run, screen-reader, real Safari, and real-device passes.

The site avoids unconfirmed claims: no LinkedIn placeholder, portrait, phone number, or language levels.

---

## Repository note

This is a standalone git repository inside the old portfolio directory. The outer portfolio stays untouched, and `/v2/` is excluded from the outer repository through `.git/info/exclude`. The outer working tree has a pre-existing `package-lock.json` modification that is unrelated to this work.
