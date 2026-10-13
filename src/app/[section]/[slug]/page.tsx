import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageHeading } from "@/components/page-heading";
import { ContentActions } from "@/components/content-actions";
import { getContent } from "@/lib/catalog";
import { EmailForm } from "@/components/forms";
import { sectionInfo } from "@/lib/content";
type Props = { params: Promise<{ section: string; slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props) {
  const { section, slug } = await params;
  const item = (await getContent(section)).find((c) => c.slug === slug);
  return {
    title: item?.seoTitle || item?.title || "Resource not found",
    description: item?.seoDescription || item?.description,
    alternates: { canonical: `/${section}/${slug}` },
  };
}
export default async function Page({ params }: Props) {
  const { section, slug } = await params;
  if (!sectionInfo[section]) notFound();
  const item = (await getContent(section)).find((c) => c.slug === slug);
  if (!item) notFound();
  return (
    <>
      <PageHeading
        title={item.title}
        description={item.description}
        eyebrow={item.category.toUpperCase()}
        parent={[section, `/${section}`]}
      />
      <div className="container page-body article-layout">
        <div>
          <ContentActions body={item.body} slug={slug} />
          {item.assetPath && (
            <a
              className="button primary small"
              href={`/api/resources/${slug}/download`}
              download
            >
              Download PDF ↗
            </a>
          )}
          {item.emailCapture && item.assetPath && (
            <EmailForm resourceSlug={slug} />
          )}
          <article className="prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {item.body}
            </ReactMarkdown>
          </article>
        </div>
        <aside className="article-sidebar panel">
          <span className="eyebrow">KEEP BUILDING</span>
          <h3>Your free AI toolkit.</h3>
          <p>
            Prompts, proposals, content plans, and workflows in one practical
            PDF.
          </p>
          <Link href="/toolkit" className="button primary small">
            Get the toolkit ↗
          </Link>
        </aside>
      </div>
    </>
  );
}
