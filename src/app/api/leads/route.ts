import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard, readJson, apiError } from "@/lib/api";
import { leadSchema } from "@/lib/validation";
import { token, hashToken } from "@/lib/security";
import { sendEmail, emailReady } from "@/lib/email";
export async function POST(request: Request) {
  try {
    const blocked = await guard(request, "leads", 5);
    if (blocked) return blocked;
    const data = leadSchema.parse(await readJson(request));
    if (data.website)
      return NextResponse.json(
        { error: "Submission rejected." },
        { status: 400 },
      );
    const resource = data.resourceSlug
      ? await db.resource.findUnique({ where: { slug: data.resourceSlug } })
      : null;
    if (data.resourceSlug && (!resource?.published || !resource.assetPath))
      return NextResponse.json(
        { error: "This resource is unavailable." },
        { status: 404 },
      );
    const lead = await db.$transaction(async (tx) => {
      const contact = await tx.lead.upsert({
        where: { email: data.email },
        create: {
          email: data.email,
          source: data.source,
          campaign: data.campaign,
          status: data.marketing ? "PENDING" : "TRANSACTIONAL",
        },
        update: {},
      });
      await tx.emailConsent.create({
        data: { leadId: contact.id, granted: data.marketing },
      });
      if (data.marketing && contact.status !== "SUBSCRIBED")
        await tx.lead.update({
          where: { id: contact.id },
          data: { status: "PENDING" },
        });
      return contact;
    });
    if (!emailReady()) {
      await db.emailDelivery.create({
        data: {
          leadId: lead.id,
          kind: data.newsletter ? "VERIFICATION" : "RESOURCE",
          resourceSlug: data.resourceSlug,
          status: "NOT_CONFIGURED",
        },
      });
      return NextResponse.json(
        {
          error:
            "Your request was saved, but email delivery is not configured. Download the toolkit directly; no email has been sent.",
        },
        { status: 503 },
      );
    }
    let sent = true;
    const base = process.env.NEXT_PUBLIC_SITE_URL!;
    if (resource)
      sent = await sendEmail(
        lead.id,
        lead.email,
        "RESOURCE",
        "Your NavoNixx toolkit is ready",
        `Your requested resource: ${resource.title}\n\nDownload: ${base}/api/resources/${resource.slug}/download\n\n${data.marketing ? "You will receive a separate email to confirm optional updates." : "You have not been subscribed to promotional emails."}`,
        resource.slug,
      );
    if (data.marketing && lead.status !== "SUBSCRIBED") {
      const raw = token();
      await db.emailVerification.create({
        data: {
          leadId: lead.id,
          tokenHash: hashToken(raw),
          purpose: "SUBSCRIBE",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      const verified = await sendEmail(
        lead.id,
        lead.email,
        "VERIFICATION",
        "Confirm your NavoNixx updates",
        `Confirm your optional subscription: ${base}/verify-email?token=${raw}\n\nThis link expires in 24 hours. If you did not request updates, ignore this email.`,
      );
      sent = sent && verified;
    }
    return NextResponse.json(
      sent
        ? {
            message: data.newsletter
              ? "Check your inbox to confirm your subscription."
              : "The email provider accepted your toolkit email. Check your inbox. Optional updates require confirmation.",
          }
        : {
            error:
              "Your request was saved, but email delivery failed. Please use the direct download and try again later.",
          },
      { status: sent ? 200 : 502 },
    );
  } catch (e) {
    return apiError(e);
  }
}
