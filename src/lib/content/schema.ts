import { z } from "zod";

const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
  kind: z.enum(["demo", "repo", "docs", "video"]),
});

const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  kind: z.enum(["measured", "artifact", "scope"]),
  source: z.string().min(1),
  href: z.string().url().optional(),
  measuredAt: z.string().date(),
});

const evidenceSchema = z.object({
  id: z.string().min(1),
  claim: z.string().min(1),
  source: z.string().min(1),
  kind: z.enum(["repo", "deploy", "screenshot", "benchmark", "doc", "commit"]),
  href: z.string().url().optional(),
  private: z.boolean().default(false),
  verifiedAt: z.string().date(),
});

const stackSchema = z.object({
  ai: z.array(z.string()),
  backend: z.array(z.string()),
  frontend: z.array(z.string()),
  infra: z.array(z.string()),
  data: z.array(z.string()),
});

export const workFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  tagline: z.string().min(1).max(120),
  descriptor: z.string().min(1).max(60),
  summary: z.string().min(1).max(340),
  year: z.number().int().min(2020).max(2100),
  role: z.string().min(1),
  duration: z.string().min(1).optional(),
  status: z.enum(["production", "internal", "in-development", "archived"]),
  featured: z.boolean(),
  order: z.number().int().nonnegative(),
  confidentiality: z.enum(["public", "partially-private", "private"]),

  /** The 60-second contract, max 18 words per value. */
  contract: z.object({
    problem: z.string().min(1),
    constraint: z.string().min(1),
    proof: z.string().min(1),
  }),

  capabilities: z.array(z.string()).min(1),
  stack: stackSchema,
  links: z.array(linkSchema),
  metrics: z.array(metricSchema).max(4),
  evidence: z.array(evidenceSchema).min(2),
  seo: z.object({
    title: z.string().min(1).max(70),
    description: z.string().min(50).max(170),
    ogAlt: z.string().min(1),
  }),
});

export type WorkFrontmatter = z.infer<typeof workFrontmatterSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type Evidence = z.infer<typeof evidenceSchema>;
