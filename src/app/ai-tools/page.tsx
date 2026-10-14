import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { AffiliateDirectory } from "@/components/affiliates";
import { getAffiliates } from "@/lib/catalog";
export const metadata = {
  title: "AI Tools Directory: Honest Picks for Freelancers & Small Businesses",
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
        crumb="AI Tools"
        description="Discover tools for your workflow, with useful detail and transparent recommendations. No invented ratings. No promises of overnight success."
        eyebrow="THE AI TOOLS DIRECTORY"
      />
      <div className="container page-body">
        <Link href="/ai-tools/finder" className="finder-banner">
          <span className="tool-icon lavender">
            <Sparkles size={22} />
          </span>
          <div>
            <strong>Not sure where to start?</strong>
            <span>
              Answer 3 quick questions and get a shortlist matched to your work
              and budget.
            </span>
          </div>
          <span className="button primary small">
            Take the 60-second finder <ArrowRight size={15} />
          </span>
        </Link>
        <div className="section-heading">
          <p>
            Every listing shows limitations as well as features. Always verify
            current plans with the provider.
          </p>
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
