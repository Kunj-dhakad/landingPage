# Media provenance and launch checklist

Vendor-provided media is used only to promote Comic Videos AI. The public JV page describes a "DFY Affiliate Promo Kit" with "Ad Creatives, Bonus Graphics, Demo Videos." The linked JV document supplies the sales video and app demo. This is the promotional-use basis; no broader commercial media license is asserted. Join/obtain approval for the vendor affiliate program and review its current terms before launching a campaign. Do not redistribute assets as a separate collection or use them for unrelated products.

Images are downloaded from `https://sales.comicvideosai.com/jv/images/` using the same filenames in `public/images/`: official promotional scene illustrations, product mockup, three workflow illustrations, product cover, logo, and four sample posters. They are not invented dashboard screenshots. No third-party stock photography or scraped customer social-account images were used.

Locally downloaded videos:

- `public/videos/comic-02.mp4`: https://d1f5xajkt26gbd.cloudfront.net/comicvideosai/mobile/comic-02.mp4 (lightweight vendor version).
- `public/videos/baby-06.mp4`: https://d1f5xajkt26gbd.cloudfront.net/comicvideosai/mobile/baby-06.mp4 (2.8 MB).

Two additional gallery videos use exact public URLs found in the vendor player script, with local poster images. They load only after play. A visible error state links to the official showcase if playback fails. The app walkthrough uses the officially linked Vimeo video ID 1232486302 and loads its iframe only after clicking play; no Vimeo download or restrictions were bypassed.

Manual items:

1. The owner-supplied affiliate URL `https://jvz1.com/c/3615703/454633/` is configured for all purchase buttons. `NEXT_PUBLIC_AFFILIATE_URL` can override it.
2. Supply the production origin in `NEXT_PUBLIC_SITE_URL` for metadata.
3. No verified reusable dashboard screenshot was identified. The official mockup and labeled workflow illustrations are used instead. If adding a dashboard screenshot later, obtain it from the vendor's authorized promo kit and configure the local path in `src/config/site.ts`.
4. Recheck price, feature limits, affiliate approval, and vendor refund terms before launch.

No manual demo video replacement is required for the included samples. To replace any revoked/unavailable media, update `src/config/site.ts`. `VideoPlayer` exposes an honest unavailable state; do not substitute invented media URLs.


Excluded: comic/1vid.mp4 and its poster show a recognizable third-party superhero. Those files were removed; no permission for that character was established. The hero uses the vendor's cat-yoga comic sample instead. The wide gallery card frames this original portrait sample in a 16:9 player; it is not a claim about native export dimensions.

Playback repair: Watch Demo opens a native dialog and plays the local product sample. Whole poster surfaces are clickable; playing another sample pauses the previous one. Vimeo currently presents an access challenge in verification, so the local comic sample is the default demonstration and the walkthrough includes an external fallback link. The affiliate redirect was verified to resolve to the vendor bundle offer; the landing page therefore directs visitors to current pricing rather than presenting the old Premium price.
