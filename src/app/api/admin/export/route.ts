import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/api";
const csv = (v: unknown) => {
  const s = String(v ?? "");
  return (
    '"' + (/^[=+\-@\t\r]/.test(s) ? "'" + s : s).replaceAll('"', '""') + '"'
  );
};
export async function GET(request: Request) {
  try {
    const admin = await requireAdmin(true);
    const url = new URL(request.url);
    const format = url.searchParams.get("format");
    if (format === "lead-json") {
      const id = url.searchParams.get("id");
      if (!id)
        return NextResponse.json(
          { error: "Lead id required." },
          { status: 400 },
        );
      const lead = await db.lead.findUnique({
        where: { id },
        include: { consents: true, deliveries: true, downloads: true },
      });
      return NextResponse.json(lead, {
        headers: {
          "Content-Disposition": 'attachment; filename="lead-data.json"',
          "Cache-Control": "no-store",
        },
      });
    }
    const rows = await db.lead.findMany({
      take: 10000,
      orderBy: { createdAt: "desc" },
    });
    const data = [
      ["Email", "Created", "Source", "Campaign", "Status", "Verified"],
      ...rows.map((r) => [
        r.email,
        r.createdAt.toISOString(),
        r.source,
        r.campaign,
        r.status,
        r.verifiedAt?.toISOString(),
      ]),
    ]
      .map((r) => r.map(csv).join(","))
      .join("\r\n");
    await db.adminAuditLog.create({
      data: { adminId: admin.id, action: "EXPORT", entity: "leads" },
    });
    return new NextResponse(data, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="navonixx-leads.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return apiError(e);
  }
}
