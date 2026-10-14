"use client";
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Gift,
  Loader2,
  Lock,
  Mail,
  X,
} from "lucide-react";
import Link from "next/link";
import { track, campaignContext } from "@/lib/events";
import { readPreference, savePreference } from "@/lib/preferences";
import { copyText } from "@/lib/browser-utils";

type GateOffer = {
  slug: string;
  name: string;
  coupon?: { code: string; note: string };
  bonus: { title: string; checklist: string[] };
};

/**
 * Primary review-page CTA. Visitors unlock the vendor coupon and our free
 * quick-start bonus with their email, then continue to the offer. A skip link
 * always remains so nobody is forced to sign up to reach the product.
 */
export function OfferGate({
  offer,
  href,
  label = "Unlock coupon + free bonus",
  className = "button primary",
}: {
  offer: GateOffer;
  href: string;
  label?: string;
  className?: string;
}) {
  const key = `navonixx-offer-${offer.slug}`;
  const dialog = useRef<HTMLDialogElement>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const uid = useId();
  useEffect(() => {
    setUnlocked(readPreference(key) === "1");
    // Every CTA on the page switches to a direct link once any one unlocks.
    const sync = (e: Event) => {
      if ((e as CustomEvent).detail === offer.slug) setUnlocked(true);
    };
    window.addEventListener("offer-unlocked", sync);
    return () => window.removeEventListener("offer-unlocked", sync);
  }, [key, offer.slug]);
  const visit = (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={() => track("affiliate_link_clicked", offer.slug)}
    >
      Continue to {offer.name} <ArrowUpRight size={17} />
    </a>
  );
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const params = new URLSearchParams(location.search);
      const response = await fetch("/api/offer-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          marketing,
          website,
          offerSlug: offer.slug,
          source: params.get("utm_source") || campaignContext().source,
          campaign: params.get("utm_campaign") || campaignContext().campaign,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw Error(data.error || "Could not unlock. Please try again.");
      savePreference(key, "1");
      setUnlocked(true);
      window.dispatchEvent(new CustomEvent("offer-unlocked", { detail: offer.slug }));
      setMessage(data.message);
      track("offer_lead_captured", offer.slug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not unlock. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      {unlocked ? (
        visit
      ) : (
        <button
          type="button"
          className={className}
          onClick={() => {
            dialog.current?.showModal();
            track("offer_gate_opened", offer.slug);
          }}
        >
          <Gift size={17} /> {label}
        </button>
      )}
      <dialog
        ref={dialog}
        className="offer-dialog"
        aria-labelledby={`${uid}-title`}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="offer-dialog-body">
          <button
            type="button"
            className="icon-button offer-close"
            aria-label="Close"
            onClick={() => dialog.current?.close()}
          >
            <X size={18} />
          </button>
          {unlocked ? (
            <>
              <span className="offer-gift">
                <Check size={26} />
              </span>
              <h2 id={`${uid}-title`}>
                {message || "You're all set."}
              </h2>
              <Unlocked offer={offer} copied={copied} setCopied={setCopied} />
              {visit}
            </>
          ) : (
              <form onSubmit={submit}>
                <span className="offer-gift">
                  <Lock size={24} />
                </span>
                <h2 id={`${uid}-title`}>
                  Unlock the coupon and your free bonus
                </h2>
                <ul className="offer-unlocks">
                  {offer.coupon && (
                    <li>
                      <Check size={16} /> The vendor&apos;s current coupon code
                    </li>
                  )}
                  <li>
                    <Check size={16} /> Our {offer.bonus.title} (free)
                  </li>
                  <li>
                    <Check size={16} /> The NavoNixx AI Business Growth Toolkit
                  </li>
                </ul>
                <label className="sr-only" htmlFor={`${uid}-email`}>
                  Email address
                </label>
                <div className="email-input">
                  <Mail size={18} />
                  <input
                    id={`${uid}-email`}
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    placeholder="Your best email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <label className="honeypot" aria-hidden="true">
                  Website
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                  />
                  <span>
                    Also send me occasional tool reviews and deals (optional).
                    Unsubscribe anytime.
                  </span>
                </label>
                <button className="button primary wide" disabled={busy}>
                  {busy ? <Loader2 size={18} /> : <Gift size={17} />}
                  {busy ? "Unlocking…" : "Unlock now"}
                </button>
                {error && (
                  <p className="notice error" role="alert">
                    {error}
                  </p>
                )}
                <p className="micro">
                  We email you the bonus and never sell your address.{" "}
                  <Link href="/privacy">Privacy policy</Link>.
                </p>
                <a
                  className="offer-skip"
                  href={href}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  onClick={() => track("affiliate_link_clicked", offer.slug)}
                >
                  No thanks, take me to {offer.name}
                </a>
              </form>
          )}
        </div>
      </dialog>
    </>
  );
}

function Unlocked({
  offer,
  copied,
  setCopied,
}: {
  offer: GateOffer;
  copied: boolean;
  setCopied: (v: boolean) => void;
}) {
  return (
    <div className="offer-unlocked">
      {offer.coupon && (
        <div className="coupon">
          <div>
            <span className="micro">VENDOR COUPON</span>
            <strong>{offer.coupon.code}</strong>
          </div>
          <button
            type="button"
            className="button secondary small"
            onClick={async () => {
              try {
                await copyText(offer.coupon!.code);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch {
                /* The code stays visible for manual copying. */
              }
            }}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      {offer.coupon && <p className="micro">{offer.coupon.note}</p>}
      <strong className="bonus-title">{offer.bonus.title}</strong>
      <ol>
        {offer.bonus.checklist.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
