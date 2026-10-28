# 09 — Build roadmap

Status: Locked v1.0 · 27 Oct 2026
Owner: Yassine · Solo build
Rule: **content before code; gates before launch; never fake a project to fill a grid.**

> **Status · 27 Oct 2026:** This is the original build plan, kept for sequencing and decisions. The site shipped locally at v1.0 with a reduced evidence scope. The authoritative record of what was built, verified, and left open is `13-implementation-report.md`; the claim-to-source mapping is `evidence-ledger.md`. Checkboxes below were not maintained as a live tracker after the plan was locked.

---

## Shape of the work

```
Phase 0  Decisions + owner inputs          1–2 days
Phase 1  Evidence sprint                   7–10 days   ← critical path
Phase 2  Foundation                        2 days
Phase 3  Home + work index                 3 days
Phase 4  Case studies + about              5–6 days
Phase 5  Motion + interaction polish       2 days
Phase 6  Quality hardening                 3 days
Phase 7  Verification                      2 days
Phase 8  Launch                            1 day
Phase 9  Post-launch                       ongoing
```

**Total:** ~26–31 working days, about 5–6 weeks part-time. The estimate is dominated by evidence and writing, not by React. If the evidence is not ready, the launch moves; the site does not invent it.

**Critical path:** permissions → screenshots/demo → flagship evaluation → case-study drafts → build → gates. Code can start in parallel with the evidence sprint once the schema is stable, but case-study pages cannot be finished without the assets.

---

## Phase 0 — Decisions and inputs

**Goal:** remove ambiguity before building.

- [ ] Read `01`–`12`; sign off on the brief and the four-project selection.
- [ ] Answer every owner input in `docs/README.md`:
  - availability date / notice (resolved: available immediately)
  - work authorization (resolved: visa sponsorship required outside Tunisia)
  - Capgemini permission + redaction rules
  - Sadine / RFID / Wave permission
  - demo plan for the flagship
  - LinkedIn URL, contact channel, phone policy
  - domain choice
  - languages and levels
  - target role priority
  - portrait yes/no
- [ ] Confirm the flagship fallback (sanitized demo vs Sadine as flagship).
- [ ] Choose the domain; check availability; decide DNS provider.
- [ ] Create the GitHub remote (private until launch) and push `main`.
- [ ] Add a `docs/evidence-ledger.md` with the first claims.
- [ ] Schedule the five recruiter tests for Phase 7.

**Done when:** every input has an answer or a dated decision; the four projects are confirmed; the domain is chosen; the repo has a remote.

---

## Phase 1 — Evidence sprint (critical path)

**Goal:** make the work visible and measurable before writing the final copy.

### 1A — Permissions and redaction

- [ ] Written confirmation for Capgemini, Sadine, RFID, Wave.
- [ ] A one-page redaction rule per project: names, logos, emails, customer data, tokens, internal URLs.
- [ ] Decide what is `public`, `partially-private`, or `private`.
- [ ] If permission is denied, switch to the flagship fallback and label the project honestly.

### 1B — Screenshots

- [ ] Capture 3–5 shots per featured project (shot list in `03-content-strategy.md`).
- [ ] Use a neutral demo dataset; redact; strip EXIF.
- [ ] Export AVIF/WebP at 1280/1920 widths; keep a 2560px master outside the repo.
- [ ] Write a caption and alt text for every image.
- [ ] Store under `public/work/<slug>/`.

### 1C — Demo

- [ ] Flagship: hosted synthetic-corpus demo **or** a 60–90s captioned walkthrough.
- [ ] Anomaly: 45s scan → findings → MCP tool call.
- [ ] Sadine: 45–60s quote request → customer accept → admin audit.
- [ ] RFID: 30–45s live dashboard decision + reader photo.
- [ ] Compress to ≤3MB; MP4 + WebM; poster; `.vtt` captions.
- [ ] No client data, no audio, no branded intro.

### 1D — Flagship evaluation

- [ ] Build a synthetic corpus of 20–30 documents (4 formats, one scanned).
- [ ] Write 50 questions: 35 answerable, 10 multi-hop, 5 unanswerable.
- [ ] Label gold answers + gold chunks.
- [ ] Run: recall@5, MRR@10, citation accuracy (sample audit), abstention, p50/p95 latency.
- [ ] Write `docs/evidence/rag-eval.md`: method, corpus, sample size, limitations, raw table, command, date.
- [ ] Commit the eval set and script if the repo is public; otherwise keep the report and label the code private.

### 1E — Resume

