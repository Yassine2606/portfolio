# 12 — Decision log

Status: Living · Started 27 Oct 2026
Format: context → decision → consequences → alternatives → revisit trigger.
Append new entries; do not rewrite history. If a decision changes, add a new ADR that supersedes the old one.

---

## ADR-001 — Next.js static-first

**Status:** Accepted · 27 Oct 2026
**Context:** A recruiter-facing portfolio needs crawlable case-study pages, per-page metadata, OG images, a sitemap, and excellent mobile performance. The author already knows Next.js; the old portfolio is Next 16.
**Decision:** Use Next.js 16 App Router with all public routes statically generated. Server components by default; client islands only for the Index, mobile menu, and copy-email.
**Consequences:** Static HTML per case study, strong SEO, cheap hosting, a familiar build. Cost: framework upgrade churn; more config than Vite; the App Router has its own sharp edges.
**Alternatives:** Vite SPA (weaker SEO/metadata without a prerender layer), Astro (excellent content site, but less familiar and a different React integration), Remix (SSR unnecessary).
**Revisit if:** the static build becomes the bottleneck, or the site needs per-request personalization (it should not).

---

## ADR-002 — Light-first dossier, no dark mode at launch

**Status:** Accepted · 27 Oct 2026
**Context:** AI portfolios overwhelmingly use dark backgrounds with neon accents. Long case studies are harder to read on dark, and the evidence margin needs clear contrast. Dark mode doubles the token and testing surface.
**Decision:** Ship a light, warm-paper design only. Include `color-scheme: light`; structure tokens so a dark theme is a later swap. No theme toggle.
**Consequences:** Distinctive in a sea of dark AI sites; better long-form readability; one visual system to test. Cost: visitors who prefer dark mode get no option; a future dark theme needs a full contrast pass.
**Alternatives:** dark primary (generic, harder to read), system-preference toggle (scope), both at launch (time).
**Revisit if:** analytics or recruiter feedback shows a strong preference, or after launch with a complete token audit.

---

## ADR-003 — Dedicated case-study routes

**Status:** Accepted · 27 Oct 2026
**Context:** The old site opened case studies in a modal on one page. That blocked shareable URLs, search results, link previews, and interview prep.
**Decision:** Each featured project gets `/work/[slug]`, statically generated, with its own metadata, OG image, JSON-LD, and sitemap entry. The home page earns the click; the case file closes the argument.
**Consequences:** Deeper content, better SEO, a link a recruiter can forward. Cost: four pages of long-form writing and per-page metadata.
**Alternatives:** modal-only (worse for sharing), one long page (harder to scan), PDF case studies (not indexable).
**Revisit if:** analytics show case studies are never opened; unlikely.

---

## ADR-004 — Four featured projects + three archive cards

**Status:** Accepted · 27 Oct 2026
**Context:** Seven projects exist. Not all have the same evidence or relevance. A grid of seven equal cards flattens the argument.
**Decision:** Feature Documents Assistant (flagship), Sadine Tours, Anomaly Detection Agent, and RFID Access Control. Keep Wave, TranscriptoSense, and Data Drift as archive cards. No thin case-study pages.
**Consequences:** Depth over breadth; a clear flagship; the archive still shows range. Cost: three projects get less attention; the flagship depends on Capgemini permission.
**Alternatives:** three featured (too narrow), seven featured (thin), only AI projects (loses full-stack proof).
**Revisit if:** the flagship is blocked and Sadine becomes the lead; or Wardrobe gains strong evidence and replaces an archive card.

---

## ADR-005 — MDX + zod, no CMS

**Status:** Accepted · 27 Oct 2026
**Context:** Case studies are long-form, component-rich, and change a few times a year. A CMS adds a service, auth, and a network dependency for a solo site.
**Decision:** Author case studies in MDX with typed frontmatter validated by zod at build. Compile with `next-mdx-remote/rsc`; inject a fixed component map. Build fails on invalid content.
**Consequences:** Content lives with code; full component power; no runtime content API; a bad file fails the build. Cost: editing Markdown, no visual editor; MDX upgrade risk.
**Alternatives:** JSON + templates (rigid prose), a CMS (overhead), TSX content (noisy prose).
**Revisit if:** a non-technical editor needs to publish, or MDX tooling breaks on a Next upgrade. Fallback: typed TSX modules.

