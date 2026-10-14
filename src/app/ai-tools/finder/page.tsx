import { PageHeading } from "@/components/page-heading";
import { ToolFinder } from "@/components/funnel";
import { getAffiliates } from "@/lib/catalog";
import { databaseReady } from "@/lib/db";
export const metadata = {
  title: "AI Tool Finder: Get Your AI Stack in 60 Seconds",
  description:
    "Answer three quick questions and get a shortlist of AI tools matched to your work and budget, with free plans first.",
  alternates: { canonical: "/ai-tools/finder" },
};
export const dynamic = "force-dynamic";
export default async function Page() {
  return (
    <>
      <PageHeading
        title="Find your AI stack in 60 seconds."
        description="Three quick questions. A short, honest shortlist matched to your work and budget, free plans first."
        eyebrow="THE AI TOOL FINDER"
        parent={["AI Tools", "/ai-tools"]}
        crumb="Tool Finder"
      />
      <div className="container page-body finder-page">
        <ToolFinder listings={await getAffiliates()} redirect={databaseReady()} />
      </div>
    </>
  );
}
