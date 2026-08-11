import fs from "node:fs";
import path from "node:path";

import type { Project, SiteContent } from "./schema";
import { parseProject, parseSite } from "./schema";

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");
const SITE_FILE = path.join(process.cwd(), "src", "content", "site.json");

/**
 * Load and validate every project JSON at build time. A malformed or
 * unparseable file fails the build, never the runtime.
 */
export function getProjects(): Project[] {
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".json"));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8");
    const data = JSON.parse(raw) as unknown;
    return parseProject(data);
  });
}

/** Load and validate the site-wide content (hero, nav, philosophy, etc.). */
export function getSite(): SiteContent {
  const raw = fs.readFileSync(SITE_FILE, "utf8");
  return parseSite(JSON.parse(raw) as unknown);
}
