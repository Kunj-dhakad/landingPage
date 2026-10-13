import { notFound, redirect } from "next/navigation";
import { currentAdmin } from "@/lib/auth";
import { AdminFrame, AdminOverview, AdminData } from "@/components/admin";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
const names: Record<string, string> = {
  overview: "Overview",
  analytics: "Analytics",
  visitors: "Visitors",
  leads: "Leads",
  "free-tools": "Free Tools",
  "affiliate-tools": "Affiliate Tools",
  content: "Content Management",
  resources: "Resources",
  campaigns: "Campaigns",
  "email-activity": "Email Activity",
  conversions: "Conversions",
  contact: "Contact Inbox",
  settings: "Settings",
  administrators: "Administrators",
  "audit-log": "Audit Log",
};
export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  const { section } = await params;
  if (!names[section]) notFound();
  if (admin.role === "EDITOR" && !["content", "resources"].includes(section))
    redirect("/admin/content");
  return (
    <AdminFrame role={admin.role}>
      {["overview", "analytics", "conversions"].includes(section) ? (
        <AdminOverview entity={section} />
      ) : (
        <AdminData key={section} entity={section} title={names[section]} />
      )}
    </AdminFrame>
  );
}
