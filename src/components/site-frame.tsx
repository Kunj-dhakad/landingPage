"use client";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
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
  const path = usePathname();
  const previousPath = useRef(path);
  const historyPath = useRef<string | null>(null);
  useEffect(() => {
    const restoreHistory = () => {
      historyPath.current = window.location.pathname;
    };
    window.addEventListener("popstate", restoreHistory);
    return () => window.removeEventListener("popstate", restoreHistory);
  }, []);
  useLayoutEffect(() => {
    if (previousPath.current === path) return;
    previousPath.current = path;
    const restoringHistory = historyPath.current === path;
    historyPath.current = null;
    if (restoringHistory || window.location.hash) return;
    // New pages start at the top; hash links and history retain native behavior.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [path]);
  const admin = path.startsWith("/admin");
  return (
    <div className={admin ? "admin-site" : "public-site"}>
      {!admin && header}
      <main id="main">{children}</main>
      {!admin && footer}
      {!admin && privacy}
    </div>
  );
}
