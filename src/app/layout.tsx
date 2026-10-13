import type { Metadata } from "next";
import { Header, Footer, PrivacyControls } from "@/components/shell";
import { SiteFrame } from "@/components/site-frame";
import "@fontsource/geist/400.css";
import "@fontsource/geist/500.css";
import "@fontsource/geist/600.css";
import "@fontsource/geist/700.css";
import "@fontsource/geist/800.css";
import { ScrollReveals } from "@/components/scroll-reveals";
import { getSettings } from "@/lib/catalog";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://navonixx.vercel.app",
  ),
  title: {
    default: "NavoNixx — Smarter Tools. Better Work. Bigger Growth.",
    template: "%s | NavoNixx",
  },
  description:
    "Genuinely free productivity tools, practical AI prompts, templates, and workflows for freelancers, creators, and small businesses.",
  openGraph: {
    type: "website",
    siteName: "NavoNixx",
    title: "NavoNixx — Work smarter. Create faster.",
    description: "Free tools and useful resources for your next big idea.",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.svg" },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteFrame
          header={<Header brandName={settings.brandName} />}
          footer={<Footer settings={settings} />}
          privacy={<PrivacyControls />}
        >
          {children}
        </SiteFrame>
        <ScrollReveals />
      </body>
    </html>
  );
}
