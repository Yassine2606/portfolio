# 07 — Technical architecture

Status: Locked v1.0 · 27 Oct 2026
Companion: `08-quality-standards.md`, `12-decision-log.md`
Principle: **static-first, content-safe, cheap to run, hard to break.**

---

## Stack

| Layer     | Choice                                                  | Version                                  | Why                                                                                |
| --------- | ------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| Framework | Next.js App Router                                      | 16.3                                     | Static HTML per case study, metadata API, OG generation, RSC keeps client JS small |
| UI        | React                                                   | 19.2                                     | Server components by default; small islands for interaction                        |
| Language  | TypeScript                                              | 5.x, strict + `noUncheckedIndexedAccess` | Content and UI contracts fail at build                                             |
| Styling   | Tailwind CSS v4 + semantic CSS tokens                   | 4.x                                      | Token discipline without a runtime CSS-in-JS cost                                  |
| Content   | MDX + `gray-matter` + zod                               | latest                                   | Long-form case studies with typed frontmatter and reusable components              |
| Fonts     | `next/font/google`                                      | —                                        | Self-hosted, subset, zero layout shift                                             |
| Analytics | Vercel Analytics + Speed Insights                       | —                                        | Cookieless, first-party, no banner                                                 |
| Hosting   | Vercel                                                  | —                                        | Preview deploys, static CDN, edge headers, rollback                                |
| Tests     | Vitest, Testing Library, Playwright, axe, Lighthouse CI | —                                        | Unit, component, E2E, accessibility, budgets                                       |
| CI        | GitHub Actions                                          | —                                        | Every PR runs the same gates as local                                              |

**Not in the stack at launch:** Motion/Framer Motion, anime.js, Three.js, GSAP, a CMS, a database, auth, i18n, a contact form backend, a state manager, a component library. Add only with an ADR and a measured reason.

### Why Next.js, not Vite or Astro

- **Vite SPA:** simplest build, but each case study needs metadata, OG, sitemap, and crawlable HTML. Doing that well means adding a prerender layer — i.e. rebuilding half of Next.
- **Astro:** excellent static content site, but the user asked for a React repo and the existing project is Next. Familiarity matters for a solo build.
- **Next.js static-first:** all pages are SSG; only the Index, menu, and copy button ship JS. The framework cost is mostly build-time, not runtime.

If the client JS budget is missed, the escape hatch is to remove the Index JS (CSS-only tabs) before changing frameworks.

---

## Rendering strategy

| Route                         | Rendering                               | Client JS                             |
| ----------------------------- | --------------------------------------- | ------------------------------------- |
| `/`                           | Static (SSG)                            | Index, mobile menu, copy email        |
| `/work`                       | Static                                  | mobile menu                           |
| `/work/[slug]`                | Static via `generateStaticParams`       | mobile menu, copy email, video native |
| `/about`                      | Static                                  | mobile menu, copy email               |
| `/404`                        | Static                                  | none                                  |
| `/sitemap.xml`, `/robots.txt` | Static                                  | none                                  |
| OG images                     | Generated at request/build by `next/og` | none                                  |
| `/api/contact`                | Not shipped at launch                   | —                                     |

No SSR, no ISR, no middleware at launch. The site is a set of static files behind a CDN. That is the performance strategy.

---

## Repository structure

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    not-found.tsx
    error.tsx
    work/
      page.tsx
      [slug]/
        page.tsx
        opengraph-image.tsx
    about/
      page.tsx
    sitemap.ts
    robots.ts
    icon.svg
  components/
    layout/
      site-header.tsx
      mobile-menu.tsx
      site-footer.tsx
      skip-link.tsx
    home/
      hero.tsx
      index-tabs.tsx          # client island
      method.tsx
      experience.tsx
      about-preview.tsx
      contact.tsx
    work/
      project-card.tsx
      archive-row.tsx
      case-header.tsx
      summary-box.tsx
      architecture.tsx
      decision.tsx
      metric.tsx
      figure.tsx
      video.tsx
      toc.tsx
      prev-next.tsx
    evidence/
      claim.tsx
      evidence-note.tsx
    ui/
      button.tsx
      tag.tsx
      status.tsx
      section-heading.tsx
      copy-email.tsx          # client island
  content/
    work/
      documents-assistant.mdx
      sadine.mdx
      anomaly-detection-agent.mdx
      rfid-access-control.mdx
    site.ts                   # name, role, links, availability, meta
  lib/
    content/
      schema.ts
      load.ts
      mdx-components.tsx
    seo/
      metadata.ts
      jsonld.ts
    utils.ts
  styles/                     # optional split if globals grows
