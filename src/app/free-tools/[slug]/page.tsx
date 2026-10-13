import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import { ToolRunner, ToolCard } from "@/components/tool-ui";
import { getTools } from "@/lib/catalog";
import { StructuredData } from "@/components/structured-data";
type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tool = (await getTools()).find((t) => t.slug === slug);
  return {
    title: tool?.seoTitle || tool?.name || "Tool not found",
    description: tool?.seoDescription || tool?.description,
    alternates: { canonical: `/free-tools/${slug}` },
  };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const tools = await getTools();
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();
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
      <PageHeading
        title={tool.name}
        description={tool.description}
        eyebrow={`${tool.category.toUpperCase()} · FREE FOREVER`}
        parent={["Free tools", "/free-tools"]}
      />
      <div className="container page-body">
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
                Select Run tool to calculate or transform your input. Check any
                validation messages.
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
