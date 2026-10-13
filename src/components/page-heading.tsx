import Link from "next/link";
import { ChevronRight } from "lucide-react";
export function PageHeading({
  title,
  description,
  eyebrow = "YOUR SMARTER WORKSPACE",
  parent,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  parent?: [string, string];
}) {
  return (
    <section className="page-hero">
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
          <span>{title}</span>
        </div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
