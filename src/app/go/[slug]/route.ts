import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, databaseReady } from "@/lib/db";
import { safeDestination, rateLimit } from "@/lib/security";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!databaseReady())
    return NextResponse.json(
      { error: "Directory setup required." },
      { status: 503 },
    );
  const { slug } = await params;
  const tool = await db.affiliateTool.findUnique({ where: { slug } });
  const target = tool?.published
    ? safeDestination(tool.destinationUrl || tool.officialUrl)
    : null;
  if (!target)
    return NextResponse.json(
      { error: "Approved destination unavailable." },
      { status: 404 },
    );
  if (
    (await cookies()).get("navonixx_analytics")?.value === "accepted" &&
    process.env.AUTH_SECRET
  ) {
    try {
      if (await rateLimit(request, "affiliate", 30)) {
        const id = (await cookies()).get("navonixx_visit")?.value;
        const session = id
          ? await db.visitSession.findUnique({ where: { id } })
          : null;
        await db.affiliateClick.create({
          data: {
            toolId: tool!.id,
            source: session?.source,
            campaign: session?.campaign,
          },
        });
      }
    } catch {
      /* Analytics must not break navigation. */
    }
  }
  return NextResponse.redirect(target, 302);
}
