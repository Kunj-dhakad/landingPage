import Link from "next/link";
import Image from "next/image";
import { assetUrl } from "@/lib/media-assets";
import { ChevronRight } from "lucide-react";
export function PageHeading({
  title,
  description,
  eyebrow = "YOUR SMARTER WORKSPACE",
  parent,
  crumb,
  compact = false,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  parent?: [string, string];
  /** Short breadcrumb label; defaults to the title. */
  crumb?: string;
  compact?: boolean;
}) {
  return (
    <section className={`page-hero${compact ? " tool-page-hero" : ""}`}>
      <div className="container">
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={12} />
          {parent && (
            <>
              <Link href={parent[1]}>{parent[0]}</Link>
              <ChevronRight size={12} />
            </>
          )}
          <span aria-current="page">{crumb ?? title}</span>
        </div>
        <div className="page-heading-banner">
          <Image className="page-heading-art" src={assetUrl("/images/navonixx-tools-banner.png")} alt="" width={720} height={240} sizes="(max-width: 600px) 240px, 480px" />
          <div className="page-heading-copy">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
