# 10 — Quality gates

Status: Locked v1.0 · 27 Oct 2026
A gate is pass/fail. "Looks good" is not a result. Record the evidence (report, screenshot, command output) next to the gate.

---

## Gate 0 — Content and evidence

**Owner:** Yassine · **When:** end of Phase 1 and before launch

- [ ] Four featured case studies confirmed; three archive cards.
- [ ] Every checkable claim is in `docs/evidence-ledger.md` with a source and `verifiedAt`.
- [ ] Every metric has a method, sample/denominator, date, and source.
- [ ] Every private project is labeled private; no dead GitHub/demo buttons.
- [ ] Every featured project has ≥3 real screenshots and a captioned demo or a live URL.
- [ ] No client names, logos, emails, tokens, or customer data in any image.
- [ ] The flagship has a measured result or an explicit `not measured` note.
- [x] Resume PDFs current: EN/FR designed and ATS versions, one page each.
- [ ] Banned words removed; spelling and proper nouns checked.
- [ ] Meta titles and descriptions written for every route.

**Evidence:** signed ledger + `pdftotext public/resume.pdf` output + link to the demo.

---

## Gate 1 — Five-second and recruiter tests

**When:** Phase 7, with 5 participants who hire or work with engineers.

### 5-second test

Show `/` for 5 seconds, then ask:

1. What does this person do?
2. Where are they based / are they available?
3. What would you click first?

**Pass:** 4/5 role, 4/5 availability/location, 4/5 choose work or CV.

### 30-second proof test

"Find evidence this person has shipped production AI."

**Pass:** within 30 seconds, names one system + one technology.

### 2-minute tradeoff test

"Explain one tradeoff from a case study."

**Pass:** names the choice, the alternative, and the cost.

### Hiring-manager test

"Would you interview this person? What would you ask first?"

**Pass:** yes + a specific technical question.

### Recruiter test

"You have 20 seconds. Fit for an AI engineer role? Why?"

**Pass:** role, stack, location, CV.

**Evidence:** verbatim notes + participant count + any fixes made.

---

## Gate 2 — Accessibility

**Commands**

```bash
npm run build && npm start
# in another terminal:
npm run audit:a11y
```

The first run needs `npx playwright install chromium`.

**Automated**

- [x] axe: 0 violations on `/`, `/work`, every case study, `/about`, and a 404 at 320, 390, and 1440px. The open mobile menu and both open resume disclosures are included.
- [x] Forced colors (Windows High Contrast emulation): 8 routes at 390 and 1440px, 0 violations. Solid buttons use `ButtonFace`/`ButtonText`, with a `Highlight` hover.
- [x] Lighthouse accessibility = 100 on `/`, `/work`, the flagship, and `/about`.
- [x] HTML validator: Nu HTML Checker 26.10.12, 0 errors and 0 warnings on 8 routes. Only informational self-closing-void notes remain.

**Manual**

- [x] Skip link is the first Tab stop; jumps to `<main>`.
- [x] Mobile menu: Escape closes; focus returns; Tab stays inside while open; body scroll locked.
- [x] Keyboard-only: 31/24/20/19 focus stops on `/`, `/work`, the flagship, and `/about`; all indicators visible; Index arrow keys work; TOC anchors land 23px below the sticky header.
- [x] 320px: no horizontal scroll; all content readable; all four case tables fit.
- [ ] VoiceOver (Safari) or NVDA (Firefox): headings, landmarks, evidence notes, figures, links.
- [x] 200% zoom at 1280px equivalent (640 CSS px): 8 routes, no clipping or horizontal scroll.
- [x] Text spacing overrides: 8 routes at 1440px and 390px; email breaks, tables scroll inside their wrapper.
- [x] Reduced motion: 0 running animations and `scroll-behavior: auto` on `/` and the flagship.
- [x] Contrast: token ratios are recorded in `05-design-system.md` (ink 16.06:1, soft 9.76:1, faint 5.39:1, signal-text 5.84:1, status 4.68:1); axe reports no contrast violations on shipped pairs, including forced colors.
- [x] No video shipped; the architecture section uses code-generated maps.
- [x] No colour-only meaning: status, confidentiality, and evidence kinds carry text labels; links are underlined.