---

## ADR-006 — CSS-first motion, no animation runtime

**Status:** Accepted · 27 Oct 2026
**Context:** The site needs a polished hero, an Index transition, and hover states — not scroll choreography. Framer Motion costs ~30–40KB gzipped and adds a client boundary; the JS budget is 120KB.
**Decision:** Use CSS keyframes, transitions, and progressive scroll-driven animations. The Index and mobile menu use small React state islands with CSS transitions. No Motion, anime.js, GSAP, or Three.js at launch.
**Consequences:** Smaller bundle, fewer dependencies, native reduced-motion support. Cost: no layout animations or complex orchestration; if a future interaction needs them, it must be isolated and measured.
**Alternatives:** Framer Motion for the Index (bundle cost), GSAP (another runtime), no motion (less craft).
**Revisit if:** a specific interaction cannot be expressed in CSS at acceptable quality — add Motion to that island only, with a bundle measurement.

---

## ADR-007 — No WebGL, 3D, custom cursor, or scroll-jacking

**Status:** Accepted · 27 Oct 2026
**Context:** Awwwards-style sites often use 3D and scroll effects. They also load slowly, break on mid-range phones, and can obscure the work.
**Decision:** The signature is the Index and the evidence margin, not a 3D object. No Three.js, no particles, no custom cursor, no pinned scroll, no horizontal scroll.
**Consequences:** Fast, accessible, content-first; the craft shows in typography, layout, and evidence. Cost: less immediate visual spectacle; the site must earn attention through the work.
**Alternatives:** a 3D hero (memorable, expensive), a scroll-driven case study (fragile), a custom cursor (novelty).
**Revisit if:** a lightweight 3D element can be proven to add meaning and stay under budget on a mid-range phone. Unlikely at launch.

---

## ADR-008 — Contact by email/LinkedIn; no form at launch

**Status:** Accepted · 27 Oct 2026
**Context:** A contact form adds a server route, spam handling, rate limiting, error states, and a delivery dependency. Recruiters usually use email or LinkedIn anyway.
**Decision:** Ship a contact block with a visible email, copy button, GitHub, LinkedIn, and resume. No form. Revisit only if analytics shows contact intent without action.
**Consequences:** Less code, no spam, no PII storage, no 503 states. Cost: no in-page message capture; some visitors prefer a form.
**Alternatives:** Resend form (scope), Formspree (third party), mailto only (less friendly).
**Revisit if:** 30-day analytics show high contact-section engagement and low email clicks, or a recruiter explicitly asks for a form.

---

## ADR-009 — The evidence margin is the signature

**Status:** Accepted · 27 Oct 2026
**Context:** "Evidence over claims" is the positioning. A philosophy section would state it; a layout can prove it.
**Decision:** Every checkable claim can carry a source in a right-hand margin on wide screens and under the claim on mobile. It is CSS-only, in reading order, printable, and accessible. The hero Index is the visual delivery.
**Consequences:** A distinctive, meaningful detail; no tooltip/JS fragility; the site practices what it claims. Cost: authoring discipline; a claim without a source stands out.
**Alternatives:** hover tooltips (inaccessible), footnotes only (less visible), a separate "evidence" page (easy to ignore).
**Revisit if:** the margin causes horizontal overflow at any width or overwhelms the prose. Fix the layout, not the concept.

---

## ADR-010 — Typography: Bricolage Grotesque + Instrument Sans + JetBrains Mono

**Status:** Accepted · 27 Oct 2026
**Context:** The default AI portfolio uses Inter, Space Grotesk, or a system font. The dossier needs a distinctive display face that still reads as technical, a body face for long text, and a mono for labels.
**Decision:** Bricolage Grotesque (display), Instrument Sans (body), JetBrains Mono (labels), Instrument Serif Italic (one accent per page). All free, variable where possible, self-hosted via `next/font`.
**Consequences:** A recognizable voice; strong long-form readability; no font licensing cost. Cost: four families to load; only two preload; total font weight must stay under 180KB.
**Alternatives:** Instrument Serif as display (too editorial), Space Grotesk (AI-default), Inter (banned), a paid face (budget/licensing).
**Revisit if:** the font payload exceeds budget or Bricolage renders poorly at small sizes. Body remains Instrument Sans.

