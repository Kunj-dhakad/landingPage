import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.TEST_BASE_URL || "http://localhost:3108";
const assets = JSON.parse(
  fs.readFileSync("src/config/media-assets.json", "utf8"),
);
const previews = JSON.parse(
  fs.readFileSync("src/config/resource-previews.json", "utf8"),
);
const urls = Object.keys(previews).map(
  (slug) => assets[`/images/resources/${slug}.webp`]?.url,
);
assert.equal(urls.length, 36);
assert.equal(new Set(urls).size, 36);
assert.ok(
  urls.every((url) => url?.startsWith("https://ik.imagekit.io/0y2jm8mid/")),
);
for (let offset = 0; offset < urls.length; offset += 6) {
  await Promise.all(
    urls.slice(offset, offset + 6).map(async (url) => {
      const response = await fetch(url, { method: "HEAD" });
      assert.equal(response.status, 200, url);
      assert.match(response.headers.get("content-type"), /^image\//);
    }),
  );
}
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
});
try {
  const context = await browser.newContext({
    viewport: { width: 1365, height: 900 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  await context.addInitScript(() =>
    localStorage.setItem("navonixx-theme", "light"),
  );
  await context.route("**/api/events", (route) =>
    route.fulfill({ json: { ok: true } }),
  );
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [kind, total] of [
    ["prompts", 30],
    ["templates", 6],
  ]) {
    await page.goto(base + "/" + kind, { waitUntil: "networkidle" });
    const cards = page.locator(".resource-kit-card");
    assert.equal(await cards.count(), total);
    const images = await cards
      .locator("img")
      .evaluateAll((images) =>
        images.map((image) => image.getAttribute("src")),
      );
    assert.equal(new Set(images).size, total);
    await cards.first().scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      [...document.querySelectorAll(".resource-kit-card img")]
        .slice(0, 3)
        .every((image) => image.complete && image.naturalWidth > 0),
    );
    await cards
      .first()
      .getByRole("button", { name: /^Copy / })
      .click();
    await page.waitForFunction(() =>
      document
        .querySelector(".resource-kit-copy")
        ?.textContent?.includes("Copied!"),
    );
    assert.match(await cards.first().innerText(), /Copied!/);
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    assert.ok(clipboard.length > 80);
    if (kind === "templates") assert.match(clipboard, /^# /);
    else assert.ok(!clipboard.startsWith("# "));
    await page
      .getByRole("textbox", {
        name: kind === "prompts" ? "Search prompts" : "Search templates",
      })
      .fill("proposal");
    assert.ok((await cards.count()) > 0 && (await cards.count()) < total);
    await page
      .getByRole("textbox", {
        name: kind === "prompts" ? "Search prompts" : "Search templates",
      })
      .fill("zz-no-match-resource-zz");
    assert.equal(await cards.count(), 0);
    await page.getByRole("button", { name: "Show all " + kind }).click();
    assert.equal(await cards.count(), total);
    await page.getByRole("combobox", { name: "Resource category" }).click();
    await page
      .getByRole("option", { name: "Freelancing", exact: true })
      .click();
    assert.ok((await cards.count()) > 0);
    const categories = await cards
      .locator(".resource-kit-category")
      .allTextContents();
    assert.ok(categories.every((value) => value === "Freelancing"));
    await page.getByRole("combobox", { name: "Resource category" }).click();
    await page
      .getByRole("option", { name: "All categories", exact: true })
      .click();
    await page.screenshot({ path: `.runtime/resources-${kind}-desktop.png` });
    await page.evaluate(
      () => (document.documentElement.dataset.theme = "dark"),
    );
    await page.screenshot({ path: `.runtime/resources-${kind}-dark.png` });
    await page.setViewportSize({ width: 375, height: 800 });
    await page.evaluate(
      () => (document.documentElement.dataset.theme = "light"),
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    assert.ok((await cards.first().boundingBox()).width <= 375);
    await page.screenshot({ path: `.runtime/resources-${kind}-mobile.png` });
    await cards.first().locator(".resource-kit-open").click();
    await page.waitForURL(new RegExp(`/${kind}/.+`));
    assert.equal(await page.locator(".page-hero h1").count(), 1);
    await page.setViewportSize({ width: 1365, height: 900 });
    console.log(
      `${kind}: unique images, copy, search, categories, links, themes and mobile layout passed`,
    );
  }
  assert.deepEqual(errors, []);
  console.log(
    "PASS: all 36 CDN assets, unique card imagery, working prompt/template actions and responsive libraries.",
  );
} finally {
  await browser.close();
}
