# Verification record

Verified on 13 October 2026 using Windows, Node.js 24.18, installed Playwright Chromium, and an isolated real PostgreSQL cluster.

| Check | Result |
| --- | --- |
| TypeScript strict check | Passed |
| ESLint, zero warnings | Passed |
| Critical unit tests | 14 passed |
| Real PostgreSQL integration tests | 8 passed |
| Production build | Passed |
| Production dependency audit | Zero reported vulnerabilities at verification time |
| Stable version checks | Next.js 16.4.0 and React 19.3.0 |
| All 35 tool default examples in Chromium | Passed |
| Invalid JSON, safe Markdown, and Open Graph input-edit regression | Passed |
| Public routes, AI comparisons, and actual PDF download | Passed |
| Responsive layouts at 320, 390, and 768 pixels; desktop at 1440 | Passed |
| Mobile navigation, light/dark modes, browser runtime errors | Passed |
| Admin login, real metrics, content create/edit/delete, CSV export, logout | Passed |
| Editor role restrictions and deleted-account session revocation | Passed |
| Isolated test server/database teardown | Passed |

Database tests verify authorization, input/origin validation, normalized lead deduplication, separate consent, event rejection/deduplication, persistent PDF download records, server-controlled redirects, single-use subscription verification, unsubscribe revocation, and India-time analytics buckets including returning visitors. Email adapter acceptance/error states were verified against PostgreSQL with a simulated provider, not a live Resend account.

The browser checks inspect semantic headings and labeled forms, responsive overflow, navigation, and runtime stability. They are not a claim of a complete accessibility audit or a measured Lighthouse score. Next.js may return HTTP 200 for streamed not-found responses; deleted content is checked against its actual not-found view.

Screenshots from the verified test application:

- [Desktop homepage](screenshots/navonixx-desktop.png)
- [Mobile homepage](screenshots/navonixx-mobile.png)
- [Mobile dark theme](screenshots/navonixx-mobile-dark.png)
- [Authenticated admin overview](screenshots/navonixx-admin.png)

## External setup still required

Production PostgreSQL connection/pooling, live Resend sender/delivery verification, optional Vercel Blob uploads, retention scheduling, operator-specific legal/contact information, and public Vercel deployment require configuration in the target environment. No external email delivery, Blob upload, public deployment, legal compliance, or performance score is claimed by these local tests.
