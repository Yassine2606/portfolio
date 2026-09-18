# Portfolio — Yassine Ben Romdhane, AI Engineer

Single-page portfolio built with Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Motion. Content-driven: every section renders from JSON validated at build time with zod.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also validates all content JSON)
npm run start    # serve the production build
npm run lint     # eslint
```

Copy `.env.example` to `.env.local` for local contact-form testing. The site runs without env vars (contact form returns 503 until `RESEND_API_KEY` is set).

## Environment

| Var | Required | What it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL for metadata, sitemap, robots, OG. Falls back to the production domain in `src/lib/site.ts`. |
| `RESEND_API_KEY` | For contact form | Sends via Resend. Unset → `POST /api/contact` returns 503. |
| `CONTACT_EMAIL` | No | Inbox for form messages. Defaults to the owner address in `src/app/api/contact/route.ts`. |

## Content

- `src/content/site.json` — hero, nav, engineering clusters, toolbox, timeline, philosophy, contact + links (including `Resume: /resume.pdf`).
- `src/content/projects/*.json` — one file per project: summary, stack, capabilities, full case study (problem → future), architecture graph, results, gallery.
- Schema is the contract: `src/lib/content/schema.ts` (`parseProject` / `parseSite`). A malformed file or dangling architecture edge fails `npm run build`, never runtime.
- Presentation order: `flagship` first, then `order` ascending (`src/components/sections/featured-work.tsx`).
- Results honesty rule: only numbers traceable to repo artifacts (module counts, migrations, locales, pipeline stages). No benchmarks without a committed benchmark. Empty `results` renders no block.
- Private repos: `links.github: null` hides the GitHub button and renders a `Private repo` badge. No private URLs are ever emitted.

## Resume

`public/resume.pdf` is served at `/resume.pdf` and linked from hero (`Resume (PDF)`), contact links, and footer via `site.json`. Replace the file in place to update it — no code change needed.

## Structure

```
src/app/            # layout, page, sitemap, robots, /api/contact
src/components/sections/  # Nav, Hero, FeaturedWork, Engineering, Timeline, Toolbox, Philosophy, Contact, Footer
src/components/ui/  # ArchitectureDiagram, PipelineFlow, SectionHeading, ThemeToggle
src/components/motion/    # Reveal primitive
src/content/        # site.json + projects/*.json
src/lib/content/    # schema (zod) + loaders
src/lib/ /src/hooks/      # theme, scroll-to, scroll-lock, dialog flag, media query
public/             # og.png, resume.pdf
docs/               # PRD.md (vision), PLAN.md (build plan + decision log)
```

Design tokens (palette, glass, radii, motion curves) live in `src/app/globals.css`. Dark is primary; light mode is a token swap via `data-theme`. Motion follows the regimes in `docs/PLAN.md` (reveal default, scrubbed/pinned desktop-only, reduced-motion static).

## Deploy

Vercel (or any Next.js host). Set `NEXT_PUBLIC_SITE_URL` to the production domain plus `RESEND_API_KEY` / `CONTACT_EMAIL` for the contact form. No database, no CMS, fully static except `/api/contact`.

## Known gaps

No test suite or CI yet. No project screenshots (`gallery` is empty across all projects). Phase 8 quality gate (Lighthouse, budgets) has not been run — see `docs/PLAN.md` decision log.
