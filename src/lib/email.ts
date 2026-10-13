import { db } from "./db";
export const emailReady = () =>
  Boolean(
    process.env.RESEND_API_KEY &&
    process.env.EMAIL_FROM &&
    process.env.NEXT_PUBLIC_SITE_URL,
  );
export async function sendEmail(
  leadId: string,
  to: string,
  kind: string,
  subject: string,
  text: string,
  resourceSlug?: string,
) {
  const delivery = await db.emailDelivery.create({
    data: { leadId, kind, resourceSlug, status: "PENDING" },
  });
  if (!emailReady()) {
    await db.emailDelivery.update({
      where: { id: delivery.id },
      data: {
        status: "NOT_CONFIGURED",
        error: "Email provider is not configured.",
      },
    });
    return false;
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [to],
        subject,
        text,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw Error(`Provider returned ${response.status}`);
    const result = await response.json();
    await db.emailDelivery.update({
      where: { id: delivery.id },
      data: { status: "ACCEPTED", providerId: result.id },
    });
    return true;
  } catch (e) {
    await db.emailDelivery.update({
      where: { id: delivery.id },
      data: {
        status: "FAILED",
        error: e instanceof Error ? e.message.slice(0, 200) : "Provider error",
      },
    });
    return false;
  }
}
