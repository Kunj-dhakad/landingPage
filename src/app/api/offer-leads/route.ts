import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard, readJson, apiError } from "@/lib/api";
import { offerLeadSchema } from "@/lib/validation";
import { token, hashToken } from "@/lib/security";
import { sendEmail } from "@/lib/email";
import { offerBySlug } from "@/lib/offers";
/** Saves a lead from a review page and emails the free quick-start bonus. */
export async function POST(request: Request) {
  try {
    const blocked = await guard(request, "offer-leads", 5);
    if (blocked) return blocked;
    const data = offerLeadSchema.parse(await readJson(request));
    if (data.website)
      return NextResponse.json({ error: "Submission rejected." }, { status: 400 });
    const offer = offerBySlug(data.offerSlug);
    if (!offer)
      return NextResponse.json({ error: "This offer is unavailable." }, { status: 404 });
    const lead = await db.$transaction(async (tx) => {
      const contact = await tx.lead.upsert({
        where: { email: data.email },
        create: {
          email: data.email,
          source: data.source || `offer:${offer.slug}`,
          campaign: data.campaign || offer.slug,
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
    const base = process.env.NEXT_PUBLIC_SITE_URL || "";
    const sent = await sendEmail(
      lead.id,
      lead.email,
      "OFFER_BONUS",
      `Your ${offer.bonus.title}`,
      [
        `Here is your free ${offer.bonus.title} from NavoNixx.`,
        "",
        ...offer.bonus.checklist.map((step, i) => `${i + 1}. ${step}`),
        "",
        offer.coupon
          ? `Vendor coupon: ${offer.coupon.code} (${offer.coupon.note})`
          : "",
        `Our full ${offer.name} review: ${base}/reviews/${offer.slug}`,
        `Official ${offer.name} page: ${base}/go/${offer.slug}`,
        `Bonus: our free AI Business Growth Toolkit: ${base}/toolkit`,
        "",
        "Disclosure: the link above is an affiliate link. We may earn a commission at no extra cost to you.",
        data.marketing
          ? "You will receive a separate email to confirm optional updates."
          : "You have not been subscribed to promotional emails.",
      ].join("\n"),
      offer.slug,
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
      await sendEmail(
        lead.id,
        lead.email,
        "VERIFICATION",
        "Confirm your NavoNixx updates",
        `Confirm your optional subscription: ${base}/verify-email?token=${raw}\n\nThis link expires in 24 hours. If you did not request updates, ignore this email.`,
      );
    }
    // The lead is saved either way; the visitor can continue even if delivery failed.
    return NextResponse.json({
      message: sent
        ? "Unlocked! Your bonus is on its way to your inbox."
        : "Unlocked! We could not send the email right now, but your bonus is shown below.",
    });
  } catch (e) {
    return apiError(e);
  }
}
