/**
 * Single source of truth for identity, contact, and availability.
 * Used by the header, hero, contact block, footer, metadata, and JSON-LD.
 */

export const site = {
  name: "Yassine Ben Romdhane",
  shortName: "YBR",
  role: "AI Engineer",
  location: "Monastir, Tunisia",
  timezone: "CET+1",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yassine-ben-romdhane.vercel.app",

  availability: {
    label: "Available immediately",
    detail: "Monastir, Tunisia · CET+1",
  },

  focus: "RAG, agents, and reliability",
  lastShipped: "Enterprise RAG · Capgemini PFE",
  lastUpdated: "October 2026",

  email: "yassine.ben.romdhanee@gmail.com",
  github: "https://github.com/Yassine2606",
  /**
   * Deliberately empty until the owner supplies the profile URL.
   * Never invent a social link: a dead LinkedIn is worse than none.
   */
  linkedin: null as string | null,
  resume: "/resume.pdf",

  education: {
    school: "ESPRIM — École Supérieure Privée d'Ingénieurs de Monastir",
    programme: "Engineering cycle, Computer Science",
    years: "2021–2026",
  },

  languages: ["Arabic", "French", "English"],

  knowsAbout: [
    "Retrieval-augmented generation",
    "AI agents",
    "Vector search",
    "Backend engineering",
    "PostgreSQL",
    "FastAPI",
    "TypeScript",
    "Reliability engineering",
  ],
} as const;

export type Site = typeof site;
