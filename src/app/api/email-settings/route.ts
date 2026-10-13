import { NextResponse } from "next/server";
import { z } from "zod";
import { guard, readJson, apiError } from "@/lib/api";
import { emailSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { token, hashToken } from "@/lib/security";
import { sendEmail } from "@/lib/email";
export async function POST(request: Request) {
  try {
    const blocked = await guard(request, "email-settings", 5);
    if (blocked) return blocked;
    const data = z
      .object({
        purpose: z.enum(["SUBSCRIBE", "UNSUBSCRIBE"]),
        action: z.enum(["request", "confirm"]),
        token: z
          .string()
          .regex(/^[a-f0-9]{64}$/)
          .optional(),
        email: emailSchema.optional(),
      })
      .strict()
      .parse(await readJson(request));
    if (data.action === "request") {
      if (data.purpose !== "UNSUBSCRIBE" || !data.email)
        return NextResponse.json(
          { error: "Invalid request." },
          { status: 400 },
        );
      const lead = await db.lead.findUnique({ where: { email: data.email } });
      if (lead) {
        const raw = token();
        await db.emailVerification.create({
          data: {
            leadId: lead.id,
            tokenHash: hashToken(raw),
            purpose: "UNSUBSCRIBE",
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        });
        await sendEmail(
          lead.id,
          lead.email,
          "UNSUBSCRIBE",
          "Your unsubscribe link",
          `Confirm unsubscribe: ${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${raw}`,
        );
      }
      return NextResponse.json({
        message:
          "If your address is on our list, a secure link will be sent when email delivery is available.",
      });
    }
    if (!data.token)
      return NextResponse.json(
        { error: "Confirmation link required." },
        { status: 400 },
      );
    const success = await db.$transaction(async (tx) => {
      const item = await tx.emailVerification.findUnique({
        where: { tokenHash: hashToken(data.token!) },
      });
      if (
        !item ||
        item.usedAt ||
        item.expiresAt < new Date() ||
        item.purpose !== data.purpose
      )
        return false;
      const claimed = await tx.emailVerification.updateMany({
        where: { id: item.id, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      });
      if (!claimed.count) return false;
      await tx.lead.update({
        where: { id: item.leadId },
        data:
          data.purpose === "SUBSCRIBE"
            ? { status: "SUBSCRIBED", verifiedAt: new Date() }
            : { status: "UNSUBSCRIBED" },
      });
      await tx.emailConsent.create({
        data: { leadId: item.leadId, granted: data.purpose === "SUBSCRIBE" },
      });
      if (data.purpose === "UNSUBSCRIBE")
        await tx.emailVerification.deleteMany({
          where: { leadId: item.leadId, purpose: "SUBSCRIBE", usedAt: null },
        });
      return true;
    });
    return NextResponse.json(
      success
        ? {
            message:
              data.purpose === "SUBSCRIBE"
                ? "You are subscribed. Welcome to NavoNixx!"
                : "You have been unsubscribed.",
          }
        : { error: "This link has expired or has already been used." },
      { status: success ? 200 : 400 },
    );
  } catch (e) {
    return apiError(e);
  }
}
