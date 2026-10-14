"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Search,
  Type,
  Code2,
  Calculator,
  Megaphone,
  Copy,
  RotateCcw,
  Download,
  Check,
  Printer,
  ChevronRight,
  Sparkles,
  Zap,
  Lock,
  UserX,
  ShieldCheck,
  Eraser,
  RefreshCw,
  CircleAlert,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tool, categories, runTool } from "@/lib/tools";
import { track } from "@/lib/events";
import { copyText } from "@/lib/browser-utils";
export const categoryIcons = {
  Writing: Type,
  Development: Code2,
  Business: Calculator,
  Marketing: Megaphone,
};
export function ToolCard({ tool }: { tool: Tool }) {
  const Icon =
    categoryIcons[tool.category as keyof typeof categoryIcons] || Code2;
  return (
    <Link href={`/free-tools/${tool.slug}`} className="tool-card">
      <div className="card-top">
        <span className={`tool-icon ${tool.category.toLowerCase()}`}>
          {tool.iconUrl ? (
            <Image src={tool.iconUrl} alt="" width={25} height={25} />
          ) : (
            <Icon size={23} />
          )}
        </span>
        <span className="free-tag">FREE</span>
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <div className="card-bottom">
        <span>{tool.category}</span>
        <span>
          Open tool <ArrowUpRight size={15} />
        </span>
      </div>
    </Link>
  );
}
export function ToolDirectory({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All tools");
  useEffect(() => {
    const c = new URLSearchParams(location.search).get("category");
    const q = new URLSearchParams(location.search).get("q");
    if (q) setQuery(q.slice(0, 150));
    if (c && categories.includes(c)) setCategory(c);
  }, []);
  const filtered = tools.filter(
    (t) =>
      (category === "All tools" || t.category === category) &&
      `${t.name} ${t.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="directory-controls">
        <label className="search">
          <Search size={19} />
          <input
            aria-label="Search free tools"
            placeholder="Find your next favorite tool…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => {
              if (query) track("search_performed");
            }}
          />
        </label>
        <div className="filter-tabs" aria-label="Tool categories">
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={category === c ? "active" : ""}
              onClick={() => {
                setCategory(c);
                track("category_selected", undefined, c);
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="result-count">
        {filtered.length} useful tools. Zero paywalls.
      </p>
      <div className="tool-grid">
        {filtered.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <Search />
          <h3>No tools found</h3>
          <p>Try a different search or category.</p>
          <button
            className="button secondary"
            onClick={() => {
              setQuery("");
              setCategory("All tools");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
const randomTools = new Set(["password-generator", "uuid-generator"]);
const heroStatTools = new Set([
  "freelance-hourly-rate-calculator",
  "project-pricing-calculator",
  "profit-margin-calculator",
  "discount-calculator",
  "gst-calculator",
  "roi-calculator",
  "break-even-calculator",
  "meeting-cost-calculator",
  "engagement-rate-calculator",
  "reading-time-calculator",
]);
const statTools = new Set([
  ...heroStatTools,
  "word-counter",
  "character-counter",
  "timestamp-converter",
]);
const meterTools = new Set([
  "seo-title-checker",
  "meta-description-checker",
  "email-subject-checker",
  "social-media-character-limit-checker",
]);
const listTools = new Set(["uuid-generator", "duplicate-line-remover"]);
const colorKeys = new Set(["color", "start", "end"]);
const wideKeys = new Set(["url", "title", "description", "pattern"]);

function runRegex(values: Record<string, string>) {
  return new Promise<string>((resolve, reject) => {
    const worker = new Worker("/regex-worker.js");
    const timeout = setTimeout(() => {
      worker.terminate();
      reject(Error("Pattern took too long. Simplify it and try again."));
    }, 750);
    worker.onmessage = ({ data }) => {
      clearTimeout(timeout);
      worker.terminate();
      if (data.error) reject(Error(data.error));
      else resolve(data.result);
    };
    worker.onerror = () => {
      clearTimeout(timeout);
      worker.terminate();
      reject(Error("Could not start the regex worker."));
    };
    worker.postMessage({
      text: values.text,
      pattern: values.pattern,
      flags: values.flags,
    });
  });
}

type Stat = { label: string; value: string };
/** Turns "Label: value" and "12 words" lines into stats; anything else is a note. */
function parseStats(slug: string, result: string) {
  const stats: Stat[] = [];
  const notes: string[] = [];
  result.split("\n").forEach((line, i) => {
    const text = line.trim();
    if (!text) return;
    if (slug === "timestamp-converter" && i === 0)
      return stats.push({ label: "ISO 8601", value: text });
    const labelled = text.match(/^([^:]{2,40}):\s+(.+)$/);
    if (labelled) return stats.push({ label: labelled[1], value: labelled[2] });
    const counted = text.match(/^([\d.,]+%?(?:\s*\/\s*[\d.,]+)?)\s+(.+)$/);
    if (counted) return stats.push({ label: counted[2], value: counted[1] });
    notes.push(text);
  });
  return { stats, notes };
}

function CopyChip({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="tr-chip"
      onClick={async () => {
        try {
          await copyText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1200);
        } catch {
          /* Text stays visible for manual copying. */
        }
      }}
      aria-label={`${label} ${text}`}
    >
      {done ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

function ResultView({
  tool,
  result,
  values,
}: {
  tool: Tool;
  result: string;
  values: Record<string, string>;
}) {
  const slug = tool.slug;
  if (slug === "markdown-previewer")
    return (
      <article className="prose tr-doc">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
      </article>
    );
  if (slug === "invoice-generator") {
    const totals = parseStats(slug, result).stats.filter((s) =>
      /^(Subtotal|Tax|TOTAL)$/i.test(s.label),
    );
    return (
      <div className="tr-invoice">
        <div className="tr-invoice-head">
          <div>
            <span>INVOICE</span>
            <strong>{values.number}</strong>
          </div>
          <div className="tr-invoice-parties">
            <p>
              <small>From</small>
              {values.business}
            </p>
            <p>
              <small>Bill to</small>
              {values.client}
            </p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{values.item}</td>
              <td>{values.quantity}</td>
              <td>
                {values.rate} {values.currency}
              </td>
            </tr>
          </tbody>
        </table>
        <dl>
          {totals.map((t) => (
            <div key={t.label} className={t.label === "TOTAL" ? "grand" : ""}>
              <dt>{t.label === "TOTAL" ? "Total" : t.label}</dt>
              <dd>{t.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
  if (slug === "open-graph-preview") {
    const [domain, title, ...rest] = result.split("\n");
    return (
      <div className="tr-og">
        <div className="tr-og-art">navonixx.</div>
        <div>
          <span>{domain}</span>
          <strong>{title}</strong>
          <p>{rest.join(" ")}</p>
        </div>
      </div>
    );
  }
  if (slug === "css-gradient-generator")
    return (
      <>
        <div className="tr-gradient" style={{ background: result }} />
        <div className="tr-code-row">
          <code>background: {result};</code>
          <CopyChip text={`background: ${result};`} />
        </div>
      </>
    );
  if (slug === "color-palette-generator")
    return (
      <div className="tr-palette">
        {result.split("\n").map((c) => (
          <div key={c} style={{ background: c }}>
            <span>{c}</span>
            <CopyChip text={c} />
          </div>
        ))}
      </div>
    );
  if (slug === "color-converter") {
    const [hex, ...others] = result.split("\n");
    return (
      <>
        <div className="tr-swatch" style={{ background: hex }} />
        <ul className="tr-list labelled">
          {[hex, ...others].map((v, i) => (
            <li key={v}>
              <small>{["HEX", "RGB", "HSL"][i]}</small>
              <code>{v}</code>
              <CopyChip text={v} />
            </li>
          ))}
        </ul>
      </>
    );
  }
  if (slug === "password-generator") {
    const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z\d]/].filter((r) =>
      r.test(result),
    ).length;
    const strength =
      result.length >= 16 && classes >= 3
        ? ["Very strong", 100]
        : result.length >= 12 && classes >= 3
          ? ["Strong", 75]
          : ["Fair", 45];
    return (
      <>
        <div className="tr-secret">
          <code>{result}</code>
          <CopyChip text={result} />
        </div>
        <div className="tr-meter">
          <div className="tr-meter-bar">
            <i style={{ width: `${strength[1]}%` }} className="good" />
          </div>
          <span>
            {strength[0]} · {result.length} characters · {classes} character
            types
          </span>
        </div>
      </>
    );
  }
  if (listTools.has(slug))
    return (
      <ul className="tr-list">
        {result.split("\n").filter(Boolean).map((line, i) => (
          <li key={`${line}-${i}`}>
            <code>{line}</code>
            <CopyChip text={line} />
          </li>
        ))}
      </ul>
    );
  if (meterTools.has(slug)) {
    const { stats, notes } = parseStats(slug, result);
    const first = stats[0]?.value ?? "0";
    const [count, limit] = first.split("/").map((n) => Number(n.replace(/[^\d.]/g, "")));
    const range = notes.join(" ").match(/\((\d+)[–-](\d+)\)/);
    const max = limit || (range ? Number(range[2]) : 100);
    const min = range ? Number(range[1]) : 0;
    const scale = limit ? limit : max * 1.3;
    const ok = limit ? count <= limit : count >= min && count <= max;
    return (
      <>
        <div className="tr-hero">
          <strong>{first}</strong>
          <span>{stats[0]?.label}</span>
        </div>
        <div className="tr-meter">
          <div className="tr-meter-bar">
            {!limit && (
              <b
                style={{
                  left: `${(min / scale) * 100}%`,
                  width: `${((max - min) / scale) * 100}%`,
                }}
              />
            )}
            <i
              className={ok ? "good" : "warn"}
              style={{ width: `${Math.min(100, (count / scale) * 100)}%` }}
            />
          </div>
          {!limit && (
            <span>
              Sweet spot: {min}–{max} characters
            </span>
          )}
        </div>
        {stats.slice(1).length > 0 && (
          <div className="tr-stats">
            {stats.slice(1).map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        )}
        {notes.map((n) => (
          <p key={n} className={`tr-note${/within/i.test(n) ? " ok" : /too|over|short|long/i.test(n) ? " warn" : ""}`}>
            {n}
          </p>
        ))}
      </>
    );
  }
  if (statTools.has(slug)) {
    const { stats, notes } = parseStats(slug, result);
    // Lead with the answer people came for, e.g. the GST-inclusive total.
    const hero = heroStatTools.has(slug)
      ? (stats.find((s) => /^(total|final price)$/i.test(s.label)) ?? stats[0])
      : null;
    const rest = stats.filter((s) => s !== hero);
    return (
      <>
        {hero && (
          <div className="tr-hero">
            <span>{hero.label}</span>
            <strong>{hero.value}</strong>
          </div>
        )}
        {rest.length > 0 && (
          <div className="tr-stats">
            {rest.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        )}
        {notes.map((n) => (
          <p key={n} className="tr-note">
            {n}
          </p>
        ))}
      </>
    );
  }
  return (
    <div className="tr-output">
      <pre>{result}</pre>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Tool["fields"][number];
  value: string;
  onChange: (value: string) => void;
}) {
  if (field.type === "select" && field.options && field.options.length <= 4)
    return (
      <div className="tr-segment" role="radiogroup" aria-label={field.label}>
        {field.options.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={value === option}
            className={value === option ? "on" : ""}
            onClick={() => onChange(option)}
          >
            {option[0].toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    );
  if (field.type === "select")
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {field.options?.map((option) => (
          <option key={option} value={option}>
            {option[0].toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    );
  if (field.type === "textarea")
    return (
      <textarea
        rows={field.key === "text" ? 7 : 4}
        maxLength={200000}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  if (colorKeys.has(field.key))
    return (
      <div className="tr-color">
        <input
          type="color"
          aria-label={`Pick ${field.label}`}
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#2563eb"}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          maxLength={60}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  return (
    <input
      type={field.type === "number" ? "number" : "text"}
      inputMode={field.type === "number" ? "decimal" : undefined}
      min={field.min}
      step="any"
      maxLength={2000}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function ToolHeader({ tool }: { tool: Tool }) {
  const Icon =
    categoryIcons[tool.category as keyof typeof categoryIcons] || Code2;
  return (
    <header className="tr-header">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={12} />
        <Link href="/free-tools">Free Tools</Link>
        <ChevronRight size={12} />
        <span aria-current="page">{tool.name}</span>
      </nav>
      <div className="tr-title">
        <span className={`tool-icon ${tool.category.toLowerCase()}`}>
          {tool.iconUrl ? (
            <Image src={tool.iconUrl} alt="" width={26} height={26} />
          ) : (
            <Icon size={24} />
          )}
        </span>
        <div>
          <h1>{tool.name}</h1>
          <p>{tool.description}</p>
        </div>
      </div>
      <ul className="tr-badges">
        <li>
          <Sparkles size={13} /> Free forever
        </li>
        <li>
          <Zap size={13} /> Live results
        </li>
        <li>
          <Lock size={13} /> Runs in your browser
        </li>
        <li>
          <UserX size={13} /> No sign-up
        </li>
      </ul>
    </header>
  );
}

export function ToolRunner({ tool }: { tool: Tool }) {
  const initial = Object.fromEntries(tool.fields.map((f) => [f.key, f.value]));
  const [values, setValues] = useState(initial);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [nonce, setNonce] = useState(0);
  const touched = useRef(false);
  const random = randomTools.has(tool.slug);
  useEffect(() => {
    track("tool_opened", tool.slug);
  }, [tool.slug]);
  // Every tool updates as you type; the regex tester runs in a bounded worker.
  useEffect(() => {
    let cancelled = false;
    const regex = tool.slug === "regex-tester";
    const timer = setTimeout(
      async () => {
        try {
          const output = regex ? await runRegex(values) : runTool(tool.slug, values);
          if (cancelled) return;
          setResult(output);
          setError("");
          if (touched.current) {
            touched.current = false;
            track("tool_completed", tool.slug);
          }
        } catch (e) {
          if (cancelled) return;
          setResult("");
          setError(
            e instanceof Error ? e.message : "Check your input and try again.",
          );
        }
      },
      regex ? 350 : 150,
    );
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [tool.slug, values, nonce]);
  function update(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    if (!touched.current) track("tool_used", tool.slug);
    touched.current = true;
  }
  async function copy() {
    try {
      await copyText(result);
      setCopied(true);
      track("copy_clicked", tool.slug);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError(
        "Clipboard access is unavailable. Select and copy the result manually.",
      );
    }
  }
  function download() {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = tool.slug + ".txt";
    a.click();
    URL.revokeObjectURL(url);
    track("download_clicked", tool.slug);
  }
  const textarea = tool.fields.find((f) => f.type === "textarea");
  return (
    <div className="tr-workspace">
      <section className="tr-input" aria-label="Your input">
        <div className="tr-pane-head">
          <h2>Your input</h2>
          <button
            type="button"
            className="tr-ghost"
            onClick={() => {
              setValues(initial);
              setError("");
            }}
          >
            <RotateCcw size={14} /> Reset example
          </button>
          {textarea && (
            <button
              type="button"
              className="tr-ghost"
              onClick={() => update(textarea.key, "")}
            >
              <Eraser size={14} /> Clear
            </button>
          )}
        </div>
        <form className="tr-fields" onSubmit={(e) => e.preventDefault()}>
          {tool.fields.map((field) => (
            <label
              key={field.key}
              className={`tr-field${
                field.type === "textarea" || wideKeys.has(field.key) || field.type === "select"
                  ? " wide"
                  : ""
              }`}
            >
              <span className="tr-label">
                {field.label}
                {field.type === "textarea" && (
                  <small>{values[field.key]?.length ?? 0} characters</small>
                )}
              </span>
              <FieldInput
                field={field}
                value={values[field.key] ?? ""}
                onChange={(v) => update(field.key, v)}
              />
            </label>
          ))}
        </form>
        <p className="tr-privacy">
          <ShieldCheck size={14} /> Processed on your device. Nothing you type is
          sent to us.
        </p>
      </section>
      <section className="tr-result" aria-label="Your result">
        <div className="tr-pane-head">
          <h2>Result</h2>
          <span className="tr-live">
            <i /> Live
          </span>
        </div>
        <div className="tr-result-body" aria-live="polite">
          {error ? (
            <p className="tr-error" role="alert">
              <CircleAlert size={16} /> {error}
            </p>
          ) : result ? (
            <ResultView tool={tool} result={result} values={values} />
          ) : (
            <div className="tr-empty">
              <Zap size={22} />
              <p>Start typing. Your result appears here instantly.</p>
            </div>
          )}
        </div>
        <div className="tr-actions">
          <button
            type="button"
            className="button primary small"
            disabled={!result}
            onClick={() => void copy()}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy result"}
          </button>
          {random && (
            <button
              type="button"
              className="button secondary small"
              onClick={() => setNonce((n) => n + 1)}
            >
              <RefreshCw size={15} /> Regenerate
            </button>
          )}
          {tool.slug === "invoice-generator" ? (
            <button
              type="button"
              className="button secondary small"
              disabled={!result}
              onClick={() => window.print()}
            >
              <Printer size={15} /> Print / Save PDF
            </button>
          ) : (
            <button
              type="button"
              className="button secondary small"
              disabled={!result}
              onClick={download}
            >
              <Download size={15} /> Download
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
