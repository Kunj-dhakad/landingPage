import type { MetadataRoute } from "next";
export const dynamic = "force-dynamic";
import { getTools, getContent, getAffiliates } from "@/lib/catalog";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://navonixx.vercel.app";
  const [tools, content, affiliates] = await Promise.all([
    getTools(),
    getContent(),
    getAffiliates(),
  ]);
  const paths = [
    "",
    "/free-tools",
    "/ai-tools",
    "/ai-tools/compare",
    "/toolkit",
    "/prompts",
    "/templates",
    "/workflows",
    "/resources",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/affiliate-disclosure",
    ...tools.map((t) => `/free-tools/${t.slug}`),
    ...content
      .filter((c) => c.kind !== "toolkit")
      .map((c) => `/${c.kind}/${c.slug}`),
    ...affiliates.map((a) => `/ai-tools/${a.slug}`),
  ];
  return paths.map((p) => ({
    url: base + p,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : p === "/free-tools" ? 0.9 : 0.7,
  }));
}
