import { db } from "./db";
export async function applyRetention() {
  const setting = await db.siteSetting.findUnique({
    where: { key: "retentionDays" },
  });
  const days = Math.min(730, Math.max(7, Number(setting?.value) || 90));
  const cutoff = new Date(Date.now() - days * 86400000);
  const result = await db.$transaction([
    db.analyticsEvent.deleteMany({ where: { createdAt: { lt: cutoff } } }),
    db.affiliateClick.deleteMany({ where: { createdAt: { lt: cutoff } } }),
    db.resourceDownload.deleteMany({ where: { createdAt: { lt: cutoff } } }),
    db.visitSession.deleteMany({ where: { lastSeenAt: { lt: cutoff } } }),
    db.visitor.deleteMany({ where: { sessions: { none: {} } } }),
    db.rateLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
    db.adminSession.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
    db.emailVerification.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    }),
  ]);
  return { days, counts: result.map((r) => r.count) };
}
