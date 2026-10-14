"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { track } from "@/lib/events";
import {
  audienceLabels,
  goalLabels,
  hasFreePlan,
  type Audience,
  type Editorial,
  type Goal,
} from "@/lib/affiliate-content";

export type FunnelListing = {
  slug: string;
  name: string;
  description: string;
  category: string;
  pricingModel: string;
  freePlan: string;
  affiliate: boolean;
  featured?: boolean;
  officialUrl: string;
  logoUrl?: string | null;
  editorial: Editorial | null;
};

const palette = ["#4f7cff", "#7c5cff", "#13a37f", "#f07a2b", "#e0457b", "#0ea5c6"];
export function ToolMonogram({
  name,
  logoUrl,
  size = 46,
}: {
  name: string;
  logoUrl?: string | null;
  size?: number;
}) {
  const color =
    palette[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % palette.length];
  return (
    <span
      className="monogram"
      style={{ width: size, height: size, background: logoUrl ? undefined : color }}
      aria-hidden="true"
    >
      {logoUrl ? (
        <Image src={logoUrl} alt="" width={size - 14} height={size - 14} />
      ) : (
        name.slice(0, 1)
      )}
    </span>
  );
}

export function outboundHref(listing: FunnelListing, redirect: boolean) {
  return redirect ? `/go/${listing.slug}` : listing.officialUrl;
}

/** Outbound button. Affiliate links are labeled and marked sponsored. */
export function VisitButton({
  listing,
  redirect,
  className = "button primary",
  label,
}: {
  listing: FunnelListing;
  redirect: boolean;
  className?: string;
  label?: string;
}) {
  const text =
    label ??
    (hasFreePlan(listing.pricingModel)
      ? `Try ${listing.name} free`
      : `Visit ${listing.name}`);
  return (
    <a
      className={className}
      href={outboundHref(listing, redirect)}
      target="_blank"
      rel={
        listing.affiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"
      }
      onClick={() => track("affiliate_link_clicked", listing.slug)}
    >
      {text} <ArrowUpRight size={16} />
    </a>
  );
}

type Budget = "free" | "paid";
function rank(
  listings: FunnelListing[],
  audience: Audience,
  goals: Goal[],
  budget: Budget,
) {
  const scored = listings
    .filter((l) => l.editorial)
    .map((l) => {
      const e = l.editorial!;
      let score = 0;
      const matched: Goal[] = [];
      goals.forEach((g, gi) => {
        const at = e.goals.indexOf(g);
        if (at >= 0) {
          score += 12 - at * 2 - gi;
          matched.push(g);
        }
      });
      if (e.audiences.includes(audience)) score += 3;
      if (budget === "free")
        score += hasFreePlan(l.pricingModel) ? 3 : -8;
      if (l.featured) score += 1;
      return { listing: l, score, matched };
    })
    .filter((r) => r.matched.length)
    .sort((a, b) => b.score - a.score);
  // Cover each chosen goal before doubling up on one.
  const picks: typeof scored = [];
  for (const g of goals) {
    const best = scored.find((r) => r.matched.includes(g) && !picks.includes(r));
    if (best) picks.push(best);
  }
  for (const r of scored) if (!picks.includes(r)) picks.push(r);
  return picks.slice(0, 3);
}

