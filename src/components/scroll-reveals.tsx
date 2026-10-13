"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function ScrollReveals() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "visible");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.05 },
    );
    const nodes = document.querySelectorAll(
      ".section-heading, .category-card, .tool-card",
    );
    for (const node of nodes)
      if (node.getBoundingClientRect().top > innerHeight) {
        node.setAttribute("data-reveal", "waiting");
        observer.observe(node);
      }
    return () => {
      observer.disconnect();
      for (const node of nodes) node.removeAttribute("data-reveal");
    };
  }, [path]);
  return null;
}
