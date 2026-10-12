# Comic Videos AI affiliate landing page

Next.js 16.4.0 App Router, React 19.3.0, TypeScript, Tailwind CSS, Motion, and Lucide. Exact resolved dependencies are recorded in package-lock.json.

## Run

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production checks: `npm run typecheck` and `npm run build`. Run production locally with `npm start`.

The homepage currently sends visitors straight to the vendor sales offer through the configured affiliate URL using a server-side 307 redirect. The landing page source is retained. Remove the `/` rule in `next.config.ts` to display it again. Redeploy after changing the redirect or its environment variable. The existing landing-page browser verification script applies when this redirect is disabled.

## Configure and deploy to Vercel

Import this folder as a Next.js project in Vercel. Default build command: `npm run build`; no custom output directory is needed.

- All purchase buttons default to your supplied affiliate URL: `https://jvz1.com/c/3615703/454633/`. Set `NEXT_PUBLIC_AFFILIATE_URL` only to override it.
- Set `NEXT_PUBLIC_SITE_URL` to the production origin, e.g. your actual Vercel domain. Rebuild after environment changes.
- All purchase buttons read the single `src/config/site.ts` configuration. Media, product image paths, verified price, and reference links are configured there too.
- Recheck current pricing and terms before publishing. Premium was listed at $36.95 on October 9, 2026; we do not advertise coupons, countdowns, or guaranteed results.

## Media and content

See [docs/RESEARCH.md](docs/RESEARCH.md) and [docs/MEDIA.md](docs/MEDIA.md) for evidence, provenance, promotional-use scope, and replacement instructions. Video files load on user interaction with native play/pause, volume/mute, seeking, and fullscreen controls. Watch Demo plays a local sample in a dismissible dialog. All four gallery samples are hosted locally. The official Vimeo walkthrough is click-to-load with a direct link if Vimeo requires access verification. Images use Next.js Image; below-fold images are lazy-loaded.

No user data collection, analytics, fabricated testimonials, fake product UI, or signup backend is included. Privacy and affiliate disclaimer routes are provided; tailor their operator details if you add tracking or forms.

