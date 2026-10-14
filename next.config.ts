import type { NextConfig } from "next";
import { imageKitEndpoint } from "./src/lib/imagekit-config";
const isDevelopment = process.env.NODE_ENV === "development";
const imagekit = imageKitEndpoint();
const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [];
if (process.env.BLOB_PUBLIC_HOST) remotePatterns.push({ protocol: "https", hostname: process.env.BLOB_PUBLIC_HOST });
if (imagekit && imagekit.protocol === "https:" && imagekit.hostname === "ik.imagekit.io") remotePatterns.push({ protocol: "https", hostname: imagekit.hostname, pathname: `${imagekit.pathname.replace(/\/+$/, "")}/**` });
const imageSources = [imagekit?.origin, process.env.BLOB_PUBLIC_HOST ? `https://${process.env.BLOB_PUBLIC_HOST}` : null].filter(Boolean).join(" ");
const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "192.168.0.93"],
  serverExternalPackages: ["@navonixx/prisma-client"],
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/@navonixx/prisma-client/**",
    ],
  },
  poweredByHeader: false,
  // Paid offers have full review pages; keep their directory URLs pointing there.
  async redirects() {
    return ["comic-videos-ai", "cuevue", "personaible"].map((slug) => ({
      source: `/ai-tools/${slug}`,
      destination: `/reviews/${slug}`,
      permanent: true,
    }));
  },
  images: {
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              `default-src 'self'; script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: ${imageSources}; media-src 'self' ${imagekit?.origin || ''}; font-src 'self'; connect-src 'self'; worker-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`,
          },
        ],
      },
    ];
  },
};
export default nextConfig;
