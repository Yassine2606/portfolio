# Evidence ledger

Status: Shipped v1.0 · public re-check 27 Oct 2026
Scope: the 16 evidence notes and 16 scope metrics rendered in the four case files, plus the three archive rows.

This ledger covers the claims the site renders as evidence notes and scope metrics. Narrative paragraphs explain those claims; they are not a second claim set. If a new number, guarantee, or outcome is added to a case file, it must be added here in the same commit.

## How to read the tables

| Basis               | Meaning                                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Public re-check** | Re-checked on 27 Oct 2026 against a shallow clone of the public repository's default branch. Paths are relative to its root. |
| **Owner record**    | Supplied from the private project's repository or delivery record. Not independently re-checked and not publishable.         |
| **Unmeasured**      | Designed but not run. No outcome number exists, and the site says so.                                                        |

`Artifact` means a structural count or configuration fact. It is not a benchmark, a customer outcome, or a quality score.

---

## A. Evidence notes — 16

These are the numbered notes rendered in each case file. The claim text matches the evidence register.

| #   | Project             | Claim                                                                                                                | Source                                            | Kind | Basis                    |
| --- | ------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---- | ------------------------ |
| 01  | Documents Assistant | A separate verification call returns a pass/fail verdict before an answer streams.                                   | `ai-service/app/services/verification.py`         | repo | Owner record · private   |
| 02  | Documents Assistant | Retrieval fuses dense cosine and Postgres full-text results with reciprocal rank fusion.                             | `ai-service/app/services/retrieval.py`            | repo | Owner record · private   |
| 03  | Documents Assistant | The retrieval benchmark is designed but not run; no outcome numbers are published.                                   | `remarks.md` — evaluation plan                    | doc  | **Unmeasured** · private |
| 04  | Documents Assistant | Provider failover tries NVIDIA first and falls back to Gemini on errors.                                             | `ai-service/app/services/llm_provider.py`         | repo | Owner record · private   |
| 05  | Sadine Tours        | Quote acceptance runs in a transaction, rejects non-sent quotes, and enforces expiry.                                | `src/modules/quotes/quote.service.ts`             | repo | Owner record · private   |
| 06  | Sadine Tours        | Decimal money leaves the API as strings; the client formats but never calculates.                                    | `src/modules/bookings/booking.service.ts`         | repo | Owner record · private   |
| 07  | Sadine Tours        | Auth, role, and owner checks are declared as middleware contracts on privileged routes.                              | `src/plugins/auth.ts`                             | repo | Owner record · private   |
| 08  | Sadine Tours        | The repository contains 41 Prisma models and 26 backend modules.                                                     | `prisma/schema.prisma` + `src/modules/`           | repo | Owner record · private   |
| 09  | Anomaly Detection   | The scan path only reads: SELECT queries, counts, and read-only aggregations. No scan step writes.                   | `src/monitors/database.py` + `src/api/main.py`    | repo | **Public re-check**      |
| 10  | Anomaly Detection   | The MCP server only accepts the mock scan type; real connectors are not wired into it yet.                           | `src/mcp_server.py`                               | repo | **Public re-check**      |
| 11  | Anomaly Detection   | All three connectors implement the same read methods, so one detector rule set scans PostgreSQL, MySQL, and MongoDB. | `src/monitors/database.py` + `src/api/main.py`    | repo | **Public re-check**      |
| 12  | Anomaly Detection   | The README advertises pytest, but no tests directory is committed.                                                   | `README.md` + repository tree                     | doc  | **Public re-check**      |
| 13  | RFID Access Control | MQTT payloads are Zod-validated before dispatch; business logic lives in services, not callbacks.                    | `backend/src/modules/mqtt/mqtt.consumer.ts`       | repo | Owner record · private   |
| 14  | RFID Access Control | Device presence is derived from heartbeats, retained status, and the broker Last Will.                               | `backend/src/modules/devices/presence.service.ts` | repo | Owner record · private   |
| 15  | RFID Access Control | Every decision records the failed rule, so a denial can be explained after the fact.                                 | `backend/src/modules/access/access.service.ts`    | repo | Owner record · private   |
| 16  | RFID Access Control | A serial-to-MQTT bridge exercises the identical consumer path without physical readers.                              | `scripts/serial-mqtt-bridge.ts`                   | repo | Owner record · private   |

