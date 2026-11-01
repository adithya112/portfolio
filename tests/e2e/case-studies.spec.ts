import { expect, test } from "@playwright/test";

const slugs = [
  "analytics-performance",
  "reliable-background-processing",
  "concurrent-video-exports",
];

for (const slug of slugs) {
  for (const width of [360, 768, 1280]) {
    test(`${slug} renders accessible MDX at ${width}px`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(`/work/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      expect(await page.title()).not.toBe("Engineering portfolio");
      await expect(page.getByRole("article", { name: "Case study" })).toBeVisible();
      await expect(page.getByRole("img")).toHaveCount(2);
      for (const diagram of await page.getByRole("img").all()) {
        await expect(diagram).toHaveAccessibleName(/Before|After|Request handoff|Worker execution/);
        await expect(diagram).toHaveAccessibleDescription(
          /workload|executor|request|producer|Dedicated/i,
        );
      }
      expect(await page.locator("main").textContent()).not.toMatch(
        /publication clearance|withheld|supplied (?:account|evidence|history)|not (?:been )?confirmed|not documented|no .*claim|unconfirmed|not employer source|private endpoints/i,
      );
      const toc = page.getByRole("navigation", { name: "On this page" });
      await expect(toc.getByRole("link")).toHaveCount(11);
      for (const href of await toc
        .locator("a")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")!))) {
        await expect(page.locator(href)).toHaveCount(1);
      }
      await toc.getByRole("link", { name: "Results", exact: true }).click();
      await expect(page.getByRole("heading", { name: "Results", exact: true })).toBeInViewport();
      const details = page.locator("article details").first();
      await expect(details).not.toHaveAttribute("open", "");
      await details.locator("summary").focus();
      await page.keyboard.press("Enter");
      await expect(details).toHaveAttribute("open", "");
      await expect(page.locator("article pre.shiki").first()).toBeVisible();
      await expect(page.locator("article pre.shiki span[style]").first()).toBeAttached();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      if (width === 360) {
        const diagram = page.locator(".diagram-scroll").first();
        expect(await diagram.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
          true,
        );
        await diagram.focus();
        await page.keyboard.press("ArrowRight");
        await expect
          .poll(() => diagram.evaluate((element) => element.scrollLeft))
          .toBeGreaterThan(0);
      }
      const next = page.getByRole("navigation", { name: "Next case study" }).getByRole("link");
      const nextHref = await next.getAttribute("href");
      expect(nextHref).not.toBe(`/work/${slug}`);
      expect((await page.request.get(nextHref!)).status()).toBe(200);
      await page.evaluate(() => {
        (document.activeElement as HTMLElement)?.blur();
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      if (width !== 768) {
        await page
          .locator(".case-header")
          .screenshot({ path: `test-results/${slug}-header-${width}.png` });
        await page
          .locator(".diagram-frame")
          .first()
          .screenshot({ path: `test-results/${slug}-diagram-${width}.png` });
      }
      await page.screenshot({ path: `test-results/${slug}-${width}.png`, fullPage: true });
      expect(errors).toEqual([]);
    });
  }
}

test("work index and home link only to completed case studies", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator(".work-index article")).toHaveCount(3);
  for (const slug of slugs) {
    const link = page.locator(`.work-index a[href="/work/${slug}"]`);
    await expect(link).toHaveCount(1);
    await link.click();
    await expect(page.getByRole("article", { name: "Case study" })).toBeVisible();
    await page.getByRole("link", { name: "All engineering work" }).click();
    await expect(page).toHaveURL("/work");
  }
  await page.goto("/");
  await expect(page.locator('#work a[href^="/work/"]')).toHaveCount(3);
});

test("unknown case-study slug returns the useful 404", async ({ page }) => {
  const response = await page.goto("/work/unknown-study");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Return home" })).toBeVisible();
});
