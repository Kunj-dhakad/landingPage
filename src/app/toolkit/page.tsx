import { PageHeading } from "@/components/page-heading";
import { EmailForm } from "@/components/forms";
import { getContent } from "@/lib/catalog";
import { Check, Download, FileText, Sparkles } from "lucide-react";
import { TrackView } from "@/components/track-view";
export const metadata = {
  title: "Free AI Business Growth Toolkit",
  description:
    "Download a useful PDF with 10 AI prompts, proposals, email templates, a 7-day content plan, and automation workflows.",
  alternates: { canonical: "/toolkit" },
};
export const dynamic = "force-dynamic";
export default async function Page() {
  const resource = (await getContent("toolkit")).find(
    (c) => c.slug === "ai-business-growth-toolkit",
  );
  return (
    <>
      <TrackView name="resource_viewed" slug="ai-business-growth-toolkit" />
      <PageHeading
        title="Your next chapter starts here."
        description="The NavoNixx AI Business Growth Toolkit. A useful collection for freelancers and small businesses—ready to make your own."
        eyebrow="YOUR FREE AI BUSINESS TOOLKIT"
        crumb="Free Toolkit"
      />
      <div className="container page-body">
        <div className="toolkit-banner">
          <div className="toolkit-art">
            <div className="toolkit-book">
              <div className="book-brand">
                <Sparkles size={16} />
                navonixx.
              </div>
              <div className="book-title">
                Smarter work.
                <br />
                Bigger ideas.
                <br />
                <em>All yours.</em>
              </div>
              <div className="book-orbit">
                <FileText size={37} />
              </div>
              <div className="book-footer">
                AI BUSINESS GROWTH TOOLKIT<span>THE FREE EDITION</span>
              </div>
            </div>
          </div>
          <div className="toolkit-copy">
            <span className="eyebrow">A PRACTICAL HEAD START</span>
            <h2>Useful from page one.</h2>
            <div className="toolkit-benefits">
              {[
                "10 useful freelancer prompts",
                "A client proposal template",
                "Client follow-up emails",
                "A 7-day social content plan",
                "3 automation workflows",
                "A freelancer checklist",
              ].map((t) => (
                <span key={t}>
                  <Check size={15} />
                  {t}
                </span>
              ))}
            </div>
            {resource ? (
              <>
                <a
                  className="button primary"
                  href="/api/resources/ai-business-growth-toolkit/download"
                  download
                >
                  <Download size={17} />
                  Download free PDF
                </a>
                {resource.emailCapture && (
                  <>
                    <p>Or receive it by email:</p>
                    <EmailForm resourceSlug="ai-business-growth-toolkit" />
                  </>
                )}
              </>
            ) : (
              <p>
                This resource is currently unpublished. Explore our other free
                resources.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