---

## ADR-011 — Cut standalone Toolbox, Philosophy, Engineering, AI Systems sections

**Status:** Accepted · 27 Oct 2026
**Context:** The old single page had sections for capabilities, tools, philosophy, and AI systems. They repeated claims that case studies can prove and lengthened the scan.
**Decision:** Fold capabilities into project stacks and case studies; fold philosophy into "How I work" with evidence links; put the full stack on `/about`. No separate Toolbox, Engineering, Philosophy, or AI Systems section.
**Consequences:** A shorter, sharper home page; every claim has a project behind it. Cost: less visible keyword surface for recruiters; mitigated by `/about` and project stacks.
**Alternatives:** keep the sections (bloat), merge into a mega-section (harder to scan), remove entirely (loses context).
**Revisit if:** recruiter testing shows the stack is hard to find. Add a compact stack strip, not a section.

---

## ADR-012 — Vercel + cookieless analytics

**Status:** Accepted · 27 Oct 2026
**Context:** The site is static; previews and rollbacks are valuable; cookie-based analytics would require a consent banner.
**Decision:** Host on Vercel. Use Vercel Analytics + Speed Insights, both cookieless and first-party. No Google Analytics, no heatmaps, no session recording.
**Consequences:** Simple deploys, preview URLs, field CWV, no banner. Cost: vendor coupling; analytics limited to aggregate events.
**Alternatives:** Netlify/Cloudflare Pages (fine, less integrated), Plausible (paid), GA4 (cookies/consent).
**Revisit if:** hosting costs change or the analytics lack a needed event. Export data before switching.

---

## ADR-013 — No blog, notes, or playground at launch

**Status:** Accepted · 27 Oct 2026
**Context:** A blog with no cadence looks abandoned. A playground adds API keys, cost, abuse, and maintenance. Both compete with the evidence sprint.
**Decision:** Launch with the portfolio only. No blog, no newsletter, no AI playground, no chatbot. Add writing only after three real posts exist; add a demo only with a synthetic corpus and a clear maintenance owner.
**Consequences:** Focus; less surface to maintain. Cost: fewer ways to show expertise; the case studies must carry the depth.
**Alternatives:** a notes section with two posts (thin), a playground (scope), a newsletter (no audience).
**Revisit if:** there is a publishing cadence and a reason beyond "more content".

---

## ADR-014 — Private work is labeled, never faked

**Status:** Accepted · 27 Oct 2026
**Context:** Most client work is private. Fake screenshots or invented demos would be easy and would destroy trust when checked.
**Decision:** Label private projects. Use real architecture, real decisions, and a synthetic demo where permitted. If a client denies permission, use an anonymized case study or move the project to archive. Never fabricate a UI, metric, logo, or testimonial.
**Consequences:** Credibility; legal safety; honest gaps. Cost: less visual proof for private work; the demo/eval becomes more important.
**Alternatives:** mockups passed as real (rejected), skip private work (loses the flagship), vague "confidential" cards (weak).
**Revisit if:** never. This is a hard rule.

---

## ADR-015 — English only

**Status:** Accepted · 27 Oct 2026
**Context:** Yassine speaks Arabic, French, and English. The target roles are international AI engineering roles; the CV is in English. Translating four long case studies triples the content and QA surface.
**Decision:** Launch in English. List languages on `/about`. No i18n framework, no locale routes. If a French-market search becomes a priority, add `/fr` later with translated summaries, not full case studies.
**Consequences:** One canonical version; simpler SEO. Cost: French-speaking recruiters read English (common in tech).
**Alternatives:** bilingual at launch (scope), French-first (narrower), machine translation (quality risk).
**Revisit if:** a significant share of target roles is French-only.

---

## ADR-016 — No testimonials, logos, or "trusted by" wall

**Status:** Accepted · 27 Oct 2026
**Context:** Social proof is common on portfolios, but unnamed quotes and client logos are unverifiable and often unauthorized.
**Decision:** Omit testimonials and logo walls at launch. If a named reference is available with written permission, add one quote with a real name, role, and link. Client names/logos only with permission.
**Consequences:** No borrowed credibility; the work must speak. Cost: less traditional social proof.
**Alternatives:** anonymous quotes (rejected), logo wall (permission/scope), none (chosen).
**Revisit if:** a named reference volunteers and permission is written.

