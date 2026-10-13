# NavoNixx

A Next.js 16 / React 19 productivity platform with 35 free browser tools, original learning resources, a useful downloadable PDF, a transparent AI tools directory, and PostgreSQL-backed administration.

## Run locally

Node.js 22+ and PostgreSQL 16+ are recommended. Copy `.env.example` to `.env` and fill in your database URLs and authentication secret. Never commit credentials.

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open http://localhost:3000. Public tools and editorial seed content work without external configuration. With `DATABASE_URL` configured, content and listings come from PostgreSQL. Missing backend configuration produces an honest unavailable/setup response; no leads, email deliveries, or admin statistics are simulated.

Set `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD` before seeding, then sign in at `/admin/login`. The seed does not overwrite existing passwords or content. Remove seed credentials from production runtime after provisioning. The supported roles are `ADMIN` and `EDITOR`; editors manage content/resources, while administrators manage leads, analytics, settings, and accounts.

## Included functionality

- 35 independent writing, development, business, and marketing utilities; validated inputs, reset, copying, text exports, printable invoices, safe Markdown, and an isolated bounded regex worker.
- A searchable tool directory; prompts, templates, workflows, journal articles, resources, toolkit, about/contact, legal pages, unsubscribe and verification flows.
- A generated four-page AI Business Growth Toolkit PDF with 10 prompts, proposal/email templates, a seven-day content plan, automation recipes, and a freelancer checklist. Direct downloads do not require email.
- Three original AI listings with official source links, comparisons, transparent plan information, and no invented ratings. Administrators can add approved affiliate destinations and publish/unpublish listings.
- Persistent leads, normalized email deduplication, recorded consent, separate transactional delivery, single-use subscription confirmation and unsubscribe tokens, delivery acceptance/failure states, and contact submissions.
- Auth.js/NextAuth stable credentials authentication, scrypt password hashes, encrypted HTTP-only session cookies, revocable PostgreSQL sessions, server-side role checks, CSRF/origin protection, database-backed rate limits, and audit logs.
- Consented first-party visitor/session events, batched sanitized ingestion, ID deduplication, coarse devices/country, UTM attribution/referrer domain, estimated durations, outbound clicks, resource download counts, and configurable retention.
- Real database admin overview/charts, visitors, lead search/filter/pagination/export/deletion, content Markdown CRUD/preview, free-tool metadata, affiliate CRUD, campaigns, email activity, contacts, settings, administrators, and audit history.
- Optional persistent PDF/image uploads using Vercel Blob, with size limits, MIME/signature checks, authenticated access, and an approved asset host.
- Shared design tokens, Geist fonts hosted locally, responsive navigation, light/dark modes, keyboard focus, reduced-motion support, page/error/loading states, canonical metadata, social preview image, sitemap, robots, and structured data.

## Verify

See [the verification record](docs/VALIDATION.md) for completed checks, screenshots, and external setup limits.

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:integration
```

`test:integration` starts an isolated real PostgreSQL cluster and the production application on loopback ports 55439 and 3100. It applies migrations, seeds an ephemeral administrator, runs persistence/API tests, then checks all 35 tools and responsive/admin flows in Playwright. It stops both processes afterward. Test database files remain in ignored `.runtime/`; no existing database is modified. Playwright requires its Chromium runtime (`npx playwright install chromium` if absent).

`npm run test:e2e` checks an already running server at `TEST_BASE_URL` (default http://localhost:3000). Do not run admin test scenarios against a production database. `npm run toolkit:generate` rebuilds the actual downloadable PDF from the original source content.

## Project structure

```text
src/app/                 Public routes, admin routes, REST APIs, SEO
src/components/          Shared UI, interactive tools, forms, charts, editor
src/lib/tools.ts         Executable tool registry and pure calculations
src/lib/content.ts       Original resources used for editorial seed content
src/lib/affiliate-content.ts  Source-linked directory seed content
src/lib/                 Persistence, authorization, validation, email, analytics
src/auth.ts              Maintained authentication configuration
prisma/schema.prisma     PostgreSQL relational models
prisma/migrations/       Initial SQL migration and migration lock
prisma/seed.ts           Idempotent content/admin seed
public/downloads/        Actual toolkit PDF
scripts/                 PDF generation and real PostgreSQL/browser verification
tests/                   Calculation/security and persistence integration tests
docs/                    Architecture and deployment instructions
```

The generated Prisma client lives in `node_modules/@navonixx/prisma-client` and is produced by `prisma generate`. It is externalized from server bundles to avoid tracing unrelated project files. Run generation after changing dependencies or the schema. Existing Comic Videos AI media/source files are retained for review; public NavoNixx pages use the new application.

## Production setup

See [deployment instructions](docs/DEPLOYMENT.md) and [architecture](docs/ARCHITECTURE.md). Configure managed PostgreSQL, a verified Resend sender, the final site origin, authentication secret, optional Blob storage, and retention scheduling before launch. Actual Resend delivery and Blob uploads require your service credentials and must be verified in your account. Email states distinguish provider acceptance from confirmed delivery; no delivery webhook is claimed.

The implementation does not claim legal compliance, guaranteed Lighthouse scores, external email delivery, or a public deployment without checking those in the target environment. Review the operator's contact/privacy/terms information before publishing. Analytics use consented populations and estimate visitor/session activity; ratios are labeled accurately and do not imply exact identity-level attribution.
