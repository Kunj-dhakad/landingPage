"use client";
import { useState } from "react";
import { track } from "@/lib/events";
export function EmailSettings({
  purpose,
  token,
}: {
  purpose: "SUBSCRIBE" | "UNSUBSCRIBE";
  token?: string;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="panel contact-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const form = new FormData(e.currentTarget);
        try {
          const response = await fetch("/api/email-settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              purpose,
              token,
              email: form.get("email") || undefined,
              action: token ? "confirm" : "request",
            }),
          });
          const data = await response.json();
          setMessage(data.message || data.error);
          if (response.ok && token && purpose === "SUBSCRIBE") {
            track("email_verified");
            track("newsletter_subscribed");
          }
        } catch {
          setMessage("Could not connect. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      {!token && (
        <label className="field">
          Your email address
          <input name="email" type="email" required />
        </label>
      )}
      <button className="button primary" disabled={busy}>
        {busy
          ? "Working…"
          : token
            ? purpose === "SUBSCRIBE"
              ? "Confirm subscription"
              : "Confirm unsubscribe"
            : "Send secure unsubscribe link"}
      </button>
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
