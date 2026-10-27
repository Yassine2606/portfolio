# Agent prompt — project scoping & evidence extraction

Use this prompt with a coding agent (Claude Code, opencode, Cursor, etc.) pointed at one real repo at a time. The output is a draft case study in `src/content/work/<slug>.mdx` plus a list of missing evidence.

The agent is a **research assistant**, not the author. A human reads, checks, and edits every line before it ships.

---

## Context

You are extracting evidence for a recruiter-facing portfolio for **Yassine Ben Romdhane**, an AI and full-stack engineer. The site's rule is simple:

> Every checkable claim has a source, an explicit `private / not measured` label, or it does not ship.

The audience is technical recruiters, hiring managers, and founders. They will check the work. Your job is to make that easy.

Read these files before starting:

- `docs/01-brief.md` — positioning and audience
- `docs/03-content-strategy.md` — evidence standard, project selection
- `docs/11-content-templates.md` — frontmatter, MDX skeleton, decision blocks
- `src/lib/content/schema.ts` — the frontmatter contract

---

## Golden rules

1. **Facts only.** Never invent a metric, date, user count, outcome, benchmark, employer, or feature. If it is not in the repo, a README, a commit, an issue, a benchmark file, or a deployment config, omit it or write `Not measured`.
2. **Traceability.** Every claim gets a source path, a commit SHA, a URL, or an explicit label.
3. **Verify the stack from manifests**, not memory: `package.json`, `pyproject.toml`, `requirements.txt`, `docker-compose.yml`, `Dockerfile`, `prisma/schema.prisma`, `next.config.*`.
4. **Private is a label, not a hole.** If the repo is private, say so. Never fabricate a demo or a screenshot.
5. **Depth over volume.** Three to five decisions with alternatives and costs beat twenty features.
6. **Plain language.** Explain the system to a smart founder and a staff engineer in the same paragraph. Define jargon once.
7. **No template fluff.** Ban: passionate, innovative, cutting-edge, seamless, robust, scalable (unless defined), leveraged, harnessed, spearheaded.
8. **Numbers need a method.** A count of routes is `scope`, not impact. A percentage needs a denominator and a measurement method.

---

## Inputs

For the target project, collect:

- Repo path or URL; default branch; last commit date.
- README and `docs/` (read first).
- Manifests and lockfiles.
- Docker/Compose, CI, deployment config.
- Database schema/migrations.
- Tests, benchmarks, eval scripts, notebooks.
- Screenshots or demo assets already in the repo (usually none).
- The old case study JSON in `../src/content/projects/<slug>.json` if it exists — use only as a lead, verify everything.

If the repo URL is private, use the local checkout. Do not request credentials in chat.

---

## Procedure

### 1. Inventory

Record: repo URL, primary language, description, last commit date, license, stars (if public), and whether the repo is public/private.

### 2. Read for the problem

From the README/docs, extract:

- The user and the problem.
- What the system does.
- The hard constraint (privacy, latency, cost, legacy data, deadline).
- What is explicitly out of scope.

### 3. Verify the stack

List only what the manifests and code prove. Group into `ai`, `backend`, `frontend`, `infra`, `data`. Use the exact names (`PostgreSQL`, not "SQL database"; `pgvector`, not "vector DB").

### 4. Mine evidence

Collect only:

- **Repo artifacts:** file paths, schema counts, module counts, route counts, locales, migration counts.
- **Measured results:** benchmark output, eval scripts, load tests, CI results, documented user counts.
- **Deploy facts:** Docker services, CI workflows, hosting config.
- **Explicit gaps:** no tests, no benchmark, no screenshots, private repo.

For each metric, record:

```yaml
label: "Recall@5"
value: "0.00"
kind: measured | artifact | scope
source: "docs/evidence/rag-eval.md"
measuredAt: "YYYY-MM-DD"
```

Max 4 metrics. If you cannot find a real value, do not invent one.

### 5. Build the architecture

Nodes = real components. Edges = real data flow. One sentence per node.

```yaml
nodes:
  - stage: "Client"
    name: "React app"
    type: "frontend"
    detail: "Upload, chat, citations."
  - stage: "API"
    name: "Express API"
    type: "backend"
    detail: "Auth, jobs, SSE."
```

Rules:

- Group nodes into ordered stages.
- No node you cannot point to in the code or Compose file.
- No edge you cannot explain.
- If a component is unknown, leave it out rather than guess.
- Include a plain-language `summary` of the flow.

### 6. Find the decisions

Identify 3–5 real decisions. For each:

- **Choice:** what was done.
- **Alternative:** what a reasonable engineer might have done instead.
- **Why:** the constraint that drove the choice.
- **Cost:** what the choice made worse.

If you cannot find an alternative or a cost, it is not a decision — drop it.

### 7. Find the failure modes

What breaks? How is it detected? What is the fallback? What still breaks today? Use the code and the README; do not speculate beyond a labeled `Unknown`.

### 8. Draft the case study

Use the exact skeleton in `docs/11-content-templates.md`:

- Frontmatter (validated by zod)
- Intro (≤ 80 words)
- Context
- Problem and constraints
- Architecture
- Decisions and tradeoffs (3–5)
- Evidence (figures, claims, metrics)
- Reliability
- Outcome
- What I'd do differently
- Missing evidence list (outside the MDX, in your response)

Word budget: flagship 1,800–2,400; featured 1,200–1,800.

### 9. List missing evidence

Before finishing, output a checklist:

- Permissions needed.
- Screenshots to capture (exact screens).
- Demo to record (exact flow).
- Metrics to measure (method + sample).
- Links that are private or dead.
- Claims you removed because you could not source them.

Do not fill gaps with prose. Leave them visible.

---

## Output format

Write `src/content/work/<slug>.mdx` with valid frontmatter and MDX body. Also return a short report:

```md
## Scoped: <project>

- Repo: <url or local path>
- Public/private: <status>
- Evidence found: <n> claims, <n> metrics
- Missing: <list>
- Metrics removed for lack of source: <list>
- Decisions found: <n>
- Suggested featured rank: <1-7>
```

Frontmatter must satisfy `workFrontmatterSchema`. `slug` must match the filename. `evidence` must have at least one entry. `metrics` max 4.

---

## Hard rejects

- Invented metrics, users, testimonials, dates, or outcomes.
- "Confidential" used to avoid naming what was built.
- A GitHub/demo link that 404s or requires a login.
- A screenshot of a different product.
- A feature list with no problem.
- "Scalable", "robust", "seamless" without a definition.
- A decision with no alternative or no cost.
- More than 4 metrics.
- Claiming production use without a deployment or user evidence.

If the project cannot meet the standard, say so and recommend archive status. A thin case study is worse than no case study.