public/
  work/<slug>/*.webp|avif|mp4|vtt
  resume.pdf
  og/
docs/
```

Conventions:

- Server components by default. `"use client"` only at the leaf that needs state or events.
- Named exports for components; default only where Next requires it.
- No barrel files (`index.ts` re-exports) — they hurt tree-shaking and hide dependencies.
- One component per file; file name kebab-case; component name PascalCase.
- No `any`; use `unknown` + zod at boundaries.
- Content is data, not code. MDX body + typed frontmatter.
- No secrets in the repo. `.env.example` is the contract.

---

## Content model

### Frontmatter schema (`src/lib/content/schema.ts`)

```ts
import { z } from "zod";

const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
  kind: z.enum(["demo", "repo", "docs", "video"]),
});

const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  kind: z.enum(["measured", "artifact", "scope"]),
  source: z.string().min(1),
  href: z.string().url().optional(),
  measuredAt: z.string().date(),
});

const evidenceSchema = z.object({
  claim: z.string().min(1),
  kind: z.enum(["repo", "deploy", "screenshot", "benchmark", "doc", "commit"]),
  source: z.string().min(1),
  href: z.string().url().optional(),
  verifiedAt: z.string().date(),
});

export const workFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  tagline: z.string().min(1).max(120),
  summary: z.string().min(1).max(320),
  year: z.number().int().min(2020).max(2100),
  role: z.string().min(1),
  duration: z.string().min(1).optional(),
  team: z.string().min(1).optional(),
  status: z.enum(["production", "internal", "in-development", "archived"]),
  featured: z.boolean(),
  order: z.number().int().nonnegative(),
  confidentiality: z.enum(["public", "partially-private", "private"]).default("public"),
  capabilities: z.array(z.string()).min(1),
  stack: z.object({
    ai: z.array(z.string()),
    backend: z.array(z.string()),
    frontend: z.array(z.string()),
    infra: z.array(z.string()),
    data: z.array(z.string()),
  }),
  links: z.array(linkSchema),
  metrics: z.array(metricSchema).max(4),
  evidence: z.array(evidenceSchema).min(1),
  seo: z.object({
    title: z.string().min(1).max(70),
    description: z.string().min(50).max(170),
    ogAlt: z.string().min(1),
  }),
});

export type WorkFrontmatter = z.infer<typeof workFrontmatterSchema>;
```

Rules:

- `slug` must match the filename. The loader asserts it.
- `metrics` max 4, and every metric needs a source and a date.
- `evidence` min 1; every case study must have at least one checkable source.
- `links` never contain a dead URL. If a repo is private, omit the link and add a `private` note in the body.
- `seo.description` is the meta description, 50–170 chars.

### Loader (`src/lib/content/load.ts`)

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { workFrontmatterSchema, type WorkFrontmatter } from "./schema";

const dir = path.join(process.cwd(), "src/content/work");

export type WorkEntry = {
  slug: string;
  frontmatter: WorkFrontmatter;
  body: string;
};

export function getWorkSlugs(): string[] {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getWork(slug: string): WorkEntry {
  const file = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(file)) throw new Error(`Unknown case study: ${slug}`);
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = workFrontmatterSchema.parse(data);
  if (frontmatter.slug !== slug) {
    throw new Error(`Slug mismatch: ${slug} vs ${frontmatter.slug}`);
  }
  return { slug, frontmatter, body: content };
}

export function getAllWork(): WorkEntry[] {
  return getWorkSlugs()
    .map(getWork)
    .sort((a, b) => {
      if (a.frontmatter.featured !== b.frontmatter.featured) {
        return a.frontmatter.featured ? -1 : 1;
      }
      return a.frontmatter.order - b.frontmatter.order;
    });
}
```

The build fails on invalid frontmatter, a slug mismatch, or a missing file. Content errors never reach runtime.

### MDX rendering

```tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/lib/content/mdx-components";

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWork(slug);
  return (
    <article>
      <CaseHeader work={work} />
      <MDXRemote source={work.body} components={mdxComponents} />
      <PrevNext current={slug} />
    </article>
  );
}
```

- `generateStaticParams()` returns `getWorkSlugs()`.
- `generateMetadata()` uses `work.frontmatter.seo` + the canonical URL.
- MDX components available in every case study: `Claim`, `EvidenceNote`, `Metric`, `Figure`, `Video`, `Architecture`, `Decision`, `Callout`, `CodeBlock` (optional), `Table`.
- No imports inside MDX; components are injected. This keeps content portable and build-safe.
- If `next-mdx-remote` breaks on a Next upgrade, the fallback is to render case studies from typed TSX modules. Do not switch to a CMS for this.

### Site data (`src/content/site.ts`)

Typed object for name, role, location, timezone, availability, email, social links, resume path, and the current focus. Single source for the header, hero, contact, footer, and JSON-LD. No duplicated strings.

---

## Pages and metadata

### Metadata

```ts
export function buildMetadata(input: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}): Metadata {
  const url = new URL(input.path, siteUrl).toString();
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: input.title,
      description: input.description,
      images: [
        { url: input.ogImage ?? "/og/default.png", width: 1200, height: 630, alt: input.title },
      ],
    },
    twitter: { card: "summary_large_image", title: input.title, description: input.description },
  };
}
```

- Title template: `%s — Yassine Ben Romdhane`.
- Home title: `Yassine Ben Romdhane — AI Engineer`.
- Case study title: short project name, not the full tagline.
- Canonical on every page.
- `metadataBase` from `NEXT_PUBLIC_SITE_URL`.

### OG images

- `src/app/work/[slug]/opengraph-image.tsx` uses `next/og` `ImageResponse` with the dossier tokens: paper, ink, signal, project name, one-line outcome, `yassine…` footer.
- 1200×630, font files bundled locally (Inter? No — Bricolage/Instrument from `public/fonts` or fetch at build). `ImageResponse` cannot use `next/font`; ship the two font files in `src/app/_og/` or use a system fallback. Prefer a local `.ttf` for the display line and mono label.
- Home and `/work` get static `opengraph-image.tsx` too.
- Alt text is meaningful; do not stuff the name.

### JSON-LD

- Home: `Person` with `name`, `jobTitle`, `url`, `sameAs` (GitHub; LinkedIn added only when supplied), `knowsAbout`, `alumniOf`, `address` (city/country only).
- Case study: `CreativeWork` with `name`, `description`, `author` (Person), `dateCreated`, `keywords`, `url`, `image`.
- `/work`: `CollectionPage` + `ItemList`.
- Breadcrumbs: `BreadcrumbList` on case studies.
- Render with `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`; no user input in the JSON-LD.

### Sitemap and robots

- `app/sitemap.ts`: `/`, `/work`, `/about`, every published case study; `lastModified` from frontmatter `verifiedAt` or file mtime; no 404; `/resume.pdf` optional (low priority).
- `app/robots.ts`: allow all; sitemap URL; disallow nothing at launch.

---

## Interaction islands

| Island       | Why client                          | Size target |
| ------------ | ----------------------------------- | ----------- |
| `IndexTabs`  | Tab state, keyboard, panel switch   | ≤ 3KB gz    |
| `MobileMenu` | Open/close, focus trap, scroll lock | ≤ 2KB gz    |
| `CopyEmail`  | Clipboard + confirmation            | ≤ 1KB gz    |

Everything else is a server component. No global provider, no theme context, no state library.

### Index without JS

Render all four panels stacked, each with its link, inside `<noscript>`-friendly markup. The client island hides inactive panels after hydration only if it successfully initialises. If JS fails, the content remains readable.

### Focus management

- Mobile menu: focus first link on open, trap Tab, Escape closes, return focus to trigger.
- If a video lightbox is added later: same pattern, plus arrow keys and a close button.
- No focus traps on the Index (it is not a modal).

---

## Contact (launch)

No form. The contact block contains:

- `mailto:yassine.ben.romdhanee@gmail.com` (visible address).
- A Copy button (`navigator.clipboard.writeText`, fallback to selecting the text).
- GitHub, Resume. Add LinkedIn only when the owner supplies the URL.
- `aria-live="polite"` confirmation: "Email copied".

This removes Resend, rate limiting, spam, and a server route from the launch scope. If a form is added later (ADR-009), it needs: server action or route handler, zod validation, honeypot, rate limit (Upstash or Vercel KV), Turnstile if spam appears, accessible success/error states, and a no-JS fallback (`mailto`). Do not add a form without those.

---

## Analytics

- Vercel Analytics: page views, referrers, devices, countries.
- Vercel Speed Insights: Core Web Vitals field data.
- Custom events via `track` from `@vercel/analytics` in client islands only:
  - `case_study_open` `{ slug }`
  - `resume_download`
  - `contact_click` `{ channel: "email" | "github" | "linkedin" }`
  - `demo_click` `{ slug }`
  - `copy_email`
- No PII, no query strings with emails, no cross-site cookies.
- Add a small `Analytics` component in the root layout; it loads after hydration.
- Verify events in preview before launch.

---

## Security and privacy

### Headers (`next.config.ts`)

```ts
async headers() {
  return [{
    source: "/(.*)",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ],
  }];
}
```

- CSP: ship in report-only first, then enforce. Start with `default-src 'self'`, `img-src 'self' data:`, `font-src 'self'`, `style-src 'self' 'unsafe-inline'` (Tailwind/Next inline styles), `script-src 'self'` plus the nonce/hash approach Next documents. Do not ship `unsafe-eval`.
- No third-party embeds. If a YouTube/Vimeo embed is added, it opens a privacy and CSP decision.
- Dependencies: Dependabot/Renovate weekly; `npm audit` in CI (non-blocking for dev, blocking for high severity).
- Secrets: only `NEXT_PUBLIC_SITE_URL` is public. No API keys in the client. No client data in the repo.
- Confidentiality: redact screenshots before committing; check EXIF; no real names, emails, tokens, or customer records. A pre-commit check for large images and obvious secrets (`gitleaks` optional).

### Privacy

- The resume is public by design. Decide whether to include a phone number; email is enough for most international roles.
- Analytics is cookieless; no consent banner needed. If a cookie-based tool is added, add a consent gate.
- Contact emails are stored in the recipient inbox, not a database.

---

## Testing and CI

### Local scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lighthouse": "lhci autorun"
  }
}
```

### Test layers

| Layer         | Tool                     | What                                                                          |
| ------------- | ------------------------ | ----------------------------------------------------------------------------- |
| Unit          | Vitest                   | Schema parsing, slug matching, date formatting, metadata builder, JSON-LD     |
| Component     | Vitest + Testing Library | Evidence links, Index keyboard, mobile menu focus, copy button                |
| E2E           | Playwright               | Home, `/work`, every case study, `/about`, 404, resume 200, no console errors |
| Accessibility | axe-core in Playwright   | 0 critical/serious on each route                                              |
| Visual        | Playwright screenshots   | 3 viewports per route; diff on PR (optional at launch)                        |
| Performance   | Lighthouse CI            | Budgets in `08-quality-standards.md`                                          |
| Links         | `lychee` or `linkinator` | Internal + external 200s (external allowlist)                                 |
| Content       | Build + zod              | Frontmatter, metric sources, evidence presence                                |

### CI (`.github/workflows/ci.yml`)

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run format:check
      - run: npm run test -- --run
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - run: npm run lighthouse
```

- Lighthouse runs against `next start` on a built app. Assert LCP, CLS, TBT, accessibility, SEO.
- Keep CI under 10 minutes. Cache Playwright browsers if needed.
- Add a `link-check` job nightly, not on every PR (external network flakiness).
- Dependabot for npm and GitHub Actions.

---

## Performance implementation

- `next/font` self-hosts and subsets fonts; only the display and body fonts preload. Mono and serif load with `display: swap` and no preload.
- `next/image` for screenshots: explicit `width`/`height`, `sizes`, AVIF/WebP, lazy below the fold, `priority` only for the LCP image if it is an image (it is not; the H1 is text).
- No image larger than 400KB; hero figure ≤ 200KB.
- No client component above the fold except `IndexTabs`; keep it small.
- Videos: poster + click-to-load; `preload="none"`; max 3MB.
- CSS: Tailwind v4 purges; no unused component library. Keep global CSS ≤ 30KB gz.
- Server components: no `useEffect` data fetching; no client fetch.
- Cache: Vercel CDN static assets immutable; HTML revalidated per deploy.
- Measure on a real mid-range Android; do not trust a desktop Lighthouse score alone.

---

## Error handling and failure modes

| Failure                   | Behaviour                                                                   |
| ------------------------- | --------------------------------------------------------------------------- |
| Font fails                | Fallback stack; no layout shift because `next/font` reserves metrics        |
| Image fails               | `alt` + caption remain; figure border holds layout via aspect ratio         |
| JS fails                  | All content visible; Index panels stacked; menu links visible in the footer |
| Analytics blocked         | Site works; no errors                                                       |
| External link dead        | Link checker catches it before launch; remove or label private              |
| MDX build error           | Build fails with file + field; never ships                                  |
| 404                       | Useful page with Home/Work/Resume links, status 404                         |
| Future contact form fails | Visible error, retry, mailto fallback                                       |

Add `src/app/error.tsx` (client) with a plain apology, a retry button, and the email. Do not expose stack traces.

---

## Migration from v1

1. **Content:** copy the seven project JSON files into the new repo as reference; rewrite each into MDX with the new frontmatter. Do not import the old schema.
2. **Copy:** keep factual claims; rewrite the hero, philosophy, and contact copy in the dossier voice. The old case-study bodies are raw material, not final text.
3. **Diagrams:** reuse the node/edge data, rebuild the visual as accessible stage cards. Do not port the fixed-pixel SVG.
4. **Resume:** rewrite, do not copy. Same project names as the site.
5. **Assets:** capture new screenshots; do not reuse old OG art. Copy only `resume.pdf` temporarily.
6. **URLs:** the old site is a single page; only `/resume.pdf` must survive. If the domain changes, 301 the old origin.
7. **Cutover:** keep v1 live until v2 passes every gate in `10-quality-gates.md`; then switch the domain and keep v1 as a tag for two weeks.

---

## Definition of done for the architecture

- [ ] `npm run build` fails on invalid frontmatter, missing evidence, or slug mismatch.
- [ ] Every route is static; no server runtime at launch.
- [ ] Initial JS ≤ 120KB gz; Index island ≤ 3KB gz.
- [ ] No third-party scripts except Vercel Analytics.
- [ ] All metadata, OG images, sitemap, robots, JSON-LD present.
- [ ] CSP report-only deployed before enforcement.
- [ ] CI runs typecheck, lint, format, unit, build, E2E, axe, Lighthouse on every PR.
- [ ] A mid-range Android loads the home page in under 2 seconds on 4G.
- [ ] No secrets or client data in the repo or screenshots.
- [ ] `README.md` commands work from a clean clone.
