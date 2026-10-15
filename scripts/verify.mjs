import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [];
const analyticsRequests = [];
page.on("request", request => {
  if (new URL(request.url()).pathname === "/api/events" && request.method() === "POST") {
    analyticsRequests.push(JSON.parse(request.postData() || "{}"));
  }
});
page.on("pageerror", (e) => errors.push(e.message));
try {
  const response = await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.equal(await page.locator("h1").count(), 1);
  assert.match(await page.locator("h1").innerText(), /AI tools/);
  assert.equal(await page.getByRole("complementary", { name: "Analytics privacy choices" }).count(), 0);
  await page.locator("header .brand").first().click();
  await page.getByRole("button", { name: "Privacy preferences" }).click();
  await page.waitForTimeout(800);
  assert.ok(analyticsRequests.some(body => body.events.some(event => event.name === "page_view")));
  assert.ok(analyticsRequests.some(body => body.events.some(event => event.name === "button_clicked")));
  assert.ok(analyticsRequests.some(body => body.events.some(event => event.name === "link_clicked")));
  assert.ok(analyticsRequests.every(body => body.events.every(event =>
    Object.keys(event).every(key => ["id", "name", "path", "slug", "category"].includes(key))
  )));
  assert.ok(analyticsRequests.every(body => body.attribution === undefined));
  await page.getByRole("button", { name: "Essential only" }).click();
  await page.waitForFunction(() => localStorage.getItem("navonixx-consent") === "declined");
  const recordedBeforeOptOut = analyticsRequests.length;
  await page.waitForTimeout(800);
  assert.equal(analyticsRequests.length, recordedBeforeOptOut);
  await fs.mkdir("docs/screenshots", { recursive: true });
  await page.screenshot({
    path: "docs/screenshots/navonixx-desktop.png",
    fullPage: true,
  });
  await page.goto(base + "/free-tools");
  assert.equal(await page.locator(".tool-card").count(), 35);
  await page.getByRole("button", { name: "Business", exact: true }).click();
  assert.equal(await page.locator(".tool-card").count(), 10);
  await page.getByRole("button", { name: "All tools", exact: true }).click();
  await page.getByRole("textbox", { name: "Search free tools" }).fill("JSON");
  assert.equal(await page.locator(".tool-card").count(), 1);
  await page
    .getByRole("textbox", { name: "Search free tools" })
    .fill("no-such-tool");
  assert.equal(await page.locator(".tool-card").count(), 0);
  await page.getByRole("button", { name: "Clear filters" }).click();
  const toolPaths = await page
    .locator(".tool-card")
    .evaluateAll((cards) => cards.map((c) => c.getAttribute("href")));
  for (const path of toolPaths) {
    assert.equal((await page.goto(base + path)).status(), 200);
    await page.getByRole("button", { name: "Run tool", exact: true }).click();
    await page.waitForFunction(
      () =>
        document.querySelector(
          ".result-content pre, .result-content article",
        ) || document.querySelector(".notice.error"),
    );
    assert.equal(
      await page.locator(".notice.error").count(),
      0,
      `Default example: ${path}`,
    );
    assert.ok((await page.locator(".result-content").innerText()).length > 0);
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    assert.ok(await page.locator(".result-placeholder").isVisible());
  }
  await page.goto(base + "/free-tools/json-formatter");
  await page.getByRole("textbox", { name: "Your text" }).fill("{invalid");
  await page.getByRole("button", { name: "Run tool", exact: true }).click();
  assert.ok(await page.locator(".notice.error[role=alert]").isVisible());
  await page.goto(base + "/free-tools/markdown-previewer");
  await page
    .getByRole("textbox", { name: "Your text" })
    .fill("<script>window.hacked=true</script>\n\n# Safe title");
  await page.getByRole("button", { name: "Run tool", exact: true }).click();
  assert.equal(await page.evaluate(() => window.hacked), undefined);
  assert.equal(await page.locator(".result-content script").count(), 0);
  await page.goto(base + "/free-tools/open-graph-preview");
  await page.getByRole("button", { name: "Run tool", exact: true }).click();
  await page.waitForSelector(".og-preview");
  await page
    .getByRole("textbox", { name: "Page URL", exact: true })
    .fill("invalid");
  assert.ok(
    await page.locator(".og-preview").isVisible(),
    "Editing a URL must not crash an existing preview.",
  );
  await page.getByRole("button", { name: "Run tool", exact: true }).click();
  assert.ok(await page.locator(".notice.error").isVisible());
  for (const route of [
    "/ai-tools",
    "/ai-tools/chatgpt",
    "/ai-tools/compare",
    "/toolkit",
    "/prompts",
    "/templates",
    "/workflows",
    "/resources",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/affiliate-disclosure",
    "/unsubscribe",
    "/admin/login",
    "/sitemap.xml",
    "/robots.txt",
  ])
    assert.equal((await page.goto(base + route)).status(), 200, route);
  await page.goto(base + "/ai-tools/compare");
  await page.getByRole("combobox", { name: "Tool 1", exact: true }).click();
  await page.getByRole("option", { name: "ChatGPT", exact: true }).click();
  await page.getByRole("combobox", { name: "Tool 2", exact: true }).click();
  await page.getByRole("option", { name: "Notion AI", exact: true }).click();
  assert.equal(
    await page.locator(".compare-table th").first().innerText(),
    "Compare",
  );
  assert.ok(
    (await page.locator(".compare-table").innerText()).includes("ChatGPT"),
  );
  const download = await context.request.get(
    base + "/api/resources/ai-business-growth-toolkit/download",
  );
  assert.equal(download.status(), 200);
  assert.match(download.headers()["content-type"], /application\/pdf/);
  assert.equal((await download.body()).subarray(0, 4).toString(), "%PDF");
  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of [
      "/",
      "/free-tools",
      "/free-tools/invoice-generator",
      "/toolkit",
      "/ai-tools/compare",
    ]) {
      await page.goto(base + route);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `Overflow: ${route} at ${width}`,
      );
    }
    if (width === 390) {
      await page.goto(base);
      await page
        .getByRole("button", { name: "Open menu", exact: true })
        .click();
      await page
        .locator(".main-nav")
        .getByRole("link", { name: "Free Tools", exact: true })
        .click();
      await page.waitForURL(base + "/free-tools");
      assert.match(page.url(), /free-tools/);
      await page.goto(base);
      await page.getByRole("button", { name: "Switch to dark theme" }).click();
      assert.equal(
        await page.locator("html").getAttribute("data-theme"),
        "dark",
      );
      await page.screenshot({
        path: "docs/screenshots/navonixx-mobile-dark.png",
        fullPage: true,
      });
      await page.getByRole("button", { name: "Switch to light theme" }).click();
      await page.screenshot({
        path: "docs/screenshots/navonixx-mobile.png",
        fullPage: true,
      });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await page.goto(base + "/admin");
    await page.waitForURL(base + "/admin/login");
    assert.ok(
      await page.getByRole("heading", { name: "Welcome back" }).isVisible(),
    );
    assert.equal(await page.getByRole("dialog").count(), 0);
    await page.getByRole("button", { name: "Sign in securely" }).click();
    await page
      .getByRole("alert")
      .filter({ hasText: "Enter your admin email and password." })
      .waitFor();
    await page
      .getByRole("button", { name: "Show password", exact: true })
      .click();
    assert.equal(
      await page.locator("#admin-login-password").getAttribute("type"),
      "text",
    );
    await page
      .getByRole("button", { name: "Hide password", exact: true })
      .click();
    assert.equal(
      await page.locator("#admin-login-password").getAttribute("type"),
      "password",
    );
    await page.setViewportSize({ width: 320, height: 650 });
    assert.ok(
      await page.locator(".admin-signin-card").evaluate((e) => {
        const r = e.getBoundingClientRect();
        return r.left >= 0 && r.right <= innerWidth;
      }),
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: "docs/screenshots/navonixx-login.png" });
    await page
      .getByRole("textbox", { name: "Admin email" })
      .fill(process.env.ADMIN_EMAIL);
    await page
      .getByLabel("Password", { exact: true })
      .fill(process.env.ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign in securely" }).click();
    await page.waitForURL(base + "/admin");
    await page.waitForSelector(".metric-card");
    assert.ok((await page.locator(".metric-card").count()) >= 9);
    await page.screenshot({
      path: "docs/screenshots/navonixx-admin.png",
      fullPage: true,
    });
    await page.goto(base + "/admin/content");
    await page.getByRole("button", { name: "Add new" }).click();
    await page
      .getByLabel("Title", { exact: true })
      .fill("Integration resource");
    await page
      .getByLabel("URL slug", { exact: true })
      .fill("integration-resource");
    await page.getByRole("combobox", { name: "Resource type" }).click();
    await page.getByRole("option", { name: "blog", exact: true }).click();
    await page
      .getByLabel("Short description")
      .fill("A genuine integration test of content publishing.");
    await page.getByLabel("Category", { exact: true }).fill("Productivity");
    await page
      .getByLabel("Markdown content")
      .fill("# Integration guide\n\nThis verifies real persisted content.");
    await page.getByLabel("Published", { exact: true }).check();
    await page.getByRole("button", { name: "Save changes" }).click();
    await page.waitForFunction(() =>
      document
        .querySelector("[role=status]")
        ?.textContent.includes("Saved successfully"),
    );
    assert.equal(
      (await page.goto(base + "/blog/integration-resource")).status(),
      200,
    );
    await page.goto(base + "/admin/leads");
    await page.waitForSelector(".data-table");
    const exported = await context.request.get(base + "/api/admin/export");
    assert.equal(exported.status(), 200);
    assert.ok((await exported.text()).includes("user@example.test"));
    await page.goto(base + "/admin/content");
    await page
      .getByRole("textbox", { name: "Search records" })
      .fill("Integration resource");
    await page.waitForFunction(
      () => document.querySelectorAll("tbody tr").length === 1,
    );
    await page.getByRole("button", { name: "Edit record" }).click();
    await page
      .getByLabel("Title", { exact: true })
      .fill("Updated integration resource");
    await page.getByRole("button", { name: "Save changes" }).click();
    await page.waitForFunction(() =>
      document
        .querySelector("[role=status]")
        ?.textContent.includes("Changes saved"),
    );
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Delete record" }).click();
    await page.waitForFunction(() =>
      document
        .querySelector("[role=status]")
        ?.textContent.includes("Record deleted"),
    );
    const missing = await context.request.get(
      base + "/blog/integration-resource",
    );
    assert.ok(
      (await missing.text()).includes("no longer available"),
      "Deleted content must render the not-found view, including when Next.js streams a 200 response.",
    );
    const created = await context.request.post(
      base + "/api/admin/administrators",
      {
        headers: { Origin: base },
        data: {
          email: "editor@example.test",
          password: process.env.ADMIN_PASSWORD,
          role: "EDITOR",
          enabled: true,
        },
      },
    );
    assert.equal(created.status(), 201);
    const editor = await created.json();
    const editorContext = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    const editorPage = await editorContext.newPage();
    await editorPage.goto(base + "/admin/login");
    await editorPage.getByLabel("Admin email").fill("editor@example.test");
    await editorPage
      .getByLabel("Password", { exact: true })
      .fill(process.env.ADMIN_PASSWORD);
    await editorPage.getByRole("button", { name: "Sign in securely" }).click();
    await editorPage.waitForURL(base + "/admin/content");
    assert.equal(
      (await editorContext.request.get(base + "/api/admin/content")).status(),
      200,
    );
    assert.equal(
      (await editorContext.request.get(base + "/api/admin/leads")).status(),
      401,
    );
    assert.equal(
      (
        await editorContext.request.post(base + "/api/admin/affiliate-tools", {
          headers: { Origin: base },
          data: {},
        })
      ).status(),
      401,
    );
    assert.equal(
      (
        await context.request.delete(
          base + `/api/admin/administrators/${editor.id}`,
          { headers: { Origin: base } },
        )
      ).status(),
      200,
    );
    assert.equal(
      (await editorContext.request.get(base + "/api/admin/content")).status(),
      401,
      "Deleting an administrator must revoke persisted sessions.",
    );
    await editorContext.close();
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL(base + "/admin/login");
    assert.equal(
      (await context.request.get(base + "/api/admin/leads")).status(),
      401,
    );
  }
  assert.deepEqual(errors, []);
  console.log(
    "PASS: 35 browser tools, input validation, safe Markdown, public routes, comparisons, real PDF, responsive layouts, themes, navigation and configured admin CRUD.",
  );
} finally {
  await browser.close();
}
