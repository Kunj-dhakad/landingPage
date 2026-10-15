import { retryDatabaseRead } from "./database-connection";
import { db, databaseReady } from "./db";
import { tools } from "./tools";
import { content } from "./content";
import { affiliateContent, affiliateEditorial } from "./affiliate-content";
import { assetUrl } from "./media-assets";
export async function getSettings() {
  if (!databaseReady()) return {};
  const rows = await retryDatabaseRead(() => db.siteSetting.findMany());
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<
    string,
    string
  >;
}
export async function getTools() {
  if (!databaseReady()) return tools;
  const records = await retryDatabaseRead(() => db.freeTool.findMany());
  const meta = new Map(records.map((t) => [t.slug, t]));
  return tools
    .filter((t) => meta.get(t.slug)?.enabled !== false)
    .map((t) => ({
      ...t,
      name: meta.get(t.slug)?.title ?? t.name,
      description: meta.get(t.slug)?.description ?? t.description,
      category: meta.get(t.slug)?.category ?? t.category,
      iconUrl: meta.get(t.slug)?.iconUrl ? assetUrl(meta.get(t.slug)!.iconUrl!) : undefined,
      seoTitle: meta.get(t.slug)?.seoTitle,
      seoDescription: meta.get(t.slug)?.seoDescription,
      featured: meta.get(t.slug)?.featured,
    }));
}
export async function getContent(kind?: string) {
  if (!databaseReady()) return content.filter((c) => !kind || c.kind === kind);
  const records = await retryDatabaseRead(() => db.resource.findMany({
    where: { published: true, ...(kind ? { kind } : {}) },
    orderBy: { createdAt: "desc" },
  }));
  return records.map((record) => ({ ...record, assetPath: record.assetPath ? assetUrl(record.assetPath) : null, coverUrl: record.coverUrl ? assetUrl(record.coverUrl) : null }));
}
export async function getAffiliates() {
  if (!databaseReady())
    return affiliateContent.map((a) => ({
      ...a,
      id: a.slug,
      logoUrl: null as string | null,
      editorial: affiliateEditorial[a.slug] ?? null,
    }));
  const records = await retryDatabaseRead(() => db.affiliateTool.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  }));
  return records.map((record) => ({
    ...record,
    logoUrl: record.logoUrl ? assetUrl(record.logoUrl) : null,
    editorial: affiliateEditorial[record.slug] ?? null,
  }));
}
export type AffiliateRecord = Awaited<ReturnType<typeof getAffiliates>>[number];
