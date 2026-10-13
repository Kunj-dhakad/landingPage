import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { readJson, apiError } from "@/lib/api";
import { sameOrigin } from "@/lib/security";
import { db, databaseReady } from "@/lib/db";
export async function POST(request: Request) {
  try {
    if (!sameOrigin(request))
      return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
    const { accept } = z
      .object({ accept: z.boolean() })
      .strict()
      .parse(await readJson(request));
    const jar = await cookies();
    if (!accept) {
      const visitor = jar.get("navonixx_visitor")?.value;
      if (visitor && databaseReady())
        await db.visitor.deleteMany({ where: { id: visitor } });
      jar.delete("navonixx_visitor");
      jar.delete("navonixx_visit");
      jar.set("navonixx_analytics", "declined", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 31536000,
        path: "/",
      });
    } else
      jar.set("navonixx_analytics", "accepted", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 31536000,
        path: "/",
      });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
