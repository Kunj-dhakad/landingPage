import { PageHeading } from "@/components/page-heading";
import { EmailSettings } from "@/components/email-settings";
export const metadata = {
  title: "Confirm your subscription",
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <>
      <PageHeading
        title="One small step. Useful updates."
        crumb="Verify email"
        description="Confirm that you'd like to receive optional NavoNixx resources and updates. You can unsubscribe anytime."
      />
      <div className="container page-body">
        {token ? (
          <EmailSettings purpose="SUBSCRIBE" token={token} />
        ) : (
          <p>A valid confirmation link is required. Check your email.</p>
        )}
      </div>
    </>
  );
}
