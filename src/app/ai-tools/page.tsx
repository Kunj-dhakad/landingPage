import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { AffiliateDirectory } from "@/components/affiliates";
import { getAffiliates } from "@/lib/catalog";
export const metadata = {
  title: "AI tools directory",
  description:
    "Compare useful AI tools with clear features, limitations, and transparent affiliate information.",
  alternates: { canonical: "/ai-tools" },
};
export const dynamic = "force-dynamic";
export default async function Page() {
  return (
    <>
      <PageHeading
        title="Good software. Clear choices."
        description="Discover tools for your workflow, with useful detail and transparent recommendations. No invented ratings. No promises of overnight success."
        eyebrow="THE AI TOOLS DIRECTORY"
      />
      <div className="container page-body">
        <div className="section-heading">
          <p>Always verify current plans directly with the provider.</p>
          <Link href="/ai-tools/compare" className="button secondary small">
            Compare up to 3 tools ↗
          </Link>
        </div>
        <AffiliateDirectory listings={await getAffiliates()} />
        <p className="section-note">
          Affiliate listings are clearly labeled. We may earn a commission
          through marked links.
        </p>
      </div>
    </>
  );
}
