import { db } from "./db";
import { conversionRate } from "./security";
export async function overview(from: Date, to: Date) {
  const createdAt = { gte: from, lte: to };
  const [
    visitors,
    sessions,
    pageViews,
    leads,
    verified,
    downloads,
    toolUsage,
    affiliateClicks,
    traffic,
    sources,
    popular,
    devices,
    landingPages,
  ] = await Promise.all([
    db.$queryRaw<
      { count: bigint }[]
    >`SELECT COUNT(DISTINCT s."visitorId") AS count FROM "VisitSession" s JOIN "AnalyticsEvent" e ON e."sessionId" = s.id WHERE e."createdAt" >= (${from}::timestamptz AT TIME ZONE 'UTC') AND e."createdAt" <= (${to}::timestamptz AT TIME ZONE 'UTC')`,
    db.visitSession.count({ where: { startedAt: createdAt } }),
    db.analyticsEvent.count({ where: { name: "page_view", createdAt } }),
    db.lead.count({ where: { createdAt } }),
    db.lead.count({ where: { status: "SUBSCRIBED", verifiedAt: createdAt } }),
    db.resourceDownload.count({ where: { createdAt } }),
    db.analyticsEvent.count({ where: { name: "tool_completed", createdAt } }),
    db.affiliateClick.count({ where: { createdAt } }),
    db.$queryRaw<
      { day: string; visits: bigint }[]
    >`SELECT to_char("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS day, COUNT(*) AS visits FROM "AnalyticsEvent" WHERE name = 'page_view' AND "createdAt" >= (${from}::timestamptz AT TIME ZONE 'UTC') AND "createdAt" <= (${to}::timestamptz AT TIME ZONE 'UTC') GROUP BY day ORDER BY day`,
    db.visitSession.groupBy({
      by: ["source"],
      where: { startedAt: createdAt },
      _count: true,
      orderBy: { _count: { source: "desc" } },
      take: 12,
    }),
    db.analyticsEvent.groupBy({
      by: ["slug"],
      where: { name: "tool_completed", createdAt },
      _count: true,
      orderBy: { _count: { slug: "desc" } },
      take: 10,
    }),
    db.visitSession.groupBy({
      by: ["device"],
      where: { startedAt: createdAt },
      _count: true,
    }),
    db.visitSession.groupBy({
      by: ["landingPage"],
      where: { startedAt: createdAt },
      _count: true,
      orderBy: { _count: { landingPage: "desc" } },
      take: 10,
    }),
  ]);
  return {
    metrics: [
      {
        label: "Consented unique visitors (estimate)",
        value: Number(visitors[0]?.count || 0),
      },
      { label: "Consented sessions", value: sessions },
      { label: "Recorded page views", value: pageViews },
      { label: "New leads", value: leads },
      { label: "Verified subscribers", value: verified },
      { label: "Toolkit / resource downloads", value: downloads },
      { label: "Completed free tools", value: toolUsage },
      { label: "Consented outbound clicks", value: affiliateClicks },
      {
        label: "Lead / session ratio",
        value: conversionRate(leads, sessions),
        suffix: "%",
      },
      {
        label: "Click / page view ratio",
        value: conversionRate(affiliateClicks, pageViews),
        suffix: "%",
      },
    ],
    traffic: traffic.map((d) => ({ day: d.day, visits: Number(d.visits) })),
    sources: sources.map((s) => ({
      name: s.source || "Direct / unattributed",
      count: s._count,
    })),
    popular: popular.map((p) => ({
      name: p.slug || "Unknown",
      count: p._count,
    })),
    devices: devices.map((d) => ({
      name: d.device || "Unknown",
      count: d._count,
    })),
    landingPages: landingPages.map((d) => ({
      name: d.landingPage,
      count: d._count,
    })),
    funnel: [
      { name: "Page views", count: pageViews },
      { name: "Tool completions", count: toolUsage },
      { name: "New leads", count: leads },
      { name: "Outbound clicks", count: affiliateClicks },
    ],
  };
}