---

## ADR-017 — One-click PDF resume, no HTML resume at launch

**Status:** Accepted · 27 Oct 2026
**Context:** Recruiters need a file to attach to an ATS; a web resume can be useful but duplicates content.
**Decision:** One ATS-safe PDF, linked from the header, contact, and footer. No `/resume` HTML page at launch. The PDF is generated from the same source content and re-exported when metrics change.
**Consequences:** One artifact to keep current; ATS-friendly. Cost: mobile readers get a PDF; acceptable.
**Alternatives:** HTML resume (duplicate), both (scope), no PDF (friction).
**Revisit if:** analytics shows mobile users bouncing on the PDF; add an HTML view later.

---

## ADR-018 — Sharp 2px geometry, no shadows or glass

**Status:** Accepted · 27 Oct 2026
**Context:** Rounded cards, soft shadows, and glassmorphism are the default AI portfolio look. The dossier needs structure, not softness.
**Decision:** 2px radius on cards/buttons/figures; pill only for the availability status and tags; no drop shadows; elevation via 1px lines and `paper-raised`. No blur.
**Consequences:** A sharper, more editorial system; less depth but more clarity. Cost: less "premium app" softness; must rely on type and rules.
**Alternatives:** 12px cards + shadows (generic), glass nav (unreadable), zero radius (harsh).
**Revisit if:** usability testing shows the 2px geometry reads as unfinished; adjust radius, not shadows.

---

## ADR-019 — Custom domain, old origin 301

**Status:** Proposed · 27 Oct 2026
**Context:** The current site is on `yassine-ben-romdhane.vercel.app`. A custom domain is more memorable and better for a CV.
**Decision:** Buy a short personal domain (verify availability; budget ≤ $20/year). 301 the old vercel.app origin to the new domain. Keep `/resume.pdf` working.
**Consequences:** Better recall and professionalism; a small annual cost; DNS setup. Cost: domain can be squatted; choose a sensible fallback.
**Alternatives:** stay on vercel.app (free, forgettable), use a GitHub Pages URL (worse).
**Revisit if:** the domain is unavailable or the budget is not approved. Do not launch with a broken canonical.

---

## ADR-020 — Fifth case study deferred

**Status:** Proposed · 27 Oct 2026
**Context:** Wave, TranscriptoSense, Data Drift, and Wardrobe could each become a case study, but four deep files are enough for launch and the evidence sprint is the bottleneck.
**Decision:** Launch with four. Revisit Wave or Wardrobe after launch if real screenshots and a demo exist. Do not add a fifth page without the same evidence standard.
**Consequences:** Focus; the archive still shows range. Cost: less breadth on the work index.
**Revisit if:** the four launch files are complete and a fifth has strong visuals plus a measured result.

---

## Open decisions

| #   | Question                                             | Owner   | Needed by   |
| --- | ---------------------------------------------------- | ------- | ----------- |
| 1   | Exact availability date and notice period            | Yassine | Phase 0     |
| 2   | Remote / relocation / work authorization             | Yassine | Phase 0     |
| 3   | Capgemini disclosure scope                           | Yassine | Phase 0     |
| 4   | Flagship demo format (synthetic corpus vs recording) | Yassine | Phase 1     |
| 5   | Domain choice                                        | Yassine | Phase 0     |
| 6   | Phone number on the public resume                    | Yassine | Phase 1     |
| 7   | Portrait yes/no                                      | Yassine | Phase 4     |
| 8   | Fifth case study (Wave vs Wardrobe)                  | Yassine | Post-launch |
| 9   | Contact form after 30 days                           | Yassine | Post-launch |
| 10  | Dark mode after launch                               | Yassine | Post-launch |

---

## Supersession rule

If a new decision contradicts an accepted ADR:

1. Add a new ADR titled `ADR-0XX — Supersedes ADR-0YY`.
2. State what changed and why.
3. Update the affected docs in the same commit.
4. Mark the old ADR `Superseded by ADR-0XX`; do not delete it.
