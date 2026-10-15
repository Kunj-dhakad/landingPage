import { PageHeading } from "@/components/page-heading";
import Link from "next/link";
export const metadata = {
  title: "Privacy policy",
  alternates: { canonical: "/privacy" },
};
export default function Page() {
  return (
    <>
      <PageHeading
        title="Your work stays yours."
        crumb="Privacy"
        description="Clear choices, minimal data, and tools that work on your device."
        eyebrow="PRIVACY AT NAVONIXX"
      />
      <article className="container page-body prose" style={{ maxWidth: 850 }}>
        <h2>Tool inputs</h2>
        <p>
          Our browser tools process your text, calculations, passwords, and
          results locally. We do not send these inputs to our server or include
          them in analytics. Text files are created on your device.
        </p>
        <h2>Basic activity counts</h2>
        <p>
          We record page paths, button and link clicks, and tool interaction types
          to understand which features are useful. Basic activity records do not
          contain visitor or session identifiers, tracking cookies, raw IP addresses,
          form values, or URL query parameters. They cannot tell us how many distinct
          people visited. We respect Do Not Track, Global Privacy Control, and your
          essential-only preference.
        </p>
        <h2>Optional analytics</h2>
        <p>
          With your permission, we record page paths, tool names, interaction
          types, campaign parameters, device categories, and approximate session
          activity. First-party cookies provide an anonymous visitor and session
          identifier. Counts are limited by consent and tracking availability;
          session duration and unique visitors are estimates.
        </p>
        <p>
          We do not use fingerprinting, cross-site identity resolution, or link
          browsing histories to email addresses. We do not store raw IP
          addresses in analytics. A short-lived keyed hash may be used for abuse
          prevention. Country-level information is available only when provided
          by our deployment host.
        </p>
        <h2>Your choices</h2>
        <p>
          Choose essential-only access to stop basic activity counts and decline
          optional analytics. Use
          Privacy preferences in the footer to change your choice. Declining
          removes identification cookies and deletes the associated visitor
          record and sessions when the database is connected. Unidentified
          aggregate event records may remain until retention cleanup.
        </p>
        <h2>Email and contact forms</h2>
        <p>
          We store the details needed to fulfill your request. Download delivery
          and optional promotional consent are separate. Marketing updates
          require email confirmation. Each consent choice is recorded with a
          notice version and time. You can{" "}
          <Link href="/unsubscribe">unsubscribe here</Link>.
        </p>
        <h2>Retention, export, and deletion</h2>
        <p>
          Analytics retention defaults to 90 days and can be configured by the
          operator. A retention job must be scheduled for automatic cleanup.
          Contact us to request an export or deletion of your lead and consent
          data. Lead deletion removes linked consents, verification tokens, and
          email activity.
        </p>
        <h2>Third-party services</h2>
        <p>
          When configured, the platform uses managed PostgreSQL for persistence
          and Resend for email. External software websites operate under their
          own policies. Our hosting provider may keep infrastructure and
          security logs under its own policy.
        </p>
        <h2>Before public launch</h2>
        <p>
          The site operator must configure contact details, providers, retention
          scheduling, and any location-specific notices. This implementation
          policy describes the platform’s behavior; the operator should review
          it for their business.
        </p>
        <p>
          <Link href="/contact">Contact NavoNixx</Link> for privacy questions.
        </p>
      </article>
    </>
  );
}
