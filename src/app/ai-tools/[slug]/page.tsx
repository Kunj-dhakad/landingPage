import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { PageHeading } from "@/components/page-heading";
import { getAffiliates } from "@/lib/catalog";
import { databaseReady } from "@/lib/db";
import { TrackView } from "@/components/track-view";
type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = (await getAffiliates()).find((a) => a.slug === slug);
  return {
    title: item?.name || "Tool not found",
    description: item?.description,
    alternates: { canonical: `/ai-tools/${slug}` },
  };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const items = await getAffiliates();
  const a = items.find((a) => a.slug === slug);
  if (!a) notFound();
  return (
    <>
      <TrackView name="affiliate_tool_viewed" slug={a.slug} />
      <PageHeading
        title={a.name}
        description={a.description}
        eyebrow={a.category.toUpperCase()}
        parent={["AI tools", "/ai-tools"]}
      />
      <div className="container page-body article-layout">
        <article className="prose">
          <ReactMarkdown>{a.body}</ReactMarkdown>
          {[
            ["Features", a.features],
            ["Advantages", a.advantages],
            ["Limitations", a.limitations],
            ["Best use cases", a.useCases],
            ["Platforms", a.platforms],
          ].map(([title, values]) => (
            <section key={title as string}>
              <h2>{title}</h2>
              <ul>
                {(values as string[]).map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </section>
          ))}
          <h2>Useful questions</h2>
          <details>
            <summary>Is there a free plan?</summary>
            <p>{a.freePlan}</p>
          </details>
          <details>
            <summary>Where should I check current pricing?</summary>
            <p>
              Use the official provider website. Prices, quotas, availability,
              and licensing terms may change.
            </p>
          </details>
          <h2>Explore alternatives</h2>
          {items
            .filter((t) => t.slug !== slug)
            .map((t) => (
              <p key={t.slug}>
                <Link href={`/ai-tools/${t.slug}`}>{t.name}</Link> —{" "}
                {t.description}
              </p>
            ))}
        </article>
        <aside className="panel article-sidebar">
          <span className="eyebrow">PLAN INFORMATION</span>
          <h3>{a.pricingModel.toLowerCase()}</h3>
          <p>{a.pricingDescription}</p>
          <p>{a.freePlan}</p>
          <a
            className="button primary"
            href={databaseReady() ? `/go/${a.slug}` : a.officialUrl}
            target="_blank"
            rel={
              a.affiliate
                ? "sponsored noopener noreferrer"
                : "noopener noreferrer"
            }
          >
            {a.affiliate ? "Visit affiliate partner" : "Visit official website"}{" "}
            ↗
          </a>
          <p className="micro">
            {a.affiliate
              ? "We may earn a commission through this link."
              : "This listing has no affiliate relationship."}
          </p>
          <p className="micro">
            Overview last checked:{" "}
            {a.lastVerifiedAt
              ? new Date(a.lastVerifiedAt).toLocaleDateString("en-IN", {
                  timeZone: "Asia/Calcutta",
                })
              : "Not yet verified"}
            . Plan specifics may remain unverified.
          </p>
          <Link className="text-link" href="/ai-tools/compare">
            Compare tools ↗
          </Link>
        </aside>
      </div>
    </>
  );
}