export function ToolFinder({
  listings,
  redirect,
  compact = false,
}: {
  listings: FunnelListing[];
  redirect: boolean;
  compact?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState<Audience | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const available = new Set(listings.flatMap((l) => l.editorial?.goals ?? []));
  const goalOptions = (Object.keys(goalLabels) as Goal[]).filter((g) =>
    available.has(g),
  );
  const results =
    step === 3 && audience && budget ? rank(listings, audience, goals, budget) : [];
  const restart = () => {
    setStep(0);
    setAudience(null);
    setGoals([]);
    setBudget(null);
  };
  return (
    <div className={`finder panel${compact ? " finder-compact" : ""}`}>
      {step < 3 && (
        <div className="finder-progress" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <i key={i} className={i <= step ? "done" : ""} />
          ))}
        </div>
      )}
      {step === 0 && (
        <fieldset className="finder-step">
          <legend>
            <span className="micro">STEP 1 OF 3</span>
            What best describes you?
          </legend>
          <div className="finder-options">
            {(Object.keys(audienceLabels) as Audience[]).map((a) => (
              <button
                type="button"
                key={a}
                aria-pressed={audience === a}
                className="finder-option"
                onClick={() => {
                  setAudience(a);
                  setStep(1);
                }}
              >
                {audienceLabels[a]}
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {step === 1 && (
        <fieldset className="finder-step">
          <legend>
            <span className="micro">STEP 2 OF 3 · PICK UP TO 3</span>
            What should AI take off your plate first?
          </legend>
          <div className="finder-options grid">
            {goalOptions.map((g) => {
              const on = goals.includes(g);
              return (
                <button
                  type="button"
                  key={g}
                  aria-pressed={on}
                  className={`finder-option${on ? " selected" : ""}`}
                  disabled={!on && goals.length >= 3}
                  onClick={() =>
                    setGoals(on ? goals.filter((x) => x !== g) : [...goals, g])
                  }
                >
                  {goalLabels[g]}
                  {on && <Check size={16} />}
                </button>
              );
            })}
          </div>
          <div className="finder-nav">
            <button type="button" className="text-button" onClick={() => setStep(0)}>
              <ArrowLeft size={15} /> Back
            </button>
            <button
              type="button"
              className="button primary"
              disabled={!goals.length}
              onClick={() => setStep(2)}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </fieldset>
      )}
      {step === 2 && (
        <fieldset className="finder-step">
          <legend>
            <span className="micro">STEP 3 OF 3</span>
            How do you feel about paying for software?
          </legend>
          <div className="finder-options">
            {(
              [
                ["free", "Free plans first, I'll upgrade if it proves itself"],
                ["paid", "Happy to pay if it saves me real time"],
              ] as [Budget, string][]
            ).map(([b, label]) => (
              <button
                type="button"
                key={b}
                aria-pressed={budget === b}
                className="finder-option"
                onClick={() => {
                  setBudget(b);
                  setStep(3);
                  track("finder_completed", undefined, goals.join(","));
                }}
              >
                {label}
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
          <div className="finder-nav">
            <button type="button" className="text-button" onClick={() => setStep(1)}>
              <ArrowLeft size={15} /> Back
            </button>
          </div>
        </fieldset>
      )}
      {step === 3 && (
        <div className="finder-results" aria-live="polite">
          <div className="finder-results-head">
            <span className="micro">
              <Sparkles size={13} /> YOUR SHORTLIST
            </span>
            <h3>
              {results.length
                ? `${results.length} tools matched to your work`
                : "No close match yet"}
            </h3>
            <p>
              Start with the first pick. Test it on one real task this week
              before paying for anything.
            </p>
          </div>
          <ol className="finder-picks">
            {results.map(({ listing, matched }, i) => (
              <li key={listing.slug} className={i === 0 ? "top-pick" : ""}>
                {i === 0 && <span className="pick-badge">Best match</span>}
                <div className="pick-head">
                  <ToolMonogram name={listing.name} logoUrl={listing.logoUrl} />
                  <div>
                    <h4>{listing.name}</h4>
                    <span>{listing.editorial?.bestFor}</span>
                  </div>
                </div>
                <ul className="pick-reasons">
                  {matched.map((g) => (
                    <li key={g}>
                      <Check size={14} /> {goalLabels[g]}
                    </li>
                  ))}
                  {hasFreePlan(listing.pricingModel) && (
                    <li>
                      <Check size={14} /> Free plan to test first
                    </li>
                  )}
                </ul>
                <div className="pick-actions">
                  <VisitButton
                    listing={listing}
                    redirect={redirect}
                    className={i === 0 ? "button primary small" : "button secondary small"}
                  />
                  <Link className="text-link" href={`/ai-tools/${listing.slug}`}>
                    Read our take <ArrowRight size={14} />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
          <div className="finder-nav">
            <button type="button" className="text-button" onClick={restart}>
              <RotateCcw size={15} /> Start over
            </button>
            <Link className="text-link" href="/ai-tools/compare">
              Compare side by side <ArrowRight size={14} />
            </Link>
          </div>
          <p className="finder-note">
            Picks are based on your answers and our editorial notes, never on
            who pays us. Some links may be affiliate links, which are labeled
            on each tool page.
          </p>
        </div>
      )}
    </div>
  );
}
