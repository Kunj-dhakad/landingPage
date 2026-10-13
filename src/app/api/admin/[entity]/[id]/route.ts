import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@navonixx/prisma-client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { guard, readJson, apiError } from "@/lib/api";
import {
  affiliateSchema,
  resourceSchema,
  freeToolSchema,
  httpUrl,
  emailSchema,
} from "@/lib/validation";
import { hashPassword } from "@/lib/security";
type Context = { params: Promise<{ entity: string; id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  try {
    const { entity, id } = await params;
    const admin = await requireAdmin(
      !["content", "resources"].includes(entity),
    );
    const blocked = await guard(request, "admin", 100);
    if (blocked) return blocked;
    const body = await readJson(request, 120000);
    if (["resources", "content"].includes(entity))
      await db.resource.update({
        where: { id },
        data: resourceSchema.parse(body),
      });
    else if (entity === "affiliate-tools")
      await db.affiliateTool.update({
        where: { id },
        data: affiliateSchema.parse(body),
      });
    else if (entity === "free-tools")
      await db.freeTool.update({
        where: { id },
        data: freeToolSchema.parse(body),
      });
    else if (entity === "leads") {
      const data = z
        .object({ status: z.literal("UNSUBSCRIBED") })
        .strict()
        .parse(body);
      await db.$transaction([
        db.lead.update({ where: { id }, data }),
        db.emailConsent.create({ data: { leadId: id, granted: false } }),
        db.emailVerification.deleteMany({
          where: { leadId: id, purpose: "SUBSCRIBE", usedAt: null },
        }),
      ]);
    } else if (entity === "campaigns")
      await db.campaign.update({
        where: { id },
        data: z
          .object({
            name: z.string().min(2).max(100),
            source: z.string().min(1).max(100),
            medium: z.string().min(1).max(100),
            url: httpUrl,
          })
          .strict()
          .parse(body),
      });
    else if (entity === "contact")
      await db.contactSubmission.update({
        where: { id },
        data: z
          .object({ status: z.enum(["NEW", "REPLIED", "CLOSED"]) })
          .strict()
          .parse(body),
      });
    else if (entity === "administrators") {
      const data = z
        .object({
          email: emailSchema,
          role: z.enum(["ADMIN", "EDITOR"]),
          enabled: z.boolean(),
          password: z.string().min(12).max(128).optional(),
        })
        .strict()
        .parse(body);
      if (id === admin.id && (!data.enabled || data.role !== "ADMIN"))
        return NextResponse.json(
          { error: "You cannot disable or demote your current administrator." },
          { status: 400 },
        );
      await db.adminUser.update({
        where: { id },
        data: {
          email: data.email,
          role: data.role,
          enabled: data.enabled,
          ...(data.password
            ? { passwordHash: hashPassword(data.password) }
            : {}),
        },
      });
      if (!data.enabled || data.password)
        await db.adminSession.deleteMany({ where: { adminId: id } });
    } else
      return NextResponse.json(
        { error: "Update not supported." },
        { status: 400 },
      );
    await db.adminAuditLog.create({
      data: { adminId: admin.id, action: "UPDATE", entity, entityId: id },
    });
    return NextResponse.json({ message: "Changes saved." });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      return NextResponse.json(
        { error: "That slug or email is already used." },
        { status: 409 },
      );
    return apiError(e);
  }
}
export async function DELETE(request: Request, { params }: Context) {
  try {
    const { entity, id } = await params;
    const admin = await requireAdmin();
    const blocked = await guard(request, "admin", 100);
    if (blocked) return blocked;
    if (["resources", "content"].includes(entity))
      await db.resource.delete({ where: { id } });
    else if (entity === "affiliate-tools")
      await db.affiliateTool.delete({ where: { id } });
    else if (entity === "leads") await db.lead.delete({ where: { id } });
    else if (entity === "campaigns")
      await db.campaign.delete({ where: { id } });
    else if (entity === "contact")
      await db.contactSubmission.delete({ where: { id } });
    else if (entity === "administrators") {
      if (id === admin.id)
        return NextResponse.json(
          { error: "You cannot delete your current administrator." },
          { status: 400 },
        );
      await db.adminUser.delete({ where: { id } });
    } else
      return NextResponse.json(
        { error: "Deletion not supported." },
        { status: 400 },
      );
    await db.adminAuditLog.create({
      data: { adminId: admin.id, action: "DELETE", entity, entityId: id },
    });
    return NextResponse.json({ message: "Record deleted." });
  } catch (e) {
    return apiError(e);
  }
}
