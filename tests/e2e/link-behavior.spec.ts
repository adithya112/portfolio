import { expect, test } from "@playwright/test";

test("external references and PDF viewing preserve the portfolio tab", async ({ page }) => {
  for (const route of ["/", "/about", "/resume", "/writing/reliable-background-jobs"]) {
    await page.goto(route);
    for (const link of await page.locator('a[href^="https://"]').all()) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      await expect(link).toHaveAccessibleName(/opens in a new tab/);
    }
    for (const link of await page.locator('a[href^="mailto:"], a[href="/work"]').all())
      await expect(link).not.toHaveAttribute("target", "_blank");
  }
  await page.goto("/resume");
  await expect(page.getByRole("link", { name: /Open PDF/ })).toHaveAttribute("target", "_blank");
  await expect(page.getByRole("link", { name: "Download resume PDF" })).toHaveAttribute(
    "download",
    "",
  );
});
