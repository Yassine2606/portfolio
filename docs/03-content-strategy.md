# 03 — Content strategy

Status: Locked v1.0 · 27 Oct 2026
Companion: `11-content-templates.md`, `prompts/project-scoping.md`
The code is not the critical path. This document is.

---

## The narrative

One sentence: **I take AI from demo to dependable.**

The site is structured as four acts:

| Act            | Question answered                 | Surface                                              |
| -------------- | --------------------------------- | ---------------------------------------------------- |
| **Proof**      | Can they build it?                | Hero Index + four case studies                       |
| **Method**     | How do they think when it breaks? | "How I work" section + decisions inside case studies |
| **Range**      | Can they own the whole path?      | Project stack, architecture, experience strip        |
| **Invitation** | How do I start?                   | Contact + CV                                         |

The old site tried to prove range with a long single page: engineering clusters, toolbox, philosophy, timeline. The new site proves range through **four deep case studies** and a compact experience strip. Depth is the differentiator; breadth is a side effect of the work.

**Tone:** first person, plain, specific, calm. Confident without adjectives. A senior engineer explaining a system to a smart colleague.

---

## Content pyramid

| Level    | Count | Purpose                                                | Depth                           | Where                       |
| -------- | ----- | ------------------------------------------------------ | ------------------------------- | --------------------------- |
| Flagship | 1     | The strongest proof of AI engineering judgment         | 1,800–2,400 words + 4–6 visuals | `/work/documents-assistant` |
| Featured | 3     | Prove range: product platform, agent/MCP, realtime/IoT | 1,200–1,800 words + 3–5 visuals | `/work/...`                 |
| Archive  | 3     | Show earlier breadth without thin pages                | 80–120 words + 1 visual or link | `/work` cards               |
| About    | 1     | Human context, experience, availability                | 500–700 words                   | `/about`                    |

Launch with four complete case studies. Three archive cards are enough for the rest. Do not publish a thin case study just to fill a grid.

---

## Project selection

Selection criteria, in order:

1. **Relevance** to AI / backend / full-stack roles.
2. **Evidence available** — screenshots, demo, public code, measured result.
3. **Ownership** — what Yassine personally built.
4. **Recency** — 2025–2026 first.
5. **Range** — the set should cover RAG, agents, product platforms, and realtime systems.

### Recommended set

| Role         | Project                                                      | Why it earns the slot                                                                                                     | Evidence today                                                              | Gap                                                                 |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Flagship** | **Documents Assistant** — enterprise RAG, Capgemini PFE 2026 | Deepest AI work: ingestion, hybrid retrieval, verification, citations, provider failover, 9-stage pipeline                | Architecture, code, detailed case study in old repo; private client context | Permission, screenshots, demo, measured retrieval quality           |
| Featured     | **Sadine Tours** — travel platform, 2026                     | Proves product and backend depth: 41 models, 26 modules, 224 route handlers, 3 locales, quote→booking state machine, RBAC | Architecture, metrics, code references                                      | Screenshots (public catalog, admin, customer), permission           |
| Featured     | **Anomaly Detection Agent** — MCP + monitoring, 2025         | Timely agent/MCP work; public repo; clear architecture; tool calling                                                      | Public GitHub, architecture, metrics                                        | Demo recording, screenshots, a measured detection result            |
| Featured     | **RFID Access Control** — IoT + realtime, 2026               | Proves systems thinking: MQTT ingestion, rule engine, audit, realtime dashboard, firmware                                 | Architecture, metrics, dashboard                                            | Screenshots, hardware photo, permission                             |
| Archive      | **Wave** — campus app, 2025                                  | Mobile + payments + push pipeline + realtime                                                                              | Detailed case study in old repo                                             | Permission, screenshots; candidate to promote if visuals are strong |
| Archive      | **TranscriptoSense** — multilingual speech, 2025             | Speech/LLM range; public repo                                                                                             | Public GitHub, architecture                                                 | Demo, screenshots                                                   |
| Archive      | **Data Drift** — ML monitoring, 2025                         | ML evaluation/monitoring depth; public repo                                                                               | Public GitHub, notebooks                                                    | A short visual or notebook result                                   |

**Wardrobe** (AI fashion platform, ongoing) appears on the CV but is not in the old site content. Treat it as a candidate: if it has a real UI and a demo, it may replace an archive card or become a fifth featured project. Do not add it on claims alone.

### Flagship fallback

If Capgemini does not permit public screenshots or a demo:

