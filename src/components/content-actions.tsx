"use client";
import { useState, useEffect } from "react";
import { Copy, Download, Check } from "lucide-react";
import { track } from "@/lib/events";
export function ContentActions({ body, slug }: { body: string; slug: string }) {
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
            await navigator.clipboard.writeText(body);
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
        {copied ? "Copied" : "Copy resource"}
      </button>
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
