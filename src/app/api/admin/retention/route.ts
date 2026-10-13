import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { guard, apiError } from "@/lib/api";
import { db } from "@/lib/db";
import { applyRetention } from "@/lib/retention";
export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(true);
    const blocked = await guard(request, "retention", 5);
    if (blocked) return blocked;
    const { days, counts } = await applyRetention();
    await db.adminAuditLog.create({
      data: { adminId: admin.id, action: "RETENTION", entity: "analytics" },
    });
    return NextResponse.json({
      message: `Retention applied (${days} days).`,
      counts,
    });
  } catch (e) {
    return apiError(e);
  }
}
