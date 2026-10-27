# Evidence ledger

Status: Template · started 27 Oct 2026
Every checkable claim on the site gets a row. If it is not here, it does not ship.

| #   | Claim                                                           | Project                 | Kind     | Source                                    | Verified   | Owner   |
| --- | --------------------------------------------------------------- | ----------------------- | -------- | ----------------------------------------- | ---------- | ------- |
| 1   | Answers are verified against retrieved chunks before streaming. | Documents Assistant     | repo     | `ai-service/app/verification/verifier.py` | 2026-10-27 | Yassine |
| 2   | The client UI is private; the demo uses a synthetic corpus.     | Documents Assistant     | doc      | Permission note, 27 Oct 2026              | 2026-10-27 | Yassine |
| 3   | 41 Prisma models.                                               | Sadine Tours            | scope    | `sadine-back/prisma/schema.prisma`        | 2026-10-27 | Yassine |
| 4   | 26 backend modules.                                             | Sadine Tours            | scope    | `sadine-back/src/modules/`                | 2026-10-27 | Yassine |
| 5   | 224 route handlers.                                             | Sadine Tours            | scope    | `sadine-back/src/modules/` (grep)         | 2026-10-27 | Yassine |
| 6   | 3 locales: en/fr/ar.                                            | Sadine Tours            | artifact | `sadine-front/src/messages/`              | 2026-10-27 | Yassine |
| 7   | Quote acceptance rejects expired quotes inside the transaction. | Sadine Tours            | repo     | `quotes.service.ts`                       | 2026-10-27 | Yassine |
| 8   | MCP server exposes scans and reports as tools.                  | Anomaly Detection Agent | repo     | `src/mcp_server.py`                       | 2026-10-27 | Yassine |
| 9   | 4 MCP tools.                                                    | Anomaly Detection Agent | scope    | `src/mcp_server.py`                       | 2026-10-27 | Yassine |
| 10  | 3 database connectors, read-only.                               | Anomaly Detection Agent | artifact | PostgreSQL, MySQL, MongoDB connectors     | 2026-10-27 | Yassine |
| 11  | Offline detection within 3 missed heartbeats.                   | RFID Access Control     | repo     | retained status + Last Will               | 2026-10-27 | Yassine |
| 12  | 8 Prisma models, 11 backend modules, 5 migrations.              | RFID Access Control     | scope    | `backend/prisma`, `backend/src/modules`   | 2026-10-27 | Yassine |
| 13  | Push receipts are polled every 60s.                             | Wave                    | repo     | `workers/pushWorker.ts`                   | 2026-10-27 | Yassine |
| 14  | ~30 API route modules.                                          | Wave                    | scope    | `back/routes/`                            | 2026-10-27 | Yassine |
| 15  | 3 languages: French, Arabic, Darija.                            | TranscriptoSense        | artifact | pipeline config                           | 2026-10-27 | Yassine |
| 16  | 5 export formats.                                               | TranscriptoSense        | artifact | JSON, DOCX, PDF, CSV, ICS                 | 2026-10-27 | Yassine |
| 17  | PSI + KS + chi-square drift tests.                              | Data Drift              | repo     | `src/`                                    | 2026-10-27 | Yassine |

## How to add a row

1. Write the claim exactly as it appears (or will appear) on the site.
2. Name the project.
3. Choose a kind: `repo`, `deploy`, `screenshot`, `benchmark`, `doc`, `commit`, `scope`, `artifact`.
4. Give a path, URL, or method. If private, say so.
5. Set `verifiedAt` to the date you checked.
6. If it cannot be verified, remove the claim from the site — do not leave the row blank.

## Review

- Before launch: every row verified; every metric has a method and a date.
- Quarterly: re-verify; demote stale claims.
- After a project update: update the row and the case study in the same commit.
