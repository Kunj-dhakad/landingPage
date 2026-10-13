"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, ArrowUpRight, Sparkles } from "lucide-react";
import { track } from "@/lib/events";
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
          <select
            id="ai-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="ai-pricing">
            Pricing model
          </label>
          <select
            id="ai-pricing"
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
          >
            {["All plans", "FREE", "FREEMIUM", "PAID", "UNVERIFIED"].map(
              (c) => (
                <option key={c}>{c}</option>
              ),
            )}
          </select>
          <label className="sr-only" htmlFor="ai-use-case">
            Use case
          </label>
          <select
            id="ai-use-case"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
          >
            {useCases.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
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
              <span className="tool-icon lavender">
                {a.logoUrl ? (
                  <Image src={a.logoUrl} alt="" width={25} height={25} />
                ) : (
                  <Sparkles size={22} />
                )}
              </span>
              <span className="pill">
                {a.pricingModel === "UNVERIFIED"
                  ? "Pricing unverified"
                  : a.pricingModel.toLowerCase()}
              </span>
            </div>
            <span className="micro">
              {a.affiliate ? "AFFILIATE LISTING" : "NO AFFILIATE RELATIONSHIP"}
            </span>
            <h3>{a.name}</h3>
            <p>{a.description}</p>
            <div className="card-bottom">
              <span>{a.category}</span>
              <span>
                Explore tool <ArrowUpRight size={14} />
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
            <select
              value={slug}
              onChange={(e) => {
                const next = [...selected];
                next[i] = e.target.value;
                setSelected(next);
                if (next.filter(Boolean).length >= 2)
                  track("comparison_created");
              }}
            >
              <option value="">Select tool {i + 1}</option>
              {listings
                .filter((a) => !selected.includes(a.slug) || a.slug === slug)
                .map((a) => (
                  <option value={a.slug} key={a.slug}>
                    {a.name}
                  </option>
                ))}
            </select>
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
