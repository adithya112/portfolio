import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const articleSlugs = ["java-completablefuture-executors", "reliable-background-jobs"];
for (const width of [360, 768, 1280]) {
  for (const route of [
    "/about",
    "/resume",
    "/writing",
    ...articleSlugs.map((slug) => `/writing/${slug}`),
  ]) {
    test(`${route} works at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      expect(await page.locator("main").textContent()).not.toMatch(
        /TODO|placeholder|publication clearance|withheld|awaiting owner/,
      );
      if (route.startsWith("/writing/")) {
        const toc = page.getByRole("navigation", { name: "On this page" });
        for (const href of await toc
          .locator("a")
          .evaluateAll((links) => links.map((link) => link.getAttribute("href")!))) {
          await expect(page.locator(href)).toHaveCount(1);
        }
        await toc.getByRole("link").last().click();
        await expect(page.locator("article h2").last()).toBeInViewport();
        await expect(page.locator("article pre.shiki").first()).toBeAttached();
        const next = page.getByRole("navigation", { name: "Next article" }).getByRole("link");
        expect((await page.request.get((await next.getAttribute("href"))!)).status()).toBe(200);
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({
        path: `test-results/phase4-${route.replaceAll("/", "-")}-${width}.png`,
        fullPage: true,
      });
      expect(errors).toEqual([]);
    });
  }
}
test("resume opens and downloads the supplied PDF", async ({ page }) => {
  await page.goto("/resume");
  const open = page.getByRole("link", { name: "Open PDF (opens in a new tab)", exact: true });
  await expect(open).toHaveAttribute("href", "/resume.pdf");
  const response = await page.request.get("/resume.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  const localPdf = await readFile("public/resume.pdf");
  expect((await response.body()).equals(localPdf)).toBe(true);
  expect(localPdf.subarray(0, 5).toString()).toBe("%PDF-");
  const pending = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download resume PDF" }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("resume.pdf");
  expect(await download.failure()).toBeNull();
});
test("writing previews and navigation reach completed routes", async ({ page }) => {
  await page.goto("/writing");
  await expect(page.locator(".article-card")).toHaveCount(2);
  for (const slug of articleSlugs)
    expect((await page.request.get(`/writing/${slug}`)).status()).toBe(200);
  await page.goto("/");
  await expect(page.locator('.writing-grid a[href^="/writing/"]')).toHaveCount(2);
  const navigation = page.getByRole("navigation", { name: "Main navigation", exact: true });
  for (const label of ["Work", "Writing", "About", "Resume"])
    await expect(navigation.getByRole("link", { name: label, exact: true })).toHaveCount(1);
  await page.getByRole("link", { name: "View resume", exact: true }).click();
  await expect(page).toHaveURL("/resume");
});
test("unknown article has a useful 404", async ({ page }) => {
  const response = await page.goto("/writing/unknown-article");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Return home" })).toBeVisible();
});
