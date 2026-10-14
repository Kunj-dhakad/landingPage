import Link from "next/link";
import { notFound, redirect as redirectTo } from "next/navigation";
import { offerBySlug } from "@/lib/offers";
import ReactMarkdown from "react-markdown";
import {
  ArrowRight,
  Check,
  CircleAlert,
  ShieldCheck,
  ThumbsUp,
  X,
} from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { getAffiliates } from "@/lib/catalog";
import { databaseReady } from "@/lib/db";
import { TrackView } from "@/components/track-view";
import { StructuredData } from "@/components/structured-data";
import { ToolMonogram, VisitButton } from "@/components/funnel";
import { hasFreePlan } from "@/lib/affiliate-content";
type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = (await getAffiliates()).find((a) => a.slug === slug);
  if (!item) return { title: "Tool not found" };
  return {
    title: `${item.name} Review: Features, Limits & Who It's For`,
    description: item.editorial
      ? `${item.editorial.bestFor}. ${item.description}`.slice(0, 158)
      : item.description,
    alternates: { canonical: `/ai-tools/${slug}` },
  };
}
const pricingLabel: Record<string, string> = {
  FREE: "Free",
  FREEMIUM: "Free plan + paid plans",
  PAID: "Paid plans only",
  UNVERIFIED: "Check current pricing",
};
export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (offerBySlug(slug)) redirectTo(`/reviews/${slug}`);
  const items = await getAffiliates();
  const a = items.find((a) => a.slug === slug);
  if (!a) notFound();
  const redirect = databaseReady();
  const e = a.editorial;
  const alternatives = items
    .filter(
      (t) =>
        t.slug !== slug &&
        (t.category === a.category ||
          t.editorial?.goals.some((g) => e?.goals.includes(g))),
    )
    .slice(0, 3);
  const free = hasFreePlan(a.pricingModel);
  return (
    <>
      <TrackView name="affiliate_tool_viewed" slug={a.slug} />
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: a.name,
          description: a.description,
          applicationCategory: "BusinessApplication",
          operatingSystem: a.platforms.join(", "),
          url: a.officialUrl,
        }}
      />
      <PageHeading
        title={a.name}
        description={a.description}
        eyebrow={a.category.toUpperCase()}
        parent={["AI Tools", "/ai-tools"]}
      />
      <div className="container page-body review-layout">
        <div className="review-main">
          <section className="verdict panel">
            <div className="verdict-head">
              <ToolMonogram name={a.name} logoUrl={a.logoUrl} size={56} />
              <div>
                <span className="micro">OUR TAKE</span>
                <h2>{e?.bestFor ?? a.description}</h2>
              </div>
            </div>
            {e && <p>{e.verdict}</p>}
            <div className="fact-chips">
              <span>{pricingLabel[a.pricingModel] ?? a.pricingModel}</span>
              {a.platforms.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </div>
            <div className="verdict-actions">
              <VisitButton listing={a} redirect={redirect} />
              <Link className="button secondary" href="/ai-tools/compare">
                Compare alternatives
              </Link>
            </div>
            <p className="micro disclosure-inline">
              <ShieldCheck size={14} />
              {a.affiliate
                ? "Affiliate link: we may earn a commission at no extra cost to you. It never changes our verdict."
                : "No affiliate relationship. We recommend it because it fits."}
            </p>
          </section>

          {e && (
            <section className="fit-grid">
              <div className="panel fit-yes">
                <h3>
                  <ThumbsUp size={18} /> A great fit if you…
                </h3>
                <ul>
                  {a.useCases.map((u) => (
                    <li key={u}>
                      <Check size={15} /> need help with {u.toLowerCase()}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="panel fit-no">
                <h3>
                  <CircleAlert size={18} /> Probably not for…
                </h3>
                <ul>
                  {e.notFor.map((n) => (
                    <li key={n}>
                      <X size={15} /> {n}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          <section className="pros-cons">
            <div className="panel">
              <h3>What we like</h3>
              <ul>
                {[...a.advantages, ...a.features.slice(0, 2)].map((v) => (
                  <li key={v}>
                    <Check size={15} /> {v}
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel">
              <h3>Worth knowing</h3>
              <ul>
                {a.limitations.map((v) => (
                  <li key={v}>
                    <CircleAlert size={15} /> {v}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <article className="prose">
            <h2>What {a.name} does</h2>
            <ReactMarkdown>{a.body}</ReactMarkdown>
            <h3>Key features</h3>
            <ul>
              {a.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </article>

          {e && (
            <section className="start-steps panel">
              <h2>Get value from it in your first hour</h2>
              <ol>
                {e.gettingStarted.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <VisitButton listing={a} redirect={redirect} />
            </section>
          )}

          <section className="prose">
            <h2>Common questions</h2>
            <details>
              <summary>Is there a free plan?</summary>
              <p>{a.freePlan}</p>
            </details>
            <details>
              <summary>How much does {a.name} cost?</summary>
              <p>
                {a.pricingDescription} Prices change often, so the official
                website is always the source of truth.
              </p>
            </details>
            <details>
              <summary>Is it safe to use with client work?</summary>
              <p>
                Review the provider&apos;s data and privacy settings before
                sharing confidential information, and check outputs before you
                use them.
              </p>
            </details>
            <details>
              <summary>Do you earn money if I sign up?</summary>
              <p>
                {a.affiliate
                  ? "Yes, this is an affiliate link. We may earn a commission at no extra cost to you. Our picks are based on fit, and every listing shows limitations."
                  : "No. We have no affiliate relationship with this provider."}
              </p>
            </details>
          </section>

          {alternatives.length > 0 && (
            <section>
              <div className="section-heading">
                <h2>Alternatives to consider</h2>
                <Link className="text-link" href="/ai-tools/finder">
                  Not sure? Take the 60-second finder <ArrowRight size={15} />
                </Link>
              </div>
              <div className="alt-grid">
                {alternatives.map((t) => (
                  <Link key={t.slug} href={`/ai-tools/${t.slug}`} className="alt-card panel">
                    <ToolMonogram name={t.name} logoUrl={t.logoUrl} size={40} />
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.editorial?.bestFor ?? t.description}</span>
                    </div>
                    <ArrowRight size={16} />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="review-aside">
          <div className="panel aside-card">
            <div className="aside-head">
              <ToolMonogram name={a.name} logoUrl={a.logoUrl} size={44} />
              <div>
                <strong>{a.name}</strong>
                <span>{pricingLabel[a.pricingModel] ?? a.pricingModel}</span>
              </div>
            </div>
            <ul>
              <li>
                <Check size={14} /> {a.freePlan}
              </li>
              {e && (
                <li>
                  <Check size={14} /> Best for: {e.bestFor.toLowerCase()}
                </li>
              )}
            </ul>
            <VisitButton listing={a} redirect={redirect} className="button primary wide" />
            {free && (
              <span className="micro">Start free. Upgrade only if it earns its place.</span>
            )}
            <p className="micro">
              {a.lastVerifiedAt
                ? `Overview checked ${new Date(a.lastVerifiedAt).toLocaleDateString("en-IN", { timeZone: "Asia/Calcutta", dateStyle: "medium" })}.`
                : "Summarized from the provider's public pages."}{" "}
              Confirm current plans on the official site.
            </p>
          </div>
        </aside>
      </div>
      <div className="sticky-cta">
        <div>
          <strong>{a.name}</strong>
          <span>{free ? "Free plan available" : "Paid plans"}</span>
        </div>
        <VisitButton
          listing={a}
          redirect={redirect}
          className="button primary small"
          label={free ? "Try free" : "Visit site"}
        />
      </div>
    </>
  );
}
