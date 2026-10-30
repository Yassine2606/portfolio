# 11 — Content templates

Status: Locked v1.0 · 27 Oct 2026
Use these templates verbatim until there is a reason not to. They exist to prevent blank-page drift and generic copy.

---

## 1. Case study frontmatter

```yaml
---
title: "Documents Assistant"
tagline: "A conversational RAG agent that cites its evidence."
summary: "A private-document assistant with hybrid retrieval, citation-grounded answers, a verification step, and provider failover. Built as a final-year engagement at Capgemini Engineering."
year: 2026
role: "Solo engineer"
duration: "Final-year project (PFE)"
team: "1 engineer + enterprise stakeholders"
status: "internal"
featured: true
order: 1
confidentiality: "partially-private"
capabilities: ["RAG", "Embeddings", "Vector Search", "Tool Calling", "LLM Pipelines"]
stack:
  ai: ["Gemini 2.5 Flash", "NVIDIA NIM", "sentence-transformers"]
  backend: ["Node.js", "Express", "TypeScript", "Python", "FastAPI"]
  frontend: ["React", "Vite", "TanStack Query"]
  infra: ["Docker", "Docker Compose", "Redis", "BullMQ"]
  data: ["PostgreSQL", "pgvector"]
links:
  - label: "Walkthrough"
    href: "https://example.com/documents-assistant-demo"
    kind: "demo"
metrics:
  - label: "Recall@5"
    value: "0.00"
    kind: "measured"
    source: "docs/evidence/rag-eval.md"
    href: "https://github.com/…#…"
    measuredAt: "2026-10-27"
evidence:
  - claim: "Answers are verified before streaming."
    kind: "repo"
    source: "ai-service/app/verification/verifier.py"
    href: "https://github.com/…#L…"
    verifiedAt: "2026-10-27"
  - claim: "The client data is private."
    kind: "doc"
    source: "Confidential engagement; demo uses a synthetic corpus."
    verifiedAt: "2026-10-27"
seo:
  title: "Documents Assistant — Production RAG with cited answers"
  description: "A RAG assistant for private documentation: hybrid retrieval, citation-grounded answers, verification, and provider failover. Architecture, tradeoffs, and evaluation."
  ogAlt: "Documents Assistant case study — a chat answer with numbered citations"
---
```

**Rules:** replace `0.00` with a real measured value before launch, or remove the metric. A placeholder metric is a lie waiting to ship.

---

## 2. Case study MDX skeleton

```mdx
<Intro>One paragraph: the system, the user, the constraint. No history lesson.</Intro>

## Context

Why this existed. Who used it. What the setting was. Two to four paragraphs.

## Problem and constraints

What made it hard. The constraint that could not move (privacy, latency, cost,
legacy data, a deadline). A short list is fine.

- Constraint one
- Constraint two

## Architecture

<Architecture
  summary="Plain-language walkthrough: the React client calls the Express API; ingestion jobs run in BullMQ; the FastAPI service parses, chunks, embeds, and stores in pgvector; answers are verified before streaming."
  nodes={[
    { stage: "Client", name: "React app", type: "frontend", detail: "Upload, chat, citations." },
    { stage: "API", name: "Express API", type: "backend", detail: "Auth, jobs, SSE." },
    {
      stage: "AI",
      name: "FastAPI service",
      type: "service",
      detail: "Parse, chunk, retrieve, verify.",
    },
    {
      stage: "Data",
      name: "PostgreSQL + pgvector",
      type: "data",
      detail: "Documents, chunks, embeddings.",
    },
  ]}
/>

Two to four paragraphs explaining the flow and why the boundaries sit where they do.

## Decisions and tradeoffs

<Decision
  title="Hand-written retrieval instead of a framework"
  choice="A small retrieval module with explicit scoring and fusion."
  alternative="LangChain or LlamaIndex."
  why="The team needed to inspect and tune every step; a framework hid the failure modes."
  cost="More code to maintain; no ecosystem shortcuts."
/>

Three to five decisions. Each one names the alternative and the cost.

## Evidence

<Figure
  src="/work/documents-assistant/chat-citations.webp"
  alt="Chat answer with numbered citations beside the retrieved document excerpts."
  caption="Answers stream with citations; the verifier blocks unsupported claims. Client data is redacted; the demo corpus is synthetic."
  width={1600}
  height={1000}
/>

<Claim
  n={1}
  source="repo"
  href="https://github.com/…#L…"
  note="ai-service/app/verification/verifier.py"
>
  The verifier checks each answer against retrieved chunks before the stream is committed.
</Claim>

<Video
  src="/work/documents-assistant/walkthrough.mp4"
  poster="/work/documents-assistant/walkthrough-poster.webp"
  captions="/work/documents-assistant/walkthrough.vtt"
  caption="A 72-second walkthrough with a synthetic corpus: upload, ask, inspect citations, and an unanswerable question."
/>

## Reliability

What breaks. How it is detected. What the fallback is. What still breaks today.

| Failure                 | Detection                    | Response                               |
| ----------------------- | ---------------------------- | -------------------------------------- |
| LLM provider rate limit | Error mapping + retry budget | Failover to the second provider        |
| Empty retrieval         | Score threshold              | Answer "not found" instead of guessing |
| Ingestion backlog       | Queue depth                  | Backpressure + status in the UI        |

## Outcome

What changed. Measured vs expected. Include the limits.

<Metric
  label="Recall@5"
  value="0.00"
  kind="measured"
  source="docs/evidence/rag-eval.md"
  measuredAt="2026-10-27"
/>

Two paragraphs. Do not claim impact that was not measured.

## What I'd do differently

- Concrete change one.
- Concrete change two.
- Concrete change three.
```

