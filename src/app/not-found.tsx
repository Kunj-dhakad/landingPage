import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container section empty-state">
      <span className="eyebrow">404 · A LITTLE DETOUR</span>
      <h1>Let&apos;s get you back on track.</h1>
      <p>
        This page doesn&apos;t exist, or the resource is no longer available.
      </p>
      <Link className="button primary" href="/free-tools">
        Explore free tools ↗
      </Link>
    </div>
  );
}