### What the public re-check found

The four public evidence notes and four public metrics all held at the snapshot below. Two earlier claims did not: the API count said five routes when the repository exposes nine, and an evidence note described a dialect-normalization step that lives in the connector contract rather than in the detectors. Both were corrected on the site and in this ledger.

| Check                             | Command / path                                                                       | Result                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| Concrete database connectors      | `src/monitors/database.py`                                                           | PostgreSQL, MySQL, MongoDB — three                             |
| MCP tools                         | `grep -c '@mcp.tool' src/mcp_server.py`                                              | 4                                                              |
| HTTP routes                       | `grep -c '@app\.' src/api/main.py`                                                   | 9                                                              |
| Write statements in the monitor   | `grep -nEi 'insert\|update\|delete\|drop\|alter\|truncate' src/monitors/database.py` | No matches                                                     |
| Test directory                    | `tests/`                                                                             | Absent; `README.md` still documents `pytest tests/`            |
| Shared connector contract         | abstract methods in `DatabaseConnector`                                              | All three connectors implement the same seven read methods     |
| Gemini model                      | `src/config/settings.py`                                                             | `gemini-2.5-flash`                                             |
| TranscriptoSense languages        | `config/pipeline.yaml`, `README.md`                                                  | French, Arabic, Darija present                                 |
| TranscriptoSense semantic modules | `src/audio/diarization.py`, `src/semantic/`                                          | Speakers, topics, action items present; tests directory exists |
| Data Drift algorithms             | `src/drift/drift_detection.py`, `src/monitoring/`                                    | PSI and KS-test, plus degradation/impact analysis; no tests    |

Snapshot: shallow clones of `Yassine2606/anomaly-detection-agent`, `Yassine2606/TranscriptoSense`, and `Yassine2606/Data-Drift-Decision-Intelligence-System`, default branch, 27 Oct 2026. Public repositories change; re-run the checks before launch.

---

## B. Scope metrics — 16

These are the numbers in each case file's key-facts strip. Every row is labelled `artifact` on the site.

| #   | Project             | Metric               | Value | Source / method                                                                         | Basis                  | What it does not prove                                           |
| --- | ------------------- | -------------------- | ----- | --------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------- |
| 01  | Documents Assistant | Pipeline stages      | 9     | upload → queue → parse → chunk → embed → retrieve → fuse → verify → cite                | Owner record · private | Latency, throughput, or retrieval quality                        |
| 02  | Documents Assistant | Retrieval tools      | 4     | list documents, search passages, read structure, list topics                            | Owner record · private | Tool-use accuracy; the private implementation is not public      |
| 03  | Documents Assistant | Embedding dimensions | 384   | `all-MiniLM-L6-v2`, running locally on CPU                                              | Owner record · private | Retrieval quality; dimension is a model property                 |
| 04  | Documents Assistant | Answer providers     | 2     | Gemini 2.5 Flash + NVIDIA NIM, with failover                                            | Owner record · private | Failover success rate; no failure-injection test is published    |
| 05  | Sadine Tours        | Prisma models        | 41    | `prisma/schema.prisma`                                                                  | Owner record · private | Schema quality, usage, or business outcomes                      |
| 06  | Sadine Tours        | Backend modules      | 26    | `src/modules/`                                                                          | Owner record · private | Code quality or test coverage                                    |
| 07  | Sadine Tours        | Route handlers       | 224   | grep across `src/modules/`                                                              | Owner record · private | That all routes are reachable, tested, or correct                |
| 08  | Sadine Tours        | Locales              | 3     | en / fr / ar message bundles                                                            | Owner record · private | Translation quality or coverage                                  |
| 09  | Anomaly Detection   | Database connectors  | 3     | PostgreSQL, MySQL, MongoDB — read-only                                                  | **Public re-check**    | Coverage or reliability; one connector per database type         |
| 10  | Anomaly Detection   | MCP tools            | 4     | FastMCP over stdio                                                                      | **Public re-check**    | That real monitors are wired into MCP; note 10 says they are not |
| 11  | Anomaly Detection   | HTTP routes          | 9     | health, mock scan, scan, reports, history, chat, endpoint check, database health, stats | **Public re-check**    | That every route is exercised or tested                          |
| 12  | Anomaly Detection   | Anomaly classes      | 3     | data quality, performance, endpoint                                                     | **Public re-check**    | Detection accuracy; no labelled evaluation                       |
| 13  | RFID Access Control | Prisma models        | 8     | employees, skills, devices, machines, reservations, logs, alerts, admins                | Owner record · private | Coverage of the access domain                                    |
| 14  | RFID Access Control | Backend modules      | 11    | `backend/src/modules/`                                                                  | Owner record · private | Code quality or test coverage                                    |
| 15  | RFID Access Control | Schema migrations    | 5     | versioned Prisma migrations; no auto-sync                                               | Owner record · private | Deployment safety or rollback                                    |
| 16  | RFID Access Control | Offline detection    | 3     | missed heartbeats, retained state, broker Last Will                                     | Owner record · private | Measured detection latency across networks; it is a threshold    |

