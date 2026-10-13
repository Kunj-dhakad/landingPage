import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  serverExternalPackages: ["@navonixx/prisma-client"],
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/@navonixx/prisma-client/**",
      "./public/downloads/**",
    ],
  },
  poweredByHeader: false,
  images: {
    remotePatterns: process.env.BLOB_PUBLIC_HOST
      ? [{ protocol: "https", hostname: process.env.BLOB_PUBLIC_HOST }]
      : [],
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
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
