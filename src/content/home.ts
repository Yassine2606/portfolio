export type ArchiveEntry = {
  title: string;
  line: string;
  year: string;
  note: string;
  href: string | null;
  hrefLabel?: string;
};

/**
 * Archive projects are real, verified builds that do not get a full case file.
 * They stay as rows: a title, one line, a year, and wherever the code lives.
 * No thin pages, no dead links, no invented outcomes.
 */
export const archive: ArchiveEntry[] = [
  {
    title: "Wave",
    line: "Campus community app: events, carpooling, housing, deals, tutoring, and chat.",
    year: "2025",
    note: "Private · overview on request",
    href: null,
  },
  {
    title: "TranscriptoSense",
    line: "French, Arabic, and Darija audio into speakers, topics, and action items.",
    year: "2025",
    note: "Public repository",
    href: "https://github.com/Yassine2606/TranscriptoSense",
    hrefLabel: "View TranscriptoSense on GitHub",
  },
  {
    title: "Data Drift",
    line: "PSI and KS-tests that flag distribution shift and quantify the model impact.",
    year: "2025",
    note: "Public repository",
    href: "https://github.com/Yassine2606/Data-Drift-Decision-Intelligence-System",
    hrefLabel: "View Data Drift on GitHub",
  },
];

export const method = [
  {
    title: "Evidence over claims",
    body: "An answer is only as good as the evidence it cites. The assistant retrieves, answers, then runs a separate verification pass before a word reaches the user.",
    link: { label: "See the verification pass", href: "/work/documents-assistant#reliability" },
  },
  {
    title: "Reliability is the feature",
    body: "Presence is derived from heartbeats, retained state, and a broker Last Will — not from a single optimistic message. Failure paths are designed, not discovered.",
    link: { label: "See the access engine", href: "/work/rfid-access-control#reliability" },
  },
  {
    title: "Model the state, not the screen",
    body: "Quote acceptance is a transaction with an expiry, an audit entry, and one legal path. Status flags rot; a state machine can explain itself.",
    link: { label: "See the booking flow", href: "/work/sadine#decisions" },
  },
] as const;

export const experience = [
  {
    year: "2026",
    company: "Capgemini Engineering",
    role: "AI/RAG platform · PFE",
    detail: "Conversational retrieval with cited answers, verification, and provider failover.",
    href: "/work/documents-assistant",
  },
  {
    year: "2026",
    company: "Sadine Tours",
    role: "Travel platform",
    detail: "Public catalog, admin ERP, and customer account in three locales.",
    href: "/work/sadine",
  },
  {
    year: "2026",
    company: "Independent",
    role: "RFID access control",
    detail: "MQTT ingestion and a rule-based access engine with a live dashboard.",
    href: "/work/rfid-access-control",
  },
  {
    year: "2025",
    company: "YBInnovations",
    role: "Wave · campus app",
    detail: "Realtime chat, bookings, and payments across iOS and Android.",
    href: null,
  },
] as const;
