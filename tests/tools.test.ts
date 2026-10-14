import test from "node:test";
import assert from "node:assert/strict";
import { tools, runTool, parseColor } from "../src/lib/tools";
test("35 registered tools have distinct slugs and valid default examples", () => {
  assert.equal(tools.length, 35);
  assert.equal(new Set(tools.map((t) => t.slug)).size, 35);
  for (const t of tools.filter((t) => t.slug !== "regex-tester")) {
    const output = runTool(
      t.slug,
      Object.fromEntries(t.fields.map((f) => [f.key, f.value])),
    );
    assert.equal(typeof output, "string", t.slug);
    assert.ok(output.length, t.slug);
  }
});
test("text utilities handle empty input, Unicode and repeated lines", () => {
  assert.match(runTool("word-counter", { text: "" }), /^0 words/);
  assert.match(runTool("character-counter", { text: "🤗 a" }), /^3 characters/);
  assert.equal(
    runTool("slug-generator", { text: "Crème brûlée & AI!" }),
    "creme-brulee-ai",
  );
  assert.equal(runTool("duplicate-line-remover", { text: " a\na\nb" }), "a\nb");
  assert.equal(
    runTool("text-cleaner", { text: "  a   b\n\n\n c  " }),
    "a b\n\nc",
  );
  assert.equal(
    runTool("text-case-converter", { text: "hello WORLD", mode: "title" }),
    "Hello World",
  );
});
test("encoding round trips Unicode and URL reserved characters", () => {
  const s = "नमस्ते 🤗 & growth";
  const encoded = runTool("base64-encoder-decoder", {
    text: s,
    mode: "encode",
  });
  assert.equal(
    runTool("base64-encoder-decoder", { text: encoded, mode: "decode" }),
    s,
  );
  const url = runTool("url-encoder-decoder", { text: s, mode: "encode" });
  assert.equal(
    runTool("url-encoder-decoder", { text: url, mode: "decode" }),
    s,
  );
  assert.throws(() =>
    runTool("url-encoder-decoder", { text: "%xx", mode: "decode" }),
  );
});
test("business calculations include costs and reject impossible denominators", () => {
  assert.equal(
    runTool("project-pricing-calculator", {
      hours: "10",
      rate: "100",
      expenses: "200",
      buffer: "10",
    }),
    "Project fee: 1,320",
  );
  assert.match(
    runTool("profit-margin-calculator", { revenue: "1000", cost: "600" }),
    /Margin: 40%/,
  );
  assert.match(
    runTool("roi-calculator", { return: "150", investment: "100" }),
    /ROI: 50%/,
  );
  assert.match(
    runTool("break-even-calculator", {
      fixed: "100",
      price: "30",
      variable: "10",
    }),
    /5 units/,
  );
  assert.throws(() =>
    runTool("break-even-calculator", {
      fixed: "100",
      price: "10",
      variable: "10",
    }),
  );
  assert.throws(() =>
    runTool("roi-calculator", { return: "150", investment: "0" }),
  );
  assert.throws(() =>
    runTool("discount-calculator", { price: "100", discount: "110" }),
  );
  assert.throws(() =>
    runTool("meeting-cost-calculator", {
      people: "-1",
      rate: "40",
      minutes: "60",
    }),
  );
});
test("GST extraction reverses inclusive tax and invoices include line quantities", () => {
  assert.match(
    runTool("gst-calculator", { amount: "1180", rate: "18", mode: "extract" }),
    /Base amount: 1,000\nGST: 180\nTotal: 1,180/,
  );
  const values = Object.fromEntries(
    tools
      .find((t) => t.slug === "invoice-generator")!
      .fields.map((f) => [f.key, f.value]),
  );
  assert.match(
    runTool("invoice-generator", {
      ...values,
      quantity: "2",
      rate: "100",
      tax: "18",
    }),
    /TOTAL: 236 USD/,
  );
});
test("colors convert HEX, RGB and HSL with validation", () => {
  assert.deepEqual(parseColor("#fff"), [255, 255, 255]);
  assert.deepEqual(parseColor("hsl(240, 100%, 50%)"), [0, 0, 255]);
  assert.deepEqual(parseColor("rgb(255, 0, 0)"), [255, 0, 0]);
  assert.throws(() => parseColor("rgb(999, 0, 0)"));
  assert.match(
    runTool("color-converter", { color: "#ff0000" }),
    /hsl\(0, 100%, 50%\)/,
  );
});
test("random utilities use bounded cryptographic outputs", () => {
  assert.throws(() => runTool("uuid-generator", { count: "1000" }));
  assert.throws(() => runTool("password-generator", { length: "4" }));
  assert.equal(runTool("password-generator", { length: "24" }).length, 24);
  const uuids = runTool("uuid-generator", { count: "10" }).split("\n");
  assert.equal(new Set(uuids).size, 10);
  for (const uuid of uuids)
    assert.match(uuid, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});
test("campaign URLs preserve query parameters and prohibit executable schemes", () => {
  const s = runTool("utm-link-builder", {
    url: "https://example.com/?a=1",
    source: "instagram",
    medium: "social",
    campaign: "bio",
    content: "",
    term: "",
  });
  const url = new URL(s);
  assert.equal(url.searchParams.get("a"), "1");
  assert.equal(url.searchParams.get("utm_source"), "instagram");
  assert.throws(() =>
    runTool("utm-link-builder", {
      url: "javascript:alert(1)",
      source: "x",
      medium: "x",
      campaign: "x",
    }),
  );
});
