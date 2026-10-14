import { PageHeading } from "@/components/page-heading";
import { ToolDirectory } from "@/components/tool-ui";
import { getTools } from "@/lib/catalog";
export const metadata = {
  title: "35 Free Online Tools for Writers, Developers & Freelancers",
  description:
    "35 genuinely free writing tools, development utilities, business calculators, and marketing tools. No account required.",
  alternates: { canonical: "/free-tools" },
};
export const dynamic = "force-dynamic";
export default async function Page() {
  return (
    <>
      <PageHeading
        title="Useful tools. Zero busywork."
        description="A thoughtfully built collection of everyday essentials. All free, all ready to use, all without an account."
        eyebrow="THE FREE TOOLS COLLECTION"
        crumb="Free Tools"
      />
      <div className="container page-body">
        <ToolDirectory tools={await getTools()} />
      </div>
    </>
  );
}
