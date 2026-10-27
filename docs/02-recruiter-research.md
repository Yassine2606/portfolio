# 02 — Recruiter research

Status: Locked v1.0 · 27 Oct 2026
Purpose: decide what the site must prove, to whom, in what order. This is a design input, not a marketing essay.

---

## How the site is actually used

A portfolio enters a hiring process at three different moments:

1. **Sourcing.** A recruiter opens the link from LinkedIn, a CV, or an outreach message. They are comparing several candidates and have limited time.
2. **Screening.** A hiring manager opens the link after a recruiter pass, often before a first call. They are looking for reasons to say yes — or a specific reason to say no.
3. **Interview preparation.** An interviewer opens a case study to choose questions. The portfolio is now a conversation aid, not a first impression.

Design consequence: the home page must survive a 20-second scan, and a case study must survive a 10-minute read. Those are different layouts and different copy densities. The site cannot be only one of them.

---

## Personas

### 1. Recruiter / talent partner

**Time:** 20–90 seconds, often on mobile.
**Job:** filter for role fit, location, seniority, availability, and evidence of the keywords in the job description.

| They ask                | The site must answer instantly                       |
| ----------------------- | ---------------------------------------------------- |
| What is this person?    | A one-line role, not a metaphor                      |
| Can they work with us?  | Location, timezone, remote/relocation, authorization |
| Are they available?     | An explicit status, with a date if possible          |
| Do they have the stack? | Real project stack, not a logo wall                  |
| Is there a CV?          | One click, every page                                |
| How do I contact them?  | Email and LinkedIn, visible, not hidden in a footer  |

**What wins:** a clear title; a specific headline; "Available immediately" plus a role target; a stack line with the tools that appear in the job description; a case study card with a real screenshot; a CV button that works.

**What loses:** "I turn ideas into reality"; an availability badge that says "open to opportunities" but no role; a CV link that opens a generic Google Drive folder; a contact page with only a form.

### 2. Hiring manager / tech lead

**Time:** 3–10 minutes.
**Job:** assess judgment. They have seen many portfolios that list technologies; they are looking for someone who has made decisions under constraints.

| They ask                      | What earns a yes                                           |
| ----------------------------- | ---------------------------------------------------------- |
| What did they actually build? | A concrete system, with a boundary and a user              |
| What was their role?          | Solo / lead / team size, named honestly                    |
| Why this architecture?        | Alternatives considered, and the cost of the choice        |
| What broke?                   | Failure modes, detection, and what changed                 |
| Is the result real?           | A measured number, a screenshot, a repo, or "not measured" |
| Can they communicate?         | Short sentences, defined jargon, no hype                   |

**What wins:** a 60-second summary before the depth; one diagram that explains the system; three tradeoffs with alternatives; a "what I'd do differently" section; honest labels on private work.

**What loses:** a feature list with no problem; architecture diagrams that are decoration; "built a scalable system" with no scale; metrics with no method; a wall of text with no visual anchor.

### 3. Founder / CTO (small team)

**Time:** 2–5 minutes.
**Job:** decide whether this person can own an outcome without a support system.

| They ask                                        | The site must show                                   |
| ----------------------------------------------- | ---------------------------------------------------- |
| Do they start at the problem or the technology? | Problem-first case studies                           |
| Can they ship the whole thing?                  | AI + backend + frontend + deploy in the same project |
| Do they handle ambiguity?                       | Constraints, missing data, changing scope            |
| Will they tell me bad news early?               | Honest limitations and failure sections              |
| Can I put them in front of a client?            | Clear writing, calm tone, real screenshots           |

**What wins:** end-to-end scope; a product with real workflows; a state machine or a reliability story; a short "how I work" section backed by evidence.

**What loses:** a portfolio that is only model demos; no product surface; no deployment; no mention of cost, latency, or maintenance.

### 4. Engineer peer

**Time:** 2–10 minutes, often from a shared link.
**Job:** decide whether the work is technically credible and whether this person is worth referring.

**What wins:** an architecture that matches the code; named tools; a link to a public repo; a tradeoff they disagree with but respect; clean diagrams.

**What loses:** vague boxes labelled "AI"; inconsistent stack names; a diagram that does not match the screenshots; private work with no explanation.

---

## The scan path

Most visitors do not read top-to-bottom. They fixate in this order:

1. **Name + role + availability** (top-left / eyebrow).
2. **Headline** (largest text). It must say what he builds, not how he feels.
3. **The first proof surface** — the Index or the first project card.
4. **The CV or contact action** — usually a header control.
5. **One project** — whichever looks most real.
6. **The about / experience strip** — only after the work looks credible.
7. **Contact** — or they leave to find the CV.

