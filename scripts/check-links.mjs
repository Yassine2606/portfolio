#!/usr/bin/env node
/**
 * Internal link and asset check against a running production server.
 * Usage: BASE_URL=http://localhost:3000 node scripts/check-links.mjs [--external]
 *
 * Internal routes come from sitemap.xml plus every same-origin link found in
 * the rendered HTML. External links are opt-in because CI network access to
 * third-party sites is not deterministic.
 */

const base = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const checkExternal = process.argv.includes("--external");
const failures = [];
const checked = new Map();

function fail(label, detail) {
  failures.push(`${label}: ${detail}`);
  console.log(`FAIL ${label} ${detail}`);
}

async function get(url, options = {}) {
  return fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
    ...options,
  });
}

function normalize(href) {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  if (href.startsWith("#")) return null;
  try {
    const url = new URL(href, base);
    if (url.origin !== new URL(base).origin) return null;
    return url.pathname + url.search;
  } catch {
    return null;
  }
}

async function checkInternal(path) {
  if (checked.has(path)) return checked.get(path);
  const response = await get(base + path);
  const type = response.headers.get("content-type") ?? "unknown";
  const ok = response.status === 200;
  console.log(`${ok ? "ok  " : "FAIL"} ${response.status} ${type} ${path}`);
  if (!ok) fail(path, `expected 200, got ${response.status}`);
  checked.set(path, ok);
  return ok;
}

const sitemap = await get(`${base}/sitemap.xml`);
if (!sitemap.ok) {
  fail("/sitemap.xml", `expected 200, got ${sitemap.status}`);
} else {
  const xml = await sitemap.text();
  const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => {
      try {
        const url = new URL(match[1]);
        return url.pathname + url.search;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  for (const route of routes) await checkInternal(route);
}

// Assets that are not linked from every page.
for (const asset of [
  "/resume.pdf",
  "/resume-fr.pdf",
  "/resume-ats.pdf",
  "/resume-fr-ats.pdf",
  "/robots.txt",
  "/icon.svg",
  "/og.png",
]) {
  await checkInternal(asset);
}

const pages = [...checked.keys()].filter(
  (path) =>
    !path.endsWith(".pdf") &&
    !path.endsWith(".xml") &&
    !path.endsWith(".txt") &&
    !path.endsWith(".svg") &&
    !path.endsWith(".png"),
);

const external = new Set();
for (const page of pages) {
  const response = await get(base + page);
  if (!response.ok) continue;
  const html = await response.text();
  const hrefs = [...html.matchAll(/<a[^>]+href="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (href.startsWith("http") && !href.startsWith(base)) {
      external.add(href);
    } else {
      const path = normalize(href);
      if (path) await checkInternal(path.split("#")[0]);
    }
  }
}

if (checkExternal) {
  for (const href of [...external].sort()) {
    try {
      const response = await get(href, {
        headers: { "user-agent": "Mozilla/5.0 (portfolio link check)" },
      });
      const ok = response.status >= 200 && response.status < 400;
      console.log(`${ok ? "ok  " : "FAIL"} ${response.status} ${href}`);
      if (!ok) fail(href, `expected 2xx/3xx, got ${response.status}`);
    } catch (error) {
      fail(href, error.message);
    }
  }
} else if (external.size > 0) {
  console.log(`skipped ${external.size} external link(s); pass --external to check them`);
}

console.log(
  `\n${failures.length === 0 ? "ALL PASS" : `${failures.length} FAILURE(S)`} · ${checked.size} internal URL(s)`,
);
process.exitCode = failures.length === 0 ? 0 : 1;
