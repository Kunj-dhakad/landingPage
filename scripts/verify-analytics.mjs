import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined });
try {
  const context = await browser.newContext();
  const batches = [];
  await context.route("**/api/events", async route => {
    batches.push(route.request().postDataJSON());
    await route.fulfill({ json: { ok: true } });
  });
  await context.route("**/api/consent", route => route.fulfill({ json: { ok: true } }));
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".consent-panel").count(), 0);
  await page.locator("header .brand").first().click();
  await page.getByRole("button", { name: "Privacy preferences" }).click();
  await page.waitForTimeout(900);
  const events = batches.flatMap(batch => batch.events);
  for (const name of ["page_view", "button_clicked", "link_clicked"]) assert.ok(events.some(event => event.name === name), name);
  assert.ok(batches.every(batch => batch.attribution === undefined));
  assert.ok(events.every(event => Object.keys(event).every(key => ["id", "name", "path", "slug", "category"].includes(key))));
  await page.getByRole("button", { name: "Essential only" }).click();
  await page.waitForFunction(() => localStorage.getItem("navonixx-consent") === "declined");
  const before = batches.length;
  await page.locator("header .brand").first().click();
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  assert.equal(batches.length, before);
  assert.equal(await page.locator(".consent-panel").count(), 0);
  await context.close();
  for (const property of ["doNotTrack", "globalPrivacyControl"]) {
    const privateContext = await browser.newContext();
    let requests = 0;
    await privateContext.addInitScript(property => Object.defineProperty(navigator, property, { value: property === "doNotTrack" ? "1" : true }), property);
    await privateContext.route("**/api/events", route => { requests++; return route.fulfill({ json: { ok: true } }); });
    const privatePage = await privateContext.newPage();
    await privatePage.goto(base, { waitUntil: "networkidle" });
    await privatePage.locator("header .brand").first().click();
    await privatePage.waitForTimeout(900);
    assert.equal(requests, 0, property);
    await privateContext.close();
  }
  console.log("PASS: hidden banner, anonymous page/button/link events, restricted payloads, persistent opt-out, DNT and GPC.");
} finally { await browser.close(); }
