"use client";
import { usePathname } from "next/navigation";
export function SiteFrame({
  children,
  header,
  footer,
  privacy,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  privacy: React.ReactNode;
}) {
  const admin = usePathname().startsWith("/admin");
  return (
    <div className={admin ? "admin-site" : "public-site"}>
      {!admin && header}
      <main id="main">{children}</main>
      {!admin && footer}
      {!admin && privacy}
    </div>
  );
}
