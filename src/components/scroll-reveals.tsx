"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function ScrollReveals() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animations = new Set<Animation>();
    const seen = new WeakSet<Element>();
    const root = document.querySelector(".public-site");
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        let stagger = 0;
        for (const entry of entries)
          if (entry.isIntersecting) {
            const animation = entry.target.animate(
                [
                  { opacity: 0, transform: "translateY(15px)" },
                  { opacity: 1, transform: "translateY(0)" },
                ],
                { duration: 420, delay: Math.min(stagger++ * 55, 165), easing: "cubic-bezier(.2,.7,.2,1)" },
              );
            animations.add(animation);
            animation.onfinish = () => animations.delete(animation);
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.05 },
    );
    const observeNewContent = () => {
      const nodes = root.querySelectorAll(
        ".section-heading, .category-card, .tool-card, .resource-card, .workflow-card, .toolkit-banner, .newsletter, .footer-welcome, .tool-guide > *, .content-grid > *, .comparison-card",
      );
      for (const node of nodes) {
        if (seen.has(node)) continue;
        seen.add(node);
        if (node.getBoundingClientRect().top > innerHeight) observer.observe(node);
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
