# 08 — Quality standards

Status: Locked v1.0 · 27 Oct 2026
These are launch gates, not aspirations. Each standard has a measurement method and a pass/fail line.

---

## Accessibility — target WCAG 2.2 AA

A portfolio that fails accessibility fails the craft test. The audience includes people who use keyboards, screen readers, zoom, and reduced motion.

### Perceivable

- [ ] Text contrast ≥ 4.5:1; large text (≥24px or ≥18.66px bold) ≥ 3:1; UI boundaries that carry meaning ≥ 3:1.
- [ ] Colour is never the only signal: active tabs also change weight/underline; errors have text; availability has a label, not just a green dot.
- [ ] Images have meaningful `alt`; decorative images `alt=""`; screenshots describe the UI and note redactions.
- [ ] Diagrams have a text summary and a "read as text" alternative.
- [ ] Video has captions (`.vtt`), a poster, and no audio at launch.
- [ ] Page reflows at 320px width with no horizontal scroll; content at 200% zoom remains usable.
- [ ] Text spacing overrides (line-height 1.5×, paragraph 2×, letter 0.12×, word 0.16×) do not clip content.
- [ ] `lang="en"` on the root; foreign-language quotes get `lang` attributes.

### Operable

- [ ] Every interactive element is keyboard reachable in a logical order.
- [ ] Visible focus ring on every focusable element: 2px `signal-text`, 3px offset; on dark surfaces, 2px paper.
- [ ] Focus is never obscured by the sticky header: `scroll-margin-top: 96px`.
- [ ] Skip link is the first Tab stop and jumps to `<main id="main">`.
- [ ] No keyboard trap except deliberate modals (mobile menu, future lightbox), which support Escape and return focus.
- [ ] Target size ≥ 24×24px (WCAG 2.2 minimum); primary controls ≥ 44×44px.
- [ ] No drag-only interaction (2.5.7). No path-based gestures without a simple alternative.
- [ ] Motion can be reduced: `prefers-reduced-motion` removes transforms, autoplay, view transitions, and smooth scroll.
- [ ] No content flashes more than three times per second.
- [ ] Time limits: none at launch.

### Understandable

- [ ] One `<h1>` per page; heading levels never skip.
- [ ] Landmarks: `<header>`, `<nav aria-label="Primary">`, `<main>`, `<footer>`.
- [ ] Link text is descriptive out of context ("Read the Documents Assistant case file", not "Read more").
- [ ] External links announce that they open a new tab, if they do.
- [ ] The 60-second summary box uses a `<dl>`; labels are visible.
- [ ] The Index uses a labelled tablist; the panel is labelled by its tab.
- [ ] Errors (future form) identify the field, explain the fix, and are announced.
- [ ] Consistent help: contact links in the same place on every page (header/footer).
- [ ] No unexpected context changes on focus.

### Robust

- [ ] Valid HTML; no duplicate IDs.
- [ ] ARIA only where native HTML cannot express the pattern; no `role="button"` on a link.
- [ ] `aria-current="page"` on the active nav link; `aria-selected` on tabs; `aria-expanded` on the menu.
- [ ] Status messages use `aria-live="polite"` (copy confirmation, future form success).
- [ ] Tested with VoiceOver (Safari/macOS or iOS) and NVDA (Firefox/Windows) at least once.

### Specific 2.2 checks

| Criterion                       | Check                                                            |
| ------------------------------- | ---------------------------------------------------------------- |
| 2.4.11 Focus Not Obscured       | Tab to every link under the sticky header; focus remains visible |
| 2.5.7 Dragging Movements        | No drag interactions; Index is click/keyboard                    |
| 2.5.8 Target Size               | Menu, tabs, video controls ≥ 24px; primary ≥ 44px                |
| 3.2.6 Consistent Help           | Contact/Resume in header and footer on every page                |
| 3.3.7 Redundant Entry           | No multi-step forms at launch; future form must not re-ask       |
| 3.3.8 Accessible Authentication | No auth at launch                                                |

### Testing protocol