Design consequence: the header, hero, Index, first project, and CV button must all be present in the first viewport on a 1440×900 desktop and within one scroll on a 390×844 phone. Everything else can be earned.

### The mobile scan

Recruiters often open links on a phone between meetings. On mobile:

- The headline must not push the first project below three screens.
- The Index must become an accordion, not a hover-only interaction.
- The CV button must be in the header menu, not only in the footer.
- Screenshots must be readable at 390px wide; crop to the UI, do not shrink a full desktop.
- Tap targets ≥ 44px; no hover-only evidence.
- The page must not autoplay video or open a modal on load.

---

## Evidence hierarchy

Not all proof is equal. Put the strongest available evidence first, and label the rest.

| Rank | Evidence                           | Why it is strong               | Requirement                             |
| ---- | ---------------------------------- | ------------------------------ | --------------------------------------- |
| 1    | Live product / demo                | Someone can use it             | Working URL, no login, no client data   |
| 2    | Real screenshot / screen recording | Shows the product exists       | Real UI, redacted, captioned            |
| 3    | Public code                        | Verifiable implementation      | Clean README, no secrets, license       |
| 4    | Architecture + decisions           | Shows judgment                 | Matches the code, names real components |
| 5    | Measured result                    | Quantifies an outcome          | Method, sample, date, source            |
| 6    | Written case study                 | Explains context and tradeoffs | Specific, honest, readable              |
| 7    | Stack list / capability claim      | Weak alone                     | Must link to a project where it is used |

**Rule:** never promote lower-ranked evidence to look like higher-ranked evidence. A diagram is not a demo. A scope count is not an outcome. A private repo is not a public one.

### Scope metrics vs outcome metrics

| Type     | Example                                                          | What it proves       | Label                           |
| -------- | ---------------------------------------------------------------- | -------------------- | ------------------------------- |
| Scope    | "41 Prisma models", "26 backend modules"                         | Size and breadth     | `Scope`                         |
| Artifact | "3 locales", "224 route handlers"                                | What exists          | `Artifact`                      |
| Outcome  | "p95 retrieval latency 180ms", "42% of answers required no edit" | Effect               | `Measured`                      |
| Adoption | "used by 200 students"                                           | Real usage           | `Measured` — only with a source |
| Quality  | "recall@5 = 0.86 on a 60-question eval"                          | Model/system quality | `Measured` + method             |

A portfolio full of scope metrics reads like a résumé of effort. A portfolio with one real outcome metric is more convincing. Aim for at least one measured outcome in the flagship case study, and label scope counts honestly elsewhere.

---

## What convinces

### 1. Specificity

"The quote acceptance path rejects expired quotes inside the transaction and writes an audit row" beats "implemented a robust booking flow." Specificity is the difference between a claim and a story.

### 2. A visible decision

Show one decision where a reasonable engineer could have chosen differently:

- Hand-written RAG instead of a framework.
- Two data stores instead of one.
- Private repo instead of a public demo.
- No tests at launch, stated as a gap.

The alternative and its cost are the proof of judgment.

### 3. A real surface

A screenshot of a working UI, even a rough one, does more than a polished abstract diagram. Recruiters are pattern-matching for "has this person shipped something a user touched?"

### 4. Honest limits

"No automated tests yet" or "client data redacted" increases trust. Junior portfolios hide gaps; senior portfolios name them and say what they would do next.

### 5. Recency and relevance

A 2026 AI project is worth more than a 2022 CRUD app. Lead with the work closest to the role. Archive the rest without deleting it.

### 6. Clear next action

"Read the case file", "Download CV", "Email me" — one primary action per surface. A recruiter should never have to guess what to do next.

---

## What repels

| Pattern                               | Why it hurts                     | Replacement                              |
| ------------------------------------- | -------------------------------- | ---------------------------------------- |
| Skill bars / percentages              | Unverifiable, dated, meaningless | Project-backed capabilities              |
| "Passionate about AI"                 | Says nothing                     | A specific problem you keep returning to |
| Logo walls                            | Claims without context           | 4–6 tools used in a named project        |
| Fake metrics                          | Destroys trust when checked      | Source + method, or omit                 |
| Testimonials from unnamed people      | Unverifiable                     | Named references only, or none           |
| 3D / WebGL hero that delays content   | Punishes the reviewer            | Typography + real work                   |
| Custom cursor / scroll-jacking        | Breaks expected behavior         | Standard scroll, crafted details         |
| Autoplay audio                        | Instant close                    | Silent video, opt-in sound               |
| Hidden CV                             | Friction at the decision point   | Header button, every page                |
| Broken "Live demo" / "GitHub" buttons | Suggests the work is not real    | Hide the button or label private         |
| Walls of text                         | No scan path                     | 60-second box + short sections           |
| "Coming soon" sections                | Signals unfinished               | Ship fewer, finished things              |
| Generic project names                 | Hard to remember                 | Named systems with a one-line hook       |

