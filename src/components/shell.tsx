"use client";
import Link from "next/link";
import Image from "next/image";
import { assetUrl } from "@/lib/media-assets";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { track } from "@/lib/events";
import { readPreference, savePreference } from "@/lib/preferences";
export function Brand({ name = "navonixx" }: { name?: string }) {
  return (
    <Link href="/" className="brand" aria-label="NavoNixx home">
      <span className="brand-mark">
        <Image src={assetUrl("/images/navonixx-logo.png")} alt="" width={48} height={48} sizes="48px" priority />
      </span>
      {name.toLowerCase()}
      <span className="brand-dot">.</span>
    </Link>
  );
}
const links = [
  ["Free Tools", "/free-tools"],
  ["AI Tools", "/ai-tools"],
  ["Reviews", "/reviews"],
  ["Prompts", "/prompts"],
  ["Templates", "/templates"],
  ["Guides", "/blog"],
];
export function Header({ brandName }: { brandName?: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const d = readPreference("navonixx-theme") !== "light";
    setDark(d);
    document.documentElement.dataset.theme = d ? "dark" : "light";
  }, []);
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Brand name={brandName} />
        <nav
          className={open ? "main-nav open" : "main-nav"}
          aria-label="Main navigation"
        >
          {links.map(([name, url]) => (
            <Link
              key={url}
              href={url}
              onClick={() => setOpen(false)}
              aria-current={path.startsWith(url) ? "page" : undefined}
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            type="button"
            className="icon-button theme-button"
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            aria-pressed={dark}
            onClick={() => {
              setDark(!dark);
              document.documentElement.dataset.theme = !dark ? "dark" : "light";
              savePreference("navonixx-theme", !dark ? "dark" : "light");
            }}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            className="button primary small"
            href="/ai-tools/finder"
            aria-label="Find my AI tools"
          >
            <span className="cta-long">Find my AI tools</span>
            <span className="cta-short" aria-hidden="true">
              Finder
            </span>{" "}
            <ArrowUpRight size={16} />
          </Link>
          <button
            className="icon-button menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
export function Footer({
  settings = {},
}: {
  settings?: Record<string, string>;
}) {
  let socialLinks: { label: string; url: string }[] = [];
  try {
    const parsed = JSON.parse(settings.socialLinks || "[]");
    if (Array.isArray(parsed))
      socialLinks = parsed
        .filter(
          (item) =>
            typeof item.label === "string" &&
            typeof item.url === "string" &&
            /^https?:\/\//.test(item.url),
        )
        .slice(0, 5);
  } catch {
    /* Ignore invalid legacy settings. */
  }
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-welcome">
          <div>
            <span className="eyebrow">YOUR NEXT IDEA STARTS HERE</span>
            <h2>
              A little less busywork.
              <br />
              <span>A lot more possibility.</span>
            </h2>
          </div>
          <Link href="/ai-tools/finder" className="button primary">
            Take the 60-second Tool Finder <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="footer-grid">
          <div>
            <Brand name={settings.brandName} />
            <p>
              {settings.tagline || (
                <>
                  Smarter Tools. Better Work.
                  <br />
                  Bigger Growth.
                </>
              )}
            </p>
            <span className="footer-brand-note">
              Useful by design. Free to explore.
            </span>
          </div>
          <div>
            <h4>Explore</h4>
            {links.slice(0, 4).map(([n, u]) => (
              <Link key={u} href={u}>
                {n}
              </Link>
            ))}
          </div>
          <div>
            <h4>Learn & build</h4>
            <Link href="/ai-tools/finder">AI Tool Finder</Link>
            <Link href="/ai-tools/compare">Compare AI tools</Link>
            <Link href="/workflows">Workflows</Link>
            <Link href="/blog">Guides</Link>
            <Link href="/toolkit">Free AI toolkit</Link>
            <Link href="/resources">All resources</Link>
          </div>
          <div>
            <h4>NavoNixx</h4>
            {settings.contactEmail && (
              <a href={`mailto:${settings.contactEmail}`}>Email us</a>
            )}
            <Link href="/about">About NavoNixx</Link>
            {socialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
            <Link href="/contact">Get in touch</Link>
            <button
              className="text-button"
              onClick={() =>
                window.dispatchEvent(new Event("privacy-settings"))
              }
            >
              Privacy preferences
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} NavoNixx. Made for meaningful work.
          </span>
          <nav aria-label="Legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
          </nav>
        </div>
        <p className="disclosure">
          {settings.affiliateDisclosure || (
            <>
              Some recommendations may contain affiliate links. We may earn a
              commission when you purchase through them, at no extra cost to
              you. Listings are clearly labeled; always verify current terms
              with the provider.
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
export function PrivacyControls() {
  const path = usePathname();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Preferences are opened from the footer, without an automatic popup.
    const show = () => setVisible(true);
    window.addEventListener("privacy-settings", show);
    return () => window.removeEventListener("privacy-settings", show);
  }, []);
  useEffect(() => {
    track("page_view");
  }, [path]);
  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest("a, button, [role='button']");
      if (!element || element.closest(".consent-panel, [data-analytics-ignore]")) return;
      if (element instanceof HTMLAnchorElement) {
        const url = new URL(element.href, location.origin);
        if (!["http:", "https:"].includes(url.protocol)) return;
        const destination = url.origin === location.origin ? url.pathname : "external";
        track("link_clicked", undefined, destination.slice(0, 60));
      } else {
        track("button_clicked", undefined, "button");
      }
    };
    document.addEventListener("click", click, { capture: true });
    return () => document.removeEventListener("click", click, { capture: true });
  }, []);
  async function choose(accept: boolean) {
    const response = await fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accept }),
    }).catch(() => null);
    if (!response?.ok) return;
    savePreference("navonixx-consent", accept ? "accepted" : "declined");
    setVisible(false);
    if (accept) track("page_view");
  }
  return visible ? (
    <aside className="consent-panel" aria-label="Analytics privacy choices">
      <ShieldCheck size={23} />
      <div>
        <p>
          <strong>Your work stays yours.</strong> Tools run in your browser.
          Basic counts record page views and clicks without tracking cookies.
          Allow analytics to enable optional visitor and session statistics.{" "}
          <Link href="/privacy">Policy</Link>
        </p>
        <div className="consent-actions">
          <button
            className="button secondary small"
            onClick={() => void choose(false)}
          >
            Essential only
          </button>
          <button
            className="button primary small"
            onClick={() => void choose(true)}
          >
            Allow analytics
          </button>
        </div>
      </div>
    </aside>
  ) : null;
}
