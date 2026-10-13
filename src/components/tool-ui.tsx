"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Search,
  Type,
  Code2,
  Calculator,
  Megaphone,
  Copy,
  RotateCcw,
  Play,
  Download,
  Check,
  Printer,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tool, categories, runTool } from "@/lib/tools";
import { track } from "@/lib/events";
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
export function ToolRunner({ tool }: { tool: Tool }) {
  const initial = Object.fromEntries(tool.fields.map((f) => [f.key, f.value]));
  const [values, setValues] = useState(initial);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    track("tool_opened", tool.slug);
  }, [tool.slug]);
  async function run() {
    setError("");
    setBusy(true);
    track("tool_used", tool.slug);
    try {
      let output: string;
      if (tool.slug === "regex-tester") {
        output = await new Promise<string>((resolve, reject) => {
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
      } else output = runTool(tool.slug, values);
      setResult(output);
      track("tool_completed", tool.slug);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Check your input and try again.",
      );
      setResult("");
    } finally {
      setBusy(false);
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
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
  return (
    <div className="tool-workspace">
      <div className="input-pane">
        <div className="pane-title">
          <span>01</span>
          <h2>Your input</h2>
          <span className="micro">PROCESSED ON YOUR DEVICE</span>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run();
          }}
        >
          {tool.fields.map((field) => (
            <label className="field" key={field.key}>
              <span>{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  maxLength={tool.slug === "regex-tester" ? 10000 : 200000}
                  rows={10}
                  value={values[field.key]}
                  onChange={(e) =>
                    setValues({ ...values, [field.key]: e.target.value })
                  }
                />
              ) : (
                <input
                  required={!["content", "term"].includes(field.key)}
                  type={field.type || "text"}
                  min={field.min}
                  step="any"
                  maxLength={2000}
                  value={values[field.key]}
                  onChange={(e) =>
                    setValues({ ...values, [field.key]: e.target.value })
                  }
                />
              )}
            </label>
          ))}
          <div className="tool-actions">
            <button className="button primary" disabled={busy} type="submit">
              <Play size={16} />
              {busy ? "Processing…" : "Run tool"}
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={() => {
                setValues(initial);
                setResult("");
                setError("");
              }}
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </form>
        {error && (
          <p className="notice error" role="alert">
            {error}
          </p>
        )}
      </div>
      <div className="result-pane">
        <div className="pane-title">
          <span>02</span>
          <h2>Your result</h2>
          <button
            className="icon-button"
            disabled={!result}
            onClick={() => void copy()}
            aria-label="Copy result"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
        <div aria-live="polite" className="result-content">
          {result ? (
            <>
              {tool.slug === "markdown-previewer" ? (
                <article className="prose">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result}
                  </ReactMarkdown>
                </article>
              ) : (
                <pre>{result}</pre>
              )}
              {tool.slug === "css-gradient-generator" && (
                <div
                  className="gradient-preview"
                  style={{ background: result }}
                />
              )}
              {tool.slug === "open-graph-preview" && (
                <div className="og-preview">
                  <div className="og-preview-art">navonixx.</div>
                  <div>
                    <span className="micro">{result.split("\n")[0]}</span>
                    <h3>{result.split("\n")[1]}</h3>
                    <p>{result.split("\n").slice(2).join("\n")}</p>
                  </div>
                </div>
              )}
              {tool.slug === "color-palette-generator" && (
                <div className="palette-preview">
                  {result.split("\n").map((c) => (
                    <div key={c} style={{ background: c }}>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="result-placeholder">
              <span className="tool-icon">
                <Code2 size={28} />
              </span>
              <h3>A little input. A useful result.</h3>
              <p>
                Run the tool to see your result here.
                <br />
                Your data stays in your browser.
              </p>
            </div>
          )}
        </div>
        <div className="tool-actions">
          <button
            className="button secondary small"
            disabled={!result}
            onClick={download}
          >
            <Download size={15} />
            Download .txt
          </button>
          {tool.slug === "invoice-generator" && (
            <button
              className="button secondary small"
              disabled={!result}
              onClick={() => window.print()}
            >
              <Printer size={15} />
              Print / Save PDF
            </button>
          )}
          <span className="micro">No account. No limits.</span>
        </div>
      </div>
    </div>
  );
}
