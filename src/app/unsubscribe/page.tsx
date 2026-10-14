import { PageHeading } from "@/components/page-heading";
import { EmailSettings } from "@/components/email-settings";
export const metadata = {
  title: "Unsubscribe",
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
        title="Your inbox. Your choice."
        crumb="Unsubscribe"
        description="Use your secure link to unsubscribe, or request one below. Resource delivery never automatically enrolls you in updates."
      />
      <div className="container page-body">
        <EmailSettings purpose="UNSUBSCRIBE" token={token} />
      </div>
    </>
  );
}
