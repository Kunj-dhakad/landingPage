import { db, databaseReady } from "./db";
import { tools } from "./tools";
import { content } from "./content";
import { affiliateContent } from "./affiliate-content";
export async function getSettings() {
  if (!databaseReady()) return {};
  const rows = await db.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<
    string,
    string
  >;
}
export async function getTools() {
  if (!databaseReady()) return tools;
  const records = await db.freeTool.findMany();
  const meta = new Map(records.map((t) => [t.slug, t]));
  return tools
    .filter((t) => meta.get(t.slug)?.enabled !== false)
    .map((t) => ({
      ...t,
      name: meta.get(t.slug)?.title ?? t.name,
      description: meta.get(t.slug)?.description ?? t.description,
      category: meta.get(t.slug)?.category ?? t.category,
      iconUrl: meta.get(t.slug)?.iconUrl,
      seoTitle: meta.get(t.slug)?.seoTitle,
      seoDescription: meta.get(t.slug)?.seoDescription,
      featured: meta.get(t.slug)?.featured,
    }));
}
export async function getContent(kind?: string) {
  if (!databaseReady()) return content.filter((c) => !kind || c.kind === kind);
  return db.resource.findMany({
    where: { published: true, ...(kind ? { kind } : {}) },
    orderBy: { createdAt: "desc" },
  });
}
export async function getAffiliates() {
  if (!databaseReady())
    return affiliateContent.map((a) => ({ ...a, id: a.slug }));
  return db.affiliateTool.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });
}