---

## C. Archive facts — 3

The archive rows are real builds that do not get a case file. They carry a title, one line, a year, and a link or a private label.

| Project          | Line on the site                                                              | Basis                  | Notes                                                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wave             | Campus community app: events, carpooling, housing, deals, tutoring, and chat. | Owner record · private | No public repository or demo. No user, revenue, or growth number is claimed.                                                                       |
| TranscriptoSense | French, Arabic, and Darija audio into speakers, topics, and action items.     | **Public re-check**    | ASR languages, diarization, topic detection, and action extraction are present; five test modules exist. No accuracy benchmark is claimed.         |
| Data Drift       | PSI and KS-tests that flag distribution shift and quantify the model impact.  | **Public re-check**    | PSI and KS-test are implemented; impact analysis tracks degradation. No tests directory; notebooks are the pipeline. No outcome metric is claimed. |

---

## D. Proof gaps

### Project evidence

| Gap                                    | Where it appears             | Status                                                                                                                                          |
| -------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Flagship benchmark not run             | Documents Assistant, note 03 | 50-question annotated benchmark is designed. No Recall@5, MRR, citation accuracy, abstention, or p95 latency exists.                            |
| Flagship interface not published       | Documents Assistant, ADR-021 | No screenshot, demo, or repository link. Architecture and code paths only.                                                                      |
| MCP integration is partial             | Anomaly Detection, note 10   | `scan_anomalies` accepts only `mock`; real database monitors are not wired into the MCP tools.                                                  |
| Anomaly has no tests                   | Anomaly Detection, note 12   | `README.md` documents `pytest tests/`; no `tests/` directory is committed.                                                                      |
| Private repositories cannot be audited | Sadine, RFID, Documents      | Source paths and counts are owner-supplied. No independent reviewer can inspect them.                                                           |
| No interface captures on any case      | All four cases               | The figures are code-generated architecture maps, not screenshots of a running product.                                                         |
| No manual accessibility audit          | Site-wide                    | axe-core 4.14.0 reports 0 violations at 320/390/1440 and Lighthouse accessibility is 100. No screen-reader, cross-browser, or real-device pass. |
| No outcome metrics                     | All four cases               | No adoption, revenue, latency, accuracy, or customer numbers are published. That is deliberate.                                                 |

### Site and launch

