import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock3 } from "lucide-react";
import { assetUrl } from "@/lib/media-assets";
import type { ContentItem } from "@/lib/content";

const illustrations: Record<string, string> = {
  "price-your-first-project": "pricing-page-copy",
  "better-ai-prompts": "project-brief-template",
  "best-free-ai-tools-for-freelancers": "decision-matrix",
  "chatgpt-vs-claude-for-freelancers": "brief-review",
  "zapier-vs-make": "weekly-planning",
  "choose-ai-tools-without-wasting-money": "project-scoping",
  "freelancer-website-checklist": "portfolio-case-study",
  "gst-invoice-guide-for-freelancers": "payment-reminder-template",
};

export function GuideCard({ item }: { item: ContentItem }) {
  const minutes = Math.max(
    1,
    Math.ceil(item.body.trim().split(/\s+/).length / 200),
  );
  const image =
    item.coverUrl ||
    assetUrl(
      `/images/resources/${illustrations[item.slug] || "learn-new-skill"}.webp`,
    );
  return (
    <Link
      className="resource-card guide-card"
      href={`/${item.kind}/${item.slug}`}
    >
      <div className="guide-card-art">
        <Image
          src={image}
          alt=""
          width={768}
          height={512}
          sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 380px"
        />
        <span className="guide-card-badge">
          <BookOpen size={12} /> GUIDE
        </span>
      </div>
      <div className="guide-card-body">
        <div className="guide-card-meta">
          <span>{item.category}</span>
          <span>
            <Clock3 size={12} /> {minutes} min read
          </span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="guide-card-footer">
          <span>Read guide</span>
          <ArrowUpRight size={17} />
        </div>
      </div>
    </Link>
  );
}