### Word budget

| Section                 | Flagship        | Featured        |
| ----------------------- | --------------- | --------------- |
| Intro + context         | 250–350         | 180–250         |
| Problem/constraints     | 200–300         | 150–250         |
| Architecture            | 300–400         | 200–300         |
| Decisions (3–5)         | 450–650         | 300–450         |
| Evidence captions       | 100–150         | 80–120          |
| Reliability             | 150–250         | 100–180         |
| Outcome                 | 150–250         | 100–180         |
| What I'd do differently | 100–150         | 80–120          |
| **Total**               | **1,800–2,400** | **1,200–1,800** |

If a section is longer, cut. The reader is deciding, not reading a memoir.

---

## 3. The 60-second summary box

Rendered from frontmatter, not authored in MDX.

| Field      | Max                  | Example                                                           |
| ---------- | -------------------- | ----------------------------------------------------------------- |
| Problem    | 1 sentence, 18 words | "Answers over private project docs had to be cited, not guessed." |
| Role       | 3–6 words            | "Solo engineer · 2026"                                            |
| Constraint | 1 sentence, 14 words | "Client data could not leave the deployment."                     |
| Proof      | 3–6 words            | "Eval + demo + architecture"                                      |

**Test:** a reader who stops after this box can say what it is, whether it shipped, and why it was hard.

---

## 4. Decision block

```mdx
<Decision
  title="Two data stores under one API"
  choice="PostgreSQL for the social core; MongoDB for conversations and marketplace documents."
  alternative="One PostgreSQL schema with JSONB columns."
  why="Each store matched the shape of its data; the team already operated both."
  cost="Two backup policies, two migration paths, and a service layer that must choose correctly."
/>
```

Rules:

- 3–5 per case study.
- One decision per paragraph.
- No decision without an alternative.
- No alternative without a cost.
- If the cost is "none", it was not a decision.

---

## 5. Evidence entry

```yaml
- claim: "Quote acceptance rejects expired quotes inside the transaction."
  kind: repo
  source: "sadine-back/src/modules/quotes/quotes.service.ts"
  href: "https://github.com/…#L…"
  verifiedAt: "2026-10-27"
```

Kinds: `repo`, `deploy`, `screenshot`, `benchmark`, `doc`, `commit`.

- `source` is the path or a human-readable label.
- `href` only if public; otherwise omit and label private in the body.
- `verifiedAt` is the date you last checked it.
- One claim per entry. Do not bundle three claims into one source.

---

## 6. Metric card

```yaml
- label: "p95 retrieval latency"
  value: "0.00s"
  kind: "measured"
  source: "docs/evidence/rag-eval.md"
  measuredAt: "2026-10-27"
```

- `kind`: `measured`, `artifact`, or `scope`.
- `value` includes the unit.
- `source` is a path, a URL, or a named method.
- Max 4 per case study.
- If the value is a count of what was built, use `scope` and do not call it impact.

---

## 7. Screenshot checklist

- [ ] Real UI, not a mockup.
- [ ] Neutral demo data; every name, email, token, logo, and client identifier redacted.
- [ ] 16:10 desktop; 9:19.5 mobile; 2560px master, 1280/1920 exports.
- [ ] AVIF/WebP; ≤400KB; EXIF stripped.
- [ ] Browser frame 1px, no fake OS chrome.
- [ ] Caption states what it shows and what is redacted.
- [ ] Alt text describes the UI, not "screenshot".
- [ ] File name is descriptive: `documents-assistant-chat-citations.webp`.
- [ ] Second pair of eyes before commit.

---

## 8. Demo video storyboard