- **Option A (preferred):** anonymized case study with a synthetic demo. Keep the architecture and decisions; replace client labels with generic ones; build a small synthetic document set; record the flow. Label it `Sanitized client engagement`.
- **Option B:** move Sadine to flagship (strongest visual product story) and keep Documents Assistant as a featured "confidential engagement" with architecture and no UI.
- **Option C:** move Anomaly Detection Agent to flagship (public repo + demo, but less product depth).

Never fake a client screen. A missing screenshot is better than a manufactured one.

---

## The evidence standard

Every checkable statement on the site is a **claim**. Every claim gets one of:

1. **A source:** repo path, commit SHA, benchmark file, screenshot, deployed URL, public document.
2. **An explicit limit:** `Private — architecture only`, `Not measured`, `Scope count, not an outcome`.

No third option. Adjectives are not evidence.

### Frontmatter evidence entry

```yaml
evidence:
  - claim: "Answers are verified against retrieved chunks before streaming."
    kind: repo # repo | deploy | screenshot | benchmark | doc | commit
    source: "ai-service/app/verification/verifier.py"
    href: "https://github.com/…#L…" # optional
    verifiedAt: "2026-10-27"
  - claim: "The client UI is private."
    kind: doc
    source: "Confidential engagement — no public URL"
    verifiedAt: "2026-10-27"
```

### Metric rules

- Maximum **four** metrics per case study. More looks like padding.
- Each metric has `value`, `label`, `kind` (`measured` / `artifact` / `scope`), `source`, and `measuredAt`.
- No composite scores, no percentages without a denominator, no "99.9% uptime" without monitoring data.
- If a number is a count of what was built, call it **scope**. Do not place it next to an outcome as if it were impact.
- If a result is expected but not measured, write `Not measured — next step: …` and keep it out of the metric strip.

### Honesty rules

- Private repos are labeled `Private`, not hidden behind a dead GitHub button.
- Client data is redacted; say so in the caption.
- Solo work says solo. Team work names team size and your role.
- Failures and gaps are named in every case study (`What I'd do differently`).
- Dates are absolute. Update `verifiedAt` when a claim is re-checked.
- No testimonials, logos, or client names without written permission.

---

## Current content audit

### Assets that exist

| Asset                                 | Location                          | Quality                                            | Action                                           |
| ------------------------------------- | --------------------------------- | -------------------------------------------------- | ------------------------------------------------ |
| Site copy (hero, philosophy, contact) | old `src/content/site.json`       | Strong raw material, dark-tech tone                | Rewrite for the dossier voice                    |
| 7 project case studies                | old `src/content/projects/*.json` | Detailed, factual, architecture graphs             | Convert to MDX, tighten to new template          |
| Resume PDFs                           | `Documents/cv/output/`            | New EN/FR designed and ATS versions, one page each | Synced to `public/resume*.pdf` on 27 Oct 2026    |
| OG image                              | old `public/og.png`               | Old design                                         | Replace with generated OG                        |
| Architecture diagrams                 | React components + JSON graphs    | Good node/edge data, dated visual                  | Rebuild as accessible stage cards                |
| Project screenshots                   | **none**                          | **Launch blocker**                                 | Capture in Phase 1                               |
| Demo videos                           | **none**                          | **Launch blocker for flagship**                    | Record in Phase 1                                |
| Public demos                          | **none**                          | Nice to have                                       | Host flagship with synthetic corpus if permitted |
| Blog / notes                          | **none**                          | Out of scope                                       | Do not fake                                      |

### The seven gaps

1. **No screenshots.** The single biggest credibility gap. A recruiter cannot see the product.
2. **Most GitHub links are private.** The site currently shows `Private repo` badges; that is honest, but it means the screenshots must carry the proof.
3. **No measured AI quality.** The flagship has pipeline stages, not retrieval quality. Add a real eval.
4. **CV source lives outside the repo.** The EN/FR designed and ATS PDFs are synced; rebuild and re-copy all four after any fact or metric change.
5. **No short demo.** A 60-second walkthrough is the closest thing to a live product for private work.
6. **Case studies are long and feature-led.** They need a 60-second summary and decision-first structure.
7. **No proof of recency for 2026.** Lead with the Capgemini PFE, Sadine, and RFID; archive 2025 work.

---

## Evidence backlog

### P0 — launch blockers

