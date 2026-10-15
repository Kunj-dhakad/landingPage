import { ResourceLibrary } from "@/components/resource-library";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { getContent } from "@/lib/catalog";
import { sectionInfo } from "@/lib/content";
import { ContactForm } from "@/components/forms";
const legal: Record<
  string,
  { title: string; crumb: string; paragraphs: string[] }
> = {
  about: {
    title: "Better tools for meaningful work.",
    crumb: "About",
    paragraphs: [
      "NavoNixx is a practical workspace for freelancers, creators, solopreneurs, and growing businesses. Our aim is simple: make useful tools accessible and everyday work easier.",
      "Our browser utilities are free and work without an account. We share prompts, templates, and workflows that you can adapt to your own process.",
      "Software recommendations are separate from our free tools. We label affiliate relationships, explain limitations, and avoid invented ratings, testimonials, or income claims.",
    ],
  },
  terms: {
    title: "Terms of use",
    crumb: "Terms",
    paragraphs: [
      "Use NavoNixx responsibly and only with content you have permission to process. Do not attempt unauthorized access, automated abuse, or attacks against our services.",
      "Tools and educational resources are provided as general utilities. Review outputs before use. Calculators are planning aids and do not replace qualified financial, tax, or legal advice.",
      "Third-party services have their own terms, privacy practices, availability, and pricing. Verify these directly before purchasing. Our affiliate disclosure explains how recommendations may be monetized.",
      "To request assistance or discuss your data, use our contact form.",
    ],
  },
  "affiliate-disclosure": {
    title: "Clear recommendations. Transparent relationships.",
    crumb: "Affiliate disclosure",
    paragraphs: [
      "NavoNixx may earn a commission when you purchase through a clearly marked affiliate link, at no additional cost to you.",
      "Affiliate listings are labeled. We do not invent user ratings, testimonials, pricing, or guarantees. Check the official provider website for current features, prices, usage limits, and refund terms.",
      "Links go through a server-controlled destination looked up from our database. Click reporting respects your optional analytics consent.",
      "Our free browser tools remain free regardless of whether you use an affiliate recommendation.",
    ],
  },
};
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ section: string }> };
export async function generateMetadata({ params }: Props) {
  const { section } = await params;
  const info = sectionInfo[section];
  return {
    title: info?.seoTitle || legal[section]?.crumb || "Contact NavoNixx",
    description: info?.seoDescription || legal[section]?.title,
    alternates: { canonical: `/${section}` },
  };
}
export default async function Page({ params }: Props) {
  const { section } = await params;
  if (section === "contact")
    return (
      <>
        <PageHeading
          title="Let's make useful things happen."
          description="A question, a tool idea, or feedback? We'd love to hear from you."
          eyebrow="GET IN TOUCH"
          crumb="Contact"
        />
        <div className="container page-body">
          <ContactForm />
        </div>
      </>
    );
  if (legal[section])
    return (
      <>
        <PageHeading
          title={legal[section].title}
          description="Smarter Tools. Better Work. Bigger Growth."
          eyebrow="NAVONIXX"
          crumb={legal[section].crumb}
        />
        <div className="container page-body prose" style={{ maxWidth: 850 }}>
          {legal[section].paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <Link href="/contact">Contact us</Link>
        </div>
      </>
    );
  const info = sectionInfo[section];
  if (!info) notFound();
  const items = await getContent(section === "resources" ? undefined : section);
  return (
    <>
      <PageHeading
        title={info.title}
        description={info.description}
        eyebrow={info.eyebrow}
        crumb={info.name}
      />
      <div className="container page-body">
        {section === "prompts" || section === "templates" ? (
          <ResourceLibrary key={section} items={items} kind={section} />
        ) : (
          <div className="resource-grid">
            {items.map((item, i) => (
              <Link
                className="resource-card panel"
                key={`${item.kind}-${item.slug}`}
                href={
                  item.kind === "toolkit"
                    ? "/toolkit"
                    : `/${item.kind}/${item.slug}`
                }
              >
                {item.coverUrl ? (
                  <Image
                    className="resource-cover"
                    src={item.coverUrl}
                    alt=""
                    width={400}
                    height={175}
                  />
                ) : (
                  <div className={`article-art article-${i % 3}`}>
                    <BookOpen size={45} />
                    <span>{item.category}</span>
                  </div>
                )}
                <span className="eyebrow">{item.kind}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="text-link">
                  Explore resource <ArrowUpRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        )}
        {!items.length && section !== "prompts" && section !== "templates" && (
          <div className="empty-state">
            <h3>New resources are on the way.</h3>
            <p>Explore our free tools while this collection grows.</p>
            <Link className="button primary" href="/free-tools">
              Explore free tools
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