---

## Reference set

Study these for structure and craft; do not copy the visual style. Sites change, so re-check before borrowing.

| Site                  | Study                                                       | Do not copy                         |
| --------------------- | ----------------------------------------------------------- | ----------------------------------- |
| `brittanychiang.com`  | Scannable work cards, clear CV CTA, low-friction navigation | The exact dark layout or card style |
| `rauno.me`            | Restraint, interaction detail, typographic confidence       | Novelty that hides content          |
| `joshwcomeau.com`     | Teaching through interaction; generous explanation          | Turning a portfolio into a course   |
| `leerob.com`          | Metadata, SEO, simple navigation, content discipline        | A blog without a writing practice   |
| `bruno-simon.com`     | Memorability and a single strong concept                    | The load cost of a 3D experience    |
| `maggieappleton.com`  | Distinctive editorial voice and visual identity             | Burying the work under essays       |
| `aristidebenoist.com` | Motion pacing and craft                                     | Style over substance                |

**The lesson:** the memorable sites have one idea carried through every detail. The forgettable ones have ten ideas competing. This build has two: **the Index** and **the evidence margin**. Everything else supports them.

---

## The tests, with scripts

Run these in Phase 7 with 5 people who hire engineers. Do not explain the site first.

### Five-second test

> "I'm going to show you a page for five seconds. Then I'll hide it and ask three questions."

1. What does this person do?
2. Where are they based, and are they available?
3. What would you click first?

Record verbatim answers. Pass: 4/5 on role, 4/5 on availability/location, 4/5 choose work or CV.

### 30-second proof test

> "Find evidence that this person has shipped production AI. Think aloud."

Observe: first click, time to a case study, whether they find a screenshot. Pass: names one system and one technology within 30 seconds.

### Two-minute tradeoff test

> "Open any case study and explain one tradeoff this person made."

Pass: names the alternative and the cost. Fail: reads a feature list.

### Hiring-manager test

> "Would you interview this person? What would you ask first?"

Pass: yes + a specific technical question. Fail: "maybe", or questions only about the design.

### Recruiter test

> "You have 20 seconds. Is this person a fit for an AI engineer role? Why?"

Pass: role, stack, location, CV. Fail: "I'd need to read more."

---

## Keyword and ATS notes

The site is read by humans; the CV is read by both humans and software. Keep them consistent.

- Role titles to use naturally: **AI Engineer**, **Applied ML Engineer**, **Full-Stack AI Engineer**, **Founding Engineer**.
- Stack keywords that appear in real projects: Python, FastAPI, TypeScript, Node.js, Next.js, React, PostgreSQL, pgvector, RAG, LLM, MCP, Docker, Redis, Prisma, Fastify.
- Do not stuff. A keyword that appears once in a project stack is enough if the project supports it.
- The CV must be a text-based PDF, one page, no columns that scramble parsing, no photo for international tech roles, no headers/footers with contact details that ATS may drop.
- File name: `Yassine-Ben-Romdhane-AI-Engineer.pdf`.
- The site and CV must use the same project names, dates, and metrics.

---

## Measurement

Track only what informs decisions. No vanity dashboard.

| Event                         | Why                           |
| ----------------------------- | ----------------------------- |
| `case_study_open` (slug)      | Which work earns attention    |
| `resume_download`             | The recruiter conversion      |
| `contact_click` (channel)     | Which channel works           |
| `demo_click` (slug)           | Whether live proof is used    |
| `scroll_depth` (page, 50/90%) | Whether case studies are read |
| `outbound_link` (host)        | GitHub / LinkedIn intent      |

Use Vercel Analytics (cookieless) or an equivalent privacy-friendly tool. No cross-site tracking, no cookie banner, no PII in event properties.

Set a baseline for two weeks after launch; do not invent conversion targets before there is traffic. The qualitative tests matter more than the dashboard at this scale.

---

## Research conclusions

1. **The first viewport is a screening decision.** Role, location, availability, proof, CV. No exceptions.
2. **The case study is the hiring argument.** The home page only has to earn the click.
3. **One measured outcome beats ten scope counts.** Build the evidence backlog around this.
4. **Private work is acceptable if labeled.** Fake work is not.
5. **Visual proof is the biggest current gap.** No screenshots = no proof, regardless of copy quality.
6. **The site must be fast and accessible.** A hiring manager on a phone on 4G is the real test, not a desktop lighthouse score.
7. **One idea carried through.** The Index and the evidence margin; cut everything that competes.
