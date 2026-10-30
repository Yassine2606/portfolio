import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { workFrontmatterSchema, type WorkFrontmatter } from "./schema";

const dir = path.join(process.cwd(), "src/content/work");

export type WorkEntry = {
  slug: string;
  frontmatter: WorkFrontmatter;
  body: string;
};

export function getWorkSlugs(): string[] {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getWork(slug: string): WorkEntry {
  const file = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(file)) throw new Error(`Unknown case study: ${slug}`);
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = workFrontmatterSchema.parse(data);
  if (frontmatter.slug !== slug) {
    throw new Error(`Slug mismatch: ${slug} vs ${frontmatter.slug}`);
  }
  return { slug, frontmatter, body: content };
}

export function getAllWork(): WorkEntry[] {
  return getWorkSlugs()
    .map(getWork)
    .sort((a, b) => {
      if (a.frontmatter.featured !== b.frontmatter.featured) {
        return a.frontmatter.featured ? -1 : 1;
      }
      return a.frontmatter.order - b.frontmatter.order;
    });
}

export function getFeaturedWork(): WorkEntry[] {
  return getAllWork().filter((work) => work.frontmatter.featured);
}

export function getArchiveWork(): WorkEntry[] {
  return getAllWork().filter((work) => !work.frontmatter.featured);
}

export function getNextWork(slug: string): WorkEntry | null {
  const featured = getFeaturedWork();
  const index = featured.findIndex((work) => work.slug === slug);
  if (index === -1) return null;
  return featured[(index + 1) % featured.length] ?? null;
}

export function getPreviousWork(slug: string): WorkEntry | null {
  const featured = getFeaturedWork();
  const index = featured.findIndex((work) => work.slug === slug);
  if (index === -1) return null;
  return featured[(index - 1 + featured.length) % featured.length] ?? null;
}