| Gap                                 | Status                                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Resume                              | Resolved 27 Oct 2026: EN/FR designed and ATS PDFs synced from `Documents/cv/output/`. One page each; ATS audit 10/10.          |
| Experience, education, Wardrobe     | Titles, dates, and scope are owner-supplied. No independent verification; Wardrobe is an ongoing project, not a case file.     |
| Availability and notice             | Resolved 27 Oct 2026: owner confirmed available immediately, no notice period. Site copy says “Available immediately”.         |
| Remote / hybrid / on-site           | Resolved 27 Oct 2026: owner confirmed all three work modes. Copy lists them on the hero card, about, and contact.              |
| Relocation                          | Resolved 27 Oct 2026: owner is open to relocation. Copy says “Open to relocation”.                                             |
| Work authorization                  | Resolved 27 Oct 2026: roles outside Tunisia require visa sponsorship. Site states this on the hero card, about, and contact.   |
| Client permissions                  | Capgemini, Sadine, RFID, and Wave visual permissions are not confirmed. No visuals are published.                              |
| Domain                              | `NEXT_PUBLIC_SITE_URL` falls back to the old Vercel origin; the custom domain is unresolved.                                   |
| LinkedIn, portrait, language levels | Omitted until the owner supplies them. No placeholder links.                                                                   |
| Phone                               | Appears in the CV PDFs; site copy uses email only.                                                                             |
| Per-case OG cards                   | Deferred. The default `public/og.png` card is used on every page.                                                              |
| Automated accessibility             | Passed 28 Oct 2026: axe-core 4.14.0, 0 violations across 8 routes at 320/390/1440 plus the open mobile menu.                   |
| Lighthouse                          | Passed 28 Oct 2026: one local run per route; mobile performance 99, accessibility/BP/SEO 100; desktop `/` 100 across all four. |
| Security headers                    | Enforced 28 Oct 2026: nosniff, referrer, frame DENY, permissions, HSTS; CSP report-only.                                       |

---

### CV source

The EN/FR CVs are generated from `Documents/cv/source/cv-data.json`; `Documents/cv/master-facts.md` traces each metric to the PFE report or the owner's record. The 11 functional scenarios and 1.9 s median local latency come from the PFE report (Tables 5.5 and 5.7). The CV is a one-page subset: it leads with Capgemini, then YBInnovations and MyMatch, and omits Sadine, RFID, and Anomaly Detection. Do not treat the CV as a second source of site claims; re-check both when a fact changes.

---

## E. Re-verification procedure

1. Clone each public repository at its default branch.
2. Inspect the paths in table A and recompute the counts in table B. The commands in “What the public re-check found” are the starting point.
3. Update the case frontmatter (`verifiedAt`) and this ledger in the same commit.
4. If a private claim cannot be re-confirmed by the owner, remove the claim from the case file instead of weakening the source.
5. If a screenshot, demo, or benchmark lands, replace the corresponding gap with the artifact and its method. Do not upgrade a claim because a related artifact exists.
6. Re-check before launch and quarterly after launch. A stale claim is worse than no claim.

## F. Change log

| Date       | Change                                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| 2026-10-27 | Replaced the template with the 16 shipped evidence notes, 16 scope metrics, and three archive facts.  |
| 2026-10-27 | Corrected the Anomaly route count from 5 to 9 and narrowed the read-only and normalization claims.    |
| 2026-10-27 | Marked all private claims as owner records; added the flagship benchmark, MCP, tests, and audit gaps. |
| 2026-10-27 | Recorded immediate availability; site copy now says “Available immediately” with no notice period.    |
| 2026-10-27 | Added confirmed remote/hybrid/on-site work and relocation willingness; left authorization unclaimed.  |
| 2026-10-27 | Recorded the confirmed visa-sponsorship requirement for roles outside Tunisia.                        |
| 2026-10-27 | Synced the new EN/FR designed and ATS CVs from `Documents/cv/output/`; all four are one page.         |
| 2026-10-28 | Fixed five axe violations (home link, card/archive link names, French ATS label, skip landmark).      |
| 2026-10-28 | Fixed 320px contact overflow; added `npm run audit:a11y`; axe now reports 0 violations.               |
| 2026-10-28 | Recorded local Lighthouse 13.6.0 results: 99 mobile performance, 100 accessibility/BP/SEO.            |
| 2026-10-28 | Added enforced security headers and a report-only CSP; upgraded Next.js to 16.4.3 for the audit fix.  |
| 2026-10-28 | `npm audit` reports 0 vulnerabilities after the Next.js upgrade.                                      |
