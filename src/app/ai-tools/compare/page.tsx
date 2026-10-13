import { PageHeading } from "@/components/page-heading";
import { Comparison } from "@/components/affiliates";
import { getAffiliates } from "@/lib/catalog";
export const metadata = {
  title: "Compare AI tools",
  alternates: { canonical: "/ai-tools/compare" },
};
export const dynamic = "force-dynamic";
export default async function Page() {
  return (
    <>
      <PageHeading
        title="Find your kind of useful."
        description="Compare up to three tools. See what fits your work, what to watch for, and where to verify the details."
        eyebrow="SIDE-BY-SIDE COMPARISON"
        parent={["AI tools", "/ai-tools"]}
      />
      <div className="container page-body">
        <Comparison listings={await getAffiliates()} />
      </div>
    </>
  );
}
