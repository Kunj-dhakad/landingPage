"use client";
import { Select } from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";
import { Search, ArrowUpRight, Sparkles } from "lucide-react";
import { track } from "@/lib/events";
import { ToolMonogram } from "@/components/funnel";
import { hasFreePlan, type Editorial } from "@/lib/affiliate-content";
export type Listing = {
  slug: string;
  name: string;
  description: string;
  category: string;
  pricingModel: string;
  pricingDescription: string;
  freePlan: string;
  features: string[];
  platforms: string[];
  useCases: string[];
  limitations: string[];
  affiliate: boolean;
  logoUrl?: string | null;
  editorial?: Editorial | null;
};
export function AffiliateDirectory({ listings }: { listings: Listing[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All categories");
  const [pricing, setPricing] = useState("All plans");
  const [useCase, setUseCase] = useState("All use cases");
  const categories = [
    "All categories",
    ...new Set(listings.map((a) => a.category)),
  ];
  const useCases = [
    "All use cases",
    ...new Set(listings.flatMap((a) => a.useCases)),
  ];
  const items = listings.filter(
    (a) =>
      `${a.name} ${a.description}`.toLowerCase().includes(q.toLowerCase()) &&
      (category === "All categories" || category === a.category) &&
      (pricing === "All plans" || pricing === a.pricingModel) &&
      (useCase === "All use cases" || a.useCases.includes(useCase)),
  );
  return (
    <>
      <div className="directory-controls">
        <label className="search">
          <Search size={18} />
          <input
            aria-label="Search AI tools"
            placeholder="Find the right tool for your work…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <div className="comparison-select">
          <label className="sr-only" htmlFor="ai-category">
            Category
          </label>
          <Select id="ai-category" value={category} onValueChange={setCategory} options={categories} />
          <label className="sr-only" htmlFor="ai-pricing">
            Pricing model
          </label>
          <Select id="ai-pricing" value={pricing} onValueChange={setPricing} options={[{value: "All plans", label: "All plans"}, ...["FREE", "FREEMIUM", "PAID", "UNVERIFIED"].map(value => ({value, label: value[0] + value.slice(1).toLowerCase()}))]} />
          <label className="sr-only" htmlFor="ai-use-case">
            Use case
          </label>
          <Select id="ai-use-case" value={useCase} onValueChange={setUseCase} options={useCases} />
        </div>
      </div>
      <div className="resource-grid">
        {items.map((a) => (
          <Link
            className="resource-card panel"
            href={`/ai-tools/${a.slug}`}
            key={a.slug}
          >
            <div className="card-top">
              <ToolMonogram name={a.name} logoUrl={a.logoUrl} />
              <span className={hasFreePlan(a.pricingModel) ? "pill free" : "pill"}>
                {hasFreePlan(a.pricingModel)
                  ? "Free plan"
                  : a.pricingModel === "PAID"
                    ? "Paid"
                    : "Check pricing"}
              </span>
            </div>
            <span className="micro">{a.category.toUpperCase()}</span>
            <h3>{a.name}</h3>
            {a.editorial && <strong className="best-for">Best for: {a.editorial.bestFor}</strong>}
            <p>{a.description}</p>
            <div className="card-bottom">
              <span>{a.affiliate ? "Affiliate link" : "No affiliate link"}</span>
              <span>
                Read our take <ArrowUpRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
      {!items.length && (
        <div className="empty-state">
          <h3>No matching listings.</h3>
          <p>Try another category or pricing filter.</p>
        </div>
      )}
    </>
  );
}
export function Comparison({ listings }: { listings: Listing[] }) {
  const [selected, setSelected] = useState<string[]>(["", "", ""]);
  const choices = selected
    .map((s) => listings.find((a) => a.slug === s))
    .filter((a): a is Listing => Boolean(a));
  return (
    <>
      <div className="comparison-select">
        {selected.map((slug, i) => (
          <label key={i}>
            <span className="sr-only">Tool {i + 1}</span>
            <Select aria-label={`Tool ${i + 1}`} value={slug} onValueChange={value => { const next = [...selected]; next[i] = value; setSelected(next); if (next.filter(Boolean).length >= 2) track("comparison_created"); }} options={[{value: "", label: `Select tool ${i + 1}`}, ...listings.filter(a => !selected.includes(a.slug) || a.slug === slug).map(a => ({value: a.slug, label: a.name}))]} />
          </label>
        ))}
      </div>
      {choices.length ? (
        <div className="compare-table panel">
          <table>
            <thead>
              <tr>
                <th>Compare</th>
                {choices.map((a) => (
                  <th key={a.slug}>
                    <Link href={`/ai-tools/${a.slug}`}>{a.name} ↗</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Features", "features"],
                ["Pricing", "pricingDescription"],
                ["Free plan", "freePlan"],
                ["Platforms", "platforms"],
                ["Best for", "useCases"],
                ["Limitations", "limitations"],
              ].map(([label, key]) => (
                <tr key={key}>
                  <th>{label}</th>
                  {choices.map((a) => (
                    <td key={a.slug}>
                      {Array.isArray(a[key as keyof Listing])
                        ? (a[key as keyof Listing] as string[]).join(" · ")
                        : String(a[key as keyof Listing])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <Sparkles />
          <h3>Good choices start side by side.</h3>
          <p>
            Select up to three tools to compare their features, limitations, and
            plan information.
          </p>
        </div>
      )}
    </>
  );
}
