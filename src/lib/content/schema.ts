import { z } from "zod";

/**
 * Content schema — validates every JSON in src/content/** at build time.
 * The schema is the single source of truth for the content contract; it
 * doubles as the TypeScript types consumed by every section component.
 */

export const linkSchema = z.object({
  github: z.string().url().nullable(),
  demo: z.string().url().nullable(),
  docs: z.string().url().nullable(),
});

export const stackSchema = z.object({
  ai: z.array(z.string()).default([]),
  backend: z.array(z.string()).default([]),
  frontend: z.array(z.string()).default([]),
  infra: z.array(z.string()).default([]),
  data: z.array(z.string()).default([]),
});

export const capabilityEnum = z.enum([
  "RAG",
  "Multi-Agent",
  "MCP",
  "LLM Pipelines",
  "Embeddings",
  "Vector Search",
  "Tool Calling",
  "Workflow Orchestration",
  "Frontend",
  "Backend",
  "Cloud",
  "DevOps",
  "Databases",
  "Tooling",
]);

export const architectureNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(["frontend", "backend", "database", "ai", "infra"]),
  /** Pipeline stage this node belongs to; nodes without a stage group under "Core". */
  stage: z.string().optional(),
  description: z.string(),
});

export const architectureEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string(),
});

export const architectureSchema = z.object({
  description: z.string(),
  nodes: z.array(architectureNodeSchema),
  edges: z.array(architectureEdgeSchema),
});

export const caseStudySchema = z.object({
  problem: z.string(),
  requirements: z.array(z.string()),
  solution: z.string(),
  architecture: architectureSchema,
  implementation: z.string(),
  challenges: z
    .array(
      z.object({
        title: z.string(),
        resolution: z.string(),
      })
    )
    .default([]),
  /**
   * Ordered end-to-end pipeline stages (e.g. the RAG flow). Rendered as the
   * animated flow inside the case study's Architecture block; must match
   * stages actually implemented. Empty = no flow shown.
   */
  pipeline: z.array(z.string()).default([]),
  results: z
    .array(
      z.object({
        metric: z.string(),
        value: z.string(),
        source: z.string(),
      })
    )
    .default([]),
  lessons: z.array(z.string()).default([]),
  future: z.array(z.string()).default([]),
});

export const galleryItemSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

export const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be lowercase-hyphenated"),
    title: z.string(),
    /** Short display name for tight contexts (nav cross-links, chips). */
    shortName: z.string(),
    tagline: z.string(),
    summary: z.string(),
    year: z.number(),
    role: z.string(),
    status: z.enum(["production", "development", "archived", "experimental"]),
    featured: z.boolean().default(false),
    /** Mark the single strongest AI case study; sorts to the top. */
    flagship: z.boolean().default(false),
    /** Editorial display order (ascending). The source of truth for how the collection is presented. */
    order: z.number(),
    links: linkSchema.default({ github: null, demo: null, docs: null }),
    stack: stackSchema,
    capabilities: z.array(capabilityEnum).default([]),
    caseStudy: caseStudySchema,
    gallery: z.array(galleryItemSchema).default([]),
  })
  // Cross-field checks that catch bad data at build time, not runtime: every
  // edge must reference a node that actually exists, and node ids are unique.
  .superRefine((data, ctx) => {
    const ids = new Set<string>();
    for (const node of data.caseStudy.architecture.nodes) {
      if (ids.has(node.id)) {
        ctx.addIssue({
          code: "custom",
          message: `duplicate architecture node id "${node.id}"`,
          path: ["caseStudy", "architecture", "nodes"],
        });
      }
      ids.add(node.id);
    }
    for (const edge of data.caseStudy.architecture.edges) {
      for (const ref of [edge.from, edge.to]) {
        if (!ids.has(ref)) {
          ctx.addIssue({
            code: "custom",
            message: `edge "${edge.from}" -> "${edge.to}" references missing node "${ref}"`,
            path: ["caseStudy", "architecture", "edges"],
          });
        }
      }
    }
  });

export type Project = z.infer<typeof projectSchema>;
export type ArchitectureNode = z.infer<typeof architectureNodeSchema>;
export type ArchitectureEdge = z.infer<typeof architectureEdgeSchema>;

/** Validate a parsed JSON object against the project schema. */
export function parseProject(data: unknown): Project {
  return projectSchema.parse(data);
}

/* ------------------------------------------------------------------ */
/* Site-wide content (src/content/site.json)                           */
/* ------------------------------------------------------------------ */

export const siteSchema = z.object({
  name: z.string(),
  role: z.string(),
  hero: z.object({
    headline: z.string(),
    subtext: z.string(),
    focus: z.string(),
    availability: z.string(),
    ctaPrimary: z.object({ label: z.string(), href: z.string() }),
    ctaSecondary: z.object({ label: z.string(), href: z.string() }),
  }),
  nav: z.array(z.object({ label: z.string(), href: z.string() })),
  engineering: z.object({
    intro: z.string(),
    clusters: z.array(
      z.object({
        title: z.string(),
        items: z.array(
          z.object({
            name: z.string(),
            note: z.string(),
            projects: z.array(z.string()).default([]),
          })
        ),
      })
    ),
  }),
  toolbox: z.object({
    intro: z.string(),
    groups: z.array(
      z.object({
        category: z.string(),
        items: z.array(z.string()),
      })
    ),
  }),
  philosophy: z.object({
    title: z.string(),
    intro: z.string(),
    principles: z.array(
      z.object({
        title: z.string(),
        body: z.string(),
      })
    ),
  }),
  timeline: z.array(
    z.object({
      year: z.string(),
      title: z.string(),
      detail: z.string(),
      links: z.array(z.string().url()).default([]),
    })
  ),
  contact: z.object({
    heading: z.string(),
    subtext: z.string(),
    ctaLabel: z.string(),
    email: z.string(),
    links: z.array(
      z.object({
        label: z.string(),
        href: z.string().url().nullable(),
      })
    ),
  }),
});

export type SiteContent = z.infer<typeof siteSchema>;

export function parseSite(data: unknown): SiteContent {
  return siteSchema.parse(data);
}