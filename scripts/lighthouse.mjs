import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, writeFile, access } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
import { chromium } from "@playwright/test";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

await access(".next/BUILD_ID");
const baseUrl = "http://127.0.0.1:3102";
const routes = [
  "/",
  "/work/analytics-performance",
  "/writing/java-completablefuture-executors",
  "/resume",
];
const outputDirectory = "test-results/quality/lighthouse";
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3102"],
  { stdio: "inherit" },
);
let chrome;
const results = [];
try {
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null)
      throw new Error("Production audit server exited before becoming ready");
    try {
      ready = (await fetch(baseUrl)).ok;
    } catch {
      /* Server is still starting. */
    }
    if (ready) break;
    await setTimeout(250);
  }
  if (!ready) throw new Error("Production audit server did not become ready");
  await mkdir(outputDirectory, { recursive: true });
  chrome = await launch({
    chromePath: chromium.executablePath(),
    chromeFlags: [
      "--headless=new",
      "--disable-dev-shm-usage",
      ...(process.env.CI ? ["--no-sandbox"] : []),
    ],
  });
  for (const route of routes) {
    console.log(`Auditing mobile performance and accessibility: ${route}`);
    const result = await lighthouse(new URL(route, baseUrl).href, {
      port: chrome.port,
      output: ["json", "html"],
      onlyCategories: ["performance", "accessibility"],
      formFactor: "mobile",
      logLevel: "error",
    });
    if (!result || result.lhr.runtimeError)
      throw new Error(
        `${route}: ${result?.lhr.runtimeError?.message ?? "Lighthouse returned no result"}`,
      );
    const slug = route === "/" ? "home" : route.replaceAll("/", "-").slice(1);
    await writeFile(`${outputDirectory}/${slug}.json`, result.report[0]);
    await writeFile(`${outputDirectory}/${slug}.html`, result.report[1]);
    const performance = Math.round(result.lhr.categories.performance.score * 100);
    const accessibility = Math.round(result.lhr.categories.accessibility.score * 100);
    results.push({
      route,
      performance,
      accessibility,
      largestContentfulPaintMs: result.lhr.audits["largest-contentful-paint"].numericValue,
      totalBlockingTimeMs: result.lhr.audits["total-blocking-time"].numericValue,
      cumulativeLayoutShift: result.lhr.audits["cumulative-layout-shift"].numericValue,
    });
    console.log(`${route}: performance ${performance}, accessibility ${accessibility}`);
  }
  await writeFile(
    `${outputDirectory}/summary.json`,
    JSON.stringify(
      { measuredAt: new Date().toISOString(), formFactor: "mobile", runsPerRoute: 1, results },
      null,
      2,
    ),
  );
  if (results.some((result) => result.performance < 90 || result.accessibility < 90))
    throw new Error("Lighthouse target not met; inspect the generated reports");
} finally {
  if (chrome) await chrome.kill();
  if (server.exitCode === null) {
    const closed = once(server, "close");
    server.kill("SIGTERM");
    await Promise.race([closed, setTimeout(5000, undefined, { ref: false })]);
    if (server.exitCode === null) server.kill("SIGKILL");
  }
}