- [x] One page, ATS-safe, text-based PDFs in English and French.
- [x] Lead with Capgemini RAG; then YBInnovations (Wave) and MyMatch.
- [x] No contradictions with the site; the CV is a one-page subset.
- [x] Links: site, GitHub, email; phone included in the PDFs.
- [x] Files: `public/resume.pdf`, `public/resume-fr.pdf`, `public/resume-ats.pdf`, `public/resume-fr-ats.pdf`.
- [x] Text extraction tested; EN and FR ATS files score 10/10 in the CV audit.

### 1F — Content drafts

- [ ] Write the four case-study drafts (1,200–2,400 words each) against the template in `11`.
- [ ] Write the hero, method, experience, about, contact, and meta descriptions.
- [ ] Fill the claim ledger; every metric has a source and date.
- [ ] Cut every claim that cannot be verified.

**Done when:** permissions are written; every featured project has a real visual and a demo or a labeled private note; the flagship has a measured result; the resume matches the content; four case-study drafts exist; the ledger is complete.

**If time is short:** launch with three case studies (flagship + Sadine + Anomaly) and move RFID to archive. Never publish a fourth thin case study. The grid can hold three.

---

## Phase 2 — Foundation

**Goal:** the shell, tokens, content pipeline, and CI that every later phase depends on.

- [x] Next.js 16 + React 19 + TypeScript strict scaffold.
- [x] Token layer in `src/app/globals.css` (paper/ink/signal/line/status/danger).
- [x] Fonts: Bricolage Grotesque, Instrument Sans, JetBrains Mono, Instrument Serif.
- [x] Placeholder home, 404, favicon, resume placeholder.
- [x] `src/content/site.ts` typed site data.
- [x] `src/lib/content/schema.ts` + `load.ts` + `mdx-components.tsx`.
- [x] `src/components/layout/` header, footer, skip link, mobile menu.
- [x] `src/app/work/page.tsx` + `[slug]/page.tsx` + `generateStaticParams` + `generateMetadata`.
- [x] `src/app/about/page.tsx`.
- [x] `src/app/sitemap.ts`, `robots.ts`; static `public/og.png` instead of `opengraph-image.tsx`.
- [x] `src/app/error.tsx`.
- [x] JSON-LD helpers.
- [x] Prettier + ESLint + Playwright + axe + GitHub Actions workflow. Vitest remains; the Lighthouse audit is a local script wired into CI.
- [x] `.github/workflows/ci.yml` committed and actionlint-clean; not yet run.
- [ ] `README` commands verified from a clean clone.
- [ ] Deploy a preview to Vercel; confirm static routes and 404.

**Done when:** `npm run build` validates content; `typecheck`, `lint`, `format:check`, unit, E2E, and Lighthouse run locally and in CI; a preview URL is live; every route returns the expected status.

---

## Phase 3 — Home + work index

**Goal:** the argument, above and below the fold.

- [ ] Header: name, Work, About, Contact, availability, Resume; sticky; mobile menu.
- [ ] Hero: eyebrow, H1, lede, CTAs, meta strip, availability card.
- [x] Index: tablist desktop, accordion mobile, real screenshots, keyboard, no-JS fallback. Screenshots are code-generated system maps because the flagship has no public visual (ADR-021).
- [ ] How I work: three principles, each linked to evidence.
- [ ] Experience: four rows, correct titles/dates.
- [ ] About preview + optional portrait.
- [ ] Contact: email, copy, GitHub, Resume. Add LinkedIn only when supplied.
- [ ] Footer: links, colophon, last updated.
- [ ] `/work`: four featured cards + three archive rows.
- [ ] Empty/loading/error states for images and links.
- [ ] Mobile pass at 320/390; no horizontal scroll.

**Done when:** the five-second test can be run on a preview; the CV is reachable without scrolling on mobile; every link on the page resolves; the Index works by keyboard and without JS.

---

## Phase 4 — Case studies + about

**Goal:** the four deep files that close the argument.

- [ ] Case header: breadcrumb, title, tagline, 60-second summary `<dl>`, hero figure.
- [ ] MDX body with the section order: Context → Problem → Architecture → Decisions → Evidence → Reliability → Outcome → What I'd do differently.
- [ ] `Architecture` component: accessible stage cards + text alternative.
- [ ] `Decision` component: choice, alternative, why, cost.
- [ ] `Metric` component: value, label, kind, source, date.
- [ ] `Figure` component: caption, redaction note, next/image.
- [ ] `Video` component: poster, captions, native controls, no autoplay.
- [ ] `Claim` + `EvidenceNote` components; margin layout at ≥1200.
- [ ] TOC: sticky desktop, `<details>` mobile, active section.
- [ ] Prev/next case file + back to work.
- [ ] `/about`: intro, looking for, experience, education, stack, languages, portrait, contact.
- [ ] Metadata + OG image per case study.
- [ ] JSON-LD `CreativeWork` + `BreadcrumbList`.
- [ ] Print styles for case studies.
- [ ] All four case studies proofread against the ledger.

