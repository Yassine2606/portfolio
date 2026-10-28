# Docs — portfolio v2

This folder is the source of truth for the rebuild. Code follows the docs; when reality changes, the doc changes in the same commit.

Owner: Yassine Ben Romdhane
Locked: 27 Oct 2026
Review cadence: end of each phase; then quarterly.

---

## Status

| Doc                              | Status      | Last decision                                        |
| -------------------------------- | ----------- | ---------------------------------------------------- |
| `01-brief.md`                    | Locked v1.0 | Audience, positioning, success tests, scope          |
| `02-recruiter-research.md`       | Locked v1.0 | Evidence hierarchy and scan paths                    |
| `03-content-strategy.md`         | Locked v1.0 | Four featured projects + three archive cards         |
| `04-information-architecture.md` | Locked v1.0 | Home, /work, /work/[slug], /about, PDF               |
| `05-design-system.md`            | Locked v1.0 | Dossier direction, OKLCH tokens, type stack          |
| `06-motion-and-interaction.md`   | Locked v1.0 | Polish + restraint; Index and evidence margin        |
| `07-technical-architecture.md`   | Locked v1.0 | Next.js static-first, MDX + zod, Vercel              |
| `08-quality-standards.md`        | Locked v1.0 | WCAG 2.2 AA, CWV budgets, SEO, security              |
| `09-build-roadmap.md`            | Locked v1.0 | 8 phases, evidence-first critical path               |
| `10-quality-gates.md`            | Locked v1.0 | 9 launch gates + manual scripts                      |
| `11-content-templates.md`        | Locked v1.0 | Case study, screenshots, resume, prompt              |
| `12-decision-log.md`             | Living      | ADR index; append, never rewrite history             |
| `13-implementation-report.md`    | Shipped     | What was built, verified, and left open              |
| `evidence-ledger.md`             | Shipped     | 16 evidence notes, 16 scope metrics, 3 archive facts |
| `prompts/project-scoping.md`     | Locked v1.0 | Agent prompt for evidence extraction                 |

"Locked" means the direction is decided. Small corrections are fine; changing a locked decision requires an ADR entry and a written reason.

---

## How to use this folder

1. **Before building anything**, read `01`, `04`, `05`, and the relevant section of `07`.
2. **Before writing copy**, read `03` and `11`. The evidence rule is not optional.
3. **Before calling a phase done**, open `10` and run the matching gate.
4. **When a decision changes**, append to `12` with context, decision, consequences, and a revisit trigger.
5. **When content changes**, update the claim's source and `verifiedAt` date. Stale evidence is worse than no evidence.

---

## Non-negotiable vocabulary

| Term                | Meaning                                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Claim**           | A checkable statement on the site. If it can be verified, it must carry a source.                                       |
| **Evidence note**   | The source attached to a claim: repo path, commit, benchmark, screenshot, live URL, or honest "private / not measured". |
| **Case file**       | A project case study at `/work/[slug]`.                                                                                 |
| **The Index**       | The hero's keyboard-accessible project switcher. The signature interaction.                                             |
| **Evidence margin** | The right-hand note column on wide screens; inline notes on mobile. A CSS-only claim/source pairing.                    |
| **Proof**           | Shipped product, real screenshot, public repo, measured result — in that order of strength.                             |
| **Scope metric**    | A count of what was built (routes, models). Evidence of size, not impact. Label it honestly.                            |

---

## Doc conventions

- Dates are absolute (`27 Oct 2026`), never "last week".
- Estimates are in working days for one person.
- `[ ]` is an open task; `[x]` is done.
- **Owner input** marks a question only Yassine can answer.
- **Gate** marks a binary pass/fail check that blocks launch.
- Links between docs are relative and should survive moves.

---

## Open owner inputs

These still block launch or would strengthen it. Defaults that were shipped without confirmation are marked as such.

- [ ] Capgemini permission: what can be shown, what must be anonymized, whether screenshots are allowed. **Default applied:** partially private, no screenshots or repository link (ADR-021).
- [ ] Permission for Sadine, RFID, and Wave visuals. **Default applied:** no visuals; system maps only.
- [ ] Public demo plan for the flagship: synthetic corpus, recorded walkthrough, or both.
- [ ] LinkedIn URL and preferred contact channel. **Default applied:** LinkedIn omitted; email and GitHub only.
- [ ] Custom domain choice and budget. **Default applied:** fallback Vercel URL until the domain is set (ADR-019).
- [ ] Languages to list (Arabic / French / English) and proficiency labels. **Default applied:** languages listed without levels.
- [ ] Target role priority: AI Engineer, Applied ML, Full-Stack AI, Founding Engineer. Copy targets AI engineering roles.
- [ ] Whether a portrait is used (recommended: one candid photo on /about only). **Default applied:** no portrait; the work is the introduction.

Resolved 27 Oct 2026: availability — available immediately, with no notice period. The site says “Available immediately” in the header, hero, footer, mobile menu, about, and contact copy.

Resolved 27 Oct 2026: work authorization — remote, hybrid, or on-site; open to relocation; visa sponsorship required outside Tunisia.

Resolved 27 Oct 2026: CV — English and French designed PDFs, plus English and French ATS-friendly PDFs. The CVs include the phone number; site copy still uses email only.

The full shipped state and verification log are in `13-implementation-report.md`.
