export function mediaFolder(local) {
  if (local === "/images/navonixx-logo.png" || local === "/favicon.svg") return "site/branding/logos";
  if (local.startsWith("/images/navonixx-")) return "site/images/banners";
  if (local === "/og.svg") return "site/branding/social";
  if (local.startsWith("/downloads/")) return "site/documents/toolkits";
  const project = "projects/comic-videos-ai";
  if (local.startsWith("/videos/")) return `${project}/videos/demos`;
  if (/logo/.test(local)) return `${project}/images/branding`;
  if (/step-/.test(local)) return `${project}/images/steps`;
  if (/scene-(astro|cinema|night)/.test(local)) return `${project}/images/backgrounds`;
  if (/baby-|comic-/.test(local)) return `${project}/images/previews`;
  return `${project}/images/product`;
}
