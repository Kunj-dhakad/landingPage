# ImageKit uploads

Local `.env` already contains:

```dotenv
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/0y2jm8mid"
IMAGEKIT_PRIVATE_KEY=""
IMAGEKIT_UPLOAD_FOLDER="/navonixx"
```

Fill `IMAGEKIT_PRIVATE_KEY` with a private API key from ImageKit Dashboard → Developer options → API keys. It needs upload/write permission. A public API key is not required because the existing authenticated admin upload endpoint sends files from the server. Do not add `NEXT_PUBLIC_` to the private key variable.

Restart `npm run dev` after filling the key. In the admin editor, upload a PNG, JPEG, WEBP or PDF (up to 5 MB), then save the record. Files are stored in the `/navonixx` folder with unique generated names. Existing format/content validation, admin authorization, origin checks and rate limits remain in place. The returned asset URL is restricted to this account's configured URL endpoint, and Next.js image loading permits this account's path.

The optional Vercel Blob configuration remains supported when no ImageKit variables are configured. Existing Blob URLs remain valid if their configured host is retained.

`.env` is ignored by Git. `.env.example` uses a dummy account endpoint and an empty private key. For deployment, configure the same ImageKit variables in the hosting environment and rebuild. Credentials are not exposed to the browser, logged, or included in API errors.

Verification: tests cover request authentication, multipart fields, allowed account paths, missing credentials, invalid folders, provider failures and response validation using mocked network calls. Real upload cannot be verified until the private key is filled in.

References: [ImageKit API keys](https://imagekit.io/docs/api-keys), [ImageKit upload example](https://imagekit.io/docs/dam/custom-metadata).

## Existing site assets migrated

20 existing public media files are organized under `/navonixx/site/` for common NavoNixx assets (4 files) and `/navonixx/projects/comic-videos-ai/` for project-specific images/videos (16 files). The site branch contains branding and toolkit documents; the project branch contains image branding, previews, product images, backgrounds, steps and demo videos.

The public mapping is tracked in `src/config/media-assets.json`. Source components and database-backed media reads use `assetUrl()` to resolve existing local paths, so no database records needed rewriting. The 20 migrated local media files were subsequently removed at the user's request; media is served from ImageKit. Scripts and environment files were not uploaded.

To upload new or changed existing files later, run `node scripts/upload-site-assets.mjs --apply`. The script uses hashes and the manifest to reuse completed uploads.

All 20 CDN assets were checked using HTTP HEAD. The desktop/mobile logo, favicon and ImageKit-backed toolkit download were verified in Chromium. See `docs/imagekit-assets-verification.json`.

The account rejected direct moves with ?Versions Limit Exceeded.? Files were uploaded into their requested destinations instead. After explicit user approval, all 20 old cloud copies and all 20 corresponding local media files were deleted. The organized destination assets remain. New uploads through the bulk script use the same project/site classification.

Cleanup completed after source hash and CDN-content verification. The regex worker is served by `src/app/regex-worker.js/route.ts` at the original `/regex-worker.js` URL. `public/` is empty. Asset manifests, source code, and `.env` are retained. Regenerating the toolkit manually creates a new local PDF; upload that version before using it as a replacement.