**Length:** 60–90s flagship, 45–60s others. **No audio.** Captions carry the meaning.

| Time   | Shot                                          | Caption                                                           |
| ------ | --------------------------------------------- | ----------------------------------------------------------------- |
| 0–4s   | Problem frame: the real starting screen       | "Private documentation, no good way to search it."                |
| 4–12s  | The main flow: upload or query                | "Ask a question in natural language."                             |
| 12–30s | The result: answer + citations + verification | "Every answer cites its sources; unsupported claims are blocked." |
| 30–45s | One hard case: unanswerable or ambiguous      | "When the evidence is missing, it says so."                       |
| 45–60s | Architecture or settings that prove the claim | "Two providers, one failover path."                               |
| 60–72s | Outcome / evidence                            | "Recall@5 0.00 on a 50-question eval; method in the case file."   |

Production rules:

- 16:10, H.264 + WebM, ≤3MB, poster.
- Cursor movements deliberate; no shaky mouse.
- No branded intro longer than 2 seconds.
- No background music.
- Captions `.vtt`; on-screen text is not the only caption.
- Hide bookmarks bar, notifications, personal tabs.

---

## 9. Hero copy worksheet

Recommended:

> **Eyebrow:** AI engineer · Monastir, Tunisia · CET+1
> **H1:** AI systems, / with the receipts.
> **Lede:** I own the whole path — retrieval, backend, interface, and the reliability work that keeps an AI product honest.
> **Primary:** Read the case files
> **Secondary:** Download CV

Why it works: role and place in the eyebrow; a five-word memorable line; the lede states ownership; two actions.

Alternatives to test in the five-second test:

| H1                                   | Words | Risk                     |
| ------------------------------------ | ----- | ------------------------ |
| Production AI, documented.           | 3     | Clear, less personality  |
| I build AI that survives production. | 6     | Strong, slightly generic |
| AI systems, with the receipts.       | 5     | Memorable, colloquial    |
| From demo to dependable.             | 4     | Good story, less literal |

Rules:

- H1 ≤ 7 words.
- Lede ≤ 32 words.
- One primary action.
- No "passionate", "innovative", "welcome to my portfolio".
- The role must appear in text, not only in the logo or metadata.

---

## 10. About bio

### 50 words

> I'm Yassine, an AI engineer in Monastir, Tunisia. I build retrieval systems, agents, and the backend that keeps them reliable — and I document the tradeoffs. I'm open to AI engineering roles. [Remote, hybrid, or on-site — confirm.]

### 100 words

> I'm Yassine, an AI engineer based in Monastir, Tunisia. I build systems where retrieval, model behavior, backend services, and interface meet — and I care most about the part after the demo: failure modes, latency, cost, and whether an answer can be trusted. My work includes an enterprise RAG assistant at Capgemini Engineering, a three-locale travel agency platform, an MCP monitoring agent, and an IoT access-control system. I write the docs before the code, measure before I claim, and leave a trail from every statement on this site to its source. I'm open to AI engineering roles. [Remote, hybrid, or on-site — confirm.]

### 200 words

> I'm Yassine, an AI engineer based in Monastir, Tunisia. I build systems where retrieval, model behavior, backend services, and interface meet — and I care most about the part after the demo: failure modes, latency, cost, and whether an answer can be trusted.
>
> My work started in full-stack product engineering: a campus app with payments, push, and realtime chat; a travel agency platform with a quote-to-booking state machine, three locales, and a 41-model schema; an IoT access-control system with MQTT ingestion and a rule engine. Those systems taught me the constraints that make AI work real: permissions, data shape, operational cost, and what happens when a dependency fails.
>
> Lately I've focused on applied AI: a RAG assistant for private documentation with hybrid retrieval, citation-grounded answers, verification, and provider failover; an MCP agent that monitors databases and endpoints and explains what it finds. I write the plan before the code, keep the architecture explainable to a founder and an engineer, and measure before I make a claim.
>
> I'm open to AI engineering roles where reliability matters as much as the model. [Remote, hybrid, or on-site — confirm.] Happy to talk about the hard part.

Rules: no childhood story, no "journey", no list of every tool, no claims without evidence.

---

## 11. Resume bullets

**Formula:** Action + system + constraint + result (measured) or scope (labeled).

### Documents Assistant

- Built a RAG assistant over private documentation with hybrid retrieval, citation-grounded answers, and a verification step that blocks unsupported claims before streaming.
- Designed a 9-stage ingestion and answer pipeline across a TypeScript/Express API, a Python/FastAPI service, BullMQ, PostgreSQL, and pgvector.
- Added provider failover between Gemini and NVIDIA NIM; mapped rate limits and errors to a single retry/fallback path.
- **Add when measured:** "Reached recall@5 of X on a 50-question synthetic evaluation; method and limits documented."

