import test from "node:test";
import assert from "node:assert/strict";
import {
  hashPassword,
  verifyPassword,
  safeDestination,
  hashToken,
  conversionRate,
} from "../src/lib/security";
import {
  emailSchema,
  leadSchema,
  eventsSchema,
  affiliateSchema,
} from "../src/lib/validation";
import { affiliateContent } from "../src/lib/affiliate-content";
test("password hashes are salted and do not accept a wrong password", () => {
  const a = hashPassword("a secure long password");
  const b = hashPassword("a secure long password");
  assert.notEqual(a, b);
  assert.ok(verifyPassword("a secure long password", a));
  assert.equal(verifyPassword("incorrect", a), false);
  assert.equal(verifyPassword("x", "malformed"), false);
  assert.equal(hashToken("token").length, 64);
});
test("redirects prohibit unsafe protocols and embedded credentials", () => {
  assert.equal(safeDestination("javascript:alert(1)"), null);
  assert.equal(safeDestination("//evil.test"), null);
  assert.equal(safeDestination("https://user:pass@example.com"), null);
  assert.equal(
    safeDestination("https://example.com/path"),
    "https://example.com/path",
  );
});
test("email normalization and separate explicit consent", () => {
  assert.equal(emailSchema.parse(" USER@EXAMPLE.COM "), "user@example.com");
  assert.equal(emailSchema.safeParse("invalid").success, false);
  assert.equal(
    leadSchema.safeParse({ email: "a@example.com", resourceSlug: "toolkit" })
      .success,
    true,
  );
  assert.equal(
    leadSchema.safeParse({
      email: "a@example.com",
      newsletter: true,
      marketing: false,
    }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({
      email: "a@example.com",
      newsletter: true,
      marketing: true,
    }).success,
    true,
  );
  assert.equal(
    leadSchema.safeParse({
      email: "a@example.com",
      resourceSlug: "toolkit",
      marketing: "true",
    }).success,
    false,
  );
});
test("event ingestion only accepts bounded whitelisted fields", () => {
  const event = {
    id: crypto.randomUUID(),
    name: "tool_completed",
    path: "/free-tools/word-counter",
    slug: "word-counter",
  };
  assert.ok(eventsSchema.safeParse({ events: [event] }).success);
  assert.equal(
    eventsSchema.safeParse({
      events: [{ ...event, email: "private@example.com" }],
    }).success,
    false,
  );
  assert.equal(
    eventsSchema.safeParse({ events: [{ ...event, name: "secret" }] }).success,
    false,
  );
  assert.equal(
    eventsSchema.safeParse({
      events: [{ ...event, path: "/tools?password=secret" }],
    }).success,
    false,
  );
  assert.equal(
    eventsSchema.safeParse({ events: Array.from({ length: 21 }, () => event) })
      .success,
    false,
  );
});
test("affiliate input rejects an unapproved destination and excessive metadata", () => {
  const { lastVerifiedAt, ...listing } = affiliateContent[0];
  void lastVerifiedAt;
  assert.ok(affiliateSchema.safeParse(listing).success);
  assert.equal(
    affiliateSchema.safeParse({
      ...listing,
      destinationUrl: "data:text/html,evil",
    }).success,
    false,
  );
});
test("conversion ratios handle zero denominators honestly", () => {
  assert.equal(conversionRate(1, 0), 0);
  assert.equal(conversionRate(3, 10), 30);
  assert.equal(conversionRate(1, 3), 33.33);
});
