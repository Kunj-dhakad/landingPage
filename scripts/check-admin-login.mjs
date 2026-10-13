import env from "@next/env";
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
env.loadEnvConfig(process.cwd());
const base = process.env.NEXT_PUBLIC_SITE_URL;
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1365, height: 768 },
  });
  await page.goto(`${base}/admin`);
  await page.waitForURL(`${base}/admin/login`);
  assert.equal(await page.locator(".site-header, .site-footer").count(), 0);
  await page.getByRole("heading", { name: "Welcome back" }).waitFor();
  await page.screenshot({ path: "docs/screenshots/navonixx-login.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({
    path: "docs/screenshots/navonixx-login-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("textbox", { name: "Admin email" })
    .fill(process.env.ADMIN_EMAIL);
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in securely" }).click();
  await page.waitForURL(`${base}/admin`, { timeout: 60000 });
  await page.waitForSelector(".metric-card", { timeout: 60000 });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "docs/screenshots/navonixx-admin.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("navigation", { name: "Admin navigation" }).waitFor();
  await page.getByRole("button", { name: "Close navigation" }).click();
  await page.screenshot({
    path: "docs/screenshots/navonixx-admin-mobile.png",
    fullPage: true,
  });
  console.log(
    "PASS: standalone login, responsive layout, supplied credentials and live database dashboard.",
  );
  await page.getByRole("button", { name: "Log out" }).click();
  await page.waitForURL(`${base}/admin/login`);
  console.log("PASS: logout returns to login.");
} finally {
  await browser.close();
}