**Evidence:** `npm run audit:a11y` output (0 violations, 28 Oct 2026); Nu HTML Checker (0 errors/warnings); Lighthouse results in Gate 3; reflow, reduced-motion, keyboard, and anchor-offset runs (28 Oct 2026). Screen-reader notes are still pending.

---

## Gate 3 — Performance

**Commands**

```bash
npm run build
npm run start
# in another terminal:
npm run audit:lighthouse
```

The script uses Lighthouse 13 with Playwright's Chromium, three runs per route, and fails if a median misses the budget. Set `AUDIT_BASE_URL` for a different origin.

**Recorded run — 28 Oct 2026**

Lighthouse 13.6.0, mobile emulation, against `next start`. Three runs per route; the desktop preset was run once manually. The table is one representative run; repeated sets varied by a few points.

| Route                       | Performance | LCP  | CLS | TBT   |
| --------------------------- | ----------- | ---- | --- | ----- |
| `/` (median of 3)           | 97          | 0.9s | 0   | 196ms |
| `/work` (median of 3)       | 99          | 0.9s | 0   | 134ms |
| `/work/documents-assistant` | 98          | 0.9s | 0   | 139ms |
| `/about` (median of 3)      | 99          | 0.9s | 0   | 107ms |
| `/` desktop preset (manual) | 100         | 0.3s | 0   | 10ms  |

Home medians were 97 (individual runs 97, 98, 96; LCP 1.1s, 0.9s, 0.9s; TBT 196ms). `/work` ran 99, 99, 98; the flagship 98, 98, 99; `/about` 99, 99, 99. This is the latest set, run after the resume picker and portrait shipped. Earlier sets put home at 96–97 and the other routes at 98–99; TBT medians ranged 107–224ms. An earlier set recorded 99, 94, 96 on the prior build, where the 94 run had a 2.6s LCP outlier. Across all sets one run fell below 95, but no three-run median did. Accessibility, best practices, and SEO scored 100 on every route. These are local lab runs, not a remote CI median; field INP and real-device timings are still pending.

**Budgets**

| Metric            | Pass                 |
| ----------------- | -------------------- |
| LCP (lab, mobile) | ≤ 1.8s               |
| LCP (field p75)   | ≤ 2.5s               |
| INP               | ≤ 200ms              |
| CLS               | ≤ 0.05               |
| TTFB              | ≤ 0.8s               |
| First-load JS     | ≤ 120KB gz           |
| CSS               | ≤ 30KB gz            |
| Fonts             | ≤ 180KB total        |
| Home weight       | ≤ 1MB                |
| Lighthouse mobile | ≥ 95 all categories  |
| Long tasks        | none > 200ms on load |
| Animation         | 60fps at 4× CPU      |

**Measured:** first-load JavaScript is 144.0 KB gzip / 123.4 KB Brotli on `/`, and 139.3–140.0 / 119.4–120.0 on the other routes, excluding the `noModule` polyfill. **The 120 KB gzip budget is missed.** React DOM (45.2 KB) and the App Router/Turbopack runtime (70.1 KB) account for about 115 KB before site code. One earlier Lighthouse run scored 94 and missed the ≥95 target; the repeatable audit's three-run medians are 97–99. Both misses are recorded, not redefined.

**Checks**

- [ ] Bundle analyzer: Index island ≤3KB gz; no animation library; no component library.
- [x] Images: no content images; the OG card is social metadata only. Architecture figures are DOM/SVG.
- [x] Fonts: 5 self-hosted subsets, 139 KB total, `display: swap`, CLS 0.
- [x] Video: none shipped.
- [x] No third-party scripts; no analytics at launch.
- [x] CSS: 9.6 KB gzip, under the 30 KB budget.
- [ ] Real mid-range Android on 4G: home <2s; case study usable.
- [ ] Performance trace: at 4× CPU throttle, two long tasks on `/` (222ms, 213ms) and one on the flagship (258ms); TBT 200–210ms. Recorded as a miss.

**Evidence:** `npm run audit:lighthouse` output (28 Oct 2026, table above); manual script-sum and CSS/font measurements; 4× CPU long-task probe. Bundle analyzer report and real-device timing pending.

