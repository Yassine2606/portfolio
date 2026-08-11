# Agent Prompt — Project Scoping & Content Extraction

Run this prompt with any coding agent (Claude Code, Cursor, opencode, etc.) pointed at the
portfolio repo. The agent's job is to turn Yassine's real projects into the structured,
factual data the portfolio consumes directly at build time — no API, no CMS.

---

## Context

You are content engineer for a premium, minimal, technical portfolio for an AI engineer.
The portfolio's only job is to convince technical recruiters, CTOs, and startup founders
that this person builds **production-quality AI software**. Every claim on the page must be
real, because the audience will check.

The frontend renders projects from JSON files in `src/content/projects/*.json`.
You are producing those files. Your output is the contract between the repos and the UI.

## Golden rules

1. **Facts only.** Never invent metrics, dates, outcomes, or features. If a number is not
   present in a README, a commit, an issue, a benchmark file, or the code itself — omit it
   (use `null`) or write "n/a".
2. **Traceability.** Every claim must trace to a repo artifact (README section, test, CI
   config, manifest, commit history). If you can't trace it, it doesn't ship.
3. **Dual audience.** Write the case study for a technical recruiter AND a non-engineer
   founder. Architecture must be explainable to both. No jargon without a one-line gloss.
4. **No template fluff.** No "leveraged", "harnessed", "cutting-edge", "seamless".
   Confident, plain, specific.
5. **Confidence, not volume.** 3-5 well-documented projects beat 15 thin ones.

## Inputs

The repos to scope. If not given, inventory the local filesystem and GitHub profile and
propose the list first, then proceed once confirmed.

## Procedure

1. **Inventory** — for each project collect: repo URL, primary language, description,
   star count, last commit date, license.
2. **Read** the README and `docs/` first. Extract the problem, solution shape,
   architecture, and feature set as stated by the author.
3. **Verify the stack from code**, not vibes:
   - JS/TS: `package.json`, `tsconfig.json`, `next.config.*`
   - Python: `pyproject.toml`, `requirements.txt`, `poetry.lock`
   - Infra: `Dockerfile`, `docker-compose.yml`, `*.tf`, `.github/workflows/*`
4. **Mine metrics only from evidence**: stars, documented benchmark/eval numbers,
   load-test results in the repo, CI badges, documented user counts. Otherwise omit.
5. **Classify capabilities** against this enum (used by the "Engineering" and "AI Systems"
   sections, so be accurate):
   `RAG`, `Multi-Agent`, `MCP`, `LLM Pipelines`, `Embeddings`, `Vector Search`,
   `Tool Calling`, `Workflow Orchestration`, plus `Frontend`, `Backend`, `Cloud`,
   `DevOps`, `Databases`, `Tooling`.
6. **Build the architecture graph honestly.** Nodes are real components (e.g.
   `ChromaDB`, `FastAPI`, `Next.js`, `Redis`). Edges are real data flow. One sentence per
   node. If a component is unknown to you, leave it out rather than guess.
7. **Write the case study** in the fixed order: problem → requirements → solution →
   architecture → implementation → results → lessons → future.
8. **Pick the featured projects**: max 3. These are the ones that best prove
   production-quality AI engineering (real users, shipped, documented). Mark
   `"featured": true`.
9. **Emit the JSON.**

## Output format

One file per project at `src/content/projects/<slug>.json` conforming to the schema below.
All strings are plain text or minimal Markdown. Use `null` for unknown values. Never add
fields outside the schema. `<slug>` must be URL-safe and lowercase-hyphenated.

```json
{
  "slug": "docu-rag",
  "title": "DocuRAG — Semantic Search for Support Docs",
  "tagline": "One-sentence hook, < 12 words.",
  "summary": "2-3 sentences for the card.",
  "year": 2025,
  "role": "Solo",
  "status": "production",
  "featured": true,
  "links": {
    "github": "https://github.com/yassine/docurag",
    "demo": "https://docurag.demo",
    "docs": null
  },
  "stack": {
    "ai": ["OpenAI", "sentence-transformers"],
    "backend": ["FastAPI", "PostgreSQL"],
    "frontend": ["Next.js", "Tailwind CSS"],
    "infra": ["Docker", "Fly.io"],
    "data": ["ChromaDB", "Redis"]
  },
  "capabilities": ["RAG", "Embeddings", "Vector Search"],
  "caseStudy": {
    "problem": "3-5 paragraphs of markdown.",
    "requirements": ["bullet", "list", "of requirements"],
    "solution": "2-4 paragraphs of markdown.",
    "architecture": {
      "description": "1-2 paragraphs in plain language.",
      "nodes": [
        {
          "id": "ui",
          "label": "Next.js UI",
          "type": "frontend",
          "description": "One sentence."
        },
        {
          "id": "api",
          "label": "FastAPI service",
          "type": "backend",
          "description": "One sentence."
        }
      ],
      "edges": [
        { "from": "ui", "to": "api", "label": "query + top-k" },
        { "from": "api", "to": "db", "label": "embed & retrieve" }
      ]
    },
    "implementation": "2-4 paragraphs. Name the real tools and the tradeoffs you made.",
    "challenges": [
      { "title": "Chunk-level latency", "resolution": "Cached embeddings, precomputed at index time." }
    ],
    "results": [
      { "metric": "nDCG@10", "value": "0.71", "source": "eval notebook committed to repo" }
    ],
    "lessons": ["3-5 honest bullets", "including what you would do differently"],
    "future": ["optional", "bullets"]
  },
  "gallery": [
    { "src": "/projects/docu-rag/search.png", "alt": "Screenshot of the search UI showing cited answers" }
  ]
}
```

## Image assets

For each project, also record a list of screenshot opportunities (UI, architecture diagram,
terminal output) with a suggested filename and alt text in `gallery`. The human will capture
them; the frontend expects them under `public/projects/<slug>/`.

## Acceptance checklist

- [ ] Every field factual and traceable to a repo artifact.
- [ ] No metric without a `source`.
- [ ] Stack verified from manifests, not assumed.
- [ ] `capabilities` only contains enum values, and only ones the project genuinely uses.
- [ ] Architecture nodes/edges are real, not decorative.
- [ ] Max 3 projects flagged `featured`.
- [ ] Files land at `src/content/projects/<slug>.json` and parse with `JSON.parse`.

## Output summary to report back

For each project, return: slug, title, 1-line verdict on whether it proves
production-quality AI engineering, and any fields you had to leave `null` because the
evidence was missing (so the human knows what to supply).
