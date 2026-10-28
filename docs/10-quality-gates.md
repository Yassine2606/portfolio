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

- [x] axe: 0 violations on `/`, `/work`, every case study, `/about`, and a 404 at 320, 390, and 1440px. The open mobile menu is included.
- [x] Lighthouse accessibility = 100 on `/`, `/work`, the flagship, and `/about`.
- [ ] HTML validator: no duplicate IDs, no invalid nesting.

**Manual**

- [x] Skip link is the first Tab stop; jumps to `<main>`.
- [x] Mobile menu: Escape closes; focus returns; Tab stays inside while open; body scroll locked.
- [ ] Keyboard-only: full header → menu → Index → cards → case study → contact journey; Index arrow keys; focus ring on every surface; sticky-header anchor offsets.
- [x] 320px: no horizontal scroll; all content readable.
- [ ] VoiceOver (Safari) or NVDA (Firefox): headings, landmarks, evidence notes, figures, links.
- [ ] 200% zoom at 1280px: no clipping, no horizontal scroll.
- [ ] Text spacing overrides: no clipping.
- [ ] Reduced motion: no transforms, autoplay, view transitions, or smooth scroll.
- [ ] Contrast: every token pair in `05` verified; no signal text on paper below 4.5:1.
- [ ] Video captions render; controls keyboard accessible.
- [ ] No colour-only meaning.

**Evidence:** `npm run audit:a11y` output (0 violations, 28 Oct 2026); Lighthouse results recorded in Gate 3; screen-reader notes and 200% screenshots still pending.

---

## Gate 3 — Performance

**Commands**

```bash
npm run build
npm run start
# in another terminal:
npx lighthouse http://localhost:3000/ --output=html --view
```

Lighthouse ships its own Chrome launcher; set `CHROME_PATH` if it cannot find one.

**Recorded run — 28 Oct 2026**

Lighthouse 13.6.0, mobile emulation, one run per route against `next start`:

| Route                       | Performance | LCP  | CLS | TBT   |
| --------------------------- | ----------- | ---- | --- | ----- |
| `/`                         | 99          | 1.0s | 0   | 110ms |
| `/work`                     | 99          | 1.0s | 0   | 130ms |
| `/work/documents-assistant` | 99          | 1.1s | 0   | 130ms |
| `/about`                    | 99          | 0.8s | 0   | 130ms |
| `/` desktop preset          | 100         | 0.3s | 0   | 10ms  |

Accessibility, best practices, and SEO scored 100 on every route. These are single lab runs, not a median; field INP and real-device timings are still pending.

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

**Checks**

- [ ] Bundle analyzer: Index island ≤3KB gz; no animation library; no component library.
- [ ] Images: correct `sizes`, AVIF/WebP, lazy below fold; no image >400KB.
- [ ] Fonts: 2 preloads; swap; no layout shift.
- [ ] Video: poster, click-to-load, ≤3MB, no autoplay.
- [x] No third-party scripts; no analytics at launch.
- [ ] Real mid-range Android on 4G: home <2s; case study usable.
- [ ] Performance trace: no long task >200ms; no layout thrash.

**Evidence:** Lighthouse JSON (28 Oct 2026, table above) + bundle report + real-device timing pending.

---

## Gate 4 — SEO and metadata

- [ ] Unique title + description on every route; lengths within limits.
- [ ] Canonical absolute URL on every route.
- [ ] One `<h1>` per page; heading order valid.
- [ ] OG + Twitter meta; 1200×630 image; preview tested in LinkedIn Post Inspector, X Card Validator, Slack.
- [ ] JSON-LD Person, CreativeWork, BreadcrumbList validate (Schema Markup Validator).
- [ ] `sitemap.xml` includes all public routes; no 404; `lastmod` sane.
- [ ] `robots.txt` allows assets and references the sitemap.
- [ ] 404 returns HTTP 404.
- [ ] Old domain 301s if changed.
- [ ] Search Console verified; sitemap submitted.
- [ ] No `noindex` on the production site.
- [ ] Internal links descriptive; no orphan pages.
- [ ] Image alt text present.

**Evidence:** screenshots of previews, sitemap URL, GSC verification, schema validation output.

---

## Gate 5 — Functional and links

