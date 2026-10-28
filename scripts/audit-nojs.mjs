#!/usr/bin/env node
/**
 * No-JavaScript audit against a running production server.
 * Usage: AUDIT_BASE_URL=http://localhost:3000 npm run audit:nojs
 *
 * Checks that server-rendered pages keep their content and links when
 * scripting is off, that the Home index falls back to the stacked list, and
 * that the narrow header swaps the menu trigger for visible links.
 */

import { chromium } from "playwright";

const base = (process.env.AUDIT_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const routes = [
  "/",
  "/work",
  "/work/documents-assistant",
  "/work/anomaly-detection-agent",
  "/work/sadine",
  "/work/rfid-access-control",
  "/about",
  "/missing-page",
];
const widths = [390, 1440];

try {
  const response = await fetch(base, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
} catch {
  console.error(`Cannot reach ${base}. Run "npm run build && npm start" first.`);
  process.exit(1);
}

const browser = await chromium.launch();
const failures = [];

function check(label, passed, detail) {
  console.log(`${passed ? "PASS" : "FAIL"} ${label} ${detail}`);
  if (!passed) failures.push(label);
}

try {
  for (const javaScriptEnabled of [false, true]) {
    const mode = javaScriptEnabled ? "js" : "no-js";

    for (const width of widths) {
      const context = await browser.newContext({
        javaScriptEnabled,
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();

      for (const route of routes) {
        await page.goto(base + route, { waitUntil: "networkidle" });
        const result = await page.evaluate(() => {
          const visible = (selector) =>
            [...document.querySelectorAll(selector)].filter((element) => {
              const style = getComputedStyle(element);
              return (
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                element.getBoundingClientRect().height > 0
              );
            });
          const main = document.querySelector("main");
          return {
            h1: document.querySelector("h1")?.textContent?.trim() ?? "",
            mainText: (main?.textContent ?? "").replace(/\s+/g, " ").trim().length,
            links: document.querySelectorAll("main a[href]").length,
            fallback: visible(".index-nojs").length,
            fallbackItems: visible(".index-nojs li").length,
            interactive: visible(".index-js").length,
            nojsNav: visible(".nojs-nav").length,
            nojsLinks: visible(".nojs-nav a[href]").length,
            jsMenu: visible(".js-menu").length,
            desktopNav: visible('nav[aria-label="Primary"]').length,
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
          };
        });

        const isMissing = route === "/missing-page";
        const contentOk =
          result.h1.length > 0 &&
          (isMissing ? result.mainText > 100 : result.mainText > 300) &&
          result.links >= (isMissing ? 2 : 3) &&
          result.scrollWidth <= result.innerWidth + 1;

        let homeOk = true;
        if (route === "/") {
          const indexOk = javaScriptEnabled
            ? result.interactive === 1 && result.fallback === 0
            : result.fallback === 1 && result.fallbackItems === 4 && result.interactive === 0;
          const headerOk = javaScriptEnabled
            ? width < 768
              ? result.jsMenu === 1 && result.nojsNav === 0
              : result.desktopNav === 1 && result.nojsNav === 0
            : width < 768
              ? result.nojsNav === 1 && result.nojsLinks === 5 && result.jsMenu === 0
              : result.desktopNav === 1 && result.nojsNav === 0 && result.jsMenu === 0;
          homeOk = indexOk && headerOk;
        }

        check(
          `${mode} ${String(width).padEnd(4)} ${route.padEnd(28)}`,
          contentOk && homeOk,
          `text=${result.mainText} links=${result.links} index=${result.interactive}/${result.fallback} items=${result.fallbackItems} nojsNav=${result.nojsNav} nojsLinks=${result.nojsLinks} width=${result.scrollWidth}/${result.innerWidth}`,
        );
      }

      await context.close();
    }
  }
} finally {
  await browser.close();
}

console.log("");

if (failures.length > 0) {
  console.log(`FAIL ${failures.length} check(s)`);
  process.exitCode = 1;
} else {
  console.log(`ALL PASS · ${routes.length} routes · ${widths.length} widths · JS on and off`);
}
