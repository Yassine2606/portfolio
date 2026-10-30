import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve("axe-core/axe.min.js"), "utf8");

const baseUrl = process.env.AUDIT_BASE_URL ?? "http://localhost:3000";
const routes = [
  "/",
  "/work",
  "/work/documents-assistant",
  "/work/sadine",
  "/work/anomaly-detection-agent",
  "/work/rfid-access-control",
  "/about",
  "/__audit-404",
];
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
  { name: "narrow", width: 320, height: 800 },
];
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

try {
  const response = await fetch(baseUrl);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
} catch {
  console.error(`Cannot reach ${baseUrl}. Run "npm run build && npm start" first.`);
  process.exit(2);
}

let browser;
try {
  browser = await chromium.launch();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  console.error('Install the browser once with "npx playwright install chromium".');
  process.exit(2);
}

let total = 0;

async function audit(page, label) {
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(
    async (runTags) => window.axe.run(document, { tags: runTags, resultTypes: ["violations"] }),
    tags,
  );
  const { violations } = results;
  total += violations.length;
  console.log(`${label.padEnd(42)} ${violations.length} violation(s)`);
  for (const violation of violations) {
    console.log(`  [${violation.impact}] ${violation.id}: ${violation.help}`);
    for (const node of violation.nodes) {
      console.log(`    ${node.target.join(" ")}`);
    }
  }
}

for (const viewport of viewports) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.width < 640,
  });

  for (const route of routes) {
    await page.goto(baseUrl + route, { waitUntil: "networkidle" });
    await audit(page, `${viewport.name} ${route}`);
  }

  if (viewport.width < 640) {
    await page.goto(baseUrl + "/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Menu" }).click();
    await page.waitForTimeout(200);
    await audit(page, `${viewport.name} / (menu open)`);
  }

  await page.close();
}

for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.emulateMedia({ forcedColors: "active" });

  for (const route of routes) {
    await page.goto(baseUrl + route, { waitUntil: "networkidle" });
    await audit(page, `forced-colors ${width} ${route}`);
  }

  await page.close();
}

await browser.close();
console.log(`\nTOTAL: ${total} violation(s)`);
process.exitCode = total === 0 ? 0 : 1;
