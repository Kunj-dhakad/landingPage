import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1365, height: 800 },
  });
  const errors = [],
    requests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => requests.push(new URL(request.url())));
  await page.addInitScript(() =>
    localStorage.setItem("navonixx-theme", "light"),
  );
  await page.goto(base + "/admin/login", { waitUntil: "networkidle" });
  await page
    .getByRole("textbox", { name: "Admin email" })
    .fill(process.env.ADMIN_EMAIL);
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in securely" }).click();
  await page.waitForURL(base + "/admin");
  const date = page.getByRole("combobox", { name: "Date range" });
  await date.click();
  await page.getByRole("option", { name: "Custom range", exact: true }).click();
  await page.getByLabel("From", { exact: true }).waitFor();
  assert.equal(await page.getByLabel("To", { exact: true }).count(), 1);
  await date.click();
  await page.getByRole("option", { name: "Last 7 days", exact: true }).click();
  assert.equal(await page.getByLabel("From", { exact: true }).count(), 0);
  await date.focus();
  await date.press("ArrowDown");
  await page
    .getByRole("option", { name: "Today (India time)", exact: true })
    .waitFor();
  await page.waitForFunction(
    () => document.activeElement?.getAttribute("role") === "option",
  );
  await page.keyboard.press("Home");
  await page.waitForFunction(() =>
    document.activeElement?.textContent?.includes("Today (India time)"),
  );
  await page.keyboard.press("Enter");
  await page.waitForFunction(() =>
    document
      .querySelector('[aria-label="Date range"]')
      .textContent.includes("Today"),
  );
  await date.click();
  await page.keyboard.press("Escape");
  assert.ok(
    await date.evaluate((element) => element === document.activeElement),
  );
  console.log("Date selection, keyboard, and Escape/focus passed.");
  await page.goto(base + "/admin/leads", { waitUntil: "networkidle" });
  const sort = page.getByRole("combobox", { name: "Sort by date" });
  await sort.click();
  await page.getByRole("option", { name: "Oldest first", exact: true }).click();
  await page.waitForTimeout(150);
  assert.ok(
    requests.some(
      (url) =>
        url.pathname === "/api/admin/leads" &&
        url.searchParams.get("sort") === "asc",
    ),
  );
  const status = page.getByRole("combobox", {
    name: "Lead subscription filter",
  });
  await status.click();
  await page.getByRole("option", { name: "Subscribed", exact: true }).click();
  await page.waitForTimeout(150);
  assert.ok(
    requests.some(
      (url) =>
        url.pathname === "/api/admin/leads" &&
        url.searchParams.get("status") === "SUBSCRIBED",
    ),
  );
  await status.click();
  await page.getByRole("option", { name: "All statuses", exact: true }).click();
  await status.click();
  assert.equal(
    await page
      .getByRole("option", { name: "All statuses", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  await page.waitForTimeout(200);
  assert.equal(
    await page
      .locator(".nx-select-menu")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
    "rgb(255, 255, 255)",
  );
  await page.screenshot({ path: ".runtime/custom-select-light.png" });
  await page.keyboard.press("Escape");
  await page.evaluate(() => (document.documentElement.dataset.theme = "dark"));
  await status.click();
  await page.waitForTimeout(200);
  assert.equal(
    await page
      .locator(".nx-select-menu")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
    "rgb(255, 255, 255)",
  );
  await page.screenshot({ path: ".runtime/custom-select-dark.png" });
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 375, height: 740 });
  await status.click();
  const bounds = await page.locator(".nx-select-menu").boundingBox();
  assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 375);
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 1365, height: 800 });
  await page.goto(base + "/admin/content", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Add new" }).click();
  await page
    .getByRole("combobox", { name: "Resource type", exact: true })
    .click();
  await page.getByRole("option", { name: "templates", exact: true }).click();
  assert.match(
    await page
      .getByRole("combobox", { name: "Resource type", exact: true })
      .innerText(),
    /templates/,
  );
  await page.goto(base + "/ai-tools/compare", { waitUntil: "networkidle" });
  await page.getByRole("combobox", { name: "Tool 1", exact: true }).click();
  await page.getByRole("option", { name: "ChatGPT", exact: true }).click();
  await page.getByRole("combobox", { name: "Tool 2", exact: true }).click();
  await page.getByRole("option", { name: "Notion AI", exact: true }).click();
  assert.match(await page.locator(".compare-table").innerText(), /ChatGPT/);
  assert.equal(await page.locator("select:visible").count(), 0);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: date ranges, sort/status request values, empty option, keyboard, focus, light/dark menus, mobile bounds, modal editor and AI comparison.",
  );
} finally {
  await browser.close();
}
