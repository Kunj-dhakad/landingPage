import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const base = process.env.UI_BASE_URL || "http://192.168.0.93:3000";
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base, { waitUntil: "networkidle" });
    if (
      await page
        .getByRole("button", { name: "Essential only", exact: true })
        .isVisible()
    )
      await page
        .getByRole("button", { name: "Essential only", exact: true })
        .click();
    await page.evaluate(() => document.fonts.ready);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Homepage overflow at ${width}px`,
    );
    assert.ok(
      await page.evaluate(() =>
        getComputedStyle(document.body).fontFamily.includes("Geist"),
      ),
    );
    const topGap = await page.evaluate(
      () =>
        document.querySelector(".hero-copy").getBoundingClientRect().top -
        document.querySelector(".site-header").getBoundingClientRect().bottom,
    );
    assert.ok(topGap <= 40, `Hero top gap is ${topGap}px at ${width}px`);
    if (width === 1440 || width === 390) {
      await page.screenshot({
        path: `docs/screenshots/navonixx-home-${width}.png`,
      });
      await page.locator(".site-footer").scrollIntoViewIfNeeded();
      await page
        .locator(".site-footer")
        .screenshot({ path: `docs/screenshots/navonixx-footer-${width}.png` });
    }
    const footerLinks = await page
      .locator(".footer-grid > div > a:not(.brand)")
      .evaluateAll((nodes) =>
        nodes.map((e) => parseFloat(getComputedStyle(e).fontSize)),
      );
    assert.ok(footerLinks.every((size) => size >= 14));
  }
  for (const route of [
    "/free-tools",
    "/free-tools/json-formatter",
    "/ai-tools",
    "/resources",
    "/toolkit",
    "/privacy",
  ]) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Overflow on ${route}`,
    );
  }
  await page.goto(base);
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await page.screenshot({ path: "docs/screenshots/navonixx-home-dark.png" });
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page
    .getByRole("button", { name: "Privacy preferences", exact: true })
    .click();
  await page.locator(".consent-panel").waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: 320/390/768/1440 layouts, reduced gap, Geist font, readable footer, key public routes, themes and privacy controls.",
  );
} finally {
  await browser.close();
}
