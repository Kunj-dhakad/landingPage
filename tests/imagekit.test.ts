import test from "node:test";
import assert from "node:assert/strict";
import { imageKitEndpoint, isImageKitAsset } from "../src/lib/imagekit-config";
import { uploadToImageKit, ImageKitUploadError } from "../src/lib/imagekit";
import { approvedAsset } from "../src/lib/security";

async function configured(run: () => Promise<void>) {
  const keys = ["IMAGEKIT_URL_ENDPOINT", "IMAGEKIT_PRIVATE_KEY", "IMAGEKIT_UPLOAD_FOLDER"] as const;
  const before = keys.map((key) => process.env[key]);
  process.env.IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/test-account";
  process.env.IMAGEKIT_PRIVATE_KEY = "private_unit_test";
  process.env.IMAGEKIT_UPLOAD_FOLDER = "/navonixx";
  try { await run(); } finally {
    keys.forEach((key, i) => { if (before[i] === undefined) delete process.env[key]; else process.env[key] = before[i]; });
  }
}
const file = () => new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], "sample.png", { type: "image/png" });

test("ImageKit URLs are restricted to the configured account, including saved assets", async () => configured(async () => {
  assert.ok(isImageKitAsset("https://ik.imagekit.io/test-account/navonixx/a.png"));
  assert.ok(approvedAsset("https://ik.imagekit.io/test-account/navonixx/a.pdf"));
  for (const url of ["http://ik.imagekit.io/test-account/a.png", "https://ik.imagekit.io/other-account/a.png", "https://ik.imagekit.io/test-account-evil/a.png", "https://ik.imagekit.io.evil.test/test-account/a.png", "https://user:pass@ik.imagekit.io/test-account/a.png", "https://ik.imagekit.io/test-account/../other/a.png"]) assert.equal(isImageKitAsset(url), false);
  assert.equal(imageKitEndpoint("https://ik.imagekit.io"), null);
  assert.equal(imageKitEndpoint("invalid"), null);
}));

test("server upload uses private Basic auth, validated folder and unique filenames", async (t) => configured(async () => {
  t.mock.method(globalThis, "fetch", async (url: string, options: RequestInit) => {
    assert.equal(url, "https://upload.imagekit.io/api/v1/files/upload");
    assert.equal(new Headers(options.headers).get("Authorization"), `Basic ${Buffer.from("private_unit_test:").toString("base64")}`);
    assert.ok(options.body instanceof FormData);
    assert.equal(options.body.get("fileName"), "generated.png");
    assert.equal(options.body.get("folder"), "/navonixx");
    assert.equal(options.body.get("useUniqueFileName"), "true");
    assert.ok(options.body.get("file") instanceof File);
    assert.equal(options.redirect, "error");
    return Response.json({ url: "https://ik.imagekit.io/test-account/navonixx/generated.png" });
  });
  assert.equal((await uploadToImageKit(file(), "generated.png")).url, "https://ik.imagekit.io/test-account/navonixx/generated.png");
}));

test("missing keys and invalid folders fail before network access", async (t) => configured(async () => {
  const request = t.mock.method(globalThis, "fetch", async () => { throw Error("Must not upload"); });
  delete process.env.IMAGEKIT_PRIVATE_KEY;
  await assert.rejects(uploadToImageKit(file(), "a.png"), (e: unknown) => e instanceof ImageKitUploadError && e.status === 503);
  process.env.IMAGEKIT_PRIVATE_KEY = "private_unit_test";
  process.env.IMAGEKIT_UPLOAD_FOLDER = "/navonixx/../other";
  await assert.rejects(uploadToImageKit(file(), "a.png"), /folder names/);
  assert.equal(request.mock.callCount(), 0);
}));

test("provider failures never expose upstream secrets, and other-account responses are rejected", async (t) => configured(async () => {
  const request = t.mock.method(globalThis, "fetch", async () => Response.json({ message: "private_unit_test" }, { status: 401 }));
  await assert.rejects(uploadToImageKit(file(), "a.png"), (e: unknown) => e instanceof ImageKitUploadError && /credentials/.test(e.message) && !e.message.includes("private_unit_test"));
  request.mock.mockImplementation(async () => Response.json({ url: "https://ik.imagekit.io/other-account/a.png" }));
  await assert.rejects(uploadToImageKit(file(), "a.png"), /does not match/);
}));


test("published assets remain allowed when Vercel has no ImageKit endpoint variable", () => {
  const before = process.env.IMAGEKIT_URL_ENDPOINT;
  delete process.env.IMAGEKIT_URL_ENDPOINT;
  try {
    assert.equal(imageKitEndpoint()?.href, "https://ik.imagekit.io/0y2jm8mid");
    assert.ok(isImageKitAsset("https://ik.imagekit.io/0y2jm8mid/navonixx/site/branding/logos/logo.png"));
    assert.equal(isImageKitAsset("https://ik.imagekit.io/other-account/logo.png"), false);
    assert.equal(imageKitEndpoint("invalid"), null);
  } finally {
    if (before === undefined) delete process.env.IMAGEKIT_URL_ENDPOINT;
    else process.env.IMAGEKIT_URL_ENDPOINT = before;
  }
});