---

## Gate 4 — SEO and metadata

- [x] Unique title + description on every route; lengths within limits.
- [x] Canonical absolute URL on every route.
- [x] One `<h1>` per page; no heading-level jumps on 8 routes.
- [ ] OG + Twitter meta; 1200×630 image; preview tested in LinkedIn Post Inspector, X Card Validator, Slack.
- [x] JSON-LD Person, CreativeWork, BreadcrumbList parse and carry schema.org context; external Schema Markup Validator still pending.
- [x] `sitemap.xml` includes all public routes; no 404; `lastmod` sane.
- [x] `robots.txt` allows assets and references the sitemap.
- [x] 404 returns HTTP 404.
- [ ] Old domain 301s if changed.
- [ ] Search Console verified; sitemap submitted.
- [x] No `noindex` on the production site.
- [x] Internal links descriptive; 14 internal URLs resolve; no orphan pages.
- [x] Image alt text present; decorative marks hidden.

**Evidence:** `npm run audit:links` (14 internal, 4 external, all 200; 28 Oct 2026); metadata and JSON-LD parse checks in `seo-links` output; sitemap and robots fetched from the running server. Social preview screenshots, external schema validation, GSC, and the domain redirect depend on deployment.

---

## Gate 5 — Functional and links

- [x] Every internal link returns 200 (or the intended 404 for the 404 test).
- [x] Every external link returns 200 or is intentionally labeled private.
- [x] Every `mailto:` opens the correct address.
- [x] Copy-email writes the address and announces "Copied".
- [x] Resume downloads from the header/hero picker, contact, footer, and mobile menu; all four filenames and content types verified.
- [x] GitHub link opens the right profile; LinkedIn only if supplied.
- [x] Prev/next case files work; no self-link.
- [x] Mobile menu links work and close the menu.
- [x] Index links navigate to the correct case file.
- [x] Back/forward browser navigation works; scroll restoration reasonable.
- [x] No console errors on any route.
- [x] No 404s for images, fonts, or scripts.
- [x] 404 page links work.

**Commands**

```bash
npm run audit:links -- --external
```

**Evidence:** `npm run audit:links` report (14 internal + 4 external, all 200); Playwright functional script on 28 Oct 2026 (prev/next, menu close, Index, back/forward, asset responses, 404 links).

---

## Gate 6 — Cross-browser and responsive

| Browser        | Check                                               |
| -------------- | --------------------------------------------------- |
| Chrome desktop | Scripted pass (Chromium 1248)                       |
| Safari macOS   | Not run as Safari UI; Playwright WebKit 27.2 passed |
| Firefox        | Scripted pass (Firefox 157)                         |
| Edge           | Not run (Chromium engine covered above)             |
| iOS Safari     | Not run                                             |
| Android Chrome | Not run on device                                   |

**Viewports tested:** 320, 360, 390, 640 (200% zoom equivalent), 768, 1024, 1280, 1440, 1920, 2560.

- [x] No horizontal page overflow at all 10 widths; data tables scroll inside their wrapper.
- [x] No overlap of sticky header, TOC, or evidence notes; TOC anchors land 23px below the header at 1440, and 768/1024/1920 were visually checked.
- [x] Text does not clip at 200% zoom equivalent (640 CSS px).
- [x] Primary controls ≥44px; breadcrumb links are 24×24, the WCAG 2.5.8 minimum; inline text links are exempt.
- [x] Hover states are enhancement only; links are underlined.
- [x] No layout shift when fonts load (CLS 0).
- [x] No broken images; no content images are shipped.
- [x] Print: case study legible; notes stay with claims; no hash-link artefacts printed.

**Evidence:** 50 viewport checks (5 routes × 10 widths) on 28 Oct 2026; keyboard and anchor-offset scripts; screenshots at 768, 1024, and 1920; print check.

---

## Gate 7 — Security and privacy

