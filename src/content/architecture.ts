/**
 * Architecture diagrams as data. Rendered as accessible stage cards, never a
 * fixed-pixel SVG. Each entry has a plain-language flow for readers who cannot
 * or do not want to parse the diagram.
 */

export type NodeKind = "client" | "service" | "store" | "model" | "edge" | "queue";

export type ArchitectureNode = {
  name: string;
  kind: NodeKind;
  note: string;
};

export type ArchitectureStage = {
  label: string;
  nodes: ArchitectureNode[];
};

export type ArchitectureDoc = {
  title: string;
  summary: string;
  trace: string;
  stages: ArchitectureStage[];
  flow: string[];
  caveat?: string;
};

export const architecture: Record<string, ArchitectureDoc> = {
  "documents-assistant": {
    title: "Ingest, retrieve, verify, cite",
    trace: "UPLOAD · PARSE · EMBED · RETRIEVE · VERIFY · CITE",
    summary:
      "Files arrive through the Express API and are processed asynchronously by the Python service. Questions run a tool-calling retrieval loop, a separate verification pass, then stream back with their sources.",
    stages: [
      {
        label: "01 / Client",
        nodes: [
          {
            name: "React + Vite UI",
            kind: "client",
            note: "Chat, upload, document browser. Renders streamed answers, agent steps, and cited passages.",
          },
        ],
      },
      {
        label: "02 / API",
        nodes: [
          {
            name: "Express API",
            kind: "service",
            note: "JWT auth, users, conversations, documents, messages. Relays the AI stream over SSE.",
          },
        ],
      },
      {
        label: "03 / Ingest",
        nodes: [
          {
            name: "BullMQ + Redis",
            kind: "queue",
            note: "Document jobs with exponential-backoff retries and an inline fallback if Redis disappears.",
          },
          {
            name: "FastAPI AI service",
            kind: "service",
            note: "Parsing with OCR, semantic chunking, embedding, retrieval, generation, verification.",
          },
        ],
      },
      {
        label: "04 / Store + models",
        nodes: [
          {
            name: "PostgreSQL + pgvector",
            kind: "store",
            note: "Relational data and 384-dimension chunk embeddings, with ivfflat and full-text indexes.",
          },
          {
            name: "sentence-transformers",
            kind: "model",
            note: "Local all-MiniLM-L6-v2 embeddings, batched and cached. No hosted embedding dependency.",
          },
          {
            name: "Gemini + NVIDIA NIM",
            kind: "model",
            note: "Interchangeable answer providers with a failover chain.",
          },
        ],
      },
    ],
    flow: [
      "A user uploads a file; the Express API stores it and enqueues a BullMQ job.",
      "A worker asks the FastAPI service to parse, chunk, embed, and index the document in pgvector.",
      "At question time, Express sends the message and the user's document scope to FastAPI.",
      "FastAPI retrieves candidates with dense + full-text search, fuses the lists with RRF, and runs a tool-calling loop.",
      "A separate verification call checks the answer against retrieved evidence before it streams to the browser.",
      "The browser receives JSON-lines events relayed as SSE: thinking, tool use, verification, answer, sources.",
    ],
    caveat:
      "The stack runs end to end locally. The benchmark that would turn this architecture into a measured outcome is designed but not yet run.",
  },

  sadine: {
    title: "Three surfaces, one transactional core",
    trace: "REQUEST · QUOTE · ACCEPT · BOOK · AUDIT",
    summary:
      "A Next.js frontend serves the public catalog, the customer account, and the admin ERP across three locales. One Fastify API owns the domain logic and the quote-to-booking state machine over PostgreSQL.",
    stages: [
      {
        label: "01 / Client",
        nodes: [
          {
            name: "Next.js surfaces",
            kind: "client",
            note: "Public catalog, customer account, and admin ERP under locale-prefixed route groups (en/fr/ar).",
          },
        ],
      },
      {
        label: "02 / API",
        nodes: [
          {
            name: "Fastify + JWT",
            kind: "service",
            note: "26 domain modules as thin routes over services. Authenticate → requireRole → requireOwner contracts.",
          },
        ],
      },
      {
        label: "03 / Domain",
        nodes: [
          {
            name: "Quote → booking state machine",
            kind: "service",
            note: "Expiry-aware, idempotent transitions with a centralized audit log; acceptance cannot race a second time.",
          },
        ],
      },
      {
        label: "04 / Data + delivery",
        nodes: [
          {
            name: "PostgreSQL + Prisma",
            kind: "store",
            note: "41 models: catalog, quotes, bookings, items, audit logs, CMS pages, invoices, users.",
          },
          {
            name: "Media + mail",
            kind: "service",
            note: "Multipart uploads with sharp processing; transactional mail on lifecycle transitions.",
          },
        ],
      },
    ],
    flow: [
      "A traveler browses the localized catalog and submits a quote request.",
      "An agent builds a quote in the admin ERP; the quote carries an expiry and copied passenger/item data.",
      "The customer accepts in their account; the transition runs in a transaction and is idempotent.",
      "Acceptance creates the booking, writes the audit entry, and fires the notification and email.",
      "Money leaves the API as decimal strings; the client formats per locale and never does arithmetic.",
    ],
    caveat:
      "Client-owned system. Counts come from the private repository; no customer data, screenshots, or business metrics are published.",
  },

  "anomaly-detection-agent": {
    title: "Read, classify, explain, serve",
    trace: "MONITOR · DETECT · EXPLAIN · REPORT",
    summary:
      "Monitors read databases and probe endpoints. Detectors classify what they find, a Gemini agent turns findings into guidance, and two clients consume the result: a dashboard and an MCP server.",
    stages: [
      {
        label: "01 / Monitor",
        nodes: [
          {
            name: "DB + endpoint monitors",
            kind: "service",
            note: "Read-only PostgreSQL, MySQL, and MongoDB connectors; HTTP probes for status and latency.",
          },
        ],
      },
      {
        label: "02 / Detect",
        nodes: [
          {
            name: "Anomaly detectors",
            kind: "service",
            note: "Nulls, duplicates, schema and FK violations, slow queries, missing indexes, endpoint regressions.",
          },
        ],
      },
      {
        label: "03 / Explain",
        nodes: [
          {
            name: "Gemini 2.5 Flash",
            kind: "model",
            note: "Turns each finding into a plain-language explanation, severity, and a fix with impact/effort.",
          },
        ],
      },
      {
        label: "04 / Serve",
        nodes: [
          {
            name: "FastAPI",
            kind: "service",
            note: "Nine HTTP routes for scans, reports, history, chat, endpoint checks, database health, and stats over a seeded report store.",
          },
          {
            name: "MCP server",
            kind: "service",
            note: "Four tools over stdio for any MCP client. Currently mock-backed: the honest boundary.",
          },
          {
            name: "React dashboard",
            kind: "client",
            note: "Anomaly cards, statistics, reports, scan triggers, and an AI recommendation chat.",
          },
        ],
      },
    ],
    flow: [
      "A scan reads schema and sample data through read-only methods and probes configured endpoints.",
      "Detectors normalize the signals into three anomaly classes.",
      "Flagged findings go to Gemini, which returns an explanation, severity, and a concrete fix.",
      "The API stores the severity-ranked report and serves it to the dashboard.",
      "The MCP server exposes scan and report operations as tools to any MCP client.",
    ],
    caveat:
      "The MCP tools accept only the mock scan type today; the real connectors are not wired into them. The case study states this instead of hiding it.",
  },

  "rfid-access-control": {
    title: "From badge scan to access decision",
    trace: "SCAN · VALIDATE · DECIDE · LOG · BROADCAST",
    summary:
      "ESP32 readers publish badge scans over MQTT. A Fastify consumer validates each event, evaluates the access rules, writes an audit record, and broadcasts the decision to a live dashboard.",
    stages: [
      {
        label: "01 / Edge",
        nodes: [
          {
            name: "ESP32 + RC522",
            kind: "edge",
            note: "Publishes scan, heartbeat, and status events. Firmware lives in the repository.",
          },
        ],
      },
      {
        label: "02 / Ingest",
        nodes: [
          {
            name: "MQTT broker",
            kind: "service",
            note: "QoS 1 delivery, retained presence state, and Last Will for offline detection.",
          },
          {
            name: "Validated consumer",
            kind: "service",
            note: "Zod-validated payloads dispatched to services. No business logic in the MQTT callback.",
          },
        ],
      },
      {
        label: "03 / Decide",
        nodes: [
          {
            name: "Access engine",
            kind: "service",
            note: "Employee active, skill certified, machine authorized, schedule allowed. Every denial has a reason.",
          },
        ],
      },
      {
        label: "04 / Record + broadcast",
        nodes: [
          {
            name: "PostgreSQL + Redis",
            kind: "store",
            note: "Eight Prisma models and derived device presence. Five versioned migrations.",
          },
          {
            name: "Socket.IO dashboard",
            kind: "client",
            note: "Live grants, denials, presence, and alerts; REST for history, reporting, and administration.",
          },
        ],
      },
    ],
    flow: [
      "A badge is scanned; the reader publishes the event to the MQTT broker.",
      "The backend validates the payload and passes it to the access-control service.",
      "The service checks employee status, certification, machine authorization, and schedule.",
      "The decision is written to the audit log and broadcast to the dashboard.",
      "A serial-to-MQTT bridge runs the same consumer path, so the system is testable without hardware.",
    ],
    caveat:
      "Helper project for Sagemcom Tunisia. Counts come from the private repository; no employer or client data is published.",
  },
};