1. **Automated:** `npm run audit:a11y` runs axe-core via Playwright on `/`, `/work`, each case study, `/about`, and a 404 at 320, 390, and 1440px. 0 violations on 28 Oct 2026.
2. **Keyboard:** Tab/Shift+Tab through every page; Enter/Space on controls; Escape closes the menu; no focus loss.
3. **Screen reader:** VoiceOver on the home page and one case study; verify headings, tablist, evidence notes, figures, and link names.
4. **Zoom/reflow:** 200% at 1280px; 320px viewport.
5. **Reduced motion:** OS setting on; no transforms, autoplay, or view transitions.
6. **Contrast:** automated token check + manual spot check of every text/background pair.

Document the pass in `10-quality-gates.md`. The 28 Oct 2026 automated pass is recorded there; the keyboard, screen-reader, zoom, reduced-motion, and contrast checks are not complete.

---

## Performance — Core Web Vitals budgets

| Metric             | Lab budget (mobile) | Field budget (p75) | How                                                  |
| ------------------ | ------------------- | ------------------ | ---------------------------------------------------- |
| LCP                | ≤ 1.8s              | ≤ 2.5s             | Static HTML, no hero image LCP, font preload, CDN    |
| INP                | ≤ 200ms             | ≤ 200ms            | Tiny islands, no long tasks, no heavy listeners      |
| CLS                | ≤ 0.05              | ≤ 0.1              | Font metrics, image dimensions, reserved Index panel |
| TTFB               | ≤ 0.8s              | ≤ 0.8s             | Static + CDN                                         |
| FCP                | ≤ 1.2s              | —                  | Inline critical CSS? Measure; avoid blocking         |
| First-load JS      | ≤ 120KB gz          | —                  | RSC, 3 small islands, no animation library           |
| CSS                | ≤ 30KB gz           | —                  | Tailwind purge                                       |
| Fonts              | ≤ 180KB total       | —                  | 2 preloaded, 2 swap                                  |
| Home page weight   | ≤ 1MB               | —                  | Lazy below-fold media                                |
| Case study initial | ≤ 1.5MB             | —                  | Lazy images/video                                    |
| Lighthouse mobile  | ≥ 95 all categories | —                  | CI assertion                                         |
| Long tasks         | 0 > 200ms on load   | —                  | Performance trace                                    |
| Animation          | 60fps               | —                  | 4× CPU throttle                                      |

### Measurement

- **Lighthouse:** the repeatable audit ran three times per route on 28 Oct 2026 and scored 96–99/100/100/100 on mobile. Home medians were 96–97 (individual runs 96–99); `/work`, the flagship, and `/about` medians were 98–99. An earlier set recorded 99, 94, 96 with a 2.6s LCP outlier, so one run across all sets missed the 95 performance target, but no three-run median did. CI runs the same script; it has not run remotely yet.
- **WebPageTest** once before launch: Moto G4 / Slow 4G, first view + repeat view.
- **Vercel Speed Insights** after launch: field p75 for LCP, INP, CLS.
- **Real device:** one mid-range Android and one iPhone on a real network, not just DevTools.
- **JavaScript:** served script tags summed per route: 144.0 KB gzip / 123.4 KB Brotli on `/`, 140.0 / 120.0 on the flagship, excluding the `noModule` polyfill. The 120 KB gzip budget is missed; React and the router are ~115 KB of it.
- **Long tasks:** at 4× CPU throttle, two tasks over 200ms on `/` (222ms, 213ms) and one on the flagship (258ms); TBT 200–210ms on `/`. Recorded as a miss.
- **Images:** no content images are shipped; the OG card is metadata only.

### Techniques

- All pages static; no server runtime at launch.
- Server components by default; client islands only.
- `next/font` with subset + swap; preload display/body only.
- `next/image` with width/height, `sizes`, AVIF/WebP; lazy below the fold.
- No third-party scripts except Vercel Analytics (first-party, deferred).
- Video: poster + click-to-load; no autoplay; max 3MB.
- CSS animations on transform/opacity only.
- No icon font, no component library, no animation runtime.
- Cache static assets immutably; HTML per deploy.