- [x] No secrets in the repo or client bundle (`grep`, `gitleaks` optional).
- [x] Security headers live: nosniff, referrer, frame, permissions, HSTS.
- [x] CSP enforced; no `unsafe-eval`, no inline styles; `script-src` still allows `'unsafe-inline'` for Next's bootstrap. Nonce/hash hardening is queued.
- [x] No third-party scripts; no analytics at launch.
- [x] Dependencies: `npm audit` reports 0 vulnerabilities (28 Oct 2026).
- [x] Screenshots redacted; none shipped. EXIF not applicable.
- [x] Resume PII decision documented: phone is included in the CV PDFs; site copy uses email only.
- [x] No cookies; no consent banner.
- [x] Error page exposes no stack traces.
- [x] Contact is mailto; no form backend.
- [ ] Domain: HTTPS, valid certificate, HSTS.
- [ ] Vercel project access limited to the owner.

**Evidence:** `curl -I` output (28 Oct 2026); `npm audit`; header config in `next.config.ts`; ADR-022 in `12-decision-log.md`.

**Evidence:** header output (`curl -I`), audit output, redaction checklist.

---

## Gate 8 — Analytics and launch readiness

- [ ] Vercel Analytics + Speed Insights installed and receiving page views in preview.
- [ ] Events fire: `case_study_open`, `resume_download`, `contact_click`, `demo_click`, `copy_email`.
- [ ] No PII in event properties.
- [ ] `NEXT_PUBLIC_SITE_URL` set to production; canonical/OG use it.
- [ ] Domain DNS + SSL live; `www` redirects to apex (or vice versa).
- [ ] Old origin 301s to the new site.
- [ ] Resume PDF accessible logged out.
- [ ] Sitemap submitted; robots correct.
- [ ] OG previews checked.
- [ ] GitHub profile, LinkedIn, CV, email signature updated.
- [ ] Previous site tagged/backed up.
- [ ] Launch announcement prepared (one post, no hype).

**Evidence:** analytics screenshot, DNS check, GSC screenshot, preview cards.

---

## Manual test scripts

### Keyboard-only

1. Reload `/`; press Tab once → skip link visible. Enter → main.
2. Tab through header: Work, About, Contact, Resume. Open the Resume disclosure with Enter; Tab through the four download links; Escape closes and returns focus to the summary. Focus visible throughout.
3. Tab to Index; Arrow Down changes the tab; Enter opens the case file.
4. On a case study: Tab reaches TOC, evidence links, figures, video controls, prev/next.
5. Shift+Tab reverses in the same order.
6. Open the mobile menu at 390px: focus moves inside; Tab cycles; Escape closes; focus returns.
7. No focus is hidden under the header.

### Screen reader

1. Open `/` in Safari + VoiceOver.
2. Rotor: headings list shows one h1, logical h2/h3.
3. Landmarks: banner, navigation, main, contentinfo.
4. Index: announces "tab, selected, 1 of 4"; panel labelled.
5. Case study: summary `<dl>` reads labels/values; evidence note is reachable; images have alt; video has captions.
6. Links: names make sense out of context.

### Reduced motion

1. Enable Reduce Motion in the OS.
2. Reload `/`: no hero transform; content visible immediately.
3. Index switches instantly; no panel rise.
4. Mobile menu opens instantly.
5. No autoplay; no view transitions; smooth scroll off.
6. Hover colour changes still work.

### No JavaScript

1. Disable JS in DevTools.
2. `/` renders all content; Index panels are stacked with links.
3. Header links work; the menu trigger is replaced by a visible four-link nav row (CSS `@media (scripting: none)`).
4. Case studies render; video shows poster; links work.
5. No blank sections.

**Recorded run — 28 Oct 2026:** `npm run audit:nojs` drives Playwright with JS on and off at 390×844 and 1440×1000 across 8 routes, 32 checks total. With JS off, `/` rendered 8,018 characters of main text and 33 links; the stacked Index showed all four projects with a case link each, and the interactive Index was hidden. At 390px the menu trigger was hidden and the five-link no-JS nav was visible; at 1440px the desktop nav remained visible and the no-JS row stayed hidden. The header and hero resume disclosures open natively with JS off. With JS on, the fallbacks were hidden and the interactive Index and mobile menu were visible. No route overflowed. Forcing the fallback visible also produced 0 axe-core violations at both widths.

