# Deploy NavoNixx on Vercel

1. Connect this Next.js repository to your Vercel project. Use Node 22+, framework preset Next.js, install command `npm ci`, and build command `npx prisma generate && npm run build`.
2. Provision a managed PostgreSQL database. Configure a pooled `DATABASE_URL` for runtime and an unpooled `DIRECT_URL` for migrations. Use TLS and the provider's connection-pooling guidance.
3. Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` to the exact final HTTPS origin. Generate and set `AUTH_SECRET`. Do not expose these server credentials through `NEXT_PUBLIC_*` variables.
4. Apply the reviewed migration from a secure workstation or CI stage: `npx prisma migrate deploy`. Do not use `migrate dev` or `db push` in production.
5. Set `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD` temporarily, then run `npx prisma db seed`. Remove the seed password from normal production runtime. The seed preserves existing records and passwords.
6. Configure `RESEND_API_KEY` and `EMAIL_FROM` using a verified sender domain. Submit a toolkit request, inspect Email Activity and your Resend dashboard, confirm receipt, test the separate marketing verification, and test unsubscribe. No provider integration is considered verified until these live checks pass.
7. For uploads, connect Vercel Blob and set `BLOB_READ_WRITE_TOKEN` plus the exact `BLOB_PUBLIC_HOST` (hostname only). Test an allowed PDF/image, an invalid signature, an oversized file, and an unapproved host. Without this service, the bundled toolkit and existing resources still work.
8. Configure retention automation. Set a random `CRON_SECRET` and schedule an authenticated GET to `/api/cron/retention` with `Authorization: Bearer <CRON_SECRET>`. Vercel Cron can supply that header when configured. The cron schedule is intentionally not enabled until you configure the service. Admin Settings also provides a manual retention action.
9. Review public contact details, legal/privacy notices, disclosures, and published listings. No affiliate commissions are claimed for the initial official listings. Add your actual approved affiliate URLs and label their relationship before publishing.
10. Run the checks from README and test the deployed origin, authentication, public tools, canonical URLs, PDF downloads, analytics consent, and database persistence. Measure Lighthouse/Core Web Vitals on the real deployment before claiming scores.

## Operational limits

The email adapter records provider acceptance and errors. It does not implement a delivery webhook or automatic retry queue. Verify provider logs for final delivery. Expiring verification links are single-use. Subscription signup is double opt-in; administrator status editing only permits unsubscribe, not forced subscription.

CSV exports are authorized, neutralize spreadsheet formula prefixes, and are bounded to 10,000 rows. Use a dedicated background export job if your audience exceeds that volume. Analytics aggregation uses bounded date ranges of at most one year. At substantially higher event volumes, introduce daily aggregate tables and partition/retention automation based on measured query plans.

Uploads are public resources; do not upload confidential documents. Blob access is optional. The browser's CSP blocks third-party scripts and frames. Inline scripts/styles remain enabled for Next.js; move to nonce-based CSP if your threat model requires it. Infrastructure logs and security controls are governed separately by your host.

The project retains the original media assets for review. They are not referenced by the new NavoNixx UI. Review hosting asset size if retaining all of them in production. Keep `.env`, `.runtime`, generated clients, and test credentials out of source control.
