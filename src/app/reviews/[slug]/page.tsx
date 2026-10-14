import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  CircleAlert,
  Gift,
  ShieldCheck,
  ThumbsUp,
  X,
} from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { StructuredData } from "@/components/structured-data";
import { TrackView } from "@/components/track-view";
import { ToolMonogram } from "@/components/funnel";
import { OfferGate } from "@/components/offer-gate";
import { offers, offerBySlug } from "@/lib/offers";
import { databaseReady } from "@/lib/db";
type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const offer = offerBySlug(slug);
  if (!offer) return { title: "Review not found" };
  return {
    title: `${offer.name} Review (2026): Features, Pricing, Pros & Cons`,
    description: `${offer.tagline}. Our honest ${offer.name} review: what it does, who it's for, real pricing, and limitations.`.slice(0, 158),
    alternates: { canonical: `/reviews/${slug}` },
  };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const offer = offerBySlug(slug);
  if (!offer) notFound();
  const href = databaseReady() ? `/go/${offer.slug}` : offer.affiliateUrl;
  const gateOffer = {
    slug: offer.slug,
    name: offer.name,
    coupon: offer.coupon,
    bonus: offer.bonus,
  };
  const others = offers.filter((o) => o.slug !== slug);
  return (
    <>
      <TrackView name="affiliate_tool_viewed" slug={offer.slug} />
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: offer.name,
          description: offer.summary,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web browser",
          url: offer.officialUrl,
        }}
      />
      <PageHeading
        title={`${offer.name} review`}
        description={offer.tagline}
        eyebrow={`HONEST REVIEW · CHECKED ${offer.checkedOn.toUpperCase()}`}
        parent={["Reviews", "/reviews"]}
        crumb={offer.name}
      />
      <div className="container page-body review-layout">
        <div className="review-main">
          <section className="verdict panel">
            <div className="verdict-head">
              <ToolMonogram name={offer.name} size={56} />
              <div>
                <span className="micro">OUR VERDICT</span>
                <h2>Best for: {offer.bestFor.toLowerCase()}</h2>
              </div>
            </div>
            <p>{offer.verdict}</p>
            <dl className="offer-facts">
              {offer.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="verdict-actions">
              <OfferGate offer={gateOffer} href={href} />
              <a className="button secondary" href="#pricing">
                See real pricing
              </a>
            </div>
            <p className="micro disclosure-inline">
              <ShieldCheck size={14} /> Affiliate link: we may earn a commission
              at no extra cost to you. It never changes what we write.
            </p>
          </section>

          {offer.media && (
            <section className="offer-media">
              <h2>See what it makes</h2>
              <div className="offer-videos">
                {offer.media.videos.map((v) => (
                  <figure key={v.src}>
                    <video
                      src={v.src}
                      poster={v.poster}
                      controls
                      playsInline
                      preload="none"
                      aria-label={v.title}
                    />
                    <figcaption>{v.title}</figcaption>
                  </figure>
                ))}
              </div>
              <div className="offer-images">
                {offer.media.images.map((img) => (
                  <Image
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    width={480}
                    height={300}
                    sizes="(max-width: 700px) 100vw, 33vw"
                  />
                ))}
              </div>
              <p className="micro">Samples from the vendor&apos;s official showcase.</p>
            </section>
          )}

          <article className="prose">
            <h2>What is {offer.name}?</h2>
            <p>{offer.summary}</p>
          </article>

          <section className="offer-steps">
            <h2>How it works</h2>
            <ol>
              {offer.steps.map((s, i) => (
                <li key={s.title} className="panel">
                  <span className="step-num">{i + 1}</span>
                  <strong>{s.title}</strong>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="offer-h2">Key features</h2>
            <div className="offer-features">
              {offer.features.map((f) => (
                <div key={f.title} className="panel">
                  <strong>
                    <Check size={16} /> {f.title}
                  </strong>
                  <p>{f.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="fit-grid">
            <div className="panel fit-yes">
              <h3>
                <ThumbsUp size={18} /> A great fit if you…
              </h3>
              <ul>
                {offer.goodFit.map((g) => (
                  <li key={g}>
                    <Check size={15} /> {g}
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel fit-no">
              <h3>
                <CircleAlert size={18} /> Probably not for…
              </h3>
              <ul>
                {offer.notFor.map((n) => (
                  <li key={n}>
                    <X size={15} /> {n}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="pricing" className="offer-pricing panel">
            <h2>What you actually pay</h2>
            <table>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Listed price</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {offer.pricing.map((p) => (
                  <tr key={p.plan}>
                    <td>{p.plan}</td>
                    <td>
                      <strong>{p.price}</strong>
                    </td>
                    <td>{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul>
              {offer.pricingNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
              <li>Prices as listed by the vendor on {offer.checkedOn}. The checkout page is always the final word.</li>
            </ul>
            <OfferGate offer={gateOffer} href={href} label="Unlock coupon + check today's price" />
          </section>

          <section className="pros-cons">
            <div className="panel">
              <h3>What we like</h3>
              <ul>
                {offer.pros.map((v) => (
                  <li key={v}>
                    <Check size={15} /> {v}
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel">
              <h3>Worth knowing</h3>
              <ul>
                {offer.cons.map((v) => (
                  <li key={v}>
                    <CircleAlert size={15} /> {v}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="offer-bonus panel">
            <span className="offer-gift">
              <Gift size={24} />
            </span>
            <div>
              <span className="eyebrow">FREE FROM NAVONIXX</span>
              <h2>Get our {offer.bonus.title}</h2>
              <p>
                A practical {offer.bonus.checklist.length}-step plan to get
                results in your first two weeks, plus the vendor&apos;s current
                coupon and our free AI Business Growth Toolkit. Sent to your
                inbox.
              </p>
              <OfferGate offer={gateOffer} href={href} label="Send me the bonus" />
            </div>
          </section>

          <section className="prose">
            <h2>{offer.name} FAQ</h2>
            {offer.faqs.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
            <details>
              <summary>Do you earn money if I buy?</summary>
              <p>
                Yes. This is an affiliate link, so we may earn a commission at
                no extra cost to you. We still list every limitation we know
                about.
              </p>
            </details>
          </section>

          {others.length > 0 && (
            <section>
              <div className="section-heading">
                <h2>More reviews</h2>
                <Link className="text-link" href="/ai-tools/finder">
                  Find your AI stack <ArrowRight size={15} />
                </Link>
              </div>
              <div className="alt-grid">
                {others.map((o) => (
                  <Link key={o.slug} href={`/reviews/${o.slug}`} className="alt-card panel">
                    <ToolMonogram name={o.name} size={40} />
                    <div>
                      <strong>{o.name}</strong>
                      <span>{o.tagline}</span>
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
              <ToolMonogram name={offer.name} size={44} />
              <div>
                <strong>{offer.name}</strong>
                <span>{offer.category}</span>
              </div>
            </div>
            <ul>
              {offer.facts.map((f) => (
                <li key={f.label}>
                  <Check size={14} /> {f.label}: {f.value}
                </li>
              ))}
            </ul>
            <OfferGate offer={gateOffer} href={href} className="button primary wide" />
            <p className="micro">
              Includes the vendor coupon and our free quick-start bonus.
              Affiliate link.
            </p>
          </div>
        </aside>
      </div>
      <div className="sticky-cta">
        <div>
          <strong>{offer.name}</strong>
          <span>{offer.facts[1]?.value}</span>
        </div>
        <OfferGate offer={gateOffer} href={href} className="button primary small" label="Get coupon" />
      </div>
    </>
  );
}
