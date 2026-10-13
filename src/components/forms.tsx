"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { track, campaignContext } from "@/lib/events";
type EmailValues = { email: string; marketing: boolean; website: string };
export function EmailForm({
  resourceSlug,
  newsletter = false,
}: {
  resourceSlug?: string;
  newsletter?: boolean;
}) {
  useEffect(() => {
    track("email_form_viewed", resourceSlug);
  }, [resourceSlug]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailValues>();
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  async function submit(values: EmailValues) {
    setMessage("");
    try {
      const params = new URLSearchParams(location.search);
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          resourceSlug,
          newsletter,
          source: params.get("utm_source") || campaignContext().source,
          campaign: params.get("utm_campaign") || campaignContext().campaign,
        }),
      });
      const data = await response.json();
      setOk(response.ok);
      setMessage(data.message || data.error);
      if (response.ok) track("email_form_submitted", resourceSlug);
    } catch {
      setOk(false);
      setMessage("Could not connect. Please try again.");
    }
  }
  return (
    <form className="email-form" onSubmit={handleSubmit(submit)}>
      <label
        className="sr-only"
        htmlFor={newsletter ? "newsletter-email" : "toolkit-email"}
      >
        Email address
      </label>
      <div className="email-input">
        <Mail size={18} />
        <input
          id={newsletter ? "newsletter-email" : "toolkit-email"}
          type="email"
          placeholder="Your email address"
          {...register("email", {
            required: "Enter your email address.",
            maxLength: 254,
          })}
        />
        <button className="button primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 size={18} />
          ) : (
            <>
              {newsletter ? "Subscribe" : "Send my toolkit"}
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </div>
      <label className="honeypot" aria-hidden="true">
        Website
        <input tabIndex={-1} autoComplete="off" {...register("website")} />
      </label>
      <label className="checkbox">
        <input
          type="checkbox"
          {...register("marketing", {
            required: newsletter
              ? "Please choose to receive the newsletter."
              : false,
          })}
        />
        <span>
          {newsletter
            ? "I want occasional NavoNixx resources and updates."
            : "Also send me occasional resources and updates (optional)."}{" "}
          Unsubscribe anytime.
        </span>
      </label>
      <p className="micro">
        We use your email to deliver what you request.{" "}
        <Link href="/privacy">Privacy policy</Link>.
      </p>
      {errors.email && <p className="notice error">{errors.email.message}</p>}
      {errors.marketing && (
        <p className="notice error">{errors.marketing.message}</p>
      )}
      {message && (
        <p className={`notice ${ok ? "success" : "error"}`} role="status">
          {ok && <CheckCircle2 size={16} />} {message}
        </p>
      )}
    </form>
  );
}
export function ContactForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="panel contact-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const values = Object.fromEntries(new FormData(e.currentTarget));
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const data = await res.json();
          setMessage(data.message || data.error);
          if (res.ok) track("contact_form_submitted");
        } catch {
          setMessage("Could not connect. Try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="field">
        Your name
        <input name="name" required maxLength={100} />
      </label>
      <label className="field">
        Email address
        <input name="email" type="email" required maxLength={254} />
      </label>
      <label className="field">
        How can we help?
        <textarea
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={5000}
        />
      </label>
      <input className="honeypot" name="website" tabIndex={-1} />
      <button className="button primary" disabled={busy}>
        {busy ? "Sending…" : "Send message"}
        <ArrowRight size={16} />
      </button>
      {message && (
        <p role="status" className="notice">
          {message}
        </p>
      )}
    </form>
  );
}