| #    | Item                | Detail                                                                                                          | Owner   | Output                                            |
| ---- | ------------------- | --------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------- |
| P0-1 | Permissions         | Capgemini, Sadine, RFID, Wave: what can be shown? Get written confirmation.                                     | Yassine | A one-page permissions note per project           |
| P0-2 | Screenshots         | 3–5 per featured project, 16:10, 2560px wide, redacted, captioned                                               | Yassine | `public/work/<slug>/*.webp`                       |
| P0-3 | Flagship demo       | Hosted synthetic-corpus demo **or** a 60–90s captioned walkthrough                                              | Yassine | URL or `public/work/documents-assistant/demo.mp4` |
| P0-4 | RAG evaluation      | 40–60 Q/A pairs over synthetic docs; recall@5, MRR, citation groundedness, abstention on unanswerable questions | Yassine | `docs/evidence/rag-eval.md` + script + results    |
| P0-5 | CV sync             | Done 27 Oct 2026: EN/FR designed and ATS PDFs; re-sync from `Documents/cv/output/` after any change             | Yassine | `public/resume*.pdf`                              |
| P0-6 | Link truth          | Every external link returns 200 or is labeled private; no dead demo buttons                                     | Yassine | Link-check report                                 |
| P0-7 | Public repo hygiene | README, license, `.env.example`, no secrets, run instructions for public repos                                  | Yassine | Updated repos                                     |

### P1 — strengthens the argument

| #    | Item                  | Detail                                                                                    |
| ---- | --------------------- | ----------------------------------------------------------------------------------------- |
| P1-1 | Anomaly demo          | Seeded database with 10–12 known issues; 45s recording of scan → findings → MCP tool call |
| P1-2 | RFID evidence         | Reader/hardware photo + live dashboard + a simulated scan latency run (p50/p95)           |
| P1-3 | Sadine walkthrough    | Public catalog in FR/AR, quote request, customer acceptance, admin booking pipeline       |
| P1-4 | Wave visuals          | App screens for events, chat, push; only if permissions allow                             |
| P1-5 | TranscriptoSense demo | 60s audio → diarized transcript + summary                                                 |
| P1-6 | Data Drift visual     | One chart showing drift detection + the retrain-or-monitor report                         |
| P1-7 | Site case study       | A short "how this site was built" note on `/about` or the footer colophon                 |

### P2 — after launch

- Fifth case study (Wave or Wardrobe) if evidence is strong.
- Interactive RAG demo on a synthetic corpus.
- Short talks / writing, only with real material.

---

## Screenshot shot list

Capture at 2× device pixel ratio, browser chrome included only when it adds context. Redact names, emails, client logos, tokens, and real customer data. Use a neutral demo dataset.

### Documents Assistant

1. Document upload / ingestion queue with formats and status.
2. Chat answer with inline citations and the verification state visible.
3. Retrieval trace: chunks, scores, selected context.
4. Provider failover / settings (Gemini + NVIDIA) if the UI exposes it.
5. Architecture diagram (not a screenshot; a designed figure).

### Sadine Tours

1. Public catalog, French and Arabic (two shots).
2. Quote request form with real fields.
3. Customer quote detail with Accept and expiry.
4. Admin booking pipeline / audit timeline.
5. Invoice or CMS page if visually strong.

### Anomaly Detection Agent

1. Scan configuration with three database connectors.
2. Findings report with severity, impact, effort.
3. MCP server terminal showing tool discovery and a scan call.
4. Architecture diagram.

### RFID Access Control

1. Live decisions dashboard (allow/deny with reason).
2. Employee portal / attendance.
3. Reader hardware photo (clean, no badge data).
4. Architecture diagram.

### Archive cards

One strong image each, or none. A text-only archive card is better than a bad screenshot.

---

## The flagship evaluation

This is the highest-leverage content work in the project. A measured retrieval result turns "I built a RAG app" into "I can tell you whether the RAG app works."

### Minimum viable eval

- **Corpus:** 20–30 synthetic project documents (public, non-client), 4 formats including one scanned PDF.
- **Questions:** 50 total — 35 answerable, 10 multi-hop, 5 unanswerable.
- **Labels:** gold answer + gold supporting chunk(s) per question.
- **Metrics:**
  - `recall@5`: did the gold chunk appear in the top 5?
  - `MRR@10`: how high did the first relevant chunk rank?
  - `citation accuracy`: do cited chunks support the answer? (manual or LLM-judge with a sample audit)
  - `abstention rate` on the 5 unanswerable questions.
  - `p50/p95` end-to-end latency on the demo machine.
- **Report:** method, corpus description, sample size, limitations, raw results table, script command, date.
- **Do not:** call it a benchmark against other systems; call it an internal evaluation of this pipeline.