**Done when:** each case study passes the 60-second contract; every metric has a source; every image has a caption and alt; the page has no horizontal scroll at 320px; the print view is legible; `/about` matches the CV.

---

## Phase 5 — Motion and interaction polish

**Goal:** make it feel engineered, not decorated.

- [ ] Hero entrance: transform-only H1, stagger, ≤900ms, reduced-motion off.
- [ ] Index: panel switch 160ms, active marker 200ms, keyboard; no layout shift.
- [ ] Mobile menu: 200ms, focus trap, Escape, scroll lock.
- [ ] Hover/focus states on cards, links, buttons, tags.
- [ ] Case-study figure reveals (CSS scroll-driven, progressive).
- [ ] Sticky TOC/figure; `scroll-margin-top`.
- [ ] Page transitions: CSS view transitions, 180ms, reduced-motion off.
- [ ] Copy email: `aria-live`, 2s reset.
- [ ] Video: poster/controls; no autoplay.
- [ ] Motion QA at 4× CPU throttle; no long tasks.
- [ ] Kill anything that does not communicate meaning.

**Done when:** the motion QA checklist in `06` passes; no animation library is in the bundle; reduced motion is indistinguishable from "no motion" except for opacity; the Index never shifts layout.

---

## Phase 6 — Quality hardening

**Goal:** accessibility, performance, SEO, security — measured, not assumed.

- [x] axe on every route; 0 violations at 320/390/1440, plus the open mobile menu.
- [x] Keyboard-only pass; 19–31 focus stops per route, indicators visible, skip link, menu trap.
- [ ] VoiceOver or NVDA pass on home + flagship.
- [x] Contrast audit: token ratios recorded; axe reports no contrast violations.
- [x] 320px reflow.
- [x] 200% zoom equivalent and WCAG text-spacing overrides.
- [x] Lighthouse mobile on `/` and flagship; 96–99 performance medians over three runs per route, 100 accessibility/BP/SEO; repeatable with `npm run audit:lighthouse`.
- [x] HTML validator: 0 errors/warnings on 8 routes.
- [x] Cross-browser scripted pass: Chromium, Firefox, and Playwright WebKit.
- [ ] Bundle analyzer; first-load JS ≤120KB (measured 140–144KB gzip, miss); Index island ≤3KB.
- [x] Image audit: no content images; OG card is metadata only.
- [x] Font audit: 5 self-hosted subsets, 139KB total, swap, CLS 0.
- [x] Metadata audit: titles, descriptions, canonical, OG, Twitter on 7 routes.
- [ ] JSON-LD validation: local parse passes; external Schema Markup Validator pending.
- [x] Sitemap + robots + 404 status.
- [x] Security headers + enforced CSP.
- [x] Link check: 14 internal + 4 external, no dead controls.
- [ ] Content audit against the ledger; banned words; spelling.
- [ ] Real-device test: mid-range Android + iPhone on 4G.
- [x] Print test.

**Done when:** every standard in `08` has a recorded pass or a documented exception with an ADR; the exception is not "we ran out of time".

---

## Phase 7 — Verification

**Goal:** test with humans and browsers, not just tools.

- [ ] 5-second test with 5 participants; record verbatim.
- [ ] 30-second proof test.
- [ ] 2-minute tradeoff test.
- [ ] Hiring-manager "would you interview?" test.
- [ ] Browser matrix: Chrome, Safari, Firefox, Edge, iOS, Android.
- [ ] Viewport sweep: 320/360/390/768/1024/1280/1440/1920/2560.
- [x] No-JS pass: content readable, links work, Index panels stacked. Verified 28 Oct 2026 at 390 and 1440; 4 stacked items and 4 header links, no overflow.
- [ ] Reduced-motion pass on macOS/iOS/Windows.
- [ ] Screen-reader pass documented.
- [ ] Fix findings; re-run the failed gate.
- [x] Record the final Lighthouse/axe/link reports in `10-quality-gates.md`.

