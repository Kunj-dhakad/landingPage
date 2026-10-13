import test from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@navonixx/prisma-client";
import { PDFDocument } from "pdf-lib";
import { hashToken } from "../src/lib/security";
import { sendEmail } from "../src/lib/email";
import { db as adapterDb } from "../src/lib/db";
import { overview } from "../src/lib/admin-data";
const db = new PrismaClient();
const base = process.env.TEST_BASE_URL!;
const post = (path: string, body: unknown, cookie = "") =>
  fetch(base + path, {
    method: "POST",
    headers: {
      Origin: base,
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify(body),
  });
test("unauthorized data and mutation endpoints fail closed", async () => {
  assert.equal((await fetch(base + "/api/admin/leads")).status, 401);
  assert.equal((await post("/api/admin/content", {})).status, 401);
  assert.equal(
    (
      await post("/api/leads", {
        email: "bad",
        resourceSlug: "ai-business-growth-toolkit",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await fetch(base + "/api/leads", {
        method: "POST",
        headers: {
          Origin: "https://evil.test",
          "Content-Type": "application/json",
        },
        body: "{}",
      })
    ).status,
    403,
  );
});
test("lead capture persists normalized unique email and never silently subscribes", async () => {
  const body = {
    email: "USER@example.test",
    resourceSlug: "ai-business-growth-toolkit",
    marketing: false,
  };
  assert.equal((await post("/api/leads", body)).status, 503);
  assert.equal(
    (await post("/api/leads", { ...body, email: "user@example.test" })).status,
    503,
  );
  const leads = await db.lead.findMany({
    where: { email: "user@example.test" },
    include: { consents: true, deliveries: true },
  });
  assert.equal(leads.length, 1);
  assert.equal(leads[0].status, "TRANSACTIONAL");
  assert.equal(leads[0].consents.length, 2);
  assert.ok(leads[0].consents.every((c) => !c.granted));
  assert.ok(leads[0].deliveries.every((d) => d.status === "NOT_CONFIGURED"));
});
test("analytics require consent, reject private metadata, and deduplicate event IDs", async () => {
  const event = {
    id: crypto.randomUUID(),
    name: "tool_completed",
    path: "/free-tools/word-counter",
    slug: "word-counter",
  };
  assert.equal((await post("/api/events", { events: [event] })).status, 204);
  const consent = await post("/api/consent", { accept: true });
  const cookies = consent.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  assert.equal(
    (
      await post(
        "/api/events",
        { events: [{ ...event, text: "sensitive" }] },
        cookies,
      )
    ).status,
    400,
  );
  assert.equal(
    (await post("/api/events", { events: [event] }, cookies)).status,
    200,
  );
  assert.equal(
    (await post("/api/events", { events: [event] }, cookies)).status,
    200,
  );
  assert.equal(await db.analyticsEvent.count({ where: { id: event.id } }), 1);
  assert.ok(await db.visitSession.count());
});
test("resource downloads contain a real multi-page PDF and persist counts", async () => {
  const before = await db.resourceDownload.count();
  const res = await fetch(
    base + "/api/resources/ai-business-growth-toolkit/download",
  );
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") || "", /application\/pdf/);
  const bytes = Buffer.from(await res.arrayBuffer());
  assert.equal(bytes.subarray(0, 4).toString(), "%PDF");
  const pdf = await PDFDocument.load(bytes);
  assert.ok(pdf.getPageCount() >= 4);
  assert.match(pdf.getTitle() || "", /AI Business Growth Toolkit/);
  assert.equal(await db.resourceDownload.count(), before + 1);
});
test("redirects ignore user destinations and only follow approved database URLs", async () => {
  const res = await fetch(base + "/go/chatgpt?url=https://evil.test", {
    redirect: "manual",
  });
  assert.equal(res.status, 302);
  assert.equal(res.headers.get("location"), "https://chatgpt.com/");
  assert.equal(
    (await fetch(base + "/go/not-a-tool", { redirect: "manual" })).status,
    404,
  );
});
test.after(async () => {
  await db.$disconnect();
  await adapterDb.$disconnect();
});
test("analytics count returning visitors and group UTC timestamps by India calendar day", async () => {
  const visitor = await db.visitor.create({
    data: {
      consentVersion: "test",
      createdAt: new Date("2025-12-01T00:00:00Z"),
    },
  });
  const session = await db.visitSession.create({
    data: {
      visitorId: visitor.id,
      landingPage: "/",
      startedAt: new Date("2026-01-01T20:00:00Z"),
      lastSeenAt: new Date("2026-01-01T20:30:00Z"),
    },
  });
  await db.analyticsEvent.createMany({
    data: [0, 1].map((i) => ({
      id: crypto.randomUUID(),
      sessionId: session.id,
      name: "page_view",
      path: "/",
      createdAt: new Date(`2026-01-01T20:0${i}:00Z`),
    })),
  });
  const data = await overview(
    new Date("2026-01-01T18:30:00Z"),
    new Date("2026-01-02T18:29:59Z"),
  );
  assert.deepEqual(data.traffic, [{ day: "2026-01-02", visits: 2 }]);
  assert.equal(
    data.metrics.find((m) => m.label.includes("unique visitors"))?.value,
    1,
  );
});
test("subscription verification is single-use and unsubscribe revokes pending confirmation", async () => {
  const lead = await db.lead.create({
    data: { email: "consent@example.test", status: "PENDING" },
  });
  const raw = crypto.randomUUID().replaceAll("-", "").repeat(2);
  await db.emailVerification.create({
    data: {
      leadId: lead.id,
      tokenHash: hashToken(raw),
      purpose: "SUBSCRIBE",
      expiresAt: new Date(Date.now() + 60000),
    },
  });
  assert.equal(
    (
      await post("/api/email-settings", {
        purpose: "SUBSCRIBE",
        action: "confirm",
        token: raw,
      })
    ).status,
    200,
  );
  assert.equal(
    (await db.lead.findUniqueOrThrow({ where: { id: lead.id } })).status,
    "SUBSCRIBED",
  );
  assert.equal(
    (
      await post("/api/email-settings", {
        purpose: "SUBSCRIBE",
        action: "confirm",
        token: raw,
      })
    ).status,
    400,
  );
  const pending = crypto.randomUUID().replaceAll("-", "").repeat(2),
    unsubscribe = crypto.randomUUID().replaceAll("-", "").repeat(2);
  await db.emailVerification.createMany({
    data: [
      {
        leadId: lead.id,
        tokenHash: hashToken(pending),
        purpose: "SUBSCRIBE",
        expiresAt: new Date(Date.now() + 60000),
      },
      {
        leadId: lead.id,
        tokenHash: hashToken(unsubscribe),
        purpose: "UNSUBSCRIBE",
        expiresAt: new Date(Date.now() + 60000),
      },
    ],
  });
  assert.equal(
    (
      await post("/api/email-settings", {
        purpose: "UNSUBSCRIBE",
        action: "confirm",
        token: unsubscribe,
      })
    ).status,
    200,
  );
  assert.equal(
    (await db.lead.findUniqueOrThrow({ where: { id: lead.id } })).status,
    "UNSUBSCRIBED",
  );
  assert.equal(
    await db.emailVerification.count({
      where: { leadId: lead.id, purpose: "SUBSCRIBE", usedAt: null },
    }),
    0,
  );
});
test("email adapter records provider acceptance and failures (provider simulated)", async () => {
  const lead = await db.lead.create({
    data: { email: "delivery@example.test" },
  });
  const originalFetch = globalThis.fetch,
    originalKey = process.env.RESEND_API_KEY,
    originalFrom = process.env.EMAIL_FROM;
  process.env.RESEND_API_KEY = "test-only";
  process.env.EMAIL_FROM = "NavoNixx <test@example.test>";
  try {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ id: "simulated-provider-id" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    assert.equal(
      await sendEmail(
        lead.id,
        lead.email,
        "RESOURCE",
        "Requested resource",
        "Resource link",
      ),
      true,
    );
    globalThis.fetch = async () => new Response("", { status: 429 });
    assert.equal(
      await sendEmail(
        lead.id,
        lead.email,
        "RESOURCE",
        "Requested resource",
        "Resource link",
      ),
      false,
    );
    const states = await db.emailDelivery.findMany({
      where: { leadId: lead.id },
    });
    assert.ok(
      states.some(
        (d) =>
          d.status === "ACCEPTED" && d.providerId === "simulated-provider-id",
      ),
    );
    assert.ok(states.some((d) => d.status === "FAILED"));
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
    if (originalFrom === undefined) delete process.env.EMAIL_FROM;
    else process.env.EMAIL_FROM = originalFrom;
  }
});
