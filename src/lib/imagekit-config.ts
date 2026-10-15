// Public delivery endpoint for the assets already published in media-assets.json.
// Rendering these assets never needs the private upload key.
export const publicImageKitEndpoint = "https://ik.imagekit.io/0y2jm8mid";

export function imageKitEndpoint(value = process.env.IMAGEKIT_URL_ENDPOINT || publicImageKitEndpoint) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "ik.imagekit.io" || url.username || url.password || url.search || url.hash || url.port) return null;
    url.pathname = url.pathname.replace(/\/+$/, "");
    return url.pathname === "/" ? null : url;
  } catch { return null; }
}
export function isImageKitAsset(value: string) {
  const endpoint = imageKitEndpoint();
  if (!endpoint) return false;
  try {
    const url = new URL(value);
    return !url.username && !url.password && url.origin === endpoint.origin && url.pathname.startsWith(`${endpoint.pathname}/`);
  } catch { return false; }
}