**Done when:** all nine gates in `10` pass; the recruiter tests meet the pass line or the failures are understood and fixed; no P0 bug remains.

---

## Phase 8 — Launch

- [ ] Freeze content; run the full gate one last time.
- [ ] Set `NEXT_PUBLIC_SITE_URL`, analytics, domain, DNS, SSL.
- [ ] 301 the old origin to the new one (if the domain changes).
- [ ] Verify all four CVs return 200, `application/pdf`, and the correct filename.
- [ ] Submit the sitemap in Google Search Console; request indexing.
- [ ] Check OG previews in LinkedIn, X, Slack.
- [ ] Add the site to GitHub profile, LinkedIn, CV, email signature.
- [ ] Announce only when the site is actually live; no "coming soon".
- [ ] Tag the release `v1.0.0`; keep the previous site tagged for two weeks.
- [ ] Monitor 24h: 404s, analytics, contact links, Vercel errors.

**Done when:** the production domain passes the smoke test in `10`; analytics receives events; no broken links; the CV link works from a logged-out browser.

---

## Phase 9 — Post-launch

| When               | What                                                                           |
| ------------------ | ------------------------------------------------------------------------------ |
| 24 hours           | Check Vercel errors, 404s, analytics, contact links                            |
| 7 days             | Review `case_study_open`, `resume_download`, scroll depth; fix any drop-off    |
| 30 days            | Review qualitative feedback; decide on the fifth case study / form / dark mode |
| Quarterly          | Re-verify metrics and links; update availability; cut stale work               |
| After each project | Add an archive card; promote if evidence is strong                             |

Do not add features in the first two weeks unless they fix a measured problem. Let the site be finished.

---

## Risks and mitigations

| Risk                                      | Likelihood | Impact | Mitigation                                                                     | Trigger                                 |
| ----------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| Capgemini denies screenshots              | Medium     | High   | Sanitized synthetic demo; fallback flagship = Sadine                           | Permission unanswered by end of Phase 0 |
| No time for screenshots/demos             | High       | High   | Cut scope to 3 case studies; never fake visuals                                | Phase 1 day 5                           |
| RAG eval takes longer                     | Medium     | Medium | Publish pipeline metrics + methodology, no outcome claim; run eval post-launch | Phase 1 day 7                           |
| Case-study writing stalls                 | Medium     | High   | Use the 60-second template; write 500 words/day; publish 3 strong files        | Phase 4 day 2                           |
| Scope creep (blog, dark mode, playground) | High       | Medium | Everything not in `01` is out; ADR required                                    | Any new idea                            |
| Performance budget missed                 | Medium     | Medium | Remove Index JS first; lazy video; cut fonts; no animation library             | Lighthouse < 95                         |
| Design drift                              | Medium     | Medium | Token-only components; design QA checklist                                     | Any hardcoded colour                    |
| Private data leaks into a screenshot      | Low        | Severe | Redaction checklist + second review before commit                              | Any image commit                        |
| Domain/DNS delay                          | Low        | Medium | Buy domain in Phase 0; keep Vercel URL as fallback                             | Phase 8                                 |

---

## Cut lines

If the deadline is real, cut in this order:

1. Fifth case study / Wardrobe.
2. Archive cards (keep two public repos).
3. Portrait.
4. Page transitions.
5. Scroll reveals.
6. Copy-email button (keep mailto).
7. `/about` long form (keep a 200-word section on home).

**Never cut:** screenshots, the flagship evidence, the CV, accessibility, performance, the 60-second summary, honesty labels.

---

## Launch criteria

All true:

- [ ] Four case studies (or three + an honest archive) with real visuals.
- [ ] Flagship has a measured result or a clearly labeled `not measured` note.
- [ ] CV is current, one page, ATS-safe, linked everywhere.
- [ ] 5-second test passes 4/5; 30-second test passes.
- [ ] WCAG 2.2 AA checks pass; axe 0 critical/serious.
- [ ] Lighthouse mobile ≥95 all categories; CWV budgets met.
- [ ] No broken links; no dead buttons; no "coming soon".
- [ ] Metadata, OG, sitemap, JSON-LD, analytics verified.
- [ ] Security headers live; CSP enforced locally, deploy check pending.
- [ ] Real-device test passed.
- [ ] Old site backed up/tagged; domain redirect works.

---

## Definition of done for the roadmap

- [ ] Each phase has a recorded output and a gate result.
- [ ] The final commit is tagged.
- [ ] The docs match the shipped site (or the delta is documented).
- [ ] The next content update has an owner and a date.