If the eval is weak, publish it anyway with the limitation and the next fix. A real 0.72 recall with a plan is more credible than a fake 0.95.

---

## Case study shape

Every case study follows the same 60-second contract:

> **Problem** (one sentence) · **Role** (solo/lead/team) · **Constraint** (the hard part) · **Shipped** (what exists) · **Proof** (one link or visual)

Then, in order:

1. Context — why this existed.
2. Problem and constraints — what made it hard.
3. Architecture — one diagram and a plain-language walkthrough.
4. Decisions and tradeoffs — 3–5 decisions, each with the alternative and the cost.
5. Evidence — screenshots, video, metrics with sources.
6. Reliability — what breaks, how it is detected, what happens next.
7. Outcome — what changed, honestly measured.
8. What I'd do differently — the senior signal.

No "features" section. Features belong inside the problem/solution narrative. No "technologies used" wall; the stack appears in context and in the summary box.

Full skeleton: `11-content-templates.md`.

---

## Copy rules

### Do

- Start with the problem, the user, or the constraint.
- Use active voice and concrete nouns: "quote", "scan", "chunk", "migration".
- Define jargon once: "RAG (retrieval-augmented generation)".
- Put the number next to its unit and its source: "p95 latency 1.4s on the demo box".
- Use "I" for solo work. Use "we" only when there was a team; name the team size.
- Write short paragraphs: 2–4 sentences.
- Let one idea own a paragraph.
- Read it aloud. If it sounds like a pitch deck, rewrite it.

### Don't

- "Passionate", "innovative", "cutting-edge", "seamless", "robust", "scalable" without a definition.
- "Leveraged", "harnessed", "spearheaded", "orchestrated" as decoration.
- "AI-powered" as a category.
- Percentages without a denominator.
- "Users love it" without a source.
- Three adjectives in a row.
- Exclamation marks.
- Em dashes as a personality.
- A metaphor in the headline and no literal sentence in the subhead.

### Before / after

| Before                                                            | After                                                                                              |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| "Passionate AI engineer building innovative, scalable solutions." | "I build RAG systems, agents, and the backend that keeps them honest."                             |
| "Implemented a robust quote-to-booking workflow."                 | "Quote acceptance rejects expired quotes inside the transaction and writes an audit row."          |
| "Leveraged cutting-edge LLMs to deliver seamless answers."        | "Answers stream with citations; a verifier rejects unsupported claims before they reach the user." |
| "Built a highly scalable platform with 224 routes."               | "A 26-module Fastify API with 224 route handlers, 41 Prisma models, and three locales."            |

---

## Resume alignment

The CV is part of the content system, not a separate document.

- One page, text-based PDF, no photo for international tech roles. The ATS version is single-column; the designed version may use two columns.
- Same project names, dates, and metrics as the site, or a clearly smaller subset. No contradictions.
- Lead with the Capgemini RAG engagement; then YBInnovations (Wave) and MyMatch, as the current one-page CV does.
- Every bullet: **action + system + constraint + result (or honest scope)**.
- Mirror job-description keywords only where true.
- Link: portfolio URL, GitHub, email. The current PDFs include the phone number; the site UI keeps email only.
- File names: `resume.pdf`, `resume-fr.pdf`, `resume-ats.pdf`, `resume-fr-ats.pdf`.
- Re-generate after any metric change and sync all four files; update the "last updated" note on `/about`.

Bullet templates and examples: `11-content-templates.md`.

---

## Update cadence

| When                        | What                                                             |
| --------------------------- | ---------------------------------------------------------------- |
| After every shipped project | New archive card; promote to featured if evidence is strong      |
| Monthly                     | Link check (CI), broken screenshot check, analytics review       |
| Quarterly                   | Re-verify metrics and dates; cut stale work; update availability |
| Before a job search         | Re-tailor the summary, reorder featured work, refresh the CV     |

Stale evidence is worse than missing evidence. A metric without a current `verifiedAt` date gets demoted or removed.

---

## Definition of done for content

- [ ] Four case studies pass the 60-second test: problem, role, constraint, shipped, proof.
- [ ] Every metric has a source, a method, and a date.
- [ ] Every featured project has ≥3 real screenshots and a captioned demo or live URL.
- [ ] Private work is labeled; no dead links.
- [x] Resume is a one-page subset of the site with no contradictory claims; EN/FR ATS files pass extraction and audit.
- [ ] No banned words in the final copy.
- [ ] The flagship has at least one measured outcome, with limitations.
