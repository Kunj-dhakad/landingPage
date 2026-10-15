import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { guard, readJson, apiError } from "@/lib/api";
import { eventsSchema } from "@/lib/validation";
import { db } from "@/lib/db";
export async function POST(request: Request) {
  try {
    const blocked = await guard(request, "events", 100);
    if (blocked) return blocked;
    const jar = await cookies();
    if (
      jar.get("navonixx_analytics")?.value === "declined" ||
      request.headers.get("dnt") === "1" ||
      request.headers.get("sec-gpc") === "1" ||
      /bot|crawler|spider|headless/i.test(
        request.headers.get("user-agent") || "",
      )
    )
      return new NextResponse(null, { status: 204 });
    const data = eventsSchema.parse(await readJson(request));
    const publicEvents = data.events.filter(event => !event.path.startsWith("/admin"));
    if (!publicEvents.length) return new NextResponse(null, { status: 204 });
    data.events = publicEvents;
    if (jar.get("navonixx_analytics")?.value !== "accepted") {
      // No visitor/session identifiers, attribution, device details, or cookies.
      await db.analyticsEvent.createMany({ data: publicEvents, skipDuplicates: true });
      return NextResponse.json({ ok: true });
    }
    let sessionId = jar.get("navonixx_visit")?.value;
    let session = sessionId
      ? await db.visitSession.findUnique({ where: { id: sessionId } })
      : null;
    if (!session || session.lastSeenAt.getTime() < Date.now() - 30 * 60000) {
      let visitorId = jar.get("navonixx_visitor")?.value;
      const visitor = visitorId
        ? await db.visitor.findUnique({ where: { id: visitorId } })
        : null;
      if (!visitor) {
        const row = await db.visitor.create({
          data: { consentVersion: "2026-10-v1" },
        });
        visitorId = row.id;
        jar.set("navonixx_visitor", visitorId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 31536000,
        });
      }
      const ua = request.headers.get("user-agent") || "";
      session = await db.visitSession.create({
        data: {
          visitorId: visitorId!,
          landingPage: data.events[0].path,
          ...data.attribution,
          device: /mobile/i.test(ua)
            ? "Mobile"
            : /tablet|ipad/i.test(ua)
              ? "Tablet"
              : "Desktop",
          browser: /Edg/.test(ua)
            ? "Edge"
            : /Chrome/.test(ua)
              ? "Chrome"
              : /Firefox/.test(ua)
                ? "Firefox"
                : /Safari/.test(ua)
                  ? "Safari"
                  : "Other",
          os: /Windows/.test(ua)
            ? "Windows"
            : /Android/.test(ua)
              ? "Android"
              : /iPhone|iPad/.test(ua)
                ? "iOS"
                : /Mac/.test(ua)
                  ? "macOS"
                  : "Other",
          country: request.headers.get("x-vercel-ip-country")?.slice(0, 2),
        },
      });
      sessionId = session.id;
      jar.set("navonixx_visit", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 1800,
      });
    }
    await db.$transaction([
      db.analyticsEvent.createMany({
        data: data.events.map((event) => ({ ...event, sessionId })),
        skipDuplicates: true,
      }),
      db.visitSession.update({
        where: { id: sessionId! },
        data: { lastSeenAt: new Date(), exitPage: data.events.at(-1)?.path },
      }),
    ]);
    jar.set("navonixx_visit", sessionId!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 1800,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
