/**
 * Single source of truth for identity, contact, and availability.
 * Used by the header, hero, contact block, footer, metadata, and JSON-LD.
 */

const resumeFiles = {
  en: "/resume.pdf",
  fr: "/resume-fr.pdf",
  enAts: "/resume-ats.pdf",
  frAts: "/resume-fr-ats.pdf",
} as const;

/**
 * Four real files, four explicit choices. The picker, the mobile menu, and
 * every direct link read from this list so a version cannot silently drift.
 */
export const resumeVersions = [
  {
    language: "English",
    format: "Designed",
    href: resumeFiles.en,
    filename: "Yassine-Ben-Romdhane-Resume-EN.pdf",
    note: "The one to read",
  },
  {
    language: "English",
    format: "ATS",
    href: resumeFiles.enAts,
    filename: "Yassine-Ben-Romdhane-Resume-EN-ATS.pdf",
    note: "The one for portals",
  },
  {
    language: "Français",
    format: "Designed",
    href: resumeFiles.fr,
    filename: "Yassine-Ben-Romdhane-CV-FR.pdf",
    note: "The one to read",
  },
  {
    language: "Français",
    format: "ATS",
    href: resumeFiles.frAts,
    filename: "Yassine-Ben-Romdhane-CV-FR-ATS.pdf",
    note: "The one for portals",
  },
] as const;

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
    workModes: "Remote · Hybrid · On-site",
    relocation: "Open to relocation",
    visaSponsorship: "Required outside Tunisia",
  },

  focus: "RAG, agents, and reliability",
  lastShipped: "Enterprise RAG · Capgemini PFE",
  lastUpdated: "October 2026",

  email: "yassine.ben.romdhanee@gmail.com",
  github: "https://github.com/Yassine2606",
  linkedin: "https://www.linkedin.com/in/mohamed-yassine-ben-romdhane-603a37294/",
  resume: resumeFiles.en,
  resumeFr: resumeFiles.fr,
  resumeAts: resumeFiles.enAts,
  resumeFrAts: resumeFiles.frAts,

  education: [
    {
      school: "ESPRIMS",
      programme: "Preparatory cycle",
      years: "2021–2023",
      note: "Two-year preparatory cycle in Monastir, before the engineering cycle.",
    },
    {
      school: "ESPRIM — École Supérieure Privée d'Ingénieurs de Monastir",
      programme: "Engineering cycle, Computer Science — data science track",
      years: "2023–2026",
      note: "National engineering degree. Final-year project at Capgemini Engineering.",
    },
  ] as const,

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