### Budget enforcement

`npm run audit:lighthouse` runs Lighthouse 13 three times per route and asserts the median:

| Metric          | Assertion |
| --------------- | --------- |
| Performance     | ≥ 95      |
| Accessibility   | 100       |
| Best practices  | 100       |
| SEO             | 100       |
| LCP             | ≤ 1800ms  |
| CLS             | ≤ 0.05    |
| TBT (lab proxy) | ≤ 300ms   |

The script uses Playwright's Chromium. `@lhci/cli` is not used because version 0.15.1 pulled 16 dev advisories; see ADR-023. If a budget fails, fix the cause; do not lower the budget without an ADR.

---

## SEO and discovery

### On-page

- [ ] One `<h1>` per page with the primary phrase.
- [ ] Title ≤ 60 chars before the brand; unique per page.
- [ ] Meta description 140–160 chars; unique; problem + outcome + stack.
- [ ] Canonical absolute URL on every page.
- [ ] Open Graph + Twitter card; 1200×630 image; alt text.
- [ ] Descriptive internal links; no "click here".
- [ ] Image alt text; filenames meaningful (`documents-assistant-chat-citations.webp`).
- [ ] `lang="en"`; no hidden keyword blocks.
- [ ] 404 returns 404; no soft redirects.

### Technical

- [ ] `sitemap.xml` includes `/`, `/work`, `/about`, every case study; no 404; reasonable `lastmod`.
- [ ] `robots.txt` allows crawling and references the sitemap; does not block CSS/JS/images.
- [ ] JSON-LD validates (Person, CreativeWork, BreadcrumbList).
- [ ] No duplicate content between home and `/work`; home summarises, `/work` indexes.
- [ ] Old domain 301s to the new origin if it changes.
- [ ] HTTPS, HSTS, no mixed content.
- [ ] Core Web Vitals green.

### Launch

- [ ] Verify the domain in Google Search Console (DNS TXT or HTML file).
- [ ] Submit the sitemap; request indexing for `/` and `/work`.
- [ ] Add Bing Webmaster Tools (optional but cheap).
- [ ] Test the OG preview in LinkedIn Post Inspector, X Card Validator, and Slack unfurl.
- [ ] Check `site:domain` after a week; fix any unexpected titles.
- [ ] Do not `noindex` the site at launch; check the meta tag.

### Content SEO

Target phrases, used naturally:

- "Yassine Ben Romdhane" (name)
- "AI engineer" / "AI engineer portfolio"
- "production RAG" / "RAG case study"
- "MCP agent" / "Model Context Protocol"
- "full-stack AI engineer"

No keyword stuffing. One phrase per page is enough; the case-study titles do the long-tail work.

---

## Security and privacy

- [x] No secrets in the repo or client bundle; only `NEXT_PUBLIC_SITE_URL` is public.
- [x] Security headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, HSTS.
- [x] CSP enforced; no `unsafe-eval`; `'unsafe-inline'` remains for Next's bootstrap and inline styles. Nonce/hash hardening is queued.
- [x] Dependencies audited; `npm audit` reports 0 vulnerabilities (28 Oct 2026).
- [x] No third-party scripts; no analytics at launch.
- [ ] Screenshots redacted; EXIF stripped; no client names, emails, tokens, or customer records.
- [x] Resume PII decision made: phone is included in the CV PDFs; site copy uses email only.
- [x] No cookies; no consent banner.
- [x] Contact is `mailto:`; no form backend at launch.
- [ ] If a form is added: zod validation, honeypot, rate limit, Turnstile if needed, no PII in logs.
- [x] Error page exposes no stack traces.
- [ ] Backups: the repo is the source; Vercel keeps deployments; export the final content quarterly.

---

## Content quality

