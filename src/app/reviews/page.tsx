import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { ToolMonogram } from "@/components/funnel";
import { offers } from "@/lib/offers";
export const metadata = {
  title: "AI Software Reviews: Honest Pros, Cons & Real Pricing",
  description:
    "In-depth reviews of AI apps for creators, freelancers, and agencies, with real pricing, limitations, and who each one is for.",
  alternates: { canonical: "/reviews" },
};
export default function Page() {
  return (
    <>
      <PageHeading
        title="Reviews that show both sides."
        description="What each app does, who it's for, what you actually pay, and what to watch out for, before you buy."
        eyebrow="IN-DEPTH REVIEWS"
        crumb="Reviews"
      />
      <div className="container page-body">
        <div className="offer-list">
          {offers.map((o) => (
            <Link key={o.slug} href={`/reviews/${o.slug}`} className="offer-card panel">
              <div className="pick-head">
                <ToolMonogram name={o.name} size={52} />
                <div>
                  <h2>{o.name}</h2>
                  <span>{o.category}</span>
                </div>
              </div>
              <p className="best-for">Best for: {o.bestFor.toLowerCase()}</p>
              <p>{o.tagline}.</p>
              <ul className="pick-reasons">
                {o.facts.slice(0, 2).map((f) => (
                  <li key={f.label}>
                    <Check size={14} /> {f.value}
                  </li>
                ))}
              </ul>
              <span className="text-link">
                Read the review <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
        <p className="section-note">
          Reviews may contain affiliate links. We may earn a commission at no
          extra cost to you; it never changes what we write.
        </p>
      </div>
    </>
  );
}
