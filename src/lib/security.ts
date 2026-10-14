import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
  createHmac,
} from "node:crypto";
import { db } from "./db";
import { isImageKitAsset } from "./imagekit-config";
export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export const token = () => randomBytes(32).toString("hex");
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function verifyPassword(password: string, stored: string) {
  try {
    const [salt, hash] = stored.split(":");
    const expected = Buffer.from(hash, "hex"),
      actual = scryptSync(password, salt, 64);
    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
  } catch {
    return false;
  }
}
export function safeDestination(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
export function approvedAsset(value: string) {
  if (/^\/downloads\/[a-z0-9-]+\.pdf$/.test(value)) return true;
  if (isImageKitAsset(value)) return true;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === process.env.BLOB_PUBLIC_HOST &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (process.env.NODE_ENV === "development") {
    const url = new URL(request.url);
    const host = request.headers.get("host") || url.host;
    return origin === `${url.protocol}//${host}`;
  }
  const expected = process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
    : new URL(request.url).origin;
  return origin === expected;
}
export async function rateLimit(
  request: Request,
  bucket: string,
  limit = 20,
  minutes = 10,
) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw Error("AUTH_SECRET is required for server endpoints.");
  const ip =
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for") ||
    "unknown";
  const window = Math.floor(Date.now() / (minutes * 60000));
  const key = createHmac("sha256", secret)
    .update(`${bucket}:${ip}:${window}`)
    .digest("hex");
  const row = await db.rateLimit.upsert({
    where: { key },
    create: { key, expiresAt: new Date((window + 1) * minutes * 60000) },
    update: { count: { increment: 1 } },
  });
  return row.count <= limit;
}
export const conversionRate = (conversions: number, visits: number) =>
  visits ? Math.round((conversions / visits) * 10000) / 100 : 0;
