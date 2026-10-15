"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
export function ScrollReveals() {
  const path = usePathname();
  const seen = useRef(new WeakSet<Element>());
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animations = new Set<Animation>();
    const root = document.querySelector(".public-site");
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (
            !entry.target.isConnected ||
            entry.target.getBoundingClientRect().bottom <= 0
          )
            continue;
          // Individual translate preserves CSS hover transforms and never hides visible content.
          const animation = entry.target.animate(
            [{ translate: "0 10px" }, { translate: "0 0px" }],
            { duration: 300, easing: "cubic-bezier(.2,.7,.2,1)" },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
      },
      { threshold: 0, rootMargin: "0px 0px 140px 0px" },
    );
    const observeNewContent = () => {
      const nodes = root.querySelectorAll(
        ".section-heading, .category-card, .tool-card, .resource-card:not(.resource-kit-card):not(.guide-card), .workflow-card, .toolkit-banner, .newsletter, .footer-welcome, .tool-guide > *, .content-grid > *, .comparison-card",
      );
      for (const node of nodes) {
        if (seen.current.has(node)) continue;
        seen.current.add(node);
        if (node.getBoundingClientRect().top > innerHeight)
          observer.observe(node);
      }
    };
    observeNewContent();
    const updates = new MutationObserver(observeNewContent);
    updates.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      updates.disconnect();
      for (const animation of animations) animation.cancel();
    };
  }, [path]);
  return null;
}
