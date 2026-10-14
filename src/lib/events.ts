import { createUUID } from "./browser-utils";
export const eventNames = [
  "page_view",
  "session_start",
  "tool_opened",
  "tool_used",
  "tool_completed",
  "copy_clicked",
  "download_clicked",
  "resource_viewed",
  "resource_downloaded",
  "email_form_viewed",
  "email_form_submitted",
  "email_verified",
  "newsletter_subscribed",
  "affiliate_tool_viewed",
  "affiliate_link_clicked",
  "comparison_created",
  "finder_completed",
  "offer_gate_opened",
  "offer_lead_captured",
  "search_performed",
  "category_selected",
  "contact_form_submitted",
] as const;
export type EventName = (typeof eventNames)[number];
type ClientEvent = {
  id: string;
  name: EventName;
  path: string;
  slug?: string;
  category?: string;
};
let queue: ClientEvent[] = [],
  timer: ReturnType<typeof setTimeout> | undefined;
let sending = Promise.resolve();
let attribution: Record<string, string> | undefined;
export function consentAccepted() {
  try {
    return (
      typeof window !== "undefined" &&
      localStorage.getItem("navonixx-consent") === "accepted"
    );
  } catch {
    return false;
  }
}
export function campaignContext() {
  return consentAccepted()
    ? { source: attribution?.source, campaign: attribution?.campaign }
    : {};
}
function flush() {
  clearTimeout(timer);
  timer = undefined;
  if (!consentAccepted()) {
    queue = [];
    return;
  }
  const events = queue.splice(0, 20);
  if (!events.length) return;
  sending = sending.then(async () => {
    if (!consentAccepted()) return;
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events, attribution }),
      keepalive: true,
    }).catch(() => {});
  });
  if (queue.length) timer = setTimeout(flush, 600);
}
export function track(name: EventName, slug?: string, category?: string) {
  if (!consentAccepted() || location.pathname.startsWith("/admin")) return;
  if (!attribution) {
    attribution = {};
    const params = new URLSearchParams(location.search);
    for (const key of ["source", "medium", "campaign", "content", "term"]) {
      const value = params.get("utm_" + key);
      if (value && /^[a-zA-Z0-9_. -]{1,100}$/.test(value))
        attribution[key] = value;
    }
    try {
      if (document.referrer)
        attribution.referrerDomain = new URL(document.referrer).hostname;
    } catch {
      /* Ignore malformed referrers. */
    }
  }
  queue.push({
    id: createUUID(),
    name,
    path: location.pathname,
    slug,
    category,
  });
  if (queue.length >= 20) flush();
  else if (!timer) timer = setTimeout(flush, 600);
}
if (typeof window !== "undefined") window.addEventListener("pagehide", flush);
