import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@navonixx/prisma-client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { guard, readJson, apiError } from "@/lib/api";
import {
  affiliateSchema,
  resourceSchema,
  httpUrl,
  emailSchema,
} from "@/lib/validation";
import { overview } from "@/lib/admin-data";
import { hashPassword } from "@/lib/security";
type Context = { params: Promise<{ entity: string }> };
const editorEntities = ["resources", "content"];
const adminSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(12).max(128),
    role: z.enum(["ADMIN", "EDITOR"]),
    enabled: z.boolean(),
  })
  .strict();
export async function GET(request: Request, { params }: Context) {
  try {
    const { entity } = await params;
    await requireAdmin(!editorEntities.includes(entity));
    const query = new URL(request.url).searchParams;
    const page = Math.max(1, Math.min(10000, Number(query.get("page")) || 1)),
      take = 25,
      skip = (page - 1) * take;
    const search = (query.get("search") || "").slice(0, 150);
    const orderBy = {
      createdAt:
        query.get("sort") === "asc" ? ("asc" as const) : ("desc" as const),
    };
    let rows: unknown[] = [],
      total = 0;
    if (["overview", "analytics", "conversions"].includes(entity)) {
      const range = z
        .object({ from: z.coerce.date(), to: z.coerce.date() })
        .refine(
          (d) =>
            d.from <= d.to &&
            d.to.getTime() - d.from.getTime() <= 366 * 86400000,
        )
        .parse({
          from: query.get("from") || new Date(Date.now() - 30 * 86400000),
          to: query.get("to") || new Date(),
        });
      return NextResponse.json(await overview(range.from, range.to));
    }
    if (entity === "leads") {
      const where: Prisma.LeadWhereInput = {
        ...(search ? { email: { contains: search, mode: "insensitive" } } : {}),
        ...(query.get("status") ? { status: query.get("status")! } : {}),
      };
      [rows, total] = await Promise.all([
        db.lead.findMany({
          where,
          skip,
          take,
          orderBy,
          include: {
            consents: { orderBy: { createdAt: "desc" }, take: 3 },
            deliveries: { orderBy: { createdAt: "desc" }, take: 3 },
          },
        }),
        db.lead.count({ where }),
      ]);
    } else if (["resources", "content"].includes(entity)) {
      const where = {
        ...(search
          ? { title: { contains: search, mode: "insensitive" as const } }
          : {}),
      };
      [rows, total] = await Promise.all([
        db.resource.findMany({ where, skip, take, orderBy }),
        db.resource.count({ where }),
      ]);
    } else if (entity === "affiliate-tools") {
      const where = {
        ...(search
          ? { name: { contains: search, mode: "insensitive" as const } }
          : {}),
      };
      [rows, total] = await Promise.all([
        db.affiliateTool.findMany({
          where,
          skip,
          take,
          orderBy,
          include: { _count: { select: { clicks: true } } },
        }),
        db.affiliateTool.count({ where }),
      ]);
    } else if (entity === "free-tools") {
      const where = search
        ? { title: { contains: search, mode: "insensitive" as const } }
        : {};
      [rows, total] = await Promise.all([
        db.freeTool.findMany({ where, skip, take, orderBy }),
        db.freeTool.count({ where }),
      ]);
    } else if (entity === "visitors") {
      const where = search
        ? { landingPage: { contains: search, mode: "insensitive" as const } }
        : {};
      [rows, total] = await Promise.all([
        db.visitSession.findMany({
          where,
          skip,
          take,
          orderBy: { startedAt: orderBy.createdAt },
          include: {
            _count: { select: { events: true } },
            visitor: { select: { createdAt: true } },
          },
        }),
        db.visitSession.count({ where }),
      ]);
      rows = (
        rows as {
          startedAt: Date;
          lastSeenAt: Date;
          visitor: { createdAt: Date };
        }[]
      ).map((r) => ({
        ...r,
        durationSecondsEstimate: Math.max(
          0,
          Math.round((r.lastSeenAt.getTime() - r.startedAt.getTime()) / 1000),
        ),
        returning:
          r.visitor.createdAt.getTime() < r.startedAt.getTime() - 60000,
      }));
    } else if (entity === "email-activity") {
      const where = search
        ? {
            lead: { email: { contains: search, mode: "insensitive" as const } },
          }
        : {};
      [rows, total] = await Promise.all([
        db.emailDelivery.findMany({
          where,
          skip,
          take,
          orderBy,
          include: { lead: { select: { email: true } } },
        }),
        db.emailDelivery.count({ where }),
      ]);
    } else if (entity === "campaigns") {
      const where = search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {};
      [rows, total] = await Promise.all([
        db.campaign.findMany({ where, skip, take, orderBy }),
        db.campaign.count({ where }),
      ]);
    } else if (entity === "contact") {
      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {};
      [rows, total] = await Promise.all([
        db.contactSubmission.findMany({ where, skip, take, orderBy }),
        db.contactSubmission.count({ where }),
      ]);
    } else if (entity === "settings") {
      const where = search
        ? { key: { contains: search, mode: "insensitive" as const } }
        : {};
      return NextResponse.json({
        rows: await db.siteSetting.findMany({ where, orderBy: { key: "asc" } }),
        total: await db.siteSetting.count({ where }),
        setup: {
          database: true,
          email: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM),
          auth: Boolean(process.env.AUTH_SECRET),
        },
      });
    } else if (entity === "administrators") {
      const where = search
        ? { email: { contains: search, mode: "insensitive" as const } }
        : {};
      [rows, total] = await Promise.all([
        db.adminUser.findMany({
          where,
          skip,
          take,
          orderBy,
          select: {
            id: true,
            email: true,
            role: true,
            enabled: true,
            createdAt: true,
          },
        }),
        db.adminUser.count({ where }),
      ]);
    } else if (entity === "audit-log") {
      const where = search
        ? { entity: { contains: search, mode: "insensitive" as const } }
        : {};
      [rows, total] = await Promise.all([
        db.adminAuditLog.findMany({ where, skip, take, orderBy }),
        db.adminAuditLog.count({ where }),
      ]);
    } else
      return NextResponse.json(
        { error: "Unknown admin section." },
        { status: 404 },
      );
    return NextResponse.json({
      rows,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / take)),
    });
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(request: Request, { params }: Context) {
  try {
    const { entity } = await params;
    const admin = await requireAdmin(!editorEntities.includes(entity));
    const blocked = await guard(request, "admin", 100);
    if (blocked) return blocked;
    const body = await readJson(request, 120000);
    let id: string;
    if (["resources", "content"].includes(entity)) {
      const data = resourceSchema.parse(body);
      id = (await db.resource.create({ data })).id;
    } else if (entity === "affiliate-tools") {
      const data = affiliateSchema.parse(body);
      id = (await db.affiliateTool.create({ data })).id;
    } else if (entity === "campaigns") {
      const data = z
        .object({
          name: z.string().min(2).max(100),
          source: z.string().min(1).max(100),
          medium: z.string().min(1).max(100),
          url: httpUrl,
        })
        .strict()
        .parse(body);
      id = (await db.campaign.create({ data })).id;
    } else if (entity === "settings") {
      const data = z
        .object({
          key: z.enum([
            "brandName",
            "tagline",
            "contactEmail",
            "affiliateDisclosure",
            "retentionDays",
            "socialLinks",
          ]),
          value: z.string().max(4000),
        })
        .strict()
        .parse(body);
      if (
        data.key === "retentionDays" &&
        (!/^\d+$/.test(data.value) ||
          Number(data.value) < 7 ||
          Number(data.value) > 730)
      )
        return NextResponse.json(
          { error: "Retention must be 7–730 days." },
          { status: 400 },
        );
      if (data.key === "contactEmail") emailSchema.parse(data.value);
      if (data.key === "brandName") z.string().min(2).max(30).parse(data.value);
      if (data.key === "socialLinks")
        z.array(
          z.object({ label: z.string().min(1).max(30), url: httpUrl }).strict(),
        )
          .max(5)
          .parse(JSON.parse(data.value));
      await db.siteSetting.upsert({
        where: { key: data.key },
        create: data,
        update: { value: data.value },
      });
      id = data.key;
    } else if (entity === "administrators") {
      const data = adminSchema.parse(body);
      id = (
        await db.adminUser.create({
          data: {
            email: data.email,
            role: data.role,
            enabled: data.enabled,
            passwordHash: hashPassword(data.password),
          },
        })
      ).id;
    } else
      return NextResponse.json(
        {
          error:
            "Creation is not supported for this section. New executable tools require code.",
        },
        { status: 400 },
      );
    await db.adminAuditLog.create({
      data: { adminId: admin.id, action: "CREATE", entity, entityId: id },
    });
    return NextResponse.json(
      { id, message: "Saved successfully." },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      return NextResponse.json(
        { error: "This slug or email already exists." },
        { status: 409 },
      );
    return apiError(e);
  }
}
