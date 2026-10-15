"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  FileCheck2,
  FileText,
  Search,
  Sparkles,
} from "lucide-react";
import { Select } from "@/components/ui/select";
import { copyText } from "@/lib/browser-utils";
import { track } from "@/lib/events";
import { assetUrl } from "@/lib/media-assets";
import previews from "@/config/resource-previews.json";
import type { ContentItem } from "@/lib/content";

function previewFor(item: ContentItem) {
  const details = (
    previews as Record<
      string,
      {
        description: string;
        output: string;
        inputs?: string[];
        originalDescription?: string;
      }
    >
  )[item.slug];
  const text =
    item.kind === "prompts"
      ? item.body.split("\n\n")[1] || item.body
      : item.body;
  const inputs = [
    ...new Set(
      [...text.matchAll(/\[([^\]\n]{1,48})\](?!\()/g)]
        .map((match) => match[1].trim())
        .filter((value) => value && value !== "x"),
    ),
  ];
  return {
    description:
      details &&
      (!item.description || item.description === details.originalDescription)
        ? details.description
        : item.description,
    output:
      details?.output ||
      (item.kind === "prompts"
        ? "A draft tailored to your context"
        : "An editable starting point"),
    inputs: details?.inputs || (inputs.length ? inputs : ["Your context"]),
    image:
      item.coverUrl ||
      (() => {
        const generated = assetUrl(`/images/resources/${item.slug}.webp`);
        return generated.startsWith("https://")
          ? generated
          : assetUrl(
              `/images/resources/${item.kind === "templates" ? "client-proposal" : "project-scoping"}.webp`,
            );
      })(),
    text,
  };
}
export function ResourceLibrary({
  items,
  kind,
}: {
  items: ContentItem[];
  kind: "prompts" | "templates";
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const categories = useMemo(
    () => ["All categories", ...new Set(items.map((item) => item.category))],
    [items],
  );
  const resources = useMemo(
    () => items.map((item) => ({ ...item, preview: previewFor(item) })),
    [items],
  );
  const visible = resources.filter(
    (item) =>
      (category === "All categories" || item.category === category) &&
      `${item.title} ${item.category} ${item.preview.description} ${item.preview.output}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  const prompt = kind === "prompts";
  async function copy(item: (typeof resources)[number]) {
    try {
      await copyText(item.preview.text);
      if (timer.current) clearTimeout(timer.current);
      setCopied(item.slug);
      setError("");
      track("copy_clicked", item.slug);
      timer.current = setTimeout(() => setCopied(null), 2000);
    } catch {
      setError(
        "Copy is unavailable in this browser. Open the resource to select and copy its text.",
      );
    }
  }
  return (
    <section
      className="resource-library"
      aria-label={prompt ? "Prompt library" : "Template library"}
    >
      <div className="resource-library-toolbar">
        <label className="resource-library-search">
          <Search size={18} aria-hidden="true" />
          <input
            aria-label={prompt ? "Search prompts" : "Search templates"}
            placeholder={
              prompt
                ? "What would you like AI to help with?"
                : "Find a shortcut for your next project..."
            }
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <Select
          aria-label="Resource category"
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            track("category_selected", undefined, value);
          }}
          options={categories}
        />
      </div>
      <div className="resource-library-caption">
        <p aria-live="polite">
          <strong>{visible.length}</strong>{" "}
          {prompt ? "copy-ready prompts" : "editable templates"}
          {category !== "All categories"
            ? ` in ${category}`
            : " to make your own"}
        </p>
        <span>
          <Check size={13} /> Free. No sign-up.
        </span>
      </div>
      <div className="resource-library-grid">
        {visible.map((item, index) => (
          <article
            className="resource-card resource-kit-card"
            key={`${item.kind}-${item.slug}`}
          >
            <Link
              className="resource-kit-visual"
              href={`/${item.kind}/${item.slug}`}
              aria-label={`Open ${item.title}`}
            >
              <Image
                src={item.preview.image}
                alt=""
                width={768}
                height={512}
                sizes="(max-width: 600px) calc(100vw - 60px), (max-width: 900px) 46vw, (max-width: 1150px) 30vw, 280px"
                priority={index < 3}
              />
              <span className="resource-kit-type">
                {prompt ? <Sparkles size={13} /> : <FileText size={13} />}
                {prompt ? "PROMPT" : "TEMPLATE"}
              </span>
              <span className="resource-kit-free">FREE</span>
            </Link>
            <div className="resource-kit-content">
              <span className="resource-kit-category">
                <i />
                {item.category}
              </span>
              <h2>
                <Link href={`/${item.kind}/${item.slug}`}>{item.title}</Link>
              </h2>
              <p className="resource-kit-description">
                {item.preview.description}
              </p>
              <div className="resource-kit-output">
                <FileCheck2 size={18} />
                <div>
                  <span>WHAT YOU GET</span>
                  <strong>{item.preview.output}</strong>
                </div>
              </div>
              <div className="resource-kit-inputs">
                <span>{prompt ? "ADD YOUR" : "MAKE IT YOURS"}</span>
                <div>
                  {item.preview.inputs.slice(0, 3).map((input) => (
                    <span key={input} title={input}>
                      {input}
                    </span>
                  ))}
                  {item.preview.inputs.length > 3 && (
                    <span>+{item.preview.inputs.length - 3} more</span>
                  )}
                </div>
              </div>
              <div className="resource-kit-actions">
                <button
                  type="button"
                  className="resource-kit-copy"
                  onClick={() => void copy(item)}
                  aria-label={`Copy ${prompt ? "prompt" : "template"}: ${item.title}`}
                >
                  {copied === item.slug ? (
                    <Check size={15} />
                  ) : (
                    <Copy size={15} />
                  )}
                  {copied === item.slug ? "Copied!" : "Quick copy"}
                </button>
                <Link
                  className="resource-kit-open"
                  href={`/${item.kind}/${item.slug}`}
                >
                  {prompt ? "Use prompt" : "Open template"}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="empty-state">
          <Search size={26} />
          <h3>No matching resources</h3>
          <p>Try another search or explore all categories.</p>
          <button
            className="button secondary small"
            onClick={() => {
              setQuery("");
              setCategory("All categories");
            }}
          >
            Show all {kind}
          </button>
        </div>
      )}
      {error && (
        <p role="status" className="notice error">
          {error}
        </p>
      )}
    </section>
  );
}
