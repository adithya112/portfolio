import { mkdir, writeFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getSiteSettings } from "../../src/lib/site";

const routes = [
  "/",
  "/work",
  "/writing",
  "/about",
  "/resume",
  "/work/analytics-performance",
  "/work/reliable-background-processing",
  "/work/concurrent-video-exports",
  "/writing/java-completablefuture-executors",
  "/writing/reliable-background-jobs",
];
for (const width of [360, 1280]) {
  for (const route of routes) {
    test(`WCAG AA scan ${route} at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await page.locator("article details").evaluateAll((details) =>
        details.forEach((detail) => {
          (detail as HTMLDetailsElement).open = true;
        }),
      );
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      await mkdir("test-results/quality", { recursive: true });
      const reportName = route === "/" ? "home" : route.replaceAll("/", "-").slice(1);
      await writeFile(
        `test-results/quality/axe-${reportName}-${width}.json`,
        JSON.stringify(result, null, 2),
      );
      await testInfo.attach("accessibility", {
        body: JSON.stringify(result, null, 2),
        contentType: "application/json",
      });
      expect(
        result.violations,
        JSON.stringify(
          result.violations.map((item) => ({
            id: item.id,
            nodes: item.nodes.map((node) => ({
              target: node.target,
              summary: node.failureSummary,
            })),
          })),
          null,
          2,
        ),
      ).toEqual([]);
    });
  }
}
for (const route of routes) {
  test(`metadata and structured data for ${route}`, async ({ page }) => {
    const settings = getSiteSettings();
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      await page.title(),
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      settings.indexable ? "index, follow" : "noindex, nofollow",
    );
    if (settings.indexable) expect(response?.headers()["x-robots-tag"]).toBeUndefined();
    else expect(response?.headers()["x-robots-tag"]).toContain("noindex");
    if (settings.origin) {
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      const openGraphUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
      // Next normalizes the root canonical without a trailing slash.
      expect(new URL(canonical!).href).toBe(new URL(route, settings.origin).href);
      expect(new URL(openGraphUrl!).href).toBe(new URL(route, settings.origin).href);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        `${settings.origin}/og`,
      );
    } else {
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
      await expect(page.locator('meta[property="og:url"], meta[property="og:image"]')).toHaveCount(
        0,
      );
    }
    const data = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(data.map((item) => JSON.parse(item)["@type"])).toContain("Person");
    if (route.startsWith("/writing/"))
      expect(data.map((item) => JSON.parse(item)["@type"])).toContain("BlogPosting");
  });
}
test("robots, sitemap, social card and icon respond with correct types", async ({ request }) => {
  const settings = getSiteSettings();
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(settings.indexable ? "Allow: /" : "Disallow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml.match(/<loc>/g)?.length ?? 0).toBe(settings.origin ? routes.length : 0);
  if (settings.origin)
    for (const route of routes)
      expect(xml).toContain(`<loc>${new URL(route, settings.origin).href}</loc>`);
  expect(xml).not.toMatch(/unknown-study|test-draft/);
  const image = await request.get("/og");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  const bytes = await image.body();
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
  expect(bytes.byteLength).toBeLessThan(200 * 1024);
  const icon = await request.get("/icon.svg");
  expect(icon.status()).toBe(200);
  expect(icon.headers()["content-type"]).toContain("image/svg+xml");
});
test("mobile menu and focus indicators stay accessible", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  expect(await skip.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const menu = page.locator('button[aria-controls="mobile-navigation"]');
  await expect(menu).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link").first(),
  ).toBeFocused();
  await mkdir("test-results/quality", { recursive: true });
  await page.screenshot({ path: "test-results/quality/mobile-keyboard-focus.png" });
  await testInfo.attach("mobile-keyboard-focus", {
    body: await page.screenshot(),
    contentType: "image/png",
  });
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
});
