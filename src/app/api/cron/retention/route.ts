import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { applyRetention } from "@/lib/retention";
import { databaseReady } from "@/lib/db";
import { apiError } from "@/lib/api";
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret)
    return NextResponse.json(
      { error: "Cron is not configured." },
      { status: 503 },
    );
  const expected = Buffer.from("Bearer " + secret),
    provided = Buffer.from(request.headers.get("authorization") || "");
  if (
    provided.length !== expected.length ||
    !timingSafeEqual(expected, provided)
  )
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!databaseReady())
    return NextResponse.json(
      { error: "Database not configured." },
      { status: 503 },
    );
  try {
    return NextResponse.json(await applyRetention());
  } catch (e) {
    return apiError(e);
  }
}
