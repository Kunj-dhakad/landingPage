"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container section empty-state">
      <h1>Something needs another try.</h1>
      <p>
        We couldn&apos;t load this page. Please retry, or return to the
        homepage.
      </p>
      <button className="button primary" onClick={reset}>
        Try again
      </button>{" "}
      <Link className="button secondary" href="/">
        Go home
      </Link>
    </div>
  );
}
