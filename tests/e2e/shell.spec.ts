import { test, expect } from "@playwright/test";
for (const width of [360, 768, 1280, 1920]) {
  test(`shell fits and links resolve at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
    if (width === 360) {
      const toggle = page.locator('button[aria-controls="mobile-navigation"]');
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Tab");
      await expect(
        page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link").first(),
      ).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(toggle).toBeFocused();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
    }
    for (const href of await page
      .locator("a[href]")
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href")!)
          .filter((href) => href.startsWith("/") && !href.startsWith("//")),
      )) {
      expect((await page.request.get(href)).status()).toBe(200);
    }
    for (const href of await page
      .locator('a[href*="#"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")!))) {
      const hash = new URL(href, page.url()).hash;
      await expect(page.locator(hash)).toHaveCount(1);
    }
    await page.getByRole("link", { name: "Explore my work" }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.getByRole("heading", { name: /Production problems/ })).toBeInViewport();
    await page.evaluate(() => {
      (document.activeElement as HTMLElement)?.blur();
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.screenshot({ path: `test-results/shell-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}
test("404 offers a real return path", async ({ page }) => {
  const response = await page.goto("/missing-route");
  expect(response?.status()).toBe(404);
  await page.getByRole("link", { name: "Return home" }).click();
  await expect(page).toHaveURL("/");
});
test("honors reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    "auto",
  );
});

test("homepage is substantive without exposing unfinished destinations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Engineering reliable systems at scale/,
  );
  await expect(page.locator("#work article")).toHaveCount(3);
  await expect(page.locator('a[href^="/writing/"]')).toHaveCount(2);
  await expect(page.getByRole("link", { name: "View resume" })).toHaveAttribute("href", "/resume");
  await expect(page.getByText(/foundation|milestone|awaiting owner/i)).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