### Sadine Tours

- Built a 26-module Fastify/Prisma API (41 models, 224 route handlers) behind a quote-to-booking state machine with expiry, audit logs, and idempotent acceptance.
- Implemented RBAC and owner gates (`authenticate` → `requireRole` → `requireOwner`) across customer, agent, and admin surfaces.
- Delivered a Next.js frontend in English, French, and Arabic with next-intl, route groups, and locale-aware money formatting.
- Shipped customer self-serve: quote list/detail, acceptance, booking tracking, document upload, and message thread.

### Anomaly Detection Agent

- Built a FastAPI agent that monitors PostgreSQL, MySQL, and MongoDB with read-only connectors and probes endpoint health.
- Classified data-quality, performance, and endpoint anomalies, then generated severity/impact/effort explanations with Gemini.
- Shipped a FastMCP stdio server exposing scans and reports as tools to any MCP client.
- **Add when measured:** "Detected X/12 seeded incidents with Y false positives on the demo dataset."

### RFID Access Control

- Built an MQTT-to-Fastify decision engine for ESP32 RFID readers with skill, machine, and schedule rules; every scan is audited with its reason.
- Added retained-status and Last Will offline detection within three missed heartbeats; broadcast decisions to a Socket.IO dashboard.
- Delivered an employee portal, attendance, alerts, and a Docker Compose stack (PostgreSQL, Redis, EMQX, nginx).

### Wave

- Built a campus app API (~30 route modules) over PostgreSQL and MongoDB with JWT auth and Swagger.
- Implemented a BullMQ push pipeline with a worker pool and 60-second receipt reconciliation to Expo/FCM.
- Added Socket.IO chat with Pusher presence and a Lydia payment provider behind a DI token.

**Rules:** no bullet without a verb; no "responsible for"; no percentage without a source; one page.

---

## 12. Meta titles and descriptions

### Home

- Title: `Yassine Ben Romdhane — AI Engineer`
- Description: `AI engineer building production RAG systems, agents, and the backend infrastructure that keeps them honest. Case studies with architecture, tradeoffs, and evidence.` (158 chars)

### Work

- Title: `Work — AI systems, documented`
- Description: `Four production systems, documented end to end: enterprise RAG, a three-locale travel agency platform, an MCP monitoring agent, and an IoT access-control system.`

### Case study template

- Title: `{Project} — {Outcome}`
- Description: `{Problem}. {What shipped}. {Stack}. Architecture, tradeoffs, and evidence from the build.`

### About

- Title: `About — AI engineer in Monastir, Tunisia`
- Description: `Yassine Ben Romdhane builds production RAG systems, agents, and full-stack platforms. Experience at Capgemini Engineering, Sadine Tours, and YBInnovations.`

Rules: unique, 140–160 chars for descriptions, no keyword stuffing, no "Welcome to".

---

## 13. Recruiter FAQ (for `/about` or the contact section)

Answer these in one or two sentences, or omit them:

- What roles are you looking for? (AI Engineer, Applied ML, Full-Stack AI, Founding Engineer)
- Remote, hybrid, or on-site? (confirm)
- Where are you based / timezone? (Monastir, CET+1)
- Are you authorized to work in the EU / remotely? (confirm; do not guess)
- When can you start? (confirm)
- What is your strongest work? (link the flagship)
- Can you share private code? (only with permission; offer a walkthrough)
- Do you have a CV? (link)

Do not invent visa status or notice period. An unanswered question is better than a wrong answer.

---

## 14. Project scoping prompt

The full agent prompt is in [`prompts/project-scoping.md`](prompts/project-scoping.md). Run it once per project, pointed at the real repo, with the output written to `src/content/work/<slug>.mdx`.

The prompt enforces:

- facts only, with a source for every claim;
- stack verified from manifests, not memory;
- metrics only from artifacts or measured runs;
- architecture nodes/edges that match the code;
- 3–5 decisions with alternatives and costs;
- private/confidential labeling;
- the 60-second summary;
- a list of missing evidence before drafting.

Do not paste the output into the site without a human read. The prompt is a research assistant, not the author.

---

## 15. Pre-publish copy checklist

- [ ] H1 ≤ 7 words; lede ≤ 32 words.
- [ ] Every claim has a source or a private/not-measured label.
- [ ] Every metric has a method and a date.
- [ ] No banned words.
- [ ] No adjective stacking.
- [ ] Jargon defined once.
- [ ] Active voice; "I" for solo work.
- [ ] Project names/dates match the CV.
- [ ] Links resolve.
- [ ] Read aloud once.
