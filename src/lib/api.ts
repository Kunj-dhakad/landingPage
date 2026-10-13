import { NextResponse } from "next/server";
import { databaseReady } from "./db";
import { sameOrigin, rateLimit } from "./security";
import { ZodError } from "zod";
export const unavailable = () =>
  NextResponse.json(
    {
      error:
        "This service needs database and email setup. Free tools and the direct toolkit download remain available.",
    },
    { status: 503 },
  );
export async function guard(request: Request, bucket: string, limit = 20) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  if (!databaseReady() || !process.env.AUTH_SECRET) return unavailable();
  if (!(await rateLimit(request, bucket, limit)))
    return NextResponse.json(
      { error: "Too many requests. Please try later." },
      { status: 429 },
    );
  return null;
}
export async function readJson(request: Request, max = 10000) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw Error("INVALID_BODY");
  if (Number(request.headers.get("content-length") || 0) > max)
    throw Error("TOO_LARGE");
  const body = await request.text();
  if (Buffer.byteLength(body) > max) throw Error("TOO_LARGE");
  try {
    return JSON.parse(body);
  } catch {
    throw Error("INVALID_BODY");
  }
}
export function apiError(error: unknown) {
  if (error instanceof ZodError)
    return NextResponse.json(
      {
        error: "Please check the supplied fields.",
        fields: error.issues.map((i) => i.path.join(".")),
      },
      { status: 400 },
    );
  const message = error instanceof Error ? error.message : "";
  if (message === "UNAUTHORIZED")
    return NextResponse.json(
      { error: "Administrator authorization required." },
      { status: 401 },
    );
  if (["INVALID_BODY", "TOO_LARGE"].includes(message))
    return NextResponse.json(
      { error: "Invalid or oversized request." },
      { status: 400 },
    );
  console.error(
    "API request failed:",
    error instanceof Error ? error.name : "UnknownError",
  );
  return NextResponse.json(
    { error: "Service temporarily unavailable. Please try again." },
    { status: 503 },
  );
}
