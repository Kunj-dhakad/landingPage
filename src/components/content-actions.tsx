"use client";
import { useState, useEffect } from "react";
import { Copy, Download, Check, ArrowUpRight } from "lucide-react";
import { track } from "@/lib/events";
import { copyText } from "@/lib/browser-utils";
export function ContentActions({
  body,
  slug,
  prompt,
}: {
  body: string;
  slug: string;
  /** When set, offers one-click links that open the prompt in an assistant. */
  prompt?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    track("resource_viewed", slug);
  }, [slug]);
  return (
    <div className="article-actions">
      <button
        className="button secondary small"
        onClick={async () => {
          try {
            await copyText(body);
            setCopied(true);
            track("copy_clicked", slug);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            setCopied(false);
            setError(
              "Clipboard access is unavailable. Select the resource text to copy it manually.",
            );
          }
        }}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}{" "}
        {copied ? "Copied" : prompt ? "Copy prompt" : "Copy resource"}
      </button>
      {prompt &&
        (
          [
            ["ChatGPT", "chatgpt", "https://chatgpt.com/?q="],
            ["Claude", "claude", "https://claude.ai/new?q="],
          ] as const
        ).map(([name, id, base]) => (
          <a
            key={id}
            className="button primary small"
            href={base + encodeURIComponent(prompt)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("affiliate_link_clicked", id)}
          >
            Open in {name} <ArrowUpRight size={15} />
          </a>
        ))}
      <button
        className="button secondary small"
        onClick={() => {
          const url = URL.createObjectURL(
            new Blob([body], { type: "text/markdown" }),
          );
          const a = document.createElement("a");
          a.href = url;
          a.download = slug + ".md";
          a.click();
          URL.revokeObjectURL(url);
          track("download_clicked", slug);
        }}
      >
        <Download size={15} />
        Download Markdown
      </button>
      {error && (
        <p className="notice error" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
