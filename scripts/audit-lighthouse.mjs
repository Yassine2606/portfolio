#!/usr/bin/env node
/**
 * Repeatable Lighthouse audit against a running production server.
 * Usage: AUDIT_BASE_URL=http://localhost:3000 npm run audit:lighthouse
 *
 * Runs Lighthouse 13 three times per route on mobile emulation, prints the
 * median, and fails when a median misses the recorded budget. The Chrome
 * binary comes from Playwright, so `npx playwright install chromium` is the
 * only browser prerequisite.
 */

import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { chromium } from "playwright";

const base = (process.env.AUDIT_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const routes = [
  { path: "/", label: "/" },
  { path: "/work", label: "/work" },
  { path: "/work/documents-assistant", label: "/work/documents-assistant" },
  { path: "/about", label: "/about" },
];
const runsPerRoute = 3;
const categories = ["performance", "accessibility", "best-practices", "seo"];

process.env.CHROME_PATH ||= chromium.executablePath();

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function seconds(ms) {
  return `${(ms / 1000).toFixed(1)}s`;
}

try {
  const response = await fetch(base, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
} catch {
  console.error(`Cannot reach ${base}. Run "npm run build && npm start" first.`);
  process.exit(1);
}

console.log(`Lighthouse 13 · mobile emulation · ${runsPerRoute} runs per route · ${base}\n`);

const failures = [];
const rows = [];

for (const route of routes) {
  const chrome = await launch({
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });

  try {
    const runs = [];
    for (let index = 0; index < runsPerRoute; index += 1) {
      const result = await lighthouse(`${base}${route.path}`, {
        port: chrome.port,
        output: "json",
        onlyCategories: categories,
        formFactor: "mobile",
      });
      const { lhr } = result;
      runs.push({
        performance: lhr.categories.performance.score * 100,
        accessibility: lhr.categories.accessibility.score * 100,
        bestPractices: lhr.categories["best-practices"].score * 100,
        seo: lhr.categories.seo.score * 100,
        lcp: lhr.audits["largest-contentful-paint"].numericValue,
        cls: lhr.audits["cumulative-layout-shift"].numericValue,
        tbt: lhr.audits["total-blocking-time"].numericValue,
      });
    }

    const medians = {
      performance: median(runs.map((run) => run.performance)),
      accessibility: median(runs.map((run) => run.accessibility)),
      bestPractices: median(runs.map((run) => run.bestPractices)),
      seo: median(runs.map((run) => run.seo)),
      lcp: median(runs.map((run) => run.lcp)),
      cls: median(runs.map((run) => run.cls)),
      tbt: median(runs.map((run) => run.tbt)),
    };

    rows.push({ route, medians, runs });

    const checks = [
      ["performance ≥ 95", medians.performance >= 95],
      ["accessibility = 100", medians.accessibility >= 99.5],
      ["best practices = 100", medians.bestPractices >= 99.5],
      ["SEO = 100", medians.seo >= 99.5],
      ["LCP ≤ 1.8s", medians.lcp <= 1800],
      ["CLS ≤ 0.05", medians.cls <= 0.05],
      ["TBT ≤ 300ms", medians.tbt <= 300],
    ];
    for (const [label, passed] of checks) {
      if (!passed) failures.push(`${route.label}: ${label}`);
    }

    console.log(
      `${route.label.padEnd(28)} perf ${String(Math.round(medians.performance)).padStart(3)}  a11y ${String(
        Math.round(medians.accessibility),
      ).padStart(3)}  bp ${String(Math.round(medians.bestPractices)).padStart(3)}  seo ${String(
        Math.round(medians.seo),
      ).padStart(
        3,
      )}  LCP ${seconds(medians.lcp).padStart(5)}  CLS ${medians.cls.toFixed(2)}  TBT ${Math.round(
        medians.tbt,
      )
        .toString()
        .padStart(3)}ms`,
    );
    console.log(
      `  performance runs: ${runs.map((run) => Math.round(run.performance)).join(", ")} · LCP: ${runs
        .map((run) => seconds(run.lcp))
        .join(", ")}`,
    );
  } finally {
    await chrome.kill();
  }
}

console.log("");
if (failures.length > 0) {
  console.log(`FAIL ${failures.length} assertion(s):`);
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `ALL PASS · ${rows.length} routes · ${runsPerRoute} runs each · medians within budget`,
  );
}