- [ ] Every internal link returns 200 (or the intended 404 for the 404 test).
- [ ] Every external link returns 200 or is intentionally labeled private.
- [ ] Every `mailto:` opens the correct address.
- [ ] Copy-email writes the address and announces "Copied".
- [ ] Resume downloads from header, contact, footer; correct filename and content type.
- [ ] GitHub link opens the right profile; LinkedIn only if supplied.
- [ ] Prev/next case files work; no self-link.
- [ ] Mobile menu links work and close the menu.
- [ ] Index links navigate to the correct case file.
- [ ] Back/forward browser navigation works; scroll restoration reasonable.
- [ ] No console errors on any route.
- [ ] No 404s for images, fonts, or scripts.
- [ ] 404 page links work.

**Commands**

```bash
npx lychee --no-progress --max-retries 2 "http://localhost:3000/**"
# or
npx linkinator http://localhost:3000 --recurse --skip "linkedin.com|github.com"
```

**Evidence:** link-check report + manual click-through.

---

## Gate 6 — Cross-browser and responsive

| Browser        | Check                                   |
| -------------- | --------------------------------------- |
| Chrome desktop | Full pass                               |
| Safari macOS   | Fonts, sticky, view transitions, focus  |
| Firefox        | Fonts, focus, sticky                    |
| Edge           | Smoke                                   |
| iOS Safari     | Menu, Index, video, 100dvh, tap targets |
| Android Chrome | Menu, Index, video, 4G                  |

**Viewports:** 320, 360, 390, 768, 1024, 1280, 1440, 1920, 2560.

- [ ] No horizontal scroll at any width.
- [ ] No overlap of sticky header, TOC, or evidence notes.
- [ ] Text does not clip at 200% zoom.
- [ ] Tap targets ≥44px on touch.
- [ ] Hover states not required on touch.
- [ ] No layout shift when fonts load.
- [ ] No broken images at any DPR.
- [ ] Print: case study legible; notes as footnotes; URLs visible.

**Evidence:** screenshots per viewport + device notes.

---

## Gate 7 — Security and privacy

- [x] No secrets in the repo or client bundle (`grep`, `gitleaks` optional).
- [x] Security headers live: nosniff, referrer, frame, permissions, HSTS.
- [x] CSP report-only deployed; no `unsafe-eval`; enforcement still planned.
- [x] No third-party scripts; no analytics at launch.
- [x] Dependencies: `npm audit` reports 0 vulnerabilities (28 Oct 2026).
- [ ] Screenshots redacted; EXIF stripped; no client data.
- [x] Resume PII decision documented: phone is included in the CV PDFs; site copy uses email only.
- [x] No cookies; no consent banner.
- [x] Error page exposes no stack traces.
- [x] Contact is mailto; no form backend.
- [ ] Domain: HTTPS, valid certificate, HSTS.
- [ ] Vercel project access limited to the owner.

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
2. Tab through header: Work, About, Contact, Resume. Focus visible.
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
3. Header links work; menu falls back to visible links (ensure a `<noscript>` or CSS fallback).
4. Case studies render; video shows poster; links work.
5. No blank sections.

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

1. Click Resume and CV links from header, contact, footer, and mobile menu.
2. PDF opens/downloads; filename correct; one page; text selectable.
3. `pdftotext` output includes name, email, Capgemini, YBInnovations (Wave), and MyMatch.
4. Links in the PDF work (portfolio, GitHub, email); the phone number is in the PDF only.

### Social preview

1. Paste the URL into LinkedIn Post Inspector; image/title/description correct.
2. X Card Validator; Slack unfurl.
3. Case-study URL previews use its own OG image, not the home.

---

## Sign-off

| Gate               | Result | Evidence                                                                 | Date       | Owner   |
| ------------------ | ------ | ------------------------------------------------------------------------ | ---------- | ------- |
| 0 Content          | ⬜     |                                                                          |            | Yassine |
| 1 Recruiter tests  | ⬜     |                                                                          |            | Yassine |
| 2 Accessibility    | ◐      | axe 0 violations at 320/390/1440; Lighthouse a11y 100; manual items open | 2026-10-28 | Yassine |
| 3 Performance      | ◐      | Local Lighthouse mobile 99; desktop 100; field/real-device pending       | 2026-10-28 | Yassine |
| 4 SEO              | ⬜     | Lighthouse SEO 100; validator/preview checks pending                     |            | Yassine |
| 5 Functional       | ⬜     |                                                                          |            | Yassine |
| 6 Cross-browser    | ⬜     | Chromium only                                                            |            | Yassine |
| 7 Security         | ⬜     |                                                                          |            | Yassine |
| 8 Analytics/launch | ⬜     |                                                                          |            | Yassine |

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
