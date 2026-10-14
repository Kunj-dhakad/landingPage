import media from "@/config/media-assets.json";

/** Uploaded assets use ImageKit; unmigrated paths retain their local fallback. */
export function assetUrl(path: string) {
  return (media as Record<string, { url: string }>)[path]?.url || path;
}