- [ ] Every checkable claim has a source or an explicit `private / not measured` label.
- [ ] Every metric has a method, a date, and a source.
- [ ] No banned words: passionate, innovative, cutting-edge, seamless, robust, scalable (unless defined), leveraged, harnessed, spearheaded, ninja, rockstar, 10x.
- [ ] No fake testimonials, logos, clients, or metrics.
- [ ] Project names, dates, and metrics match the CV.
- [ ] American English spelling is consistent ("specializing", "organization"); one style guide.
- [ ] Readability: average sentence < 20 words; no paragraph > 5 sentences.
- [ ] Jargon defined once; acronyms expanded on first use.
- [ ] Links resolve; private links are labelled.
- [ ] Dates absolute; "last updated" present on `/about`.
- [ ] Spelling checked (not only by the editor); proper nouns verified (Capgemini, Sadine, ESPRIM, pgvector, FastMCP).

### Claim ledger

Maintain one table in the repo (`docs/evidence-ledger.md`, added in Phase 1) with:

| Claim                                   | Project             | Source               | Verified   | Owner   |
| --------------------------------------- | ------------------- | -------------------- | ---------- | ------- |
| "Answers are verified before streaming" | Documents Assistant | `verifier.py` + eval | 2026-10-27 | Yassine |
| "41 Prisma models"                      | Sadine              | `schema.prisma`      | 2026-10-27 | Yassine |

If it is not in the ledger, it does not go on the site.

---

## Browser and device support

| Browser                  | Version | Priority    |
| ------------------------ | ------- | ----------- |
| Chrome (desktop/Android) | last 2  | Primary     |
| Safari (macOS/iOS)       | 17+     | Primary     |
| Firefox                  | last 2  | Secondary   |
| Edge                     | last 2  | Secondary   |
| Samsung Internet         | last 2  | Best effort |

**Viewports:** 320, 360, 390, 768, 1024, 1280, 1440, 1920, 2560.

**Conditions:** slow 4G, 4× CPU throttle, reduced motion, 200% zoom, keyboard only, screen reader, no JavaScript, print.

**Known platform risks:** iOS `100vh` (use `100dvh`), Safari view transitions, `100dvh` with browser chrome, `backdrop-filter` (not used), AVIF support (Next serves fallback), clipboard API (provide fallback).

---

## Analytics and measurement

- Cookieless Vercel Analytics; no cross-site tracking.
- Events: `case_study_open`, `resume_download`, `contact_click`, `demo_click`, `copy_email`.
- No PII; no email addresses or names in event properties.
- Review after 7 days and 30 days; do not optimise to a dashboard in week one.
- Qualitative tests (5-second, 30-second, tradeoff) are the primary signal at this traffic level.

---

## Print

- Case studies print legibly: hide header/footer/nav/video; show URLs after links; evidence notes as footnotes; black text on white; no paper grain.
- A hiring manager may print or PDF a case study for an interview panel. It should look intentional.

---

## Definition of done for quality

All of the following true:

- [x] axe: 0 violations on every route at 320/390/1440; repeatable with `npm run audit:a11y`.
- [x] Keyboard-only pass on 4 routes; 19–31 stops each, all indicators visible, TOC anchors clear the sticky header.
- [ ] Screen-reader pass on home + one case study.
- [x] Lighthouse mobile 96–99/100/100/100; medians of three runs per route; one earlier run scored 94, below the 95 performance target.
- [x] LCP ≤ 1.8s lab on every route except one 2.6s home outlier; CLS 0.
- [ ] INP ≤ 200ms in the field.
- [ ] First-load JS ≤ 120KB gz; measured 140–144 KB gzip (119–123 KB Brotli), recorded as a miss.
- [x] No horizontal scroll at 320px; all case tables fit.
- [x] HTML validator: 0 errors and 0 warnings on 8 routes.
- [x] 200% zoom equivalent, text-spacing overrides, and reduced motion pass.
- [ ] Cross-browser: Chromium, Firefox, and Playwright WebKit pass; real Safari, Edge, iOS, and Android pending.
- [x] No broken links; 14 internal and 4 external URLs resolve; no dead controls.
- [ ] Metadata + OG + JSON-LD validated externally; local structure and links pass.
- [x] Security headers + enforced CSP.
- [ ] Content ledger complete; banned words absent.
- [ ] Real-device test on Android + iPhone.