### Slow network

1. Throttle to Slow 4G, 4× CPU.
2. Home: text visible before images; no layout shift; LCP < 2.5s field target.
3. Case study: text readable while figures load; captions reserve space.
4. No spinner blocks content.

### 404

1. Visit `/work/does-not-exist`.
2. Status 404; useful links; no redirect to home.
3. Header/footer work.

### Resume

1. Click the header and hero Resume disclosures; confirm four numbered rows (EN/FR × Designed/ATS).
2. Download each file; filename matches the row; one page; text selectable. Confirm Escape and outside click close the panel.
3. Repeat from the contact section, footer, and mobile menu.
4. Disable JavaScript: the header and hero disclosures still open; the narrow header shows direct EN and FR links.
5. `pdftotext` output includes name, email, Capgemini, YBInnovations (Wave), and MyMatch.
6. Links in the PDF work (portfolio, GitHub, email); the phone number is in the PDF only.

### Social preview

1. Paste the URL into LinkedIn Post Inspector; image/title/description correct.
2. X Card Validator; Slack unfurl.
3. Case-study URL previews use its own OG image, not the home.

---

## Sign-off

| Gate               | Result | Evidence                                                                                                           | Date       | Owner   |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------ | ---------- | ------- |
| 0 Content          | ⬜     |                                                                                                                    |            | Yassine |
| 1 Recruiter tests  | ⬜     |                                                                                                                    |            | Yassine |
| 2 Accessibility    | ◐      | axe 0 incl. forced colors; HTML valid; 200%/spacing/motion/keyboard/no-JS pass; screen reader open                 | 2026-10-28 | Yassine |
| 3 Performance      | ◐      | Lighthouse 97–99 medians, 3 runs/route, desktop 100; JS 140–144 KB gz misses 120; 4× long tasks; field/device open | 2026-10-28 | Yassine |
| 4 SEO              | ◐      | SEO 100; titles/canonical/JSON-LD parse; links pass; social previews and external schema validator open            | 2026-10-28 | Yassine |
| 5 Functional       | ◐      | Link check, menu, Index, copy, CVs, prev/next, back/forward pass; real-device click-through open                   | 2026-10-28 | Yassine |
| 6 Cross-browser    | ◐      | Chromium, Firefox, WebKit pass; real Safari/Edge/iOS/Android not run                                               | 2026-10-28 | Yassine |
| 7 Security         | ◐      | Headers + enforced CSP, 0 audit vulnerabilities; domain/deploy controls open                                       | 2026-10-28 | Yassine |
| 8 Analytics/launch | ⬜     |                                                                                                                    |            | Yassine |

◐ = the automated portion passed; the manual or field portion is still open.

**Launch rule:** no gate may be skipped. A failed gate is either fixed or documented as a deliberate exception with an ADR and a date to fix. "Temporary" without a date is a no.

---

## Launch smoke test (production)

Within 15 minutes of going live:

- [ ] `/` 200, correct title, no console errors.
- [ ] `/work` 200; four case links work.
- [ ] Flagship 200; hero image loads; metrics have sources.
- [ ] `/about` 200; both CV links work.
- [ ] `/resume.pdf`, `/resume-fr.pdf`, `/resume-ats.pdf`, `/resume-fr-ats.pdf` 200, `application/pdf`, correct files.
- [ ] 404 returns 404.
- [ ] `sitemap.xml` + `robots.txt` 200.
- [ ] Canonical/OG use the production domain.
- [ ] If analytics is enabled, it receives a page view; otherwise confirm there are no third-party requests.
- [ ] Mobile: menu, Index, CV, contact.
- [ ] Social preview correct.
- [ ] No mixed content.

---

## Post-launch

| When      | Check                                                               |
| --------- | ------------------------------------------------------------------- |
| 1 hour    | Vercel errors and 404 logs; analytics only if enabled               |
| 24 hours  | All routes 200; contact links; resume download                      |
| 7 days    | If enabled: case studies opened, resume downloads, scroll depth     |
| 30 days   | Qualitative feedback; decide on fifth case study / form / dark mode |
| Quarterly | Re-verify evidence, links, availability, CV                         |
