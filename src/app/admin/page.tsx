import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/auth";
import { AdminFrame, AdminOverview } from "@/components/admin";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin overview",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.role === "EDITOR") redirect("/admin/content");
  return (
    <AdminFrame role={admin.role}>
      <AdminOverview />
    </AdminFrame>
  );
}
