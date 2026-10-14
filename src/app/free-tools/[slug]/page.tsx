import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolRunner, ToolCard, ToolHeader } from "@/components/tool-ui";
import { getTools, getAffiliates } from "@/lib/catalog";
import { categoryPicks } from "@/lib/affiliate-content";
import { databaseReady } from "@/lib/db";
import { ToolMonogram, VisitButton } from "@/components/funnel";
import { StructuredData } from "@/components/structured-data";
type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tool = (await getTools()).find((t) => t.slug === slug);
  return {
    title:
      tool?.seoTitle || (tool ? `${tool.name} – Free Online Tool` : "Tool not found"),
    description: tool?.seoDescription || tool?.description,
    alternates: { canonical: `/free-tools/${slug}` },
  };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [tools, affiliates] = await Promise.all([getTools(), getAffiliates()]);
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();
  const picks = (categoryPicks[tool.category] ?? [])
    .map((s) => affiliates.find((a) => a.slug === s))
    .filter((a) => a !== undefined);
  const redirect = databaseReady();
  const related = tools
    .filter((t) => t.category === tool.category && t.slug !== slug)
    .slice(0, 3);
  return (
    <>
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          description: tool.description,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web browser",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <div className="container tr-page">
        <ToolHeader tool={tool} />
      </div>
      <div className="container page-body tool-page-body">
        <ToolRunner key={tool.slug} tool={tool} />
        <div className="tool-guide">
          <div>
            <h2>Make it work for you.</h2>
            <ol>
              <li>
                Enter your {tool.category === "Business" ? "figures" : "input"}{" "}
                in the labeled fields. The prefilled example gives you a
                starting point.
              </li>
              <li>
                Your result updates as you type. Check any validation messages
                that appear.
              </li>
              <li>
                Copy or download the result. Reset restores the example for
                another try.
              </li>
            </ol>
            <p>
              Example:{" "}
              {tool.fields
                .map((f) => `${f.label}: ${f.value}`)
                .join(" · ")
                .slice(0, 300)}
            </p>
          </div>
          <div>
            <h2>A few useful answers.</h2>
            <details>
              <summary>Is this tool actually free?</summary>
              <p>
                Yes. There is no account, subscription, or email gate. Toolkit
                and newsletter signups are optional.
              </p>
            </details>
            <details>
              <summary>Where does my input go?</summary>
              <p>
                Processing happens in your browser. Optional analytics record
                tool names and usage events, never your input or output.
              </p>
            </details>
            <details>
              <summary>Can I use this result for my work?</summary>
              <p>
                Yes. Review the result for your situation. Calculators support
                planning, and platform length checks are guidelines rather than
                guaranteed display sizes.
              </p>
            </details>
          </div>
        </div>
        {picks.length > 0 && (
          <section className="tool-picks panel">
            <div>
              <span className="eyebrow">GO FURTHER WITH AI</span>
              <h2>Doing a lot of {tool.category.toLowerCase()} work?</h2>
              <p>
                This free tool handles the quick job. For bigger, everyday
                {" "}{tool.category.toLowerCase()} tasks, these are the AI tools
                we would try first.
              </p>
            </div>
            <div className="tool-picks-list">
              {picks.map((a) => (
                <div key={a.slug} className="tool-pick">
                  <ToolMonogram name={a.name} logoUrl={a.logoUrl} size={42} />
                  <div>
                    <Link href={`/ai-tools/${a.slug}`}>
                      <strong>{a.name}</strong>
                    </Link>
                    <span>{a.editorial?.bestFor ?? a.description}</span>
                  </div>
                  <VisitButton
                    listing={a}
                    redirect={redirect}
                    className="button secondary small"
                    label="Try it"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
        <div className="section-heading">
          <h2>Keep the momentum.</h2>
          <Link href="/toolkit" className="text-link">
            Explore the free toolkit ↗
          </Link>
        </div>
        <div className="tool-grid">
          {related.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </div>
    </>
  );
}
