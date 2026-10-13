import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/go/", "/verify-email", "/unsubscribe"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://navonixx.vercel.app"}/sitemap.xml`,
  };
}
